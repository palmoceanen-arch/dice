/**
 * Quick check of referral link format
 * Usage: node check-referral-link.js
 */

import dotenv from 'dotenv';

dotenv.config();

const BOT_USERNAME = process.env.BOT_USERNAME || 'streetdice_bot';
const APP_SHORT_NAME = process.env.APP_SHORT_NAME || 'app';

console.log('\n🔗 Referral Link Format Check');
console.log('==============================\n');

console.log('Environment Variables:');
console.log(`  BOT_USERNAME: ${BOT_USERNAME}`);
console.log(`  APP_SHORT_NAME: ${APP_SHORT_NAME}`);

console.log('\n✅ Correct Format (Mini App - RECOMMENDED):');
const correctLink = `https://t.me/${BOT_USERNAME}/${APP_SHORT_NAME}?startapp=ref_DICE_XXXXXX`;
console.log(`  ${correctLink}`);
console.log('  - Opens Mini App directly');
console.log('  - Best user experience');
console.log('  - Parameter: startapp → start_param in initData');

console.log('\n❌ Wrong Format (Bot Link):');
const wrongLink = `https://t.me/${BOT_USERNAME}?start=ref_DICE_XXXXXX`;
console.log(`  ${wrongLink}`);
console.log('  - Opens bot chat');
console.log('  - Requires Web App button');
console.log('  - Worse user experience');

console.log('\n📝 To Update:');
console.log('  1. Check your Mini App settings in @BotFather');
console.log('  2. Update src/ui/MultiplayerUI.ts:');
console.log(`     const botUsername = '${BOT_USERNAME}';`);
console.log(`     const appShortName = '${APP_SHORT_NAME}';`);
console.log('  3. Rebuild: npm run build');

console.log('\n🧪 Test Your Link:');
console.log('  1. Open game → Friends tab → "Пригласи за награды"');
console.log('  2. Copy the link');
console.log('  3. Check it matches the correct format above');
console.log('  4. Open on another device - should open app directly!');

console.log('\n');
