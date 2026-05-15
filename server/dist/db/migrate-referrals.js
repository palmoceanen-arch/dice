import { pool } from './client.js';
const migrations = [
    // Add referral_code to users table
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE`,
    // Create index for referral codes
    `CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code)`,
    // Referral relationships table
    `CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    referred_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    games_played INTEGER DEFAULT 0,
    first_purchase_made BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(referrer_id, referred_id)
  )`,
    // Referral rewards table
    `CREATE TABLE IF NOT EXISTS referral_rewards (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    referred_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reward_type VARCHAR(30) NOT NULL,
    item_id INTEGER REFERENCES item_catalog(id),
    granted_at TIMESTAMP DEFAULT NOW()
  )`,
    // Indexes for referrals
    `CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id)`,
    `CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id)`,
    `CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code)`,
    `CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON referral_rewards(referrer_id)`,
];
async function migrate() {
    console.log('Running referral system migrations...');
    for (const sql of migrations) {
        try {
            await pool.query(sql);
            console.log('✓', sql.substring(0, 60) + '...');
        }
        catch (err) {
            console.error('✗ Migration failed:', sql.substring(0, 60));
            console.error(err);
            process.exit(1);
        }
    }
    // Generate referral codes for existing users
    console.log('\nGenerating referral codes for existing users...');
    try {
        const usersWithoutCode = await pool.query('SELECT id FROM users WHERE referral_code IS NULL');
        for (const user of usersWithoutCode.rows) {
            const code = generateReferralCode();
            await pool.query('UPDATE users SET referral_code = $1 WHERE id = $2', [code, user.id]);
        }
        console.log(`✓ Generated ${usersWithoutCode.rows.length} referral codes`);
    }
    catch (err) {
        console.error('Failed to generate referral codes:', err);
    }
    console.log('\n✓ Referral system migrations completed!');
    await pool.end();
}
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DICE_';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
migrate();
//# sourceMappingURL=migrate-referrals.js.map