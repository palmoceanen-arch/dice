import { pool } from '../db/client.js';
import { UserBoost, BoostType } from '../types/index.js';
import { logger } from '../utils/logger.js';

const BOOST_CONFIGS = {
  double: { duration: 180, cooldown: 14400 }, // 3 min, 4 hours
  triple: { duration: 180, cooldown: 14400 }, // 3 min, 4 hours
  snake_eyes: { duration: 180, cooldown: 14400 }, // 3 min, 4 hours
  golden: { duration: 60, cooldown: 43200 }, // 1 min, 12 hours
};

/**
 * Get active boosts for a user
 */
export async function getActiveBoosts(userId: number): Promise<UserBoost[]> {
  const result = await pool.query(
    `SELECT * FROM user_boosts 
     WHERE user_id = $1 AND expires_at > NOW()
     ORDER BY activated_at DESC`,
    [userId]
  );
  
  return result.rows.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    boostId: row.boost_id,
    boostType: row.boost_type,
    activatedAt: row.activated_at,
    expiresAt: row.expires_at,
    availableAt: row.available_at,
    selectedParity: row.selected_parity
  }));
}

/**
 * Get boost state for a specific boost
 */
export async function getBoostState(userId: number, boostId: string): Promise<UserBoost | null> {
  const result = await pool.query(
    `SELECT * FROM user_boosts 
     WHERE user_id = $1 AND boost_id = $2
     ORDER BY activated_at DESC
     LIMIT 1`,
    [userId, boostId]
  );
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    boostId: row.boost_id,
    boostType: row.boost_type,
    activatedAt: row.activated_at,
    expiresAt: row.expires_at,
    availableAt: row.available_at,
    selectedParity: row.selected_parity
  };
}

/**
 * Check if boost is available (not on cooldown and not active)
 */
export async function isBoostAvailable(userId: number, boostId: string): Promise<boolean> {
  const state = await getBoostState(userId, boostId);
  
  if (!state) return true; // Never used before
  
  const now = new Date();
  
  // Check if still active
  if (state.expiresAt > now) return false;
  
  // Check if on cooldown
  if (state.availableAt > now) return false;
  
  return true;
}

/**
 * Activate a boost
 */
export async function activateBoost(
  userId: number, 
  boostId: string, 
  boostType: BoostType,
  selectedParity?: 'even' | 'odd'
): Promise<{ success: boolean; activeUntil?: number; availableAt?: number; error?: string }> {
  // Check if ANY boost is currently active (only one boost at a time)
  const activeBoosts = await getActiveBoosts(userId);
  if (activeBoosts.length > 0) {
    return { 
      success: false, 
      error: `Another boost is already active` 
    };
  }
  
  // Check if boost is available
  const available = await isBoostAvailable(userId, boostId);
  if (!available) {
    const state = await getBoostState(userId, boostId);
    if (state) {
      const now = new Date();
      if (state.expiresAt > now) {
        return { success: false, error: 'Boost is already active' };
      }
      if (state.availableAt > now) {
        return { success: false, error: 'Boost is on cooldown' };
      }
    }
    return { success: false, error: 'Boost is not available' };
  }
  
  // Get boost config - normalize boostId to config key
  let configKey: keyof typeof BOOST_CONFIGS;
  if (boostId === 'triple') {
    configKey = 'triple';
  } else if (boostId === 'snake_eyes') {
    configKey = 'snake_eyes';
  } else if (boostId === 'golden') {
    configKey = 'golden';
  } else if (boostId === 'double') {
    configKey = 'double';
  } else {
    return { success: false, error: 'Invalid boost ID' };
  }
  
  const config = BOOST_CONFIGS[configKey];
  if (!config) {
    return { success: false, error: 'Invalid boost configuration' };
  }
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.duration * 1000);
  const availableAt = new Date(now.getTime() + config.cooldown * 1000);
  
  try {
    // Insert or update boost state
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
      [userId, boostId, boostType, now, expiresAt, availableAt, selectedParity || null]
    );
    
    logger.info('[BOOST] Activated', { userId, boostId, boostType, expiresAt, availableAt });
    
    return {
      success: true,
      activeUntil: expiresAt.getTime(),
      availableAt: availableAt.getTime()
    };
  } catch (err) {
    logger.error('[BOOST] Activation failed', { userId, boostId, error: err });
    return { success: false, error: 'Database error' };
  }
}

/**
 * Calculate pips multiplier based on active boosts
 */
export async function calculatePipsMultiplier(
  userId: number,
  dice1: number,
  dice2: number
): Promise<{ multiplier: number; bonus: number }> {
  const activeBoosts = await getActiveBoosts(userId);
  
  let multiplier = 1;
  let bonus = 0;
  
  for (const boost of activeBoosts) {
    switch (boost.boostType) {
      case 'double':
        multiplier = Math.max(multiplier, 2);
        break;
      case 'golden':
        multiplier = Math.max(multiplier, 5);
        break;
      case 'triple_even':
      case 'triple_odd':
        const total = dice1 + dice2;
        const isEven = total % 2 === 0;
        const matchesParity = (boost.selectedParity === 'even' && isEven) || 
                             (boost.selectedParity === 'odd' && !isEven);
        if (matchesParity) {
          multiplier = Math.max(multiplier, 3);
        }
        break;
      case 'snake_eyes':
        if (dice1 === 1 && dice2 === 1) {
          bonus += 250;
        }
        break;
    }
  }
  
  return { multiplier, bonus };
}

/**
 * Clean up expired boosts (optional maintenance task)
 */
export async function cleanupExpiredBoosts(): Promise<number> {
  const result = await pool.query(
    `DELETE FROM user_boosts 
     WHERE expires_at < NOW() - INTERVAL '7 days'`
  );
  
  return result.rowCount || 0;
}
