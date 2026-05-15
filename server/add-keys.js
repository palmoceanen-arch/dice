// Add design keys to item catalog
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function addKeys() {
  try {
    console.log('Adding design keys...');
    
    // Design Key - 5k pips
    await pool.query(`
      INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
      VALUES ('key', 'design_key', 'Design Key', 'Save your custom dice design permanently', 0, 'common', 
      '{"pipsPrice": 5000, "priceDisplay": "5k pips", "color": "#4A90E2", "icon": "🔑"}')
      ON CONFLICT (code) DO UPDATE SET 
        config = EXCLUDED.config,
        description = EXCLUDED.description
    `);
    console.log('✓ Added Design Key (5000 pips)');
    
    // Creator's Key - 15000 pips
    await pool.query(`
      INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
      VALUES ('key', 'creators_key', 'Creator''s Key', 'Premium key for master designers', 0, 'rare', 
      '{"pipsPrice": 15000, "color": "#E74C3C", "icon": "🔑", "locked": true}')
      ON CONFLICT (code) DO UPDATE SET 
        config = EXCLUDED.config,
        description = EXCLUDED.description
    `);
    console.log('✓ Added Creators Key (15000 pips) - LOCKED');
    
    // Unusual Key - 30000 pips
    await pool.query(`
      INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
      VALUES ('key', 'unusual_key', 'Unusual Key', 'Legendary key for elite creators', 0, 'epic', 
      '{"pipsPrice": 30000, "color": "#9B59B6", "icon": "🔑", "locked": true}')
      ON CONFLICT (code) DO UPDATE SET 
        config = EXCLUDED.config,
        description = EXCLUDED.description
    `);
    console.log('✓ Added Unusual Key (30000 pips) - LOCKED');
    
    // Show all keys
    const result = await pool.query(`
      SELECT id, code, name, config 
      FROM item_catalog 
      WHERE type = 'key'
      ORDER BY id
    `);
    
    console.log('\nKeys in catalog:');
    console.table(result.rows);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

addKeys();
