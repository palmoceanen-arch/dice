/**
 * Clean up test purchases from database
 * This removes purchases with telegram_payment_id starting with 'test_'
 * Usage: node cleanup-test-purchases.js
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function cleanupTestPurchases() {
  try {
    console.log('\n🔍 Searching for test purchases...\n');
    
    // Find test purchases
    const testPurchases = await pool.query(
      `SELECT 
        p.id, 
        p.telegram_payment_id, 
        p.stars_amount, 
        p.created_at,
        u.nickname,
        ic.name as item_name
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN item_catalog ic ON p.item_id = ic.id
       WHERE p.telegram_payment_id LIKE 'test_%'
       ORDER BY p.created_at DESC`
    );
    
    if (testPurchases.rows.length === 0) {
      console.log('✅ No test purchases found!\n');
      return;
    }
    
    console.log(`Found ${testPurchases.rows.length} test purchase(s):\n`);
    
    testPurchases.rows.forEach((p, i) => {
      console.log(`${i + 1}. Purchase ID: ${p.id}`);
      console.log(`   User: ${p.nickname}`);
      console.log(`   Item: ${p.item_name || 'N/A'}`);
      console.log(`   Amount: ${p.stars_amount} ⭐`);
      console.log(`   Payment ID: ${p.telegram_payment_id}`);
      console.log(`   Date: ${p.created_at}`);
      console.log('');
    });
    
    // Ask for confirmation
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question('❓ Delete these test purchases? (yes/no): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n❌ Cancelled. No purchases deleted.\n');
      return;
    }
    
    // Delete test purchases
    const result = await pool.query(
      `DELETE FROM purchases WHERE telegram_payment_id LIKE 'test_%'`
    );
    
    console.log(`\n✅ Deleted ${result.rowCount} test purchase(s)!\n`);
    
    // Show updated stats
    const stats = await pool.query(
      `SELECT 
        COUNT(*) as total_purchases,
        SUM(stars_amount) as total_revenue
       FROM purchases 
       WHERE status = 'completed'`
    );
    
    console.log('📊 Updated purchase stats:');
    console.log(`   Total purchases: ${stats.rows[0].total_purchases}`);
    console.log(`   Total revenue: ${stats.rows[0].total_revenue || 0} ⭐\n`);
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

cleanupTestPurchases();
