import { pool } from './dist/db/client.js';

async function createGameBetsTable() {
  const client = await pool.connect();
  
  try {
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
    
    console.log('✓ game_bets table created successfully');
  } catch (err) {
    console.error('Error creating game_bets table:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

createGameBetsTable()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed:', err);
    process.exit(1);
  });
