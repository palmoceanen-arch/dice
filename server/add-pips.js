// Add pips to user by nickname
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function addPips() {
  const nickname = process.argv[2];
  const amount = parseInt(process.argv[3]);
  
  if (!nickname || !amount) {
    console.log('Usage: node add-pips.js <nickname> <amount>');
    console.log('Example: node add-pips.js PALMOCEAN 10000');
    process.exit(1);
  }
  
  try {
    // Find user
    const userResult = await pool.query(
      'SELECT id, nickname, pips FROM users WHERE nickname = $1',
      [nickname]
    );
    
    if (userResult.rows.length === 0) {
      console.log(`❌ User "${nickname}" not found`);
      process.exit(1);
    }
    
    const user = userResult.rows[0];
    console.log(`Found user: ${user.nickname} (ID: ${user.id})`);
    console.log(`Current pips: ${user.pips || 0}`);
    
    // Add pips
    await pool.query(
      'UPDATE users SET pips = pips + $1 WHERE id = $2',
      [amount, user.id]
    );
    
    // Get updated pips
    const updatedResult = await pool.query(
      'SELECT pips FROM users WHERE id = $1',
      [user.id]
    );
    
    const newPips = updatedResult.rows[0].pips;
    console.log(`✓ Added ${amount} pips`);
    console.log(`New total: ${newPips} pips`);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

addPips();
