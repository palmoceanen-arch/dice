import { pool } from './client.js';

/**
 * Add missing database indexes to fix slow queries (100-740ms)
 * 
 * Problem: All queries are slow because there are no indexes on frequently queried columns
 * Solution: Add indexes on foreign keys and commonly filtered columns
 */
async function addMissingIndexes() {
  const indexes = [
    // Lobbies - frequently queried by id and status
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lobbies_id ON lobbies(id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lobbies_status ON lobbies(status)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lobbies_host_id ON lobbies(host_id)',
    
    // Lobby players - frequently joined with lobbies
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lobby_players_lobby_id ON lobby_players(lobby_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lobby_players_user_id ON lobby_players(user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lobby_players_lobby_user ON lobby_players(lobby_id, user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lobby_players_status ON lobby_players(status)',
    
    // Invitations - frequently queried by lobby_id and to_user_id
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invitations_lobby_id ON invitations(lobby_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invitations_to_user_id ON invitations(to_user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invitations_from_user_id ON invitations(from_user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invitations_status ON invitations(status)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invitations_lobby_to_user ON invitations(lobby_id, to_user_id, status)',
    
    // Friends - frequently queried by user_id and friend_id
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friends_user_id ON friends(user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friends_friend_id ON friends(friend_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friends_status ON friends(status)',
    
    // Users - frequently queried by id and telegram_id
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_id ON users(id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_telegram_id ON users(telegram_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_online ON users(last_online)',
    
    // Item catalog - frequently queried by id and type
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_item_catalog_id ON item_catalog(id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_item_catalog_type ON item_catalog(type)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_item_catalog_available ON item_catalog(is_available)',
    
    // Rolls - frequently inserted during games
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rolls_lobby_id ON rolls(lobby_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rolls_user_id ON rolls(user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rolls_rolled_at ON rolls(rolled_at)',
    
    // Purchases - frequently queried by user_id
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchases_user_id ON purchases(user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchases_status ON purchases(status)',
    
    // User items - frequently joined with item_catalog
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_items_user_id ON user_items(user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_items_item_id ON user_items(item_id)',
    
    // Friend requests - frequently queried
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friend_requests_from_user ON friend_requests(from_user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friend_requests_to_user ON friend_requests(to_user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friend_requests_status ON friend_requests(status)',
  ];
  
  console.log('Starting to add missing database indexes...');
  console.log(`Total indexes to create: ${indexes.length}`);
  
  let created = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const indexQuery of indexes) {
    try {
      const indexName = indexQuery.match(/idx_\w+/)?.[0] || 'unknown';
      console.log(`Creating index: ${indexName}...`);
      
      const start = Date.now();
      await pool.query(indexQuery);
      const duration = Date.now() - start;
      
      console.log(`✓ Index created: ${indexName} (${duration}ms)`);
      created++;
    } catch (error: any) {
      // Ignore "already exists" errors
      if (error.code === '42P07' || error.message?.includes('already exists')) {
        const indexName = indexQuery.match(/idx_\w+/)?.[0] || 'unknown';
        console.log(`- Index already exists: ${indexName}`);
        skipped++;
      } else {
        console.error('Error creating index:', error.message);
        failed++;
      }
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Created: ${created}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${indexes.length}`);
  
  // Analyze tables to update statistics
  console.log('\nAnalyzing tables to update query planner statistics...');
  try {
    await pool.query('ANALYZE lobbies, lobby_players, invitations, friends, users, item_catalog, rolls, purchases, friend_requests, user_items');
    console.log('✓ Tables analyzed');
  } catch (error: any) {
    console.error('Error analyzing tables:', error.message);
  }
  
  console.log('\n✓ Done!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addMissingIndexes()
    .then(() => {
      console.log('\nClosing database connection...');
      pool.end();
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Fatal error:', error.message);
      pool.end();
      process.exit(1);
    });
}

export { addMissingIndexes };
