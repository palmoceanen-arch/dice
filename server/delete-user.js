/**
 * Delete user and all related data
 * Usage: node delete-user.js <user_id_or_telegram_id>
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function deleteUser() {
  const userIdentifier = process.argv[2];
  
  if (!userIdentifier) {
    console.error('Usage: node delete-user.js <user_id_or_telegram_id>');
    console.log('\nExamples:');
    console.log('  node delete-user.js 123          # Delete by user ID');
    console.log('  node delete-user.js 987654321    # Delete by Telegram ID');
    console.log('\nTo find users:');
    console.log('  node show-users.js');
    process.exit(1);
  }
  
  try {
    // Try to find user by ID or Telegram ID
    const userResult = await pool.query(
      'SELECT id, telegram_id, nickname FROM users WHERE id = $1 OR telegram_id = $1',
      [parseInt(userIdentifier)]
    );
    
    if (userResult.rows.length === 0) {
      console.error(`❌ User not found: ${userIdentifier}`);
      process.exit(1);
    }
    
    const user = userResult.rows[0];
    
    console.log('\n⚠️  WARNING: This will delete the following user and ALL related data:');
    console.log('=====================================');
    console.log(`User ID: ${user.id}`);
    console.log(`Telegram ID: ${user.telegram_id}`);
    console.log(`Nickname: ${user.nickname}`);
    console.log('=====================================\n');
    
    // Show what will be deleted
    const referralsAsReferrer = await pool.query(
      'SELECT COUNT(*) as count FROM referrals WHERE referrer_id = $1',
      [user.id]
    );
    
    const referralsAsReferred = await pool.query(
      'SELECT COUNT(*) as count FROM referrals WHERE referred_id = $1',
      [user.id]
    );
    
    const rewards = await pool.query(
      'SELECT COUNT(*) as count FROM referral_rewards WHERE referrer_id = $1 OR referred_id = $1',
      [user.id]
    );
    
    const items = await pool.query(
      'SELECT COUNT(*) as count FROM user_items WHERE user_id = $1',
      [user.id]
    );
    
    const friends = await pool.query(
      'SELECT COUNT(*) as count FROM friends WHERE user_id = $1 OR friend_id = $1',
      [user.id]
    );
    
    const purchases = await pool.query(
      'SELECT COUNT(*) as count FROM purchases WHERE user_id = $1',
      [user.id]
    );
    
    console.log('Data to be deleted:');
    console.log(`  - Referrals (as referrer): ${referralsAsReferrer.rows[0].count}`);
    console.log(`  - Referrals (as referred): ${referralsAsReferred.rows[0].count}`);
    console.log(`  - Referral rewards: ${rewards.rows[0].count}`);
    console.log(`  - User items: ${items.rows[0].count}`);
    console.log(`  - Friends: ${friends.rows[0].count}`);
    console.log(`  - Purchases: ${purchases.rows[0].count}`);
    
    console.log('\n⏳ Deleting in 3 seconds... (Press Ctrl+C to cancel)');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🗑️  Deleting user data...\n');
    
    // Delete in correct order (respecting foreign keys)
    
    // 1. Delete referral rewards
    const deletedRewards = await pool.query(
      'DELETE FROM referral_rewards WHERE referrer_id = $1 OR referred_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedRewards.rowCount} referral rewards`);
    
    // 2. Delete referrals (as referrer)
    const deletedAsReferrer = await pool.query(
      'DELETE FROM referrals WHERE referrer_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedAsReferrer.rowCount} referrals (as referrer)`);
    
    // 3. Delete referrals (as referred)
    const deletedAsReferred = await pool.query(
      'DELETE FROM referrals WHERE referred_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedAsReferred.rowCount} referrals (as referred)`);
    
    // 4. Delete user items
    const deletedItems = await pool.query(
      'DELETE FROM user_items WHERE user_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedItems.rowCount} user items`);
    
    // 5. Delete friends
    const deletedFriends = await pool.query(
      'DELETE FROM friends WHERE user_id = $1 OR friend_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedFriends.rowCount} friend connections`);
    
    // 6. Delete friend requests
    const deletedRequests = await pool.query(
      'DELETE FROM friend_requests WHERE from_user_id = $1 OR to_user_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedRequests.rowCount} friend requests`);
    
    // 7. Delete invitations
    const deletedInvitations = await pool.query(
      'DELETE FROM invitations WHERE from_user_id = $1 OR to_user_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedInvitations.rowCount} invitations`);
    
    // 8. Delete purchases
    const deletedPurchases = await pool.query(
      'DELETE FROM purchases WHERE user_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedPurchases.rowCount} purchases`);
    
    // 9. Delete match history (as player)
    const deletedMatches = await pool.query(
      'DELETE FROM match_history WHERE winner_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedMatches.rowCount} match history records`);
    
    // 10. Delete all rolls by this user (in any lobby)
    const deletedUserRolls = await pool.query(
      'DELETE FROM rolls WHERE user_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedUserRolls.rowCount} rolls by user`);
    
    // 11. Delete rolls from user's lobbies (by other players)
    const userLobbies = await pool.query(
      'SELECT id FROM lobbies WHERE host_id = $1',
      [user.id]
    );
    
    let totalLobbyRolls = 0;
    for (const lobby of userLobbies.rows) {
      const rollsResult = await pool.query(
        'DELETE FROM rolls WHERE lobby_id = $1',
        [lobby.id]
      );
      totalLobbyRolls += rollsResult.rowCount;
    }
    console.log(`✓ Deleted ${totalLobbyRolls} rolls from user's lobbies`);
    
    // 12. Delete lobbies (as host)
    const deletedLobbies = await pool.query(
      'DELETE FROM lobbies WHERE host_id = $1',
      [user.id]
    );
    console.log(`✓ Deleted ${deletedLobbies.rowCount} lobbies`);
    
    // 13. Finally, delete the user
    const deletedUser = await pool.query(
      'DELETE FROM users WHERE id = $1',
      [user.id]
    );
    console.log(`✓ Deleted user account`);
    
    console.log('\n✅ User deleted successfully!');
    console.log(`\nUser "${user.nickname}" (ID: ${user.id}) has been completely removed.`);
    console.log('They can now register again with the same Telegram account.\n');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

deleteUser();
