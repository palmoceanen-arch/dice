import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function showUsers() {
  try {
    // Get total count first
    const countResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(countResult.rows[0].count);
    
    // Get all users (or limit if too many)
    const limit = process.argv[2] ? parseInt(process.argv[2]) : (totalUsers > 50 ? 50 : totalUsers);
    
    const result = await pool.query(
      'SELECT id, nickname, referral_code, telegram_id FROM users ORDER BY id LIMIT $1',
      [limit]
    );
    
    console.log('\n📋 Users:');
    console.log('─'.repeat(100));
    console.log('ID'.padEnd(6) + 'Nickname'.padEnd(30) + 'Referral Code'.padEnd(20) + 'Telegram ID');
    console.log('─'.repeat(100));
    
    result.rows.forEach(user => {
      console.log(
        String(user.id).padEnd(6) + 
        String(user.nickname).padEnd(30) + 
        String(user.referral_code || 'N/A').padEnd(20) +
        String(user.telegram_id || 'N/A')
      );
    });
    
    console.log('─'.repeat(100));
    console.log(`\nShowing ${result.rows.length} of ${totalUsers} users`);
    
    if (totalUsers > limit) {
      console.log(`\nTo see more users, run: node show-users.js ${totalUsers}`);
    }
    
    console.log('\nTo test referral system, run:');
    console.log('node test-referral.js <your_user_id>');
    console.log('\nExample: node test-referral.js 1');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

showUsers();
