// Telegram-flavoured haptic helpers used by Game.ts.
// The Yandex Games build aliases this module to a navigator.vibrate-based
// version (src/yandex/stubs/haptic.ts) so the resulting bundle does not
// reference window.Telegram.

const hapticSupported =
  typeof window !== 'undefined' &&
  window.Telegram?.WebApp?.HapticFeedback &&
  typeof window.Telegram.WebApp.HapticFeedback.impactOccurred === 'function';

let lastHapticTime = 0;
const hapticThrottle = 50; // ms

export function triggerHaptic(style: 'light' | 'medium' | 'heavy'): void {
  if (!hapticSupported) return;
  const now = Date.now();
  if (now - lastHapticTime < hapticThrottle) return;
  lastHapticTime = now;
  try {
    window.Telegram?.WebApp.HapticFeedback.impactOccurred(style);
  } catch {
    // Ignore errors
  }
}

export function triggerHapticNotification(type: 'success' | 'error' | 'warning'): void {
  if (!hapticSupported) return;
  try {
    window.Telegram?.WebApp.HapticFeedback.notificationOccurred(type);
  } catch {
    // Ignore errors
  }
}
