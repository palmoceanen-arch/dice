import { query } from '../db/client.js';
import { logger } from '../utils/logger.js';

// Import getUserInventory for sending updated inventory
async function getUserInventory(userId: number) {
  const result = await query(
    `SELECT ic.* FROM item_catalog ic
     JOIN user_items ui ON ui.item_id = ic.id
     WHERE ui.user_id = $1`,
    [userId]
  );
  return result.rows;
}

// Send notification via WebSocket
async function notifyUserItemReceived(userId: number, items: any[]) {
  try {
    // Dynamic import to avoid circular dependency
    const connections = await import('../websocket/connections.js');
    const inventory = await getUserInventory(userId);
    
    connections.send(userId, {
      type: 'item_received',
      item: items,
      inventory
    });
  } catch (err) {
    logger.error('Failed to notify user', err, { userId });
  }
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  referralsWithThreeGames: number;
  referralsWithPurchase: number;
  totalRewards: number;
}

export interface ReferralInfo {
  id: number;
  referredNickname: string;
  gamesPlayed: number;
  firstPurchaseMade: boolean;
  createdAt: Date;
}

// Generate unique referral code
export async function generateReferralCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = 'DICE_';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code exists
    const existing = await query(
      'SELECT 1 FROM users WHERE referral_code = $1',
      [code]
    );
    
    if (existing.rows.length === 0) {
      return code;
    }
  }
  
  // Fallback with timestamp
  return `DICE_${Date.now().toString(36).toUpperCase()}`;
}

// Process referral when new user registers
export async function processReferral(referredUserId: number, referralCode: string): Promise<boolean> {
  try {
    logger.info('Processing referral', { referredUserId, code: referralCode });
    
    // Find referrer by code
    const referrerResult = await query<{ id: number; nickname: string }>(
      'SELECT id, nickname FROM users WHERE referral_code = $1',
      [referralCode]
    );
    
    if (referrerResult.rows.length === 0) {
      logger.warn('Invalid referral code', { code: referralCode, referredUserId });
      return false;
    }
    
    const referrer = referrerResult.rows[0];
    logger.info('Referrer found', { referrerId: referrer.id, referrerNickname: referrer.nickname });
    
    // Can't refer yourself
    if (referrer.id === referredUserId) {
      logger.warn('User tried to refer themselves', { userId: referredUserId });
      return false;
    }
    
    // Check if referral already exists
    const existingReferral = await query(
      'SELECT 1 FROM referrals WHERE referrer_id = $1 AND referred_id = $2',
      [referrer.id, referredUserId]
    );
    
    if (existingReferral.rows.length > 0) {
      logger.warn('Referral already exists', { referrerId: referrer.id, referredUserId });
      return false;
    }
    
    // Create referral record
    await query(
      `INSERT INTO referrals (referrer_id, referred_id, referral_code, status)
       VALUES ($1, $2, $3, 'active')`,
      [referrer.id, referredUserId, referralCode]
    );
    
    logger.info('Referral created successfully', { 
      referrerId: referrer.id, 
      referrerNickname: referrer.nickname,
      referredUserId, 
      code: referralCode 
    });
    return true;
  } catch (err) {
    logger.error('Failed to process referral', err, { referredUserId, code: referralCode });
    return false;
  }
}

// Increment games played for a user's referrals
export async function incrementReferralGames(userId: number): Promise<void> {
  try {
    // Find all referrals where this user is the referred one
    const referrals = await query<{ id: number; referrer_id: number; games_played: number }>(
      `SELECT id, referrer_id, games_played 
       FROM referrals 
       WHERE referred_id = $1 AND status = 'active'`,
      [userId]
    );
    
    for (const referral of referrals.rows) {
      const newGamesPlayed = referral.games_played + 1;
      
      // Update games count
      await query(
        'UPDATE referrals SET games_played = $1 WHERE id = $2',
        [newGamesPlayed, referral.id]
      );
      
      // Check if we need to grant rewards
      if (newGamesPlayed === 3) {
        await checkAndGrantRewards(referral.referrer_id);
      }
    }
  } catch (err) {
    logger.error('Failed to increment referral games', err, { userId });
  }
}

// Mark referral as having made first purchase
export async function markReferralPurchase(userId: number): Promise<void> {
  try {
    // Find referral where this user is the referred one
    const referrals = await query<{ id: number; referrer_id: number; first_purchase_made: boolean }>(
      `SELECT id, referrer_id, first_purchase_made 
       FROM referrals 
       WHERE referred_id = $1 AND status = 'active'`,
      [userId]
    );
    
    for (const referral of referrals.rows) {
      if (!referral.first_purchase_made) {
        // Update purchase flag
        await query(
          'UPDATE referrals SET first_purchase_made = true WHERE id = $1',
          [referral.id]
        );
        
        // Grant purchase reward
        await grantPurchaseReward(referral.referrer_id, userId);
      }
    }
  } catch (err) {
    logger.error('Failed to mark referral purchase', err, { userId });
  }
}

