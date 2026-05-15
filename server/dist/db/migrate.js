import { pool } from './client.js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load presets from shared JSON - try multiple paths
const possiblePaths = [
    join(__dirname, '../../../shared/presets.json'), // Local dev (from src/db/)
    join(__dirname, '../../shared/presets.json'), // Server (from dist/db/)
    join(process.cwd(), 'shared/presets.json'), // From working directory
];
let presetsPath = '';
for (const p of possiblePaths) {
    if (existsSync(p)) {
        presetsPath = p;
        break;
    }
}
if (!presetsPath) {
    console.error('Could not find presets.json. Tried:', possiblePaths);
    process.exit(1);
}
console.log('Loading presets from:', presetsPath);
const presets = JSON.parse(readFileSync(presetsPath, 'utf-8'));
const migrations = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    nickname VARCHAR(32) UNIQUE NOT NULL,
    telegram_username VARCHAR(255),
    first_name VARCHAR(255),
    avatar_url VARCHAR(500),
    equipped_dice_id INTEGER,
    equipped_table_id INTEGER,
    equipped_effect_id INTEGER,
    last_online TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
  )`,
    // Item catalog
    `CREATE TABLE IF NOT EXISTS item_catalog (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_stars INTEGER DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common',
    texture_url VARCHAR(500),
    config JSONB,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
    // User items (inventory)
    `CREATE TABLE IF NOT EXISTS user_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES item_catalog(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_id)
  )`,
    // Friends
    `CREATE TABLE IF NOT EXISTS friends (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active',
    source VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
  )`,
    // Lobbies
    `CREATE TABLE IF NOT EXISTS lobbies (
    id VARCHAR(8) PRIMARY KEY,
    host_id INTEGER REFERENCES users(id),
    game_mode VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'voting',
    selected_table_id INTEGER REFERENCES item_catalog(id),
    max_players INTEGER DEFAULT 6,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    finished_at TIMESTAMP
  )`,
    // Lobby players
    `CREATE TABLE IF NOT EXISTS lobby_players (
    lobby_id VARCHAR(8) REFERENCES lobbies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'joined',
    table_vote INTEGER REFERENCES item_catalog(id),
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (lobby_id, user_id)
  )`,
    // Invitations
    `CREATE TABLE IF NOT EXISTS invitations (
    id SERIAL PRIMARY KEY,
    lobby_id VARCHAR(8) REFERENCES lobbies(id) ON DELETE CASCADE,
    from_user_id INTEGER REFERENCES users(id),
    to_user_id INTEGER REFERENCES users(id),
    game_mode VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '5 minutes'
  )`,
    // Game sessions (Street Craps)
    `CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    lobby_id VARCHAR(8) REFERENCES lobbies(id),
    shooter_id INTEGER REFERENCES users(id),
    phase VARCHAR(20) DEFAULT 'come_out',
    point_value INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
  )`,
    // Bets
    `CREATE TABLE IF NOT EXISTS bets (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES game_sessions(id),
    user_id INTEGER REFERENCES users(id),
    bet_type VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    against_user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
  )`,
    // Rolls
    `CREATE TABLE IF NOT EXISTS rolls (
    id SERIAL PRIMARY KEY,
    lobby_id VARCHAR(8) REFERENCES lobbies(id),
    session_id INTEGER REFERENCES game_sessions(id),
    user_id INTEGER REFERENCES users(id),
    dice1 INTEGER NOT NULL,
    dice2 INTEGER NOT NULL,
    total INTEGER NOT NULL,
    result VARCHAR(30),
    rolled_at TIMESTAMP DEFAULT NOW()
  )`,
    // Purchases
    `CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    item_id INTEGER REFERENCES item_catalog(id),
    telegram_payment_id VARCHAR(100) UNIQUE,
    stars_amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
  )`,
    // Index for duplicate payment check
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_telegram_payment_id ON purchases(telegram_payment_id) WHERE telegram_payment_id IS NOT NULL`,
    // Match history
    `CREATE TABLE IF NOT EXISTS match_history (
    id SERIAL PRIMARY KEY,
    lobby_id VARCHAR(8) REFERENCES lobbies(id),
    game_mode VARCHAR(30) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    winner_id INTEGER REFERENCES users(id),
    total_rounds INTEGER
  )`,
    // Match players
    `CREATE TABLE IF NOT EXISTS match_players (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES match_history(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    nickname VARCHAR(32) NOT NULL,
    final_score INTEGER DEFAULT 0,
    total_rolls INTEGER DEFAULT 0,
    position INTEGER,
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP
  )`,
    // Match rolls
    `CREATE TABLE IF NOT EXISTS match_rolls (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES match_history(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    nickname VARCHAR(32) NOT NULL,
    round_number INTEGER NOT NULL,
    dice1 INTEGER NOT NULL,
    dice2 INTEGER NOT NULL,
    total INTEGER NOT NULL,
    result_type VARCHAR(30),
    rolled_at TIMESTAMP DEFAULT NOW()
  )`,
    // Friend requests
    `CREATE TABLE IF NOT EXISTS friend_requests (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(from_user_id, to_user_id)
  )`,
    // Indexes
    `CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id)`,
    `CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname)`,
    `CREATE INDEX IF NOT EXISTS idx_users_telegram_username ON users(telegram_username)`,
    `CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_lobby_status ON lobbies(status)`,
    `CREATE INDEX IF NOT EXISTS idx_invitations_to_user ON invitations(to_user_id, status)`,
    `CREATE INDEX IF NOT EXISTS idx_match_history_user ON match_players(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_match_rolls_match ON match_rolls(match_id)`,
];
// Default items
const defaultItems = [
    // Dice - Classic White (free, default) - glossy casino style
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'classic_white', 'Classic White', 'Classic white dice', 0, 'common', 
   '{"baseColor": "#ffffff", "dotColor": "#1a1a1a", "borderColor": "#e0e0e0", "roughness": 0.25, "metalness": 0, "clearcoat": 0.9, "clearcoatRoughness": 0.1}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Obsidian Black - sleek metallic black
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'obsidian_black', 'Obsidian Black', 'Sleek black dice with white dots', 50, 'uncommon', 
   '{"baseColor": "#000000", "dotColor": "#d4d4d4", "borderColor": "#000000", "roughness": 0.25, "metalness": 0.55, "clearcoat": 0.25, "clearcoatRoughness": 0.15}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Royal Gold - luxurious metallic gold
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'royal_gold', 'Royal Gold', 'Luxurious golden dice', 150, 'rare', 
   '{"baseColor": "#ebc60f", "dotColor": "#e0c51a", "borderColor": "#ffdd00", "roughness": 0.1, "metalness": 1, "clearcoat": 0, "clearcoatRoughness": 0}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Silver Chrome - polished silver mirror
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'silver_chrome', 'Silver Chrome', 'Polished chrome dice', 120, 'rare', 
   '{"baseColor": "#f7f7f7", "dotColor": "#fafafa", "borderColor": "#f7f7f7", "roughness": 0.05, "metalness": 1, "clearcoat": 0, "clearcoatRoughness": 0}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Rich Brown - elegant metallic brown
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'rich_brown', 'Rich Brown', 'Elegant metallic brown dice', 80, 'uncommon', 
   '{"baseColor": "#372006", "dotColor": "#af9d83", "borderColor": "#af9d83", "roughness": 0.2, "metalness": 0.95, "clearcoat": 0, "clearcoatRoughness": 0}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Charcoals - dark matte charcoal
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'charcoals', 'Charcoals', 'Dark matte charcoal dice', 70, 'uncommon', 
   '{"baseColor": "#1a1a1a", "dotColor": "#000000", "borderColor": "#1a1a1a", "roughness": 1, "metalness": 0.8, "clearcoat": 0, "clearcoatRoughness": 0}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Barbie Pink - vibrant pink with glossy finish
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'barbie_pink', 'Barbie Pink', 'Vibrant pink dice', 90, 'uncommon', 
   '{"baseColor": "#ff61f2", "dotColor": "#f4cdf1", "borderColor": "#ff61f2", "roughness": 0.5, "metalness": 0, "clearcoat": 0.55, "clearcoatRoughness": 0.3}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Cyber Black - dark metallic with neon cyan dots
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'cyber_black', 'Cyber Black', 'Dark metallic with neon dots', 130, 'rare', 
   '{"baseColor": "#040005", "dotColor": "#38e8ff", "borderColor": "#040005", "roughness": 0.25, "metalness": 0.95, "clearcoat": 0, "clearcoatRoughness": 0}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Casino Red - classic casino translucent red
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'casino_red', 'Casino Red', 'Classic casino-style red dice', 75, 'uncommon', 
   '{"baseColor": "#cc0000", "dotColor": "#ffffff", "borderColor": "#aa0000", "roughness": 0.15, "metalness": 0, "clearcoat": 1.0, "clearcoatRoughness": 0.05}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Ocean Blue - deep glossy blue
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'ocean_blue', 'Ocean Blue', 'Deep blue dice like the sea', 75, 'uncommon', 
   '{"baseColor": "#1e3a5f", "dotColor": "#87ceeb", "borderColor": "#0d2137", "roughness": 0.2, "metalness": 0, "clearcoat": 0.9, "clearcoatRoughness": 0.1}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Emerald Green - rich emerald
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'emerald_green', 'Emerald Green', 'Rich emerald green dice', 100, 'rare', 
   '{"baseColor": "#046307", "dotColor": "#90ee90", "borderColor": "#034005", "roughness": 0.2, "metalness": 0.1, "clearcoat": 0.95, "clearcoatRoughness": 0.08}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Neon Purple - vibrant glowing purple
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'neon_purple', 'Neon Purple', 'Vibrant purple with neon glow', 125, 'rare', 
   '{"baseColor": "#4a0080", "dotColor": "#ff00ff", "borderColor": "#2d004d", "roughness": 0.15, "metalness": 0.1, "clearcoat": 0.5, "clearcoatRoughness": 0.1}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Dice - Ivory Bone - antique matte ivory
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('dice', 'ivory_bone', 'Ivory Bone', 'Antique ivory-colored dice', 60, 'uncommon', 
   '{"baseColor": "#fffff0", "dotColor": "#5c4033", "borderColor": "#d4c4a8", "roughness": 0.6, "metalness": 0, "clearcoat": 0.3, "clearcoatRoughness": 0.5}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Tables - Green Felt (classic casino)
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('table', 'green_felt', 'Green Felt', 'Classic green felt table', 0, 'common',
   '{"floor":{"color":"#2d5a3d","texture":"concrete","roughness":0.6,"metalness":0.6,"normalIntensity":0.6},"wall":{"color":"#3f6953","texture":"diamond","roughness":0.5,"metalness":0.7,"normalIntensity":0.1}}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Tables - Red Velvet
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('table', 'red_velvet', 'Red Velvet', 'Luxurious red velvet table', 100, 'uncommon',
   '{"floor":{"color":"#830c0c","texture":"concrete","roughness":0.65,"metalness":0.85,"normalIntensity":1},"wall":{"color":"#1d1b1b","texture":"diamond","roughness":0.6,"metalness":0.35,"normalIntensity":0.1}}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Tables - Royal Purple
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('table', 'royal_purple', 'Royal Purple', 'Elegant purple velvet table', 150, 'rare',
   '{"floor":{"color":"#4a2066","texture":"concrete","roughness":0.55,"metalness":0.6,"normalIntensity":0.6},"wall":{"color":"#1b0231","texture":"diamond","roughness":0.4,"metalness":0.05,"normalIntensity":0.5}}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Tables - Midnight Blue
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('table', 'midnight_blue', 'Midnight Blue', 'Deep blue marble table', 100, 'uncommon',
   '{"floor":{"color":"#0a2352","texture":"marble","roughness":0.5,"metalness":1,"normalIntensity":0.1},"wall":{"color":"#192e57","texture":"diamond","roughness":0.85,"metalness":1,"normalIntensity":0.5}}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Tables - Black Onyx
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('table', 'black_onyx', 'Black Onyx', 'Sleek black table', 200, 'rare',
   '{"floor":{"color":"#1a1a1a","texture":"smooth","roughness":0.5,"metalness":0.7,"normalIntensity":0},"wall":{"color":"#0a0a0a","texture":"diamond","roughness":0.55,"metalness":0.15,"normalIntensity":0.1}}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Tables - Burgundy Wine
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('table', 'burgundy_wine', 'Burgundy Wine', 'Rich burgundy felt table', 125, 'uncommon',
   '{"floor":{"color":"#722f37","texture":"felt","roughness":0.88,"metalness":0,"normalIntensity":0.6},"wall":{"color":"#4a1f24","texture":"felt","roughness":0.92,"metalness":0,"normalIntensity":0.6}}')
   ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config`,
    // Effects
    `INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('effect', 'none', 'No Effect', 'No special effects', 0, 'common', '{}')
   ON CONFLICT (code) DO NOTHING`,
];
// Helper to escape SQL strings
function escapeSql(str) {
    return str.replace(/'/g, "''");
}
// Generate default items from presets.json
function generateDefaultItems() {
    const items = [];
    // Dice
    for (const [code, data] of Object.entries(presets.dice)) {
        const d = data;
        items.push(`INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
     VALUES ('dice', '${escapeSql(code)}', '${escapeSql(d.name)}', '${escapeSql(d.description)}', ${d.price}, '${d.rarity}', 
     '${escapeSql(JSON.stringify(d.config))}')
     ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config, name = EXCLUDED.name, description = EXCLUDED.description, price_stars = EXCLUDED.price_stars, rarity = EXCLUDED.rarity`);
    }
    // Tables
    for (const [code, data] of Object.entries(presets.tables)) {
        const t = data;
        items.push(`INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
     VALUES ('table', '${escapeSql(code)}', '${escapeSql(t.name)}', '${escapeSql(t.description)}', ${t.price}, '${t.rarity}',
     '${escapeSql(JSON.stringify(t.config))}')
     ON CONFLICT (code) DO UPDATE SET config = EXCLUDED.config, name = EXCLUDED.name, description = EXCLUDED.description, price_stars = EXCLUDED.price_stars, rarity = EXCLUDED.rarity`);
    }
    // Effects (hardcoded)
    items.push(`INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
   VALUES ('effect', 'none', 'No Effect', 'No special effects', 0, 'common', '{}')
   ON CONFLICT (code) DO NOTHING`);
    return items;
}
// Use generated items from presets.json
const generatedItems = generateDefaultItems();
async function migrate() {
    console.log('Running migrations...');
    for (const sql of migrations) {
        try {
            await pool.query(sql);
            console.log('✓', sql.substring(0, 50) + '...');
        }
        catch (err) {
            console.error('✗ Migration failed:', sql.substring(0, 50));
            console.error(err);
            process.exit(1);
        }
    }
    console.log('\nInserting default items from presets.json...');
    for (const sql of generatedItems) {
        try {
            await pool.query(sql);
        }
        catch (err) {
            console.error('Failed to insert default item:', err);
        }
    }
    // Clean up obsolete items from user inventories
    console.log('\nCleaning up obsolete items from user inventories...');
    try {
        // Get all valid item codes from presets
        const validDiceCodes = Object.keys(presets.dice);
        const validTableCodes = Object.keys(presets.tables);
        const validEffectCodes = ['none']; // Hardcoded effects
        const allValidCodes = [...validDiceCodes, ...validTableCodes, ...validEffectCodes];
        // Get default items for fallback
        const defaultTableResult = await pool.query(`
      SELECT id FROM item_catalog WHERE code = $1 AND type = 'table' LIMIT 1
    `, ['green_felt']);
        const defaultTableId = defaultTableResult.rows[0]?.id;
        // Update lobbies that reference obsolete table items
        if (defaultTableId) {
            const updateLobbiesResult = await pool.query(`
        UPDATE lobbies
        SET selected_table_id = $1
        WHERE selected_table_id IN (
          SELECT id FROM item_catalog
          WHERE code NOT IN (${allValidCodes.map((_, i) => `$${i + 2}`).join(', ')})
          AND type = 'table'
        )
      `, [defaultTableId, ...allValidCodes]);
            console.log(`✓ Updated ${updateLobbiesResult.rowCount} lobbies with obsolete tables to use default`);
        }
        // Update lobby_players table_vote that reference obsolete items
        if (defaultTableId) {
            const updateVotesResult = await pool.query(`
        UPDATE lobby_players
        SET table_vote = $1
        WHERE table_vote IN (
          SELECT id FROM item_catalog
          WHERE code NOT IN (${allValidCodes.map((_, i) => `$${i + 2}`).join(', ')})
          AND type = 'table'
        )
      `, [defaultTableId, ...allValidCodes]);
            console.log(`✓ Updated ${updateVotesResult.rowCount} table votes with obsolete tables to use default`);
        }
        // Delete user_items that reference items not in the valid list
        const deleteResult = await pool.query(`
      DELETE FROM user_items
      WHERE item_id IN (
        SELECT id FROM item_catalog
        WHERE code NOT IN (${allValidCodes.map((_, i) => `$${i + 1}`).join(', ')})
      )
    `, allValidCodes);
        console.log(`✓ Removed ${deleteResult.rowCount} obsolete items from user inventories`);
        // Reset equipped items if they reference deleted items (will be set to NULL)
        const resetEquippedResult = await pool.query(`
      UPDATE users
      SET 
        equipped_dice_id = CASE 
          WHEN equipped_dice_id NOT IN (SELECT id FROM item_catalog WHERE type = 'dice') 
          THEN NULL 
          ELSE equipped_dice_id 
        END,
        equipped_table_id = CASE 
          WHEN equipped_table_id NOT IN (SELECT id FROM item_catalog WHERE type = 'table') 
          THEN NULL 
          ELSE equipped_table_id 
        END,
        equipped_effect_id = CASE 
          WHEN equipped_effect_id NOT IN (SELECT id FROM item_catalog WHERE type = 'effect') 
          THEN NULL 
          ELSE equipped_effect_id 
        END
      WHERE 
        equipped_dice_id NOT IN (SELECT id FROM item_catalog WHERE type = 'dice')
        OR equipped_table_id NOT IN (SELECT id FROM item_catalog WHERE type = 'table')
        OR equipped_effect_id NOT IN (SELECT id FROM item_catalog WHERE type = 'effect')
    `);
        console.log(`✓ Reset ${resetEquippedResult.rowCount} users' equipped items`);
        // Finally, delete obsolete items from catalog
        const deleteCatalogResult = await pool.query(`
      DELETE FROM item_catalog
      WHERE code NOT IN (${allValidCodes.map((_, i) => `$${i + 1}`).join(', ')})
    `, allValidCodes);
        console.log(`✓ Removed ${deleteCatalogResult.rowCount} obsolete items from catalog`);
        console.log(`✓ Reset ${resetEquippedResult.rowCount} users' equipped items`);
    }
    catch (err) {
        console.error('Failed to clean up obsolete items:', err);
    }
    // Grant starter dice to all existing users
    console.log('\nGranting starter dice to existing users...');
    try {
        const starterDiceCodes = ['classic_white', 'classic_black', 'classic_red'];
        // Get IDs of starter dice
        const starterDiceResult = await pool.query('SELECT id, code FROM item_catalog WHERE code = ANY($1) AND type = \'dice\'', [starterDiceCodes]);
        if (starterDiceResult.rows.length > 0) {
            // Get all users
            const usersResult = await pool.query('SELECT id FROM users');
            let grantedCount = 0;
            for (const user of usersResult.rows) {
                for (const dice of starterDiceResult.rows) {
                    // Insert if not exists
                    const insertResult = await pool.query('INSERT INTO user_items (user_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user.id, dice.id]);
                    if (insertResult.rowCount && insertResult.rowCount > 0) {
                        grantedCount++;
                    }
                }
            }
            console.log(`✓ Granted ${grantedCount} starter dice items to ${usersResult.rows.length} users`);
        }
        else {
            console.log('⚠ No starter dice found in catalog');
        }
    }
    catch (err) {
        console.error('Failed to grant starter dice:', err);
    }
    console.log('\n✓ All migrations completed!');
    await pool.end();
}
migrate();
//# sourceMappingURL=migrate.js.map