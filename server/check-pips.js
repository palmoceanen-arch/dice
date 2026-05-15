// Check and add pips column if needed
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function checkAndAddPips() {
  try {
    console.log('Checking pips column...');
    
    // Check if column exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'pips'
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('❌ Column pips does not exist. Adding...');
      
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN pips BIGINT DEFAULT 0 NOT NULL
      `);
      
      await pool.query(`
        CREATE INDEX idx_users_pips ON users(pips DESC)
      `);
      
      console.log('✅ Column pips added successfully!');
    } else {
      console.log('✅ Column pips already exists');
    }
    
    // Show sample data
    const sampleResult = await pool.query(`
      SELECT id, nickname, pips 
      FROM users 
      ORDER BY last_online DESC 
      LIMIT 5
    `);
    
    console.log('\nRecent users:');
    console.table(sampleResult.rows);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkAndAddPips();
