import { pool } from './dist/db/client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncPresetsToDb() {
  try {
    // Read presets.json - it's in ./shared folder (relative to current directory)
    const presetsPath = path.join(__dirname, 'shared', 'presets.json');
    
    console.log('Looking for presets at:', presetsPath);
    
    if (!fs.existsSync(presetsPath)) {
      console.error('ERROR: presets.json not found at:', presetsPath);
      console.log('Current directory:', __dirname);
      process.exit(1);
    }
    
    const presetsData = JSON.parse(fs.readFileSync(presetsPath, 'utf8'));
    
    console.log('Syncing dice presets to database...\n');
    
    // Update each dice preset
    for (const [code, preset] of Object.entries(presetsData.dice)) {
      const { name, config } = preset;
      
      // Ensure all fields are present (add defaults for missing fields)
      const fullConfig = {
        baseColor: config.baseColor || '#ffffff',
        dotColor: config.dotColor || '#000000',
        borderColor: config.borderColor || config.baseColor || '#ffffff',
        roughness: config.roughness ?? 0.3,
        metalness: config.metalness ?? 0.25,
        clearcoat: config.clearcoat ?? 0,
        clearcoatRoughness: config.clearcoatRoughness ?? 0,
        opacity: config.opacity ?? 1,
        dotSize: config.dotSize ?? 29,
        dotShape: config.dotShape || 'circle', // IMPORTANT: add default dotShape
        dotDepth: config.dotDepth ?? 1.3,
        bevelRadius: config.bevelRadius ?? 0.16,
      };
      
      // Check if item exists
      const checkResult = await pool.query(
        'SELECT id, config FROM item_catalog WHERE code = $1 AND type = \'dice\'',
        [code]
      );
      
      if (checkResult.rows.length > 0) {
        const item = checkResult.rows[0];
        const oldConfig = item.config;
        
        // Update config
        await pool.query(
          'UPDATE item_catalog SET config = $1 WHERE code = $2 AND type = \'dice\'',
          [JSON.stringify(fullConfig), code]
        );
        
        console.log(`✓ Updated ${name} (${code})`);
        console.log(`  Old config keys: ${Object.keys(oldConfig || {}).length}`);
        console.log(`  New config keys: ${Object.keys(fullConfig).length}`);
        
        // Show differences
        if (oldConfig) {
          const diffs = [];
          for (const key of Object.keys(fullConfig)) {
            if (oldConfig[key] !== fullConfig[key]) {
              diffs.push(`${key}: ${oldConfig[key]} → ${fullConfig[key]}`);
            }
          }
          if (diffs.length > 0) {
            console.log(`  Changes: ${diffs.join(', ')}`);
          }
        }
        console.log('');
      } else {
        console.log(`⚠ Skipped ${name} (${code}) - not found in database`);
      }
    }
    
    console.log('\n✅ Sync complete!');
    console.log('⚠️  IMPORTANT: Restart the server with: pm2 restart dice-server');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

syncPresetsToDb();
