/**
 * Reset fraud counter for a user
 * Usage: node reset-fraud.js <userId>
 */

import { resetFraudCounter } from './dist/utils/anti-fraud.js';

const userId = parseInt(process.argv[2]);

if (!userId || isNaN(userId)) {
  console.error('Usage: node reset-fraud.js <userId>');
  process.exit(1);
}

console.log(`Resetting fraud counter for user ${userId}...`);
resetFraudCounter(userId);
console.log('Done! Fraud counter reset.');
console.log('Note: This only resets the in-memory counter. Restart the server to fully clear.');
