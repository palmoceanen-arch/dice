// Script to gift items to a user
// Usage: node gift-items.js <username> [item_code|all|dice|tables|effects|clear|reset-referrals]
// Examples:
//   node gift-items.js palmocean              - interactive mode
//   node gift-items.js palmocean royal_gold   - gift specific item
//   node gift-items.js palmocean dice         - gift all dice
//   node gift-items.js palmocean tables       - gift all tables
//   node gift-items.js palmocean effects      - gift all effects
//   node gift-items.js palmocean all          - gift everything
//   node gift-items.js palmocean clear        - remove all items (except defaults)
//   node gift-items.js palmocean reset-referrals - reset referral rewards

import pg from 'pg';
import readline from 'readline';
import WebSocket from 'ws';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_4Neil5KtVxTu@ep-delicate-grass-ahyqxilm.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

const WS_URL = process.env.WS_URL || 'ws://localhost:3002';

// Send notification to user via WebSocket server
async function notifyUser(userId, item) {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(WS_URL);
      
      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'admin_gift',
          targetUserId: userId,
          item: item
        }));
        setTimeout(() => {
          ws.close();
          resolve(true);
        }, 100);
      });
      
      ws.on('error', () => resolve(false));
      setTimeout(() => { ws.close(); resolve(false); }, 2000);
    } catch {
      resolve(false);
    }
  });
}

async function findUser(username) {
  const cleanUsername = username.replace('@', '');
  
  let result = await pool.query(
    'SELECT id, nickname, telegram_username FROM users WHERE LOWER(telegram_username) = LOWER($1)',
    [cleanUsername]
  );
  
  if (result.rows.length === 0) {
    result = await pool.query(
      'SELECT id, nickname, telegram_username FROM users WHERE LOWER(nickname) = LOWER($1)',
      [cleanUsername]
    );
  }
  
  return result.rows[0] || null;
}

async function listItems() {
  const result = await pool.query(
    "SELECT code, name, type, rarity FROM item_catalog ORDER BY type, price_stars"
  );
  return result.rows;
}

async function getItemByCode(itemCode) {
  const result = await pool.query('SELECT * FROM item_catalog WHERE code = $1', [itemCode]);
  return result.rows[0] || null;
}

async function giftItem(userId, itemCode, notify = true) {
  const item = await getItemByCode(itemCode);
  
  if (!item) {
    return { success: false, message: `Item "${itemCode}" not found`, item: null };
  }
  
  const result = await pool.query(
    'INSERT INTO user_items (user_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
    [userId, item.id]
  );
  
  if (result.rows.length > 0) {
    if (notify) {
      const notified = await notifyUser(userId, {
        id: item.id, type: item.type, code: item.code, name: item.name, rarity: item.rarity
      });
      return { success: true, message: `✓ Gifted: ${item.name}${notified ? ' (notified)' : ''}`, item };
    }
    return { success: true, message: `✓ Gifted: ${item.name}`, item };
  }
  return { success: false, message: `- Already has: ${item.name}`, item };
}

async function giftByType(userId, type) {
  const result = await pool.query(
    "SELECT id, name, code FROM item_catalog WHERE type = $1",
    [type]
  );
  
  const results = [];
  const giftedItems = [];
  
  for (const item of result.rows) {
    const giftResult = await giftItem(userId, item.code, false);
    results.push(giftResult.message);
    if (giftResult.success && giftResult.item) {
      giftedItems.push(giftResult.item);
    }
  }
  
  if (giftedItems.length > 0) {
    await notifyUser(userId, giftedItems);
  }
  
  return results;
}

async function giftAll(userId) {
  const result = await pool.query("SELECT id, name, code FROM item_catalog");
  
  const results = [];
  const giftedItems = [];
  
  for (const item of result.rows) {
    const giftResult = await giftItem(userId, item.code, false);
    results.push(giftResult.message);
    if (giftResult.success && giftResult.item) {
      giftedItems.push(giftResult.item);
    }
  }
  
  if (giftedItems.length > 0) {
    await notifyUser(userId, giftedItems);
  }
  
  return results;
}

async function clearItems(userId) {
  // Keep only default items
  const defaultCodes = ['classic_white', 'classic_black', 'classic_red', 'green_felt', 'none'];
  
  const result = await pool.query(
    `DELETE FROM user_items 
     WHERE user_id = $1 
     AND item_id NOT IN (
       SELECT id FROM item_catalog WHERE code = ANY($2)
     )
     RETURNING item_id`,
    [userId, defaultCodes]
  );
  
  return result.rowCount || 0;
}

async function resetReferralRewards(userId) {
  // Delete all referral rewards
  const rewardsResult = await pool.query(
    'DELETE FROM referral_rewards WHERE referrer_id = $1 RETURNING id',
    [userId]
  );
  
  // Reset games_played for all referrals
  await pool.query(
    'UPDATE referrals SET games_played = 0 WHERE referrer_id = $1',
    [userId]
  );
  
  return rewardsResult.rowCount || 0;
}

