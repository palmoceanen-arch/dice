// Create user_boosts table
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function createBoostsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_boosts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        boost_id VARCHAR(50) NOT NULL,
        boost_type VARCHAR(20) NOT NULL,
        activated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL,
        available_at TIMESTAMP NOT NULL,
        selected_parity VARCHAR(10),
        UNIQUE(user_id, boost_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_boosts_user_id ON user_boosts(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_boosts_expires_at ON user_boosts(expires_at);
    `);
    
    console.log('✓ user_boosts table created successfully');
  } catch (err) {
    console.error('❌ Error creating user_boosts table:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

createBoostsTable();
