/**
 * Add games to a referred user (to trigger referral rewards)
 * Usage: node add-referral-games.js <referred_user_id> <games_count>
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function addReferralGames() {
  const referredUserId = parseInt(process.argv[2]);
  const gamesCount = parseInt(process.argv[3]) || 3;
  
  if (!referredUserId) {
    console.error('Usage: node add-referral-games.js <referred_user_id> [games_count]');
    console.log('\nExample: node add-referral-games.js 1014 3');
    console.log('\nTo find users:');
    console.log('  node show-users.js');
    process.exit(1);
  }
  
  try {
    // Get user info
    const userResult = await pool.query(
      'SELECT id, nickname, telegram_id FROM users WHERE id = $1',
      [referredUserId]
    );
    
    if (userResult.rows.length === 0) {
      console.error(`❌ User not found: ${referredUserId}`);
      process.exit(1);
    }
    
    const user = userResult.rows[0];
    
    console.log('\n📋 User Info:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nickname: ${user.nickname}`);
    console.log(`   Telegram ID: ${user.telegram_id}`);
    
    // Check if user is a referral
    const referralResult = await pool.query(
      `SELECT r.*, u.nickname as referrer_nickname 
       FROM referrals r
       JOIN users u ON u.id = r.referrer_id
       WHERE r.referred_id = $1`,
      [referredUserId]
    );
    
    if (referralResult.rows.length === 0) {
      console.log('\n⚠️  This user is not a referral (not invited by anyone)');
      console.log('Cannot add games to non-referral users.');
      process.exit(1);
    }
    
    const referral = referralResult.rows[0];
    
    console.log('\n🔗 Referral Info:');
    console.log(`   Referrer: ${referral.referrer_nickname} (ID: ${referral.referrer_id})`);
    console.log(`   Current games: ${referral.games_played}`);
    console.log(`   Status: ${referral.status}`);
    
    // Add games
    const newGamesCount = referral.games_played + gamesCount;
    
    console.log(`\n🎮 Adding ${gamesCount} games...`);
    console.log(`   ${referral.games_played} → ${newGamesCount}`);
    
    await pool.query(
      'UPDATE referrals SET games_played = $1 WHERE id = $2',
      [newGamesCount, referral.id]
    );
    
    console.log('   ✓ Games updated');
    
    // Check if reward should be triggered
    if (referral.games_played < 3 && newGamesCount >= 3) {
      console.log('\n🎁 Milestone reached! User played 3 games!');
      console.log(`   Referrer ${referral.referrer_nickname} should receive a reward.`);
      console.log('\n   Note: Rewards are granted by the server automatically.');
      console.log('   Check if the referrer is online to receive real-time notification.');
      console.log('\n   Or check rewards with:');
      console.log(`   node -e "const pg=require('pg');require('dotenv').config();const p=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?.includes('neon.tech')?{rejectUnauthorized:false}:false});p.query('SELECT * FROM referral_rewards WHERE referrer_id=${referral.referrer_id}').then(r=>{console.log(r.rows);p.end();});"`);
    } else if (newGamesCount >= 3) {
      console.log('\n✓ User already has 3+ games (milestone already reached)');
    } else {
      console.log(`\n⏳ Need ${3 - newGamesCount} more games to reach milestone`);
    }
    
    console.log('\n✅ Done!\n');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

addReferralGames();