async function interactive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (q) => new Promise(resolve => rl.question(q, resolve));
  
  console.log('\n🎁 Gift Items Tool\n');
  
  const username = await question('Enter username (telegram or nickname): ');
  
  const user = await findUser(username);
  if (!user) {
    console.log(`\n❌ User "${username}" not found`);
    rl.close();
    await pool.end();
    return;
  }
  
  console.log(`\n✓ Found: ${user.nickname}${user.telegram_username ? ` (@${user.telegram_username})` : ''}`);
  
  console.log('\nOptions:');
  console.log('  1. Gift ALL dice');
  console.log('  2. Gift ALL tables');
  console.log('  3. Gift ALL effects');
  console.log('  4. Gift EVERYTHING');
  console.log('  5. Gift specific item');
  console.log('  6. List all items');
  console.log('  7. Clear all items (keep defaults)');
  console.log('  8. Reset referral rewards');
  console.log('  9. Exit');
  
  const choice = await question('\nChoice (1-9): ');
  
  switch (choice) {
    case '1':
      console.log('\nGifting all dice...');
      (await giftByType(user.id, 'dice')).forEach(r => console.log(r));
      break;
      
    case '2':
      console.log('\nGifting all tables...');
      (await giftByType(user.id, 'table')).forEach(r => console.log(r));
      break;
      
    case '3':
      console.log('\nGifting all effects...');
      (await giftByType(user.id, 'effect')).forEach(r => console.log(r));
      break;
      
    case '4':
      console.log('\nGifting everything...');
      (await giftAll(user.id)).forEach(r => console.log(r));
      break;
      
    case '5':
      const items = await listItems();
      console.log('\nAvailable items:');
      items.forEach(i => console.log(`  ${i.code} - ${i.name} (${i.type}, ${i.rarity})`));
      const itemCode = await question('\nEnter item code: ');
      console.log((await giftItem(user.id, itemCode)).message);
      break;
      
    case '6':
      console.log('\nAll items:');
      (await listItems()).forEach(i => console.log(`  ${i.code} - ${i.name} (${i.type}, ${i.rarity})`));
      break;
      
    case '7':
      console.log('\n⚠️  This will remove all items except defaults!');
      const confirm = await question('Are you sure? (yes/no): ');
      if (confirm.toLowerCase() === 'yes') {
        const count = await clearItems(user.id);
        console.log(`✓ Removed ${count} items`);
      } else {
        console.log('Cancelled');
      }
      break;
      
    case '8':
      console.log('\n⚠️  This will reset all referral rewards!');
      const confirmReset = await question('Are you sure? (yes/no): ');
      if (confirmReset.toLowerCase() === 'yes') {
        const count = await resetReferralRewards(user.id);
        console.log(`✓ Reset ${count} referral rewards`);
      } else {
        console.log('Cancelled');
      }
      break;
      
    case '9':
    default:
      console.log('Bye!');
  }
  
  console.log('\nDone!');
  rl.close();
  await pool.end();
}

// CLI mode
const args = process.argv.slice(2);

if (args.length === 0) {
  interactive();
} else {
  const username = args[0];
  const action = args[1];
  
  (async () => {
    const user = await findUser(username);
    if (!user) {
      console.log(`❌ User "${username}" not found`);
      await pool.end();
      return;
    }
    
    console.log(`Found: ${user.nickname}`);
    
    if (!action) {
      // No action - run interactive for this user
      console.log('No action specified. Use: dice, tables, effects, all, clear, reset-referrals, or <item_code>');
    } else if (action === 'dice') {
      console.log('Gifting all dice...');
      (await giftByType(user.id, 'dice')).forEach(r => console.log(r));
    } else if (action === 'tables') {
      console.log('Gifting all tables...');
      (await giftByType(user.id, 'table')).forEach(r => console.log(r));
    } else if (action === 'effects') {
      console.log('Gifting all effects...');
      (await giftByType(user.id, 'effect')).forEach(r => console.log(r));
    } else if (action === 'all') {
      console.log('Gifting everything...');
      (await giftAll(user.id)).forEach(r => console.log(r));
    } else if (action === 'clear') {
      console.log('Clearing all items (keeping defaults)...');
      const count = await clearItems(user.id);
      console.log(`✓ Removed ${count} items`);
    } else if (action === 'reset-referrals') {
      console.log('Resetting referral rewards...');
      const count = await resetReferralRewards(user.id);
      console.log(`✓ Reset ${count} referral rewards`);
    } else {
      // Specific item code
      console.log((await giftItem(user.id, action)).message);
    }
    
    console.log('Done!');
    await pool.end();
  })();
}
