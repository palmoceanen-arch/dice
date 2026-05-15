/**
 * Trigger referral reward check for a referrer
 * This simulates what happens when a referred user plays games
 * Usage: node trigger-referral-rewards.js <referrer_user_id>
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function triggerReferralRewards() {
  const referrerId = parseInt(process.argv[2]);
  
  if (!referrerId) {
    console.error('Usage: node trigger-referral-rewards.js <referrer_user_id>');
    console.log('\nExample: node trigger-referral-rewards.js 234');
    console.log('\nThis will check and grant any pending referral rewards.');
    process.exit(1);
  }
  
  try {
    // Get referrer info
    const userResult = await pool.query(
      'SELECT id, nickname FROM users WHERE id = $1',
      [referrerId]
    );
    
    if (userResult.rows.length === 0) {
      console.error(`❌ User not found: ${referrerId}`);
      process.exit(1);
    }
    
    const user = userResult.rows[0];
    
    console.log('\n📋 Referrer Info:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nickname: ${user.nickname}`);
    
    // Count referrals with 3+ games
    const countResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM referrals 
       WHERE referrer_id = $1 AND games_played >= 3 AND status = 'active'`,
      [referrerId]
    );
    
    const count = parseInt(countResult.rows[0].count);
    
    console.log(`\n📊 Referrals with 3+ games: ${count}`);
    
    // Check which rewards to grant
    const rewardsToGrant = [];
    
    if (count >= 1) rewardsToGrant.push({ type: '1_friend_3_games', itemType: 'dice', itemCount: 1, desc: '1 rare dice' });
    if (count >= 5) rewardsToGrant.push({ type: '5_friends_3_games', itemType: 'table', itemCount: 1, desc: '1 rare table' });
    if (count >= 10) rewardsToGrant.push({ type: '10_friends_3_games', itemType: 'dice', itemCount: 3, desc: '3 rare dice' });
    
    if (rewardsToGrant.length === 0) {
      console.log('\n⚠️  No milestones reached yet.');
      console.log('   Need at least 1 referral with 3+ games.');
      return;
    }
    
    console.log(`\n🎁 Checking rewards...`);
    
    for (const reward of rewardsToGrant) {
      // Check if already granted
      const existingReward = await pool.query(
        `SELECT 1 FROM referral_rewards WHERE referrer_id = $1 AND reward_type = $2`,
        [referrerId, reward.type]
      );
      
      if (existingReward.rows.length > 0) {
        console.log(`   ⏭️  ${reward.desc} - already granted`);
        continue;
      }
      
      console.log(`\n   🎁 Granting: ${reward.desc}`);
      
      // Get random items (excluding owned)
      const itemsResult = await pool.query(
        `SELECT id, name, type, rarity FROM item_catalog 
         WHERE type = $1 AND rarity = 'rare' AND is_available = true
         AND id NOT IN (SELECT item_id FROM user_items WHERE user_id = $2)
         ORDER BY RANDOM()
         LIMIT $3`,
        [reward.itemType, referrerId, reward.itemCount]
      );
      
      if (itemsResult.rows.length === 0) {
        console.log(`   ⚠️  No available ${reward.itemType} items (user has all or none in catalog)`);
        
        // Try without exclusion (allow duplicates)
        const fallbackResult = await pool.query(
          `SELECT id, name, type, rarity FROM item_catalog 
           WHERE type = $1 AND rarity = 'rare' AND is_available = true
           ORDER BY RANDOM()
           LIMIT $2`,
          [reward.itemType, reward.itemCount]
        );
        
        if (fallbackResult.rows.length === 0) {
          console.log(`   ❌ No ${reward.itemType} items in catalog at all!`);
          continue;
        }
        
        console.log(`   ℹ️  Using fallback (allowing duplicates)`);
        itemsResult.rows = fallbackResult.rows;
      }
      
      // Grant items
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
          `INSERT INTO referral_rewards (referrer_id, reward_type, item_id)
           VALUES ($1, $2, $3)`,
          [referrerId, reward.type, item.id]
        );
        
        console.log(`      ✓ ${item.name} (ID: ${item.id})`);
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
      [referrerId]
    );
    
    const rewardsResult = await pool.query(
      'SELECT COUNT(*) as count FROM referral_rewards WHERE referrer_id = $1',
      [referrerId]
    );
    
    const stats = statsResult.rows[0];
    console.log(`   Total referrals: ${stats.total_referrals}`);
    console.log(`   Active referrals (3+ games): ${stats.active_referrals}`);
    console.log(`   Referrals with purchase: ${stats.referrals_with_purchase}`);
    console.log(`   Total rewards granted: ${rewardsResult.rows[0].count}`);
    
    console.log('\n✅ Done!\n');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

triggerReferralRewards();
