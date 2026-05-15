// Test boost validation logic
console.log('=== Testing Boost Validation ===\n');

// Test cases
const tests = [
  // No boost
  { earnedPips: 7, multiplier: 1, bonus: 0, expected: true, desc: 'Normal roll (7)' },
  { earnedPips: 2, multiplier: 1, bonus: 0, expected: true, desc: 'Min roll (2)' },
  { earnedPips: 12, multiplier: 1, bonus: 0, expected: true, desc: 'Max roll (12)' },
  
  // Double boost (x2)
  { earnedPips: 14, multiplier: 2, bonus: 0, expected: true, desc: 'Double: 7*2=14' },
  { earnedPips: 4, multiplier: 2, bonus: 0, expected: true, desc: 'Double: 2*2=4' },
  { earnedPips: 24, multiplier: 2, bonus: 0, expected: true, desc: 'Double: 12*2=24' },
  
  // Triple boost (x3)
  { earnedPips: 21, multiplier: 3, bonus: 0, expected: true, desc: 'Triple: 7*3=21' },
  { earnedPips: 6, multiplier: 3, bonus: 0, expected: true, desc: 'Triple: 2*3=6' },
  { earnedPips: 36, multiplier: 3, bonus: 0, expected: true, desc: 'Triple: 12*3=36' },
  
  // Golden boost (x5)
  { earnedPips: 35, multiplier: 5, bonus: 0, expected: true, desc: 'Golden: 7*5=35' },
  { earnedPips: 10, multiplier: 5, bonus: 0, expected: true, desc: 'Golden: 2*5=10' },
  { earnedPips: 60, multiplier: 5, bonus: 0, expected: true, desc: 'Golden: 12*5=60' },
  
  // Snake Eyes bonus (+250)
  { earnedPips: 252, multiplier: 1, bonus: 250, expected: true, desc: 'Snake Eyes: 2+250=252' },
  { earnedPips: 254, multiplier: 2, bonus: 250, expected: true, desc: 'Double + Snake: 2*2+250=254' },
  { earnedPips: 256, multiplier: 3, bonus: 250, expected: true, desc: 'Triple + Snake: 2*3+250=256' },
  { earnedPips: 260, multiplier: 5, bonus: 250, expected: true, desc: 'Golden + Snake: 2*5+250=260' },
  
  // Invalid cases
  { earnedPips: 100, multiplier: 1, bonus: 0, expected: false, desc: 'Invalid: too high without boost' },
  { earnedPips: 15, multiplier: 2, bonus: 0, expected: false, desc: 'Invalid: 15 not divisible by 2' },
  { earnedPips: 20, multiplier: 3, bonus: 0, expected: false, desc: 'Invalid: 20/3 not integer' },
  { earnedPips: 500, multiplier: 10, bonus: 0, expected: false, desc: 'Invalid: multiplier 10' },
  { earnedPips: 300, multiplier: 1, bonus: 100, expected: false, desc: 'Invalid: bonus 100' },
];

// Validation function (simplified version)
function validateBoost(earnedPips, multiplier, bonus) {
  // Check multiplier
  if (![1, 2, 3, 5].includes(multiplier)) {
    return { valid: false, reason: 'Invalid multiplier' };
  }
  
  // Check bonus
  if (![0, 250].includes(bonus)) {
    return { valid: false, reason: 'Invalid bonus' };
  }
  
  // Check range
  const minBasePips = 2;
  const maxBasePips = 66;
  const minExpected = minBasePips * multiplier + bonus;
  const maxExpected = maxBasePips * multiplier + bonus;
  
  if (earnedPips < minExpected || earnedPips > maxExpected) {
    return { valid: false, reason: `Out of range ${minExpected}-${maxExpected}` };
  }
  
  // Check calculation
  const calculatedBase = (earnedPips - bonus) / multiplier;
  if (!Number.isInteger(calculatedBase) || calculatedBase < minBasePips || calculatedBase > maxBasePips) {
    return { valid: false, reason: `Base pips ${calculatedBase} invalid` };
  }
  
  return { valid: true };
}

// Run tests
let passed = 0;
let failed = 0;

tests.forEach(test => {
  const result = validateBoost(test.earnedPips, test.multiplier, test.bonus);
  const success = result.valid === test.expected;
  
  if (success) {
    console.log(`✓ ${test.desc}`);
    passed++;
  } else {
    console.log(`✗ ${test.desc}`);
    console.log(`  Expected: ${test.expected}, Got: ${result.valid}`);
    if (result.reason) console.log(`  Reason: ${result.reason}`);
    failed++;
  }
});

console.log(`\n=== Results ===`);
console.log(`Passed: ${passed}/${tests.length}`);
console.log(`Failed: ${failed}/${tests.length}`);
