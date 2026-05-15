/**
 * Cleanup script - removes all test/dev data from database
 * USE WITH CAUTION! This will delete all users and related data.
 */

import { pool } from './client.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function cleanup() {
  console.log('⚠️  WARNING: This will delete ALL data from the database!');
  console.log('This includes:');
  console.log('  - All users');
  console.log('  - All friends');
  console.log('  - All lobbies and games');
  console.log('  - All purchases');
  console.log('  - All match history');
  console.log('  - All invitations');
  console.log('');
  console.log('Item catalog will NOT be deleted (dice, tables, etc.)');
  console.log('');
  
  // Wait 3 seconds to give user time to cancel
  console.log('Starting cleanup in 3 seconds... Press Ctrl+C to cancel');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('\n🗑️  Starting cleanup...\n');
  
  try {
    // Delete in correct order (respecting foreign keys)
    
    // 1. Match data
    console.log('Deleting match history...');
    await pool.query('DELETE FROM match_rolls');
    await pool.query('DELETE FROM match_players');
    await pool.query('DELETE FROM match_history');
    
    // 2. Game data
    console.log('Deleting game sessions...');
    await pool.query('DELETE FROM bets');
    await pool.query('DELETE FROM rolls');
    await pool.query('DELETE FROM game_sessions');
    
    // 3. Lobby data
    console.log('Deleting lobbies...');
    await pool.query('DELETE FROM lobby_players');
    await pool.query('DELETE FROM lobbies');
    
    // 4. Social data
    console.log('Deleting invitations and friend requests...');
    await pool.query('DELETE FROM invitations');
    await pool.query('DELETE FROM friend_requests');
    await pool.query('DELETE FROM friends');
    
    // 5. Purchases
    console.log('Deleting purchases...');
    await pool.query('DELETE FROM purchases');
    
    // 6. User items
    console.log('Deleting user inventories...');
    await pool.query('DELETE FROM user_items');
    
    // 7. Users (this will cascade delete anything we missed)
    console.log('Deleting users...');
    const result = await pool.query('DELETE FROM users');
    
    console.log(`\n✅ Cleanup complete! Deleted ${result.rowCount} users and all related data.`);
    console.log('\nDatabase is now clean. Item catalog (dice, tables) is preserved.');
    
    // Show remaining data
    const itemCount = await pool.query('SELECT COUNT(*) FROM item_catalog');
    console.log(`\nRemaining items in catalog: ${itemCount.rows[0].count}`);
    
  } catch (err) {
    console.error('\n❌ Cleanup failed:', err);
    process.exit(1);
  }
  
  await pool.end();
}

// Run cleanup
cleanup();