// Check and grant milestone rewards
async function checkAndGrantRewards(referrerId: number): Promise<void> {
  try {
    // Count referrals with 3+ games
    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count 
       FROM referrals 
       WHERE referrer_id = $1 AND games_played >= 3 AND status = 'active'`,
      [referrerId]
    );
    
    const count = parseInt(countResult.rows[0].count);
    
    // Check which rewards to grant
    const rewardsToGrant: string[] = [];
    
    if (count >= 1) rewardsToGrant.push('1_friend_3_games');
    if (count >= 5) rewardsToGrant.push('5_friends_3_games');
    if (count >= 10) rewardsToGrant.push('10_friends_3_games');
    
    for (const rewardType of rewardsToGrant) {
      // Check if reward already granted
      const existingReward = await query(
        `SELECT 1 FROM referral_rewards 
         WHERE referrer_id = $1 AND reward_type = $2`,
        [referrerId, rewardType]
      );
      
      if (existingReward.rows.length === 0) {
        await grantMilestoneReward(referrerId, rewardType);
      }
    }
  } catch (err) {
    logger.error('Failed to check and grant rewards', err, { referrerId });
  }
}

// Grant milestone reward
async function grantMilestoneReward(referrerId: number, rewardType: string): Promise<void> {
  try {
    let itemCodes: string[] = [];
    
    // Define rewards based on type
    switch (rewardType) {
      case '1_friend_3_games':
        // Random rare dice (excluding owned)
        itemCodes = await getRandomItemsByRarity('dice', 'rare', 1, referrerId);
        break;
      case '5_friends_3_games':
        // Random rare table (excluding owned)
        itemCodes = await getRandomItemsByRarity('table', 'rare', 1, referrerId);
        break;
      case '10_friends_3_games':
        // 3 random rare dice (excluding owned)
        itemCodes = await getRandomItemsByRarity('dice', 'rare', 3, referrerId);
        break;
    }
    
    const grantedItems: any[] = [];
    
    // Grant items
    for (const code of itemCodes) {
      const itemResult = await query<{ id: number; name: string; rarity: string; type: string }>(
        'SELECT id, name, rarity, type FROM item_catalog WHERE code = $1',
        [code]
      );
      
      if (itemResult.rows.length > 0) {
        const item = itemResult.rows[0];
        
        // Add to user inventory
        await query(
          `INSERT INTO user_items (user_id, item_id) 
           VALUES ($1, $2) 
           ON CONFLICT DO NOTHING`,
          [referrerId, item.id]
        );
        
        // Record reward
        await query(
          `INSERT INTO referral_rewards (referrer_id, reward_type, item_id)
           VALUES ($1, $2, $3)`,
          [referrerId, rewardType, item.id]
        );
        
        grantedItems.push({
          id: item.id,
          name: item.name,
          rarity: item.rarity,
          type: item.type
        });
      }
    }
    
    // Notify user
    if (grantedItems.length > 0) {
      await notifyUserItemReceived(referrerId, grantedItems);
    }
    
    logger.info('Milestone reward granted', { referrerId, rewardType, items: itemCodes });
  } catch (err) {
    logger.error('Failed to grant milestone reward', err, { referrerId, rewardType });
  }
}

// Grant purchase reward
async function grantPurchaseReward(referrerId: number, referredId: number): Promise<void> {
  try {
    // Get the item that was purchased (most recent purchase by referred user)
    const purchaseResult = await query<{ item_id: number }>(
      `SELECT item_id FROM purchases 
       WHERE user_id = $1 AND status = 'completed'
       ORDER BY created_at DESC 
       LIMIT 1`,
      [referredId]
    );
    
    if (purchaseResult.rows.length === 0) {
      return;
    }
    
    const purchasedItemId = purchaseResult.rows[0].item_id;
    
    // Get item type and rarity
    const itemResult = await query<{ type: string; rarity: string }>(
      'SELECT type, rarity FROM item_catalog WHERE id = $1',
      [purchasedItemId]
    );
    
    if (itemResult.rows.length === 0) {
      return;
    }
    
    const { type, rarity } = itemResult.rows[0];
    
    // Get random item of same type and rarity (excluding owned)
    const randomItems = await getRandomItemsByRarity(type, rarity, 1, referrerId);
    
    if (randomItems.length > 0) {
      const code = randomItems[0];
      const rewardItemResult = await query<{ id: number; name: string; rarity: string; type: string }>(
        'SELECT id, name, rarity, type FROM item_catalog WHERE code = $1',
        [code]
      );
      
      if (rewardItemResult.rows.length > 0) {
        const rewardItem = rewardItemResult.rows[0];
        
        // Add to user inventory
        await query(
          `INSERT INTO user_items (user_id, item_id) 
           VALUES ($1, $2) 
           ON CONFLICT DO NOTHING`,
          [referrerId, rewardItem.id]
        );
        
        // Record reward
        await query(
          `INSERT INTO referral_rewards (referrer_id, referred_id, reward_type, item_id)
           VALUES ($1, $2, 'first_purchase', $3)`,
          [referrerId, referredId, rewardItem.id]
        );
        
        // Notify user
        await notifyUserItemReceived(referrerId, [{
          id: rewardItem.id,
          name: rewardItem.name,
          rarity: rewardItem.rarity,
          type: rewardItem.type
        }]);
        
        logger.info('Purchase reward granted', { referrerId, referredId, itemCode: code });
      }
    }
  } catch (err) {
    logger.error('Failed to grant purchase reward', err, { referrerId, referredId });
  }
}

// Get random items by rarity (excluding items user already has)
async function getRandomItemsByRarity(type: string, rarity: string, count: number, userId?: number): Promise<string[]> {
  try {
    let query_text = `
      SELECT code FROM item_catalog 
      WHERE type = $1 AND rarity = $2 AND is_available = true
    `;
    
    const params: any[] = [type, rarity];
    
    // Exclude items user already has
    if (userId) {
      query_text += ` AND id NOT IN (
        SELECT item_id FROM user_items WHERE user_id = $3
      )`;
      params.push(userId);
    }
    
    query_text += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
    params.push(count);
    
    const result = await query<{ code: string }>(query_text, params);
    
    // If no new items available, return any items (fallback)
    if (result.rows.length === 0 && userId) {
      const fallbackResult = await query<{ code: string }>(
        `SELECT code FROM item_catalog 
         WHERE type = $1 AND rarity = $2 AND is_available = true
         ORDER BY RANDOM()
         LIMIT $3`,
        [type, rarity, count]
      );
      return fallbackResult.rows.map(r => r.code);
    }
    
    return result.rows.map(r => r.code);
  } catch (err) {
    logger.error('Failed to get random items', err);
    return [];
  }
}

// Get referral stats for a user
export async function getReferralStats(userId: number): Promise<ReferralStats> {
  try {
    const statsResult = await query<{
      total_referrals: string;
      active_referrals: string;
      referrals_with_three_games: string;
      referrals_with_purchase: string;
    }>(
      `SELECT 
        COUNT(*) as total_referrals,
        COUNT(*) FILTER (WHERE status = 'active') as active_referrals,
        COUNT(*) FILTER (WHERE games_played >= 3) as referrals_with_three_games,
        COUNT(*) FILTER (WHERE first_purchase_made = true) as referrals_with_purchase
       FROM referrals 
       WHERE referrer_id = $1`,
      [userId]
    );
    
    const rewardsResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM referral_rewards WHERE referrer_id = $1',
      [userId]
    );
    
    const stats = statsResult.rows[0];
    
    return {
      totalReferrals: parseInt(stats?.total_referrals || '0'),
      activeReferrals: parseInt(stats?.active_referrals || '0'),
      referralsWithThreeGames: parseInt(stats?.referrals_with_three_games || '0'),
      referralsWithPurchase: parseInt(stats?.referrals_with_purchase || '0'),
      totalRewards: parseInt(rewardsResult.rows[0]?.count || '0'),
    };
  } catch (err) {
    logger.error('Failed to get referral stats', err, { userId });
    return {
      totalReferrals: 0,
      activeReferrals: 0,
      referralsWithThreeGames: 0,
      referralsWithPurchase: 0,
      totalRewards: 0,
    };
  }
}

// Get referral list for a user
export async function getReferralList(userId: number): Promise<ReferralInfo[]> {
  try {
    const result = await query<{
      id: number;
      referred_nickname: string;
      games_played: number;
      first_purchase_made: boolean;
      created_at: string;
    }>(
      `SELECT r.id, u.nickname as referred_nickname, r.games_played, 
              r.first_purchase_made, r.created_at
       FROM referrals r
       JOIN users u ON u.id = r.referred_id
       WHERE r.referrer_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      referredNickname: row.referred_nickname,
      gamesPlayed: row.games_played,
      firstPurchaseMade: row.first_purchase_made,
      createdAt: new Date(row.created_at),
    }));
  } catch (err) {
    logger.error('Failed to get referral list', err, { userId });
    return [];
  }
}
