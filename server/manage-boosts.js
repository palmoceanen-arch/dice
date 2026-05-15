/**
 * Manage user boosts
 * Usage: 
 *   node manage-boosts.js <username>
 *   node manage-boosts.js <username> list
 *   node manage-boosts.js <username> reset <boostId>
 *   node manage-boosts.js <username> reset-all
 *   node manage-boosts.js <username> activate <boostId> [parity]
 * 
 * Examples:
 *   node manage-boosts.js palmocean              - interactive mode
 *   node manage-boosts.js palmocean list         - list all boosts
 *   node manage-boosts.js palmocean reset double - reset specific boost
 *   node manage-boosts.js palmocean reset-all    - reset all boosts
 *   node manage-boosts.js palmocean activate golden - activate boost
 */

import { pool } from './dist/db/client.js';
import readline from 'readline';

const username = process.argv[2];
const action = process.argv[3];
const boostId = process.argv[4];
const parity = process.argv[5];

if (!username) {
  console.error('Usage:');
  console.error('  node manage-boosts.js <username>');
  console.error('  node manage-boosts.js <username> list');
  console.error('  node manage-boosts.js <username> reset <boostId>');
  console.error('  node manage-boosts.js <username> reset-all');
  console.error('  node manage-boosts.js <username> activate <boostId> [parity]');
  console.error('');
  console.error('Boost IDs: double, triple, snake_eyes, golden');
  console.error('Parity (for triple only): even, odd');
  process.exit(1);
}

const BOOST_CONFIGS = {
  double: { duration: 180, cooldown: 14400, type: 'double', name: 'Double Pips' },
  triple: { duration: 180, cooldown: 14400, type: 'triple_even', name: 'Triple Pips' },
  snake_eyes: { duration: 180, cooldown: 14400, type: 'snake_eyes', name: 'Lucky Snakes' },
  golden: { duration: 60, cooldown: 43200, type: 'golden', name: 'Golden Hour' },
};

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

async function listBoosts(userId) {
  console.log(`\n📊 Boosts:\n`);
  
  const result = await pool.query(
    `SELECT * FROM user_boosts 
     WHERE user_id = $1
     ORDER BY boost_id`,
    [userId]
  );
  
  const now = new Date();
  const boostIds = ['double', 'triple', 'snake_eyes', 'golden'];
  
  // Show all boosts, even if not in database
  for (const id of boostIds) {
    const config = BOOST_CONFIGS[id];
    const row = result.rows.find(r => r.boost_id === id);
    
    console.log(`🎯 ${config.name} (${id})`);
    
    if (!row) {
      console.log(`   Status: ✓ READY (never used)`);
    } else {
      const isActive = new Date(row.expires_at) > now;
      const isOnCooldown = new Date(row.available_at) > now;
      const cooldownRemaining = Math.max(0, Math.ceil((new Date(row.available_at) - now) / 1000));
      const activeRemaining = isActive ? Math.max(0, Math.ceil((new Date(row.expires_at) - now) / 1000)) : 0;
      
      console.log(`   Status: ${isActive ? '✅ ACTIVE' : isOnCooldown ? '⏳ COOLDOWN' : '✓ READY'}`);
      if (isActive) {
        console.log(`   Active until: ${row.expires_at} (${formatTime(activeRemaining)} remaining)`);
      }
      if (isOnCooldown) {
        console.log(`   Available at: ${row.available_at} (${formatTime(cooldownRemaining)} remaining)`);
      }
      if (row.selected_parity) {
        console.log(`   Parity: ${row.selected_parity}`);
      }
      console.log(`   Last activated: ${row.activated_at}`);
    }
    console.log('');
  }
}

async function resetBoost(userId, boostId) {
  if (!BOOST_CONFIGS[boostId]) {
    console.error(`❌ Invalid boost ID: ${boostId}`);
    console.error('Valid IDs: double, triple, snake_eyes, golden');
    process.exit(1);
  }
  
  const config = BOOST_CONFIGS[boostId];
  console.log(`\n🔄 Resetting boost "${config.name}"...`);
  
  const result = await pool.query(
    `DELETE FROM user_boosts 
     WHERE user_id = $1 AND boost_id = $2`,
    [userId, boostId]
  );
  
  if (result.rowCount === 0) {
    console.log(`ℹ️  No boost record found. It's already available.`);
  } else {
    console.log(`✅ Boost "${config.name}" reset successfully! It's now available.`);
  }
}

async function resetAllBoosts(userId) {
  console.log(`\n🔄 Resetting ALL boosts...`);
  
  const result = await pool.query(
    `DELETE FROM user_boosts WHERE user_id = $1`,
    [userId]
  );
  
  console.log(`✅ Reset ${result.rowCount} boost(s). All boosts are now available.`);
}

