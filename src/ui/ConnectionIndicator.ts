import { wsClient } from '../multiplayer/WebSocketClient';

export class ConnectionIndicator {
  private indicator: HTMLElement;
  private statusDot: HTMLElement;
  private statusText: HTMLElement;
  private isVisible = false;

  constructor() {
    this.indicator = document.createElement('div');
    this.indicator.id = 'connection-indicator';
    this.indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 20px;
      font-size: 12px;
      color: white;
      z-index: 10000;
      transition: opacity 0.3s, transform 0.3s;
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
    `;

    this.statusDot = document.createElement('div');
    this.statusDot.style.cssText = `
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4CAF50;
      transition: background 0.3s;
    `;

    this.statusText = document.createElement('span');
    this.statusText.textContent = 'Connected';

    this.indicator.appendChild(this.statusDot);
    this.indicator.appendChild(this.statusText);
    document.body.appendChild(this.indicator);

    this.setupListeners();
  }

  private setupListeners() {
    // Listen to connection health changes
    wsClient.on('connection_health_changed', (data: any) => {
      this.updateStatus(data.health, data.message);
    });

    // Show indicator when connection becomes unstable or poor
    wsClient.on('connection_unstable', () => {
      this.show();
    });

    // Monitor connection state
    const checkConnection = () => {
      if (!wsClient.isConnected) {
        this.updateStatus('offline', 'Reconnecting...');
        this.show();
      } else if (wsClient.connectionHealth === 'good' && this.isVisible) {
        // Hide after 2 seconds if connection is good
        setTimeout(() => {
          if (wsClient.connectionHealth === 'good') {
            this.hide();
          }
        }, 2000);
      }
    };

    // Check every second
    setInterval(checkConnection, 1000);
  }

  private updateStatus(health: 'good' | 'unstable' | 'poor' | 'offline', message?: string) {
    const colors = {
      good: '#4CAF50',
      unstable: '#FF9800',
      poor: '#F44336',
      offline: '#9E9E9E'
    };

    const messages = {
      good: 'Connected',
      unstable: 'Connection unstable',
      poor: 'Poor connection',
      offline: 'Reconnecting...'
    };

    this.statusDot.style.background = colors[health];
    this.statusText.textContent = message || messages[health];

    // Show indicator for non-good states
    if (health !== 'good') {
      this.show();
    } else {
      // Auto-hide after showing "Connected" for 2 seconds
      setTimeout(() => {
        if (wsClient.connectionHealth === 'good') {
          this.hide();
        }
      }, 2000);
    }

    // Add pulse animation for poor/offline
    if (health === 'poor' || health === 'offline') {
      this.statusDot.style.animation = 'pulse 1s infinite';
      if (!document.getElementById('connection-pulse-keyframes')) {
        const style = document.createElement('style');
        style.id = 'connection-pulse-keyframes';
        style.textContent = `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      this.statusDot.style.animation = '';
    }
  }

  private show() {
    this.isVisible = true;
    this.indicator.style.opacity = '1';
    this.indicator.style.transform = 'translateY(0)';
  }

  private hide() {
    this.isVisible = false;
    this.indicator.style.opacity = '0';
    this.indicator.style.transform = 'translateY(-10px)';
  }

  // Public method to force show (e.g., for testing)
  public forceShow() {
    this.show();
  }

  // Public method to force hide
  public forceHide() {
    this.hide();
  }
}
