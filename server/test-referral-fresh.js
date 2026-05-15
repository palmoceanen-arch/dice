/**
 * Fresh referral test - creates a clean test scenario
 * Usage: node test-referral-fresh.js <your_user_id>
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function testReferralFresh() {
  const userId = parseInt(process.argv[2]);
  
  if (!userId) {
    console.error('Usage: node test-referral-fresh.js <your_user_id>');
    console.log('\nThis script will:');
    console.log('  1. Reset your referral data (keep your account)');
    console.log('  2. Show your referral link');
    console.log('  3. Wait for you to test with another account');
    console.log('  4. Show the results');
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
    
    console.log('\n🧪 Fresh Referral Test');
    console.log('======================\n');
    
    console.log('📋 Your Info:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nickname: ${user.nickname}`);
    console.log(`   Referral Code: ${user.referral_code}`);
    
    // Step 1: Reset referral data
    console.log('\n🔄 Step 1: Resetting referral data...');
    
    await pool.query('DELETE FROM referral_rewards WHERE referrer_id = $1 OR referred_id = $1', [userId]);
    await pool.query('DELETE FROM referrals WHERE referrer_id = $1', [userId]);
    await pool.query('DELETE FROM referrals WHERE referred_id = $1', [userId]);
    
    console.log('   ✓ Referral data reset');
    
    // Step 2: Show referral link
    console.log('\n🔗 Step 2: Your Referral Link');
    const botUsername = process.env.BOT_USERNAME || 'streetdice_bot';
    const appShortName = process.env.APP_SHORT_NAME || 'app';
    const referralLink = `https://t.me/${botUsername}/${appShortName}?startapp=ref_${user.referral_code}`;
    
    console.log(`\n   ${referralLink}\n`);
    console.log('   Copy this link and open it on another device/account!');
    
    // Step 3: Wait for test
    console.log('\n⏳ Step 3: Waiting for referral...');
    console.log('   Open the link above on another device');
    console.log('   The app should open directly (not bot chat)');
    console.log('   After opening, press Enter here to check results...\n');
    
    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    
    // Step 4: Check results
    console.log('\n📊 Step 4: Checking Results...\n');
    
    const referrals = await pool.query(
      `SELECT r.*, u.nickname as referred_nickname, u.telegram_id as referred_telegram_id
       FROM referrals r
       JOIN users u ON u.id = r.referred_id
       WHERE r.referrer_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );
    
    if (referrals.rows.length === 0) {
      console.log('❌ No referrals found!');
      console.log('\nPossible issues:');
      console.log('  1. Link format is wrong (check it opens Mini App, not bot)');
      console.log('  2. User already registered before');
      console.log('  3. start_param not passed correctly');
      console.log('\nCheck server logs:');
      console.log('  pm2 logs street-dice-server --lines 50');
      console.log('\nLook for:');
      console.log('  - "Auth attempt" with startParam');
      console.log('  - "Processing referral"');
      console.log('  - "Referral created successfully"');
    } else {
      console.log('✅ Referral created successfully!\n');
      
      referrals.rows.forEach((ref, i) => {
        console.log(`Referral ${i + 1}:`);
        console.log(`  Referred User: ${ref.referred_nickname}`);
        console.log(`  Telegram ID: ${ref.referred_telegram_id}`);
        console.log(`  Games Played: ${ref.games_played}`);
        console.log(`  First Purchase: ${ref.first_purchase_made ? 'Yes' : 'No'}`);
        console.log(`  Status: ${ref.status}`);
        console.log(`  Created: ${ref.created_at}`);
        console.log('');
      });
      
      console.log('🎮 Next Steps:');
      console.log('  1. Play 3 games with the referred account');
      console.log('  2. Check if you receive a rare dice reward');
      console.log('  3. Test purchase reward (optional)');
      console.log('\nOr use test scripts:');
      console.log(`  node test-referral.js ${userId} single`);
      console.log(`  node test-referral.js ${userId} multiple`);
      console.log(`  node test-referral.js ${userId} purchase`);
    }
    
    console.log('\n');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

testReferralFresh();