async function activateBoost(userId, boostId, parity) {
  if (!BOOST_CONFIGS[boostId]) {
    console.error(`❌ Invalid boost ID: ${boostId}`);
    console.error('Valid IDs: double, triple, snake_eyes, golden');
    process.exit(1);
  }
  
  if (boostId === 'triple' && !parity) {
    console.error('❌ Triple boost requires parity (even or odd)');
    console.error('Usage: node manage-boosts.js <username> activate triple even');
    process.exit(1);
  }
  
  if (parity && !['even', 'odd'].includes(parity)) {
    console.error('❌ Invalid parity. Must be "even" or "odd"');
    process.exit(1);
  }
  
  const config = BOOST_CONFIGS[boostId];
  console.log(`\n⚡ Activating boost "${config.name}"...`);
  
  let boostType = config.type;
  
  if (boostId === 'triple') {
    boostType = parity === 'even' ? 'triple_even' : 'triple_odd';
  }
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.duration * 1000);
  const availableAt = new Date(now.getTime() + config.cooldown * 1000);
  
  try {
    await pool.query(
      `INSERT INTO user_boosts (user_id, boost_id, boost_type, activated_at, expires_at, available_at, selected_parity)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, boost_id) 
       DO UPDATE SET 
         boost_type = $3,
         activated_at = $4,
         expires_at = $5,
         available_at = $6,
         selected_parity = $7`,
      [userId, boostId, boostType, now, expiresAt, availableAt, parity || null]
    );
    
    console.log(`✅ Boost "${config.name}" activated successfully!`);
    console.log(`   Type: ${boostType}`);
    console.log(`   Active until: ${expiresAt} (${formatTime(config.duration)})`);
    console.log(`   Available at: ${availableAt} (cooldown: ${formatTime(config.cooldown)})`);
    if (parity) {
      console.log(`   Parity: ${parity}`);
    }
  } catch (err) {
    console.error('❌ Failed to activate boost:', err.message);
    process.exit(1);
  }
}

function formatTime(seconds) {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  } else if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  } else {
    return `${seconds}s`;
  }
}

async function interactive(user) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (q) => new Promise(resolve => rl.question(q, resolve));
  
  console.log('\n⚡ Manage Boosts\n');
  console.log(`User: ${user.nickname}${user.telegram_username ? ` (@${user.telegram_username})` : ''}`);
  
  console.log('\nOptions:');
  console.log('  1. List all boosts');
  console.log('  2. Reset specific boost');
  console.log('  3. Reset ALL boosts');
  console.log('  4. Activate boost');
  console.log('  5. Exit');
  
  const choice = await question('\nChoice (1-5): ');
  
  switch (choice) {
    case '1':
      await listBoosts(user.id);
      break;
      
    case '2':
      console.log('\nBoosts: double, triple, snake_eyes, golden');
      const resetId = await question('Enter boost ID to reset: ');
      await resetBoost(user.id, resetId);
      break;
      
    case '3':
      const confirm = await question('⚠️  Reset ALL boosts? (yes/no): ');
      if (confirm.toLowerCase() === 'yes') {
        await resetAllBoosts(user.id);
      } else {
        console.log('Cancelled');
      }
      break;
      
    case '4':
      console.log('\nBoosts: double, triple, snake_eyes, golden');
      const activateId = await question('Enter boost ID to activate: ');
      let activateParity = null;
      if (activateId === 'triple') {
        activateParity = await question('Enter parity (even/odd): ');
      }
      await activateBoost(user.id, activateId, activateParity);
      break;
      
    case '5':
    default:
      console.log('Bye!');
  }
  
  console.log('\nDone!');
  rl.close();
  await pool.end();
}

async function main() {
  try {
    const user = await findUser(username);
    if (!user) {
      console.log(`❌ User "${username}" not found`);
      await pool.end();
      process.exit(1);
    }
    
    console.log(`✓ Found: ${user.nickname}${user.telegram_username ? ` (@${user.telegram_username})` : ''}`);
    
    if (!action) {
      // Interactive mode
      await interactive(user);
      return;
    }
    
    switch (action) {
      case 'list':
        await listBoosts(user.id);
        break;
      case 'reset':
        if (!boostId) {
          console.error('❌ Boost ID required for reset');
          console.error('Usage: node manage-boosts.js <username> reset <boostId>');
          process.exit(1);
        }
        await resetBoost(user.id, boostId);
        break;
      case 'reset-all':
        await resetAllBoosts(user.id);
        break;
      case 'activate':
        if (!boostId) {
          console.error('❌ Boost ID required for activate');
          console.error('Usage: node manage-boosts.js <username> activate <boostId> [parity]');
          process.exit(1);
        }
        await activateBoost(user.id, boostId, parity);
        break;
      default:
        console.error(`❌ Unknown action: ${action}`);
        console.error('Valid actions: list, reset, reset-all, activate');
        process.exit(1);
    }
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    await pool.end();
    process.exit(1);
  }
}

main();
