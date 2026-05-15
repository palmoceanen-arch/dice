import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_4Neil5KtVxTu@ep-delicate-grass-ahyqxilm.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const result = await pool.query("SELECT id, code, config, pg_typeof(config) as config_type FROM item_catalog WHERE type = 'dice' LIMIT 3");
  console.log('Dice items:');
  result.rows.forEach(r => {
    console.log('  ', r.code, '- config type:', r.config_type, '- JS type:', typeof r.config, '- value:', r.config);
  });
  
  await pool.end();
}
run();
