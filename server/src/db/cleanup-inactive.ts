/**
 * Cleanup inactive users - removes users who haven't been online for X days
 * Safer than full cleanup - only removes old test accounts
 * 
 * Usage:
 *   npm run db:cleanup-inactive           (default: 30 days)
 *   tsx src/db/cleanup-inactive.ts 7      (custom: 7 days)
 */

import { pool } from './client.js';

// Get days from command line argument or use default
const DAYS_INACTIVE = parseInt(process.argv[2]) || 30;

async function cleanupInactive() {
  console.log(`🗑️  Cleaning up users inactive for ${DAYS_INACTIVE}+ days...\n`);
  
  try {
    // First, show what will be deleted
    const preview = await pool.query(
      `SELECT COUNT(*) as count, 
              MIN(last_online) as oldest,
              MAX(last_online) as newest
       FROM users 
       WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'`
    );
    
    const count = parseInt(preview.rows[0].count);
    
    if (count === 0) {
      console.log('✅ No inactive users found. Database is clean!');
      await pool.end();
      return;
    }
    
    console.log(`Found ${count} inactive users:`);
    console.log(`  Oldest activity: ${preview.rows[0].oldest}`);
    console.log(`  Newest activity: ${preview.rows[0].newest}`);
    console.log('');
    
    // Wait 3 seconds
    console.log('Deleting in 3 seconds... Press Ctrl+C to cancel');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🗑️  Deleting...\n');
    
    // Step 1: Delete related data for old lobbies AND lobbies of inactive users
    console.log('Cleaning up old lobby data...');
    
    // Delete rolls for old lobbies and lobbies of inactive users
    const rollsDeleted = await pool.query(
      `DELETE FROM rolls 
       WHERE lobby_id IN (
         SELECT id FROM lobbies 
         WHERE created_at < NOW() - INTERVAL '7 days' 
         OR status = 'finished'
         OR host_id IN (
           SELECT id FROM users 
           WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'
         )
       )`
    );
    console.log(`  Deleted ${rollsDeleted.rowCount} old rolls`);
    
    // Delete bets
    const betsDeleted = await pool.query(
      `DELETE FROM bets 
       WHERE session_id IN (
         SELECT id FROM game_sessions 
         WHERE lobby_id IN (
           SELECT id FROM lobbies 
           WHERE created_at < NOW() - INTERVAL '7 days' 
           OR status = 'finished'
           OR host_id IN (
             SELECT id FROM users 
             WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'
           )
         )
       )`
    );
    console.log(`  Deleted ${betsDeleted.rowCount} old bets`);
    
    // Delete game sessions
    const sessionsDeleted = await pool.query(
      `DELETE FROM game_sessions 
       WHERE lobby_id IN (
         SELECT id FROM lobbies 
         WHERE created_at < NOW() - INTERVAL '7 days' 
         OR status = 'finished'
         OR host_id IN (
           SELECT id FROM users 
           WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'
         )
       )`
    );
    console.log(`  Deleted ${sessionsDeleted.rowCount} old game sessions`);
    
    // Delete lobby players
    const playersDeleted = await pool.query(
      `DELETE FROM lobby_players 
       WHERE lobby_id IN (
         SELECT id FROM lobbies 
         WHERE created_at < NOW() - INTERVAL '7 days' 
         OR status = 'finished'
         OR host_id IN (
           SELECT id FROM users 
           WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'
         )
       )`
    );
    console.log(`  Deleted ${playersDeleted.rowCount} old lobby players`);
    
    // Step 2: Delete old lobbies and lobbies of inactive users
    console.log('Cleaning up old lobbies...');
    const lobbiesDeleted = await pool.query(
      `DELETE FROM lobbies 
       WHERE created_at < NOW() - INTERVAL '7 days'
       OR status = 'finished'
       OR host_id IN (
         SELECT id FROM users 
         WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'
       )`
    );
    console.log(`  Deleted ${lobbiesDeleted.rowCount} old lobbies`);
    
    // Step 3: Delete invitations for inactive users
    console.log('Cleaning up invitations...');
    const invitationsDeleted = await pool.query(
      `DELETE FROM invitations 
       WHERE from_user_id IN (
         SELECT id FROM users 
         WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'
       )
       OR to_user_id IN (
         SELECT id FROM users 
         WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'
       )`
    );
    console.log(`  Deleted ${invitationsDeleted.rowCount} old invitations`);
    
    // Step 4: Delete users (CASCADE will handle remaining related data)
    console.log('Deleting inactive users...');
    const result = await pool.query(
      `DELETE FROM users 
       WHERE last_online < NOW() - INTERVAL '${DAYS_INACTIVE} days'`
    );
    
    console.log(`✅ Deleted ${result.rowCount} inactive users and all their data.`);
    
    // Show remaining stats
    const remaining = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`\nRemaining users: ${remaining.rows[0].count}`);
    
  } catch (err) {
    console.error('\n❌ Cleanup failed:', err);
    process.exit(1);
  }
  
  await pool.end();
}

cleanupInactive();
