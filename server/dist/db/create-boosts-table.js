import { pool } from './client.js';
export async function createBoostsTable() {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS user_boosts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        boost_id VARCHAR(50) NOT NULL,
        boost_type VARCHAR(20) NOT NULL,
        activated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL,
        available_at TIMESTAMP NOT NULL,
        selected_parity VARCHAR(10),
        UNIQUE(user_id, boost_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_boosts_user_id ON user_boosts(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_boosts_expires_at ON user_boosts(expires_at);
    `);
        console.log('✓ user_boosts table created');
    }
    catch (err) {
        console.error('Error creating user_boosts table:', err);
        throw err;
    }
    finally {
        client.release();
    }
}
// Run if called directly
if (require.main === module) {
    createBoostsTable()
        .then(() => {
        console.log('Done');
        process.exit(0);
    })
        .catch(err => {
        console.error('Failed:', err);
        process.exit(1);
    });
}
//# sourceMappingURL=create-boosts-table.js.map