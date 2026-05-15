/**
 * Cleanup old/stuck lobbies
 * Usage: node cleanup-lobbies.js [user_id]
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function cleanupLobbies() {
  const userId = process.argv[2] ? parseInt(process.argv[2]) : null;
  
  try {
    if (userId) {
      // Cleanup lobbies for specific user
      console.log(`\n🧹 Cleaning up lobbies for user ${userId}...\n`);
      
      const lobbies = await pool.query(
        'SELECT id, status, created_at FROM lobbies WHERE host_id = $1',
        [userId]
      );
      
      if (lobbies.rows.length === 0) {
        console.log('No lobbies found for this user.');
      } else {
        console.log(`Found ${lobbies.rows.length} lobbies:`);
        lobbies.rows.forEach(lobby => {
          console.log(`  - ${lobby.id} (${lobby.status}) created ${lobby.created_at}`);
        });
        
        // Delete rolls first
        for (const lobby of lobbies.rows) {
          const rollsResult = await pool.query(
            'DELETE FROM rolls WHERE lobby_id = $1',
            [lobby.id]
          );
          if (rollsResult.rowCount > 0) {
            console.log(`  ✓ Deleted ${rollsResult.rowCount} rolls for lobby ${lobby.id}`);
          }
        }
        
        const result = await pool.query(
          'DELETE FROM lobbies WHERE host_id = $1',
          [userId]
        );
        
        console.log(`\n✓ Deleted ${result.rowCount} lobbies`);
      }
    } else {
      // Cleanup all old lobbies (older than 1 hour)
      console.log('\n🧹 Cleaning up old lobbies (older than 1 hour)...\n');
      
      const oldLobbies = await pool.query(
        `SELECT id, host_id, status, created_at 
         FROM lobbies 
         WHERE created_at < NOW() - INTERVAL '1 hour'`
      );
      
      if (oldLobbies.rows.length === 0) {
        console.log('No old lobbies found.');
      } else {
        console.log(`Found ${oldLobbies.rows.length} old lobbies:`);
        oldLobbies.rows.forEach(lobby => {
          console.log(`  - ${lobby.id} (host: ${lobby.host_id}, ${lobby.status}) created ${lobby.created_at}`);
        });
        
        // Delete rolls first
        for (const lobby of oldLobbies.rows) {
          const rollsResult = await pool.query(
            'DELETE FROM rolls WHERE lobby_id = $1',
            [lobby.id]
          );
          if (rollsResult.rowCount > 0) {
            console.log(`  ✓ Deleted ${rollsResult.rowCount} rolls for lobby ${lobby.id}`);
          }
        }
        
        const result = await pool.query(
          `DELETE FROM lobbies WHERE created_at < NOW() - INTERVAL '1 hour'`
        );
        
        console.log(`\n✓ Deleted ${result.rowCount} old lobbies`);
      }
    }
    
    console.log('');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

cleanupLobbies();
