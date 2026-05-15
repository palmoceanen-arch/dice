/**
 * Test script for referral system
 * Usage: node test-referral.js <referrer_user_id> [mode]
 * Modes: single, multiple, purchase
 */

import pg from 'pg';
import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

const WS_URL = process.env.WS_URL || 'ws://localhost:3002';

// Send notification to user via WebSocket server
async function notifyUser(userId, items) {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(WS_URL);
      
      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'admin_gift',
          targetUserId: userId,
          item: items
        }));
        setTimeout(() => {
          ws.close();
          resolve(true);
        }, 100);
      });
      
      ws.on('error', (err) => {
        console.log('   ⚠️  WebSocket error (user might not be online):', err.message);
        resolve(false);
      });
      
      setTimeout(() => { 
        ws.close(); 
        resolve(false); 
      }, 2000);
    } catch (err) {
      console.log('   ⚠️  Failed to notify user:', err.message);
      resolve(false);
    }
  });
}

// Helper function to grant reward
async function grantReward(referrerId, referredId, rewardType, itemType, itemCount) {
  const itemsResult = await pool.query(
    `SELECT id, name, type, rarity FROM item_catalog 
     WHERE type = $1 AND rarity = 'rare' AND is_available = true
     AND id NOT IN (SELECT item_id FROM user_items WHERE user_id = $2)
     ORDER BY RANDOM()
     LIMIT $3`,
    [itemType, referrerId, itemCount]
  );
  
  const grantedItems = [];
  
  for (const item of itemsResult.rows) {
    // Add to inventory
    await pool.query(
      `INSERT INTO user_items (user_id, item_id) 
       VALUES ($1, $2) 
       ON CONFLICT DO NOTHING`,
      [referrerId, item.id]
    );
    
    // Record reward
    await pool.query(
      `INSERT INTO referral_rewards (referrer_id, referred_id, reward_type, item_id)
       VALUES ($1, $2, $3, $4)`,
      [referrerId, referredId || null, rewardType, item.id]
    );
    
    grantedItems.push({
      id: item.id,
      name: item.name,
      type: item.type,
      rarity: item.rarity
    });
    
    console.log(`   ✓ Granted: ${item.name} (ID: ${item.id})`);
  }
  
  // Notify user via WebSocket
  if (grantedItems.length > 0) {
    console.log('\n📤 Sending notification to user...');
    const notified = await notifyUser(referrerId, grantedItems);
    if (notified) {
      console.log('   ✓ User notified successfully');
    } else {
      console.log('   ⚠️  User not online or notification failed');
    }
  }
  
  return grantedItems.length;
}

