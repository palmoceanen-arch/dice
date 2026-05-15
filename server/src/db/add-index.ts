import { pool } from './client.js';

async function addIndex() {
  try {
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_telegram_payment_id 
      ON purchases(telegram_payment_id) 
      WHERE telegram_payment_id IS NOT NULL
    `);
    console.log('✓ Index created successfully');
  } catch (error) {
    console.error('Error creating index:', error);
  } finally {
    await pool.end();
  }
}

addIndex();
