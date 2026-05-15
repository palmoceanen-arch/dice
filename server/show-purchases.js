/**
 * Show all purchases in database
 * Usage: node show-purchases.js
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function showPurchases() {
  try {
    console.log('\n💰 All Purchases:\n');
    
    const purchases = await pool.query(
      `SELECT 
        p.id, 
        p.telegram_payment_id, 
        p.stars_amount, 
        p.status,
        p.created_at,
        u.nickname,
        u.telegram_id,
        ic.name as item_name,
        ic.type as item_type
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN item_catalog ic ON p.item_id = ic.id
       ORDER BY p.created_at DESC`
    );
    
    if (purchases.rows.length === 0) {
      console.log('No purchases found.\n');
      return;
    }
    
    console.log(`Total: ${purchases.rows.length} purchase(s)\n`);
    
    let totalRevenue = 0;
    let testCount = 0;
    let realCount = 0;
    
    purchases.rows.forEach((p, i) => {
      const isTest = p.telegram_payment_id?.startsWith('test_');
      if (isTest) testCount++;
      else realCount++;
      
      if (p.status === 'completed') {
        totalRevenue += parseInt(p.stars_amount);
      }
      
      console.log(`${i + 1}. ${isTest ? '🧪 TEST' : '✅ REAL'} Purchase`);
      console.log(`   ID: ${p.id}`);
      console.log(`   User: ${p.nickname} (TG: ${p.telegram_id})`);
      console.log(`   Item: ${p.item_name || 'N/A'} (${p.item_type || 'N/A'})`);
      console.log(`   Amount: ${p.stars_amount} ⭐`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Payment ID: ${p.telegram_payment_id || 'N/A'}`);
      console.log(`   Date: ${new Date(p.created_at).toLocaleString('ru-RU')}`);
      console.log('');
    });
    
    console.log('📊 Summary:');
    console.log(`   Real purchases: ${realCount}`);
    console.log(`   Test purchases: ${testCount}`);
    console.log(`   Total revenue: ${totalRevenue} ⭐\n`);
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

showPurchases();
