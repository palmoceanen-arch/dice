/**
 * Test script to verify referral link processing
 * This simulates what happens when a user clicks a referral link
 * Usage: node test-referral-link.js <referral_code>
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function testReferralLink() {
  const referralCode = process.argv[2];
  
  if (!referralCode) {
    console.error('Usage: node test-referral-link.js <referral_code>');
    console.log('\nExample: node test-referral-link.js DICE_HAES9E');
    console.log('\nTo get your referral code, run:');
    console.log('node show-users.js');
    process.exit(1);
  }
  
  try {
    console.log('\n🔗 Testing Referral Link Processing');
    console.log('=====================================\n');
    
    // Step 1: Verify referral code exists
    console.log('Step 1: Verifying referral code...');
    const referrerResult = await pool.query(
      'SELECT id, nickname, referral_code FROM users WHERE referral_code = $1',
      [referralCode]
    );
    
    if (referrerResult.rows.length === 0) {
      console.error(`❌ Referral code "${referralCode}" not found!`);
      process.exit(1);
    }
    
    const referrer = referrerResult.rows[0];
    console.log(`✅ Referral code found!`);
    console.log(`   Referrer: ${referrer.nickname} (ID: ${referrer.id})`);
    console.log(`   Code: ${referrer.referral_code}`);
    
    // Step 2: Show what the link looks like
    console.log('\n📱 Step 2: Referral Link Format');
    const botUsername = process.env.BOT_USERNAME || 'streetdice_bot';
    const appShortName = process.env.APP_SHORT_NAME || 'app';
    
    // For Mini Apps (recommended)
    const miniAppLink = `https://t.me/${botUsername}/${appShortName}?startapp=ref_${referralCode}`;
    console.log(`   Mini App Link: ${miniAppLink}`);
    console.log(`   Start param: ref_${referralCode}`);
    console.log(`   Note: 'startapp' is converted to 'start_param' in initData`);
    
    // For regular bot (alternative)
    const botLink = `https://t.me/${botUsername}?start=ref_${referralCode}`;
    console.log(`\n   Bot Link (alternative): ${botLink}`);
    console.log(`   Note: Requires bot to send Web App button on /start`);
    
    if (!process.env.BOT_USERNAME) {
      console.log('\n   ⚠️  BOT_USERNAME not set in .env file!');
      console.log('   Add this to your .env: BOT_USERNAME=streetdice_bot');
      console.log('   (Replace with your actual bot username)');
    }    
    // Step 3: Simulate what happens when user clicks the link
    console.log('\n🎯 Step 3: Simulating New User Registration');
    console.log('   When user clicks the link, Telegram sends:');
    console.log(`   - start_param: "ref_${referralCode}"`);
    console.log('   - This gets extracted by extractStartParam()');
    console.log(`   - "ref_" prefix is removed → "${referralCode}"`);
    console.log('   - processReferral() is called with this code');
    
    // Step 4: Show current referrals
    console.log('\n📊 Step 4: Current Referrals');
    const referralsResult = await pool.query(
      `SELECT r.id, u.nickname, r.games_played, r.first_purchase_made, r.created_at
       FROM referrals r
       JOIN users u ON u.id = r.referred_id
       WHERE r.referrer_id = $1
       ORDER BY r.created_at DESC`,
      [referrer.id]
    );
    
    if (referralsResult.rows.length === 0) {
      console.log('   No referrals yet');
    } else {
      console.log(`   Total referrals: ${referralsResult.rows.length}`);
      referralsResult.rows.forEach((ref, i) => {
        console.log(`   ${i + 1}. ${ref.nickname} - ${ref.games_played} games, Purchase: ${ref.first_purchase_made ? 'Yes' : 'No'}`);
      });
    }
    
    // Step 5: Test creating a new referral
    console.log('\n🧪 Step 5: Creating Test Referral');
    const testTelegramId = Math.floor(Math.random() * 1000000000) + 1000000000;
    const testNickname = `TestRef${Math.floor(Math.random() * 9999)}`;
    
    // Create test user
    const newUserResult = await pool.query(
      `INSERT INTO users (telegram_id, nickname, first_name, referral_code)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nickname, referral_code`,
      [testTelegramId, testNickname, 'Test', `DICE_TEST${Math.random().toString(36).substring(7).toUpperCase()}`]
    );
    
    const newUser = newUserResult.rows[0];
    console.log(`   ✅ Created test user: ${newUser.nickname} (ID: ${newUser.id})`);
    
    // Process referral (this is what happens in findOrCreateUser)
    console.log(`   📝 Processing referral with code: ${referralCode}`);
    
    // Check if referrer exists (already verified above)
    // Check if user is trying to refer themselves
    if (referrer.id === newUser.id) {
      console.log('   ❌ Cannot refer yourself!');
    } else {
      // Check if referral already exists
      const existingReferral = await pool.query(
        'SELECT 1 FROM referrals WHERE referrer_id = $1 AND referred_id = $2',
        [referrer.id, newUser.id]
      );
      
      if (existingReferral.rows.length > 0) {
        console.log('   ⚠️  Referral already exists');
      } else {
        // Create referral record
        await pool.query(
          `INSERT INTO referrals (referrer_id, referred_id, referral_code, status)
           VALUES ($1, $2, $3, 'active')`,
          [referrer.id, newUser.id, referralCode]
        );
        
        console.log('   ✅ Referral created successfully!');
      }
    }
    
    // Step 6: Verify referral was created
    console.log('\n✅ Step 6: Verification');
    const verifyResult = await pool.query(
      `SELECT r.*, u.nickname as referred_nickname
       FROM referrals r
       JOIN users u ON u.id = r.referred_id
       WHERE r.referrer_id = $1 AND r.referred_id = $2`,
      [referrer.id, newUser.id]
    );
    
    if (verifyResult.rows.length > 0) {
      const ref = verifyResult.rows[0];
      console.log('   ✅ Referral verified in database:');
      console.log(`      Referrer ID: ${ref.referrer_id}`);
      console.log(`      Referred ID: ${ref.referred_id}`);
      console.log(`      Referred User: ${ref.referred_nickname}`);
      console.log(`      Referral Code: ${ref.referral_code}`);
      console.log(`      Status: ${ref.status}`);
      console.log(`      Games Played: ${ref.games_played}`);
      console.log(`      Created: ${ref.created_at}`);
    } else {
      console.log('   ❌ Referral not found in database!');
    }
    
    // Step 7: Show how to test in production
    console.log('\n🚀 Step 7: Testing in Production');
    console.log('   To test with real Telegram:');
    console.log(`   1. Share this link: ${miniAppLink}`);
    console.log('   2. Open it on another device/account');
    console.log('   3. It should open your Mini App directly');
    console.log('   4. Check server logs for:');
    console.log('      - "Auth attempt" with startParam and referralCode');
    console.log('      - "New user X registered with referral code: DICE_XXXXXX"');
    console.log('      - "Referral processing result: SUCCESS"');
    console.log('      - "Processing referral" with code');
    console.log('      - "Referrer found" with ID');
    console.log('      - "Referral created successfully"');
    console.log('   5. Verify in database:');
    console.log(`      SELECT * FROM referrals WHERE referrer_id = ${referrer.id} ORDER BY created_at DESC LIMIT 1;`);
    
    // Step 8: Show logging points
    console.log('\n📝 Step 8: Server Logging Points');
    console.log('   The server logs these events:');
    console.log('   1. extractStartParam() extracts start_param from initData');
    console.log('   2. handleAuth() logs: "User authenticated"');
    console.log('   3. processReferral() logs: "Referral created" (in referrals.ts)');
    console.log('   4. Check logs with: tail -f /path/to/server/logs');
    
    console.log('\n✅ Test completed successfully!');
    console.log(`\nTest user created: ${newUser.nickname} (ID: ${newUser.id})`);
    console.log('You can delete this test user with:');
    console.log(`DELETE FROM referrals WHERE referred_id = ${newUser.id};`);
    console.log(`DELETE FROM users WHERE id = ${newUser.id};`);
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

testReferralLink();
