/**
 * Reset all referral data for a user (keep user account)
 * Usage: node reset-user-referrals.js <user_id>
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function resetUserReferrals() {
  const userId = parseInt(process.argv[2]);
  
  if (!userId) {
    console.error('Usage: node reset-user-referrals.js <user_id>');
    console.log('\nExample: node reset-user-referrals.js 234');
    console.log('\nTo find your user ID:');
    console.log('  node show-users.js');
    process.exit(1);
  }
  
  try {
    // Get user info
    const userResult = await pool.query(
      'SELECT id, nickname, referral_code FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      console.error(`❌ User not found: ${userId}`);
      process.exit(1);
    }
    
    const user = userResult.rows[0];
    
    console.log('\n📋 User Info:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nickname: ${user.nickname}`);
    console.log(`   Referral Code: ${user.referral_code}`);
    
    // Show current referral data
    const referralsAsReferrer = await pool.query(
      'SELECT COUNT(*) as count FROM referrals WHERE referrer_id = $1',
      [userId]
    );
    
    const referralsAsReferred = await pool.query(
      'SELECT COUNT(*) as count FROM referrals WHERE referred_id = $1',
      [userId]
    );
    
    const rewards = await pool.query(
      'SELECT COUNT(*) as count FROM referral_rewards WHERE referrer_id = $1',
      [userId]
    );
    
    console.log('\n📊 Current Referral Data:');
    console.log(`   Referrals (as referrer): ${referralsAsReferrer.rows[0].count}`);
    console.log(`   Referrals (as referred): ${referralsAsReferred.rows[0].count}`);
    console.log(`   Referral rewards: ${rewards.rows[0].count}`);
    
    console.log('\n⚠️  This will DELETE:');
    console.log('   - All referrals where you are the referrer');
    console.log('   - All referrals where you were referred');
    console.log('   - All referral rewards');
    console.log('\n✅ This will KEEP:');
    console.log('   - Your user account');
    console.log('   - Your referral code');
    console.log('   - Your items (including referral rewards)');
    console.log('   - Your friends');
    console.log('   - Your purchases');
    
    console.log('\n⏳ Resetting in 3 seconds... (Press Ctrl+C to cancel)');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🔄 Resetting referral data...\n');
    
    // Delete referral rewards
    const deletedRewards = await pool.query(
      'DELETE FROM referral_rewards WHERE referrer_id = $1 OR referred_id = $1',
      [userId]
    );
    console.log(`✓ Deleted ${deletedRewards.rowCount} referral rewards`);
    
    // Delete referrals (as referrer)
    const deletedAsReferrer = await pool.query(
      'DELETE FROM referrals WHERE referrer_id = $1',
      [userId]
    );
    console.log(`✓ Deleted ${deletedAsReferrer.rowCount} referrals (as referrer)`);
    
    // Delete referrals (as referred)
    const deletedAsReferred = await pool.query(
      'DELETE FROM referrals WHERE referred_id = $1',
      [userId]
    );
    console.log(`✓ Deleted ${deletedAsReferred.rowCount} referrals (as referred)`);
    
    console.log('\n✅ Referral data reset successfully!');
    console.log(`\nUser "${user.nickname}" can now receive new referrals.`);
    console.log(`Referral code: ${user.referral_code}\n`);
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

resetUserReferrals();
