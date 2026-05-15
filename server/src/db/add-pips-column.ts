import { pool } from './client.js';

/**
 * Migration: Add pips column to users table
 * This allows tracking player points earned from dice rolls
 */
async function addPipsColumn() {
  console.log('Adding pips column to users table...');
  
  try {
    // Add pips column with default value 0
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS pips BIGINT DEFAULT 0 NOT NULL
    `);
    
    console.log('✓ Added pips column');
    
    // Add index for potential leaderboard queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_pips ON users(pips DESC)
    `);
    
    console.log('✓ Added index on pips column');
    
    console.log('\n✓ Migration completed successfully!');
  } catch (err) {
    console.error('✗ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addPipsColumn();
