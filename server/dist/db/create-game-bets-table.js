import { pool } from './client.js';
export async function createGameBetsTable() {
    const client = await pool.connect();
    try {
        // Create the table with the current schema. The IF NOT EXISTS clause
        // means existing deployments keep their table — those are handled by
        // the legacy-column cleanup below.
        await client.query(`
      CREATE TABLE IF NOT EXISTS game_bets (
        id SERIAL PRIMARY KEY,
        lobby_id VARCHAR(8) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        placed_at TIMESTAMP NOT NULL DEFAULT NOW(),
        resolved_at TIMESTAMP,

        CONSTRAINT positive_amount CHECK (amount > 0),
        CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'won', 'lost', 'returned'))
      );

      CREATE INDEX IF NOT EXISTS idx_game_bets_lobby ON game_bets(lobby_id);
      CREATE INDEX IF NOT EXISTS idx_game_bets_user ON game_bets(user_id);
      CREATE INDEX IF NOT EXISTS idx_game_bets_status ON game_bets(status);
    `);
        // Older deployments had a Street Craps-flavoured schema with
        // additional NOT NULL columns (bet_type, bet_target,
        // potential_payout). The current `BettingManager.confirmBet` only
        // populates the columns above, so the legacy NOT NULLs blow up
        // matchmaking with `null value in column "bet_type" ... violates
        // not-null constraint`. Drop them if they're still there.
        await client.query(`
      ALTER TABLE game_bets DROP COLUMN IF EXISTS bet_type;
      ALTER TABLE game_bets DROP COLUMN IF EXISTS bet_target;
      ALTER TABLE game_bets DROP COLUMN IF EXISTS potential_payout;
    `);
        console.log('✓ game_bets table created');
    }
    catch (err) {
        console.error('Error creating game_bets table:', err);
        throw err;
    }
    finally {
        client.release();
    }
}
// Run if called directly
if (require.main === module) {
    createGameBetsTable()
        .then(() => {
        console.log('Done');
        process.exit(0);
    })
        .catch(err => {
        console.error('Failed:', err);
        process.exit(1);
    });
}
//# sourceMappingURL=create-game-bets-table.js.map