import crypto from 'crypto';
import { config } from '../config.js';
import type { TelegramUser } from '../types/index.js';

export function validateInitData(initData: string): TelegramUser | null {
  if (!config.bot.token) {
    console.error('BOT_TOKEN not configured');
    return null;
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      console.error('No hash in initData');
      return null;
    }
    
    params.delete('hash');
    
    // Sort and create data check string
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Calculate secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(config.bot.token)
      .digest();
    
    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    if (calculatedHash !== hash) {
      console.error('Hash mismatch');
      return null;
    }
    
    // Parse user data
    const userParam = params.get('user');
    if (!userParam) {
      console.error('No user in initData');
      return null;
    }
    
    return JSON.parse(userParam) as TelegramUser;
  } catch (err) {
    console.error('Failed to validate initData:', err);
    return null;
  }
}

// For development - skip validation
export function parseInitDataUnsafe(initData: string): TelegramUser | null {
  try {
    const params = new URLSearchParams(initData);
    const userParam = params.get('user');
    if (!userParam) return null;
    return JSON.parse(userParam) as TelegramUser;
  } catch {
    return null;
  }
}

// Extract start_param (referral code) from initData
// Supports both 'start_param' (for regular bots) and 'start_param' from Web App
export function extractStartParam(initData: string): string | null {
  try {
    const params = new URLSearchParams(initData);
    // Try start_param first (this is what Telegram sends in initData for Web Apps)
    let startParam = params.get('start_param');
    
    // If not found, this might be from a direct bot command (rare case)
    if (!startParam) {
      startParam = params.get('start');
    }
    
    return startParam || null;
  } catch {
    return null;
  }
}
