import { pool } from './dist/db/client.js';

async function checkBets() {
  try {
    const result = await pool.query('SELECT * FROM game_bets ORDER BY placed_at DESC LIMIT 5');
    console.log('Recent bets:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('No bets found in database');
    }
    
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkBets();