async function testReferral() {
  const referrerUserId = parseInt(process.argv[2]);
  const mode = process.argv[3] || 'single'; // single, multiple, purchase
  
  if (!referrerUserId) {
    console.error('Usage: node test-referral.js <referrer_user_id> [mode]');
    console.log('\nModes:');
    console.log('  single   - Create 1 referral with 3 games (default)');
    console.log('  multiple - Create 10 referrals with 3 games each');
    console.log('  purchase - Create 1 referral and simulate purchase');
    console.log('\nExample: node test-referral.js 234 multiple');
    console.log('\nTo find your user ID, run:');
    console.log('node show-users.js');
    process.exit(1);
  }
  
  try {
    // Get referrer info
    const referrerResult = await pool.query(
      'SELECT id, nickname, referral_code FROM users WHERE id = $1',
      [referrerUserId]
    );
    
    if (referrerResult.rows.length === 0) {
      console.error(`User with ID ${referrerUserId} not found`);
      process.exit(1);
    }
    
    const referrer = referrerResult.rows[0];
    console.log('\n📋 Referrer Info:');
    console.log(`   ID: ${referrer.id}`);
    console.log(`   Nickname: ${referrer.nickname}`);
    console.log(`   Referral Code: ${referrer.referral_code}`);
    
    if (mode === 'multiple') {
      // Create 10 referrals with 3 games each
      console.log('\n🎮 Creating 10 referrals with 3 games each...');
      
      for (let i = 1; i <= 10; i++) {
        const testTelegramId = Math.floor(Math.random() * 1000000000) + 1000000000;
        const testNickname = `TestUser${Math.floor(Math.random() * 9999)}`;
        
        // Create user
        const newUserResult = await pool.query(
          `INSERT INTO users (telegram_id, nickname, first_name, referral_code)
           VALUES ($1, $2, $3, $4)
           RETURNING id, nickname`,
          [testTelegramId, testNickname, 'Test', `DICE_TEST${Math.random().toString(36).substring(7).toUpperCase()}`]
        );
        
        const newUser = newUserResult.rows[0];
        
        // Create referral link
        await pool.query(
          `INSERT INTO referrals (referrer_id, referred_id, referral_code, status)
           VALUES ($1, $2, $3, 'active')`,
          [referrer.id, newUser.id, referrer.referral_code]
        );
        
        // Simulate 3 games
        await pool.query(
          `UPDATE referrals SET games_played = 3 WHERE referrer_id = $1 AND referred_id = $2`,
          [referrer.id, newUser.id]
        );
        
        console.log(`   ✓ Referral ${i}/10: ${newUser.nickname} (ID: ${newUser.id})`);
      }
      
      // Check for rewards
      const countResult = await pool.query(
        `SELECT COUNT(*) as count FROM referrals 
         WHERE referrer_id = $1 AND games_played >= 3 AND status = 'active'`,
        [referrer.id]
      );
      
      const count = parseInt(countResult.rows[0].count);
      console.log(`\n📊 Total referrals with 3+ games: ${count}`);
      
      // Grant rewards for 1, 5, and 10 friends
      const rewardsToGrant = [];
      if (count >= 1) rewardsToGrant.push({ type: '1_friend_3_games', itemType: 'dice', itemCount: 1 });
      if (count >= 5) rewardsToGrant.push({ type: '5_friends_3_games', itemType: 'table', itemCount: 1 });
      if (count >= 10) rewardsToGrant.push({ type: '10_friends_3_games', itemType: 'dice', itemCount: 3 });
      
      for (const reward of rewardsToGrant) {
        // Check if already granted
        const existingReward = await pool.query(
          `SELECT 1 FROM referral_rewards WHERE referrer_id = $1 AND reward_type = $2`,
          [referrer.id, reward.type]
        );
        
        if (existingReward.rows.length === 0) {
          console.log(`\n🎁 Granting reward: ${reward.type}`);
          await grantReward(referrer.id, 0, reward.type, reward.itemType, reward.itemCount);
        } else {
          console.log(`\n⚠️  Reward ${reward.type} already granted`);
        }
      }
      
    } else if (mode === 'purchase') {
      // Create 1 referral and simulate purchase
      console.log('\n👤 Creating test user with purchase...');
      
      const testTelegramId = Math.floor(Math.random() * 1000000000) + 1000000000;
      const testNickname = `TestUser${Math.floor(Math.random() * 9999)}`;
      
      const newUserResult = await pool.query(
        `INSERT INTO users (telegram_id, nickname, first_name, referral_code)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nickname, referral_code`,
        [testTelegramId, testNickname, 'Test', `DICE_TEST${Math.random().toString(36).substring(7).toUpperCase()}`]
      );
      
      const newUser = newUserResult.rows[0];
      console.log(`   ✓ Created user: ${newUser.nickname} (ID: ${newUser.id})`);
      
      // Create referral link
      await pool.query(
        `INSERT INTO referrals (referrer_id, referred_id, referral_code, status)
         VALUES ($1, $2, $3, 'active')`,
        [referrer.id, newUser.id, referrer.referral_code]
      );
      console.log(`   ✓ Referral link created`);
      
      // Simulate 3 games
      await pool.query(
        `UPDATE referrals SET games_played = 3 WHERE referrer_id = $1 AND referred_id = $2`,
        [referrer.id, newUser.id]
      );
      console.log(`   ✓ 3 games completed`);
      
      // Grant 1 friend reward
      const existingReward = await pool.query(
        `SELECT 1 FROM referral_rewards WHERE referrer_id = $1 AND reward_type = '1_friend_3_games'`,
        [referrer.id]
      );
      
      if (existingReward.rows.length === 0) {
        console.log(`\n🎁 Granting reward: 1_friend_3_games`);
        await grantReward(referrer.id, newUser.id, '1_friend_3_games', 'dice', 1);
      }
      
      // Simulate purchase
      console.log('\n💳 Simulating purchase...');
      
      // Get a random rare item to "purchase"
      const purchaseItemResult = await pool.query(
        `SELECT id, name, type, rarity FROM item_catalog 
         WHERE rarity = 'rare' AND is_available = true 
         ORDER BY RANDOM() 
         LIMIT 1`
      );
      
      if (purchaseItemResult.rows.length > 0) {
        const purchasedItem = purchaseItemResult.rows[0];
        console.log(`   ✓ User "purchased": ${purchasedItem.name}`);
        
        // Create purchase record
        await pool.query(
          `INSERT INTO purchases (user_id, item_id, telegram_payment_id, stars_amount, status)
           VALUES ($1, $2, $3, 100, 'completed')`,
          [newUser.id, purchasedItem.id, `test_${Date.now()}`]
        );
        
        // Mark referral as having made purchase
        await pool.query(
          `UPDATE referrals SET first_purchase_made = true WHERE referrer_id = $1 AND referred_id = $2`,
          [referrer.id, newUser.id]
        );
        
        // Grant purchase reward (same type and rarity)
        console.log(`\n🎁 Granting purchase reward (${purchasedItem.type}, ${purchasedItem.rarity})...`);
        
        const rewardItemResult = await pool.query(
          `SELECT id, name, type, rarity FROM item_catalog 
           WHERE type = $1 AND rarity = $2 AND is_available = true 
           AND id NOT IN (SELECT item_id FROM user_items WHERE user_id = $3)
           ORDER BY RANDOM() 
           LIMIT 1`,
          [purchasedItem.type, purchasedItem.rarity, referrer.id]
        );
        
        if (rewardItemResult.rows.length > 0) {
          const rewardItem = rewardItemResult.rows[0];
          
          // Add to inventory
          await pool.query(
            `INSERT INTO user_items (user_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [referrer.id, rewardItem.id]
          );
          
          // Record reward
          await pool.query(
            `INSERT INTO referral_rewards (referrer_id, referred_id, reward_type, item_id)
             VALUES ($1, $2, 'first_purchase', $3)`,
            [referrer.id, newUser.id, rewardItem.id]
          );
          
          console.log(`   ✓ Granted: ${rewardItem.name}`);
          
          // Notify user
          const notified = await notifyUser(referrer.id, [{
            id: rewardItem.id,
            name: rewardItem.name,
            type: rewardItem.type,
            rarity: rewardItem.rarity
          }]);
          
          if (notified) {
            console.log('   ✓ User notified successfully');
          } else {
            console.log('   ⚠️  User not online or notification failed');
          }
        } else {
          console.log('   ⚠️  No new items available for reward');
        }
      }
      
    } else {
      // Single referral mode
      console.log('\n👤 Creating test user...');
      const testTelegramId = Math.floor(Math.random() * 1000000000) + 1000000000;
      const testNickname = `TestUser${Math.floor(Math.random() * 9999)}`;
      
      const newUserResult = await pool.query(
        `INSERT INTO users (telegram_id, nickname, first_name, referral_code)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nickname, referral_code`,
        [testTelegramId, testNickname, 'Test', `DICE_TEST${Math.random().toString(36).substring(7).toUpperCase()}`]
      );
      
      const newUser = newUserResult.rows[0];
      console.log(`   ✓ Created user: ${newUser.nickname} (ID: ${newUser.id})`);
      
      // Create referral link
      console.log('\n🔗 Creating referral link...');
      await pool.query(
        `INSERT INTO referrals (referrer_id, referred_id, referral_code, status)
         VALUES ($1, $2, $3, 'active')`,
        [referrer.id, newUser.id, referrer.referral_code]
      );
      console.log(`   ✓ Referral link created`);
      
      // Simulate 3 games
      console.log('\n🎮 Simulating 3 games...');
      for (let i = 1; i <= 3; i++) {
        await pool.query(
          `UPDATE referrals SET games_played = $1 WHERE referrer_id = $2 AND referred_id = $3`,
          [i, referrer.id, newUser.id]
        );
        console.log(`   ✓ Game ${i} completed`);
      }
      
      // Check for rewards
      const countResult = await pool.query(
        `SELECT COUNT(*) as count FROM referrals 
         WHERE referrer_id = $1 AND games_played >= 3 AND status = 'active'`,
        [referrer.id]
      );
      
      const count = parseInt(countResult.rows[0].count);
      console.log(`\n📊 Total referrals with 3+ games: ${count}`);
      
      // Check if reward should be granted
      let rewardType = null;
      let itemType = 'dice';
      let itemCount = 1;
      
      if (count >= 10) {
        rewardType = '10_friends_3_games';
        itemCount = 3;
      } else if (count >= 5) {
        rewardType = '5_friends_3_games';
        itemType = 'table';
      } else if (count >= 1) {
        rewardType = '1_friend_3_games';
      }
      
      if (rewardType) {
        // Check if reward already granted
        const existingReward = await pool.query(
          `SELECT 1 FROM referral_rewards WHERE referrer_id = $1 AND reward_type = $2`,
          [referrer.id, rewardType]
        );
        
        if (existingReward.rows.length === 0) {
          console.log(`\n🎁 Granting reward: ${rewardType}`);
          await grantReward(referrer.id, newUser.id, rewardType, itemType, itemCount);
        } else {
          console.log(`\n⚠️  Reward ${rewardType} already granted`);
        }
      }
    }
    
    // Show final stats
    console.log('\n📈 Final Stats:');
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_referrals,
        COUNT(*) FILTER (WHERE games_played >= 3) as active_referrals,
        COUNT(*) FILTER (WHERE first_purchase_made = true) as referrals_with_purchase
       FROM referrals 
       WHERE referrer_id = $1`,
      [referrer.id]
    );
    
    const rewardsResult = await pool.query(
      'SELECT COUNT(*) as count FROM referral_rewards WHERE referrer_id = $1',
      [referrer.id]
    );
    
    const stats = statsResult.rows[0];
    console.log(`   Total referrals: ${stats.total_referrals}`);
    console.log(`   Active referrals (3+ games): ${stats.active_referrals}`);
    console.log(`   Referrals with purchase: ${stats.referrals_with_purchase}`);
    console.log(`   Total rewards: ${rewardsResult.rows[0].count}`);
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

testReferral();
