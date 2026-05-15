// navigator.vibrate-based replacement for Telegram's HapticFeedback API.
// Used by the Yandex Games build via vite alias.

const STYLE_PATTERN: Record<string, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
};

const NOTIFICATION_PATTERN: Record<string, number[]> = {
  success: [10, 30, 10],
  warning: [20, 30, 20],
  error: [30, 60, 30],
};

let lastHapticTime = 0;
const hapticThrottle = 60;

function safeVibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined') return;
  const now = Date.now();
  if (now - lastHapticTime < hapticThrottle) return;
  lastHapticTime = now;
  try {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // not supported on this device — ignore
  }
}

export function triggerHaptic(style: 'light' | 'medium' | 'heavy'): void {
  const pattern = STYLE_PATTERN[style] ?? 10;
  safeVibrate(pattern);
}

export function triggerHapticNotification(
  type: 'success' | 'error' | 'warning',
): void {
  const pattern = NOTIFICATION_PATTERN[type] ?? 10;
  safeVibrate(pattern);
}
