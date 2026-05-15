// ReactionWheel.ts - Two-level emoji/message wheel for in-game communication
import { wsClient } from '../multiplayer/WebSocketClient';
import { t } from '../../shared/i18n';

interface ReactionCategory {
  id: string;
  icon: string;
  labelKey: string;
  color: string;
}

interface ReactionItem {
  id: string;
  content: string; // emoji or short text
  isEmoji: boolean;
}

interface ReactionMessage {
  playerId: number;
  playerNickname: string;
  content: string;
  timestamp: number;
}

export class ReactionWheel {
  private wheelOverlay: HTMLElement | null = null;
  private messagesContainer: HTMLElement | null = null;
  private isOpen = false;
  private currentLevel: 'categories' | 'items' = 'categories';
  private selectedCategory: string | null = null;
  private lastReactionTime = 0;
  private cooldownMs = 2000; // 2 seconds cooldown
  private messageQueue: ReactionMessage[] = [];
  private isShowingMessage = false;
  
  // Categories with icons and colors
  private categories: ReactionCategory[] = [
    { id: 'game', icon: '🎲', labelKey: 'reactions.categories.game', color: '#4CAF50' },
    { id: 'chat', icon: '💬', labelKey: 'reactions.categories.chat', color: '#2196F3' },
    { id: 'emotions', icon: '😊', labelKey: 'reactions.categories.emotions', color: '#FF9800' },
    { id: 'actions', icon: '👋', labelKey: 'reactions.categories.actions', color: '#9C27B0' }
  ];
  
  // Reactions by category
  private reactions: Record<string, ReactionItem[]> = {
    game: [
      { id: 'fire', content: '🔥', isEmoji: true },
      { id: 'lucky', content: '🍀', isEmoji: true },
      { id: 'unlucky', content: '💀', isEmoji: true },
      { id: 'nice_roll', content: t('reactions.game.niceRoll'), isEmoji: false },
      { id: 'close', content: t('reactions.game.close'), isEmoji: false },
      { id: 'gg', content: 'GG', isEmoji: false }
    ],
    chat: [
      { id: 'hello', content: '👋', isEmoji: true },
      { id: 'thanks', content: '🙏', isEmoji: true },
      { id: 'thinking', content: '🤔', isEmoji: true },
      { id: 'good_luck', content: t('reactions.chat.goodLuck'), isEmoji: false },
      { id: 'one_more', content: t('reactions.chat.oneMore'), isEmoji: false },
      { id: 'brb', content: t('reactions.chat.brb'), isEmoji: false }
    ],
    emotions: [
      { id: 'laugh', content: '😂', isEmoji: true },
      { id: 'wow', content: '😮', isEmoji: true },
      { id: 'cool', content: '😎', isEmoji: true },
      { id: 'sad', content: '😢', isEmoji: true },
      { id: 'angry', content: '😠', isEmoji: true },
      { id: 'love', content: '❤️', isEmoji: true }
    ],
    actions: [
      { id: 'thumbs_up', content: '👍', isEmoji: true },
      { id: 'thumbs_down', content: '👎', isEmoji: true },
      { id: 'clap', content: '👏', isEmoji: true },
      { id: 'facepalm', content: '🤦', isEmoji: true },
      { id: 'shrug', content: '🤷', isEmoji: true },
      { id: 'muscle', content: '💪', isEmoji: true }
    ]
  };
  
  constructor() {
    // Button removed - wheel is now opened by clicking result text
    this.createMessagesContainer();
    this.setupEventListeners();
    this.addStyles();
  }
  
  private addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .reaction-wheel-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 150;
        pointer-events: auto;
        animation: fadeIn 0.2s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .reaction-wheel {
        position: relative;
        width: 280px;
        height: 280px;
      }
      
      .reaction-wheel-item {
        position: absolute;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: rgba(100, 100, 100, 0.3);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(150, 150, 150, 0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 36px;
        font-weight: 400;
        color: white;
      }
      
      .reaction-wheel-item:hover {
        transform: scale(1.15);
        background: rgba(120, 120, 120, 0.4);
        border-color: rgba(180, 180, 180, 0.6);
      }
      
      .reaction-wheel-item:active {
        transform: scale(0.95);
      }
      
      .reaction-wheel-item-label {
        display: none;
      }
      
      .reaction-wheel-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(60, 60, 60, 0.9);
        border: 3px solid rgba(120, 120, 120, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: rgba(200, 200, 200, 0.9);
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        text-align: center;
        padding: 8px;
        line-height: 1.2;
      }
      
      .reaction-wheel-back {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .reaction-wheel-back:hover {
        background: rgba(80, 80, 80, 0.9);
        border-color: rgba(150, 150, 150, 0.6);
        transform: translate(-50%, -50%) scale(1.05);
      }
      
      #reactions-messages {
        position: fixed;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 85;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 280px;
      }
      
      .reaction-message {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 6px 12px;
        animation: slideInLeft 0.3s ease, fadeOut 0.3s ease 2.7s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(-20px);
        }
      }
      
      .reaction-message-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        color: white;
        font-family: 'Montserrat', sans-serif;
        flex-shrink: 0;
        text-transform: uppercase;
      }
      
      .reaction-message-content {
        font-size: 24px;
        color: white;
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        line-height: 1;
      }
      
      .reaction-message-content.text {
        font-size: 16px;
        font-weight: 400;
      }
    `;
    document.head.appendChild(style);
  }
  
  private createMessagesContainer() {
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.id = 'reactions-messages';
    document.body.appendChild(this.messagesContainer);
  }
  
  private setupEventListeners() {
    // Listen for reactions from other players
    wsClient.on('reaction_received', (data: any) => {
      this.queueMessage(data as ReactionMessage);
    });
  }
  
  public show() {
    // Button removed - wheel is now opened by clicking result text
  }
  
  public hide() {
    // Button removed - wheel is now opened by clicking result text
    this.closeWheel();
  }
  
  public openWheelPublic() {
    this.openWheel();
  }
  
  private openWheel() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.currentLevel = 'categories';
    this.selectedCategory = null;
    
    this.wheelOverlay = document.createElement('div');
    this.wheelOverlay.className = 'reaction-wheel-overlay';
    this.wheelOverlay.addEventListener('click', (e) => {
      if (e.target === this.wheelOverlay) {
        this.closeWheel();
      }
    });
    
    this.renderWheel();
    document.body.appendChild(this.wheelOverlay);
  }
  
  private closeWheel() {
    if (this.wheelOverlay) {
      this.wheelOverlay.remove();
      this.wheelOverlay = null;
    }
    this.isOpen = false;
    this.currentLevel = 'categories';
    this.selectedCategory = null;
  }
  
  private renderWheel() {
    if (!this.wheelOverlay) return;
    
    const wheel = document.createElement('div');
    wheel.className = 'reaction-wheel';
    
    if (this.currentLevel === 'categories') {
      this.renderCategories(wheel);
    } else {
      this.renderItems(wheel);
    }
    
    this.wheelOverlay.innerHTML = '';
    this.wheelOverlay.appendChild(wheel);
  }
  
  private renderCategories(wheel: HTMLElement) {
    const angleStep = (Math.PI * 2) / this.categories.length;
    const radius = 105;
    
    this.categories.forEach((category, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      const item = document.createElement('div');
      item.className = 'reaction-wheel-item';
      item.style.left = `calc(50% + ${x}px - 35px)`;
      item.style.top = `calc(50% + ${y}px - 35px)`;
      item.innerHTML = `<div style="font-size: 36px;">${category.icon}</div>`;
      
      item.addEventListener('click', () => {
        this.selectedCategory = category.id;
        this.currentLevel = 'items';
        this.renderWheel();
      });
      
      wheel.appendChild(item);
    });
    
    // Center label
    const center = document.createElement('div');
    center.className = 'reaction-wheel-center';
    center.textContent = '💬';
    wheel.appendChild(center);
  }
  
  private renderItems(wheel: HTMLElement) {
    if (!this.selectedCategory) return;
    
    const items = this.reactions[this.selectedCategory] || [];
    const angleStep = (Math.PI * 2) / items.length;
    const radius = 105;
    
    items.forEach((item, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      const el = document.createElement('div');
      el.className = 'reaction-wheel-item';
      el.style.left = `calc(50% + ${x}px - 35px)`;
      el.style.top = `calc(50% + ${y}px - 35px)`;
      
      if (item.isEmoji) {
        el.style.fontSize = '36px';
        el.textContent = item.content;
      } else {
        el.style.fontSize = '14px';
        el.style.fontWeight = '400';
        el.style.padding = '8px';
        el.style.textAlign = 'center';
        el.style.lineHeight = '1.2';
        el.textContent = item.content;
      }
      
      el.addEventListener('click', () => {
        this.sendReaction(item.content, item.isEmoji);
      });
      
      wheel.appendChild(el);
    });
    
    // Center back button
    const center = document.createElement('div');
    center.className = 'reaction-wheel-center reaction-wheel-back';
    center.textContent = '←';
    center.addEventListener('click', () => {
      this.currentLevel = 'categories';
      this.selectedCategory = null;
      this.renderWheel();
    });
    wheel.appendChild(center);
  }
  
  private sendReaction(content: string, isEmoji: boolean) {
    // Check cooldown
    const now = Date.now();
    if (now - this.lastReactionTime < this.cooldownMs) {
      console.log('[ReactionWheel] Cooldown active');
      return;
    }
    
    this.lastReactionTime = now;
    
    // Send to server
    wsClient.send({
      type: 'send_reaction',
      content: content
    });
    
    // Show own message immediately
    const myNickname = wsClient.user?.nickname || 'You';
    this.queueMessage({
      playerId: wsClient.user?.id || 0,
      playerNickname: myNickname,
      content: content,
      timestamp: now
    });
    
    // Play sound feedback
    this.playFeedbackSound();
    
    // Close wheel
    this.closeWheel();
  }
  
  private playFeedbackSound() {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Ignore audio errors
    }
  }
  
  private queueMessage(message: ReactionMessage) {
    this.messageQueue.push(message);
    if (!this.isShowingMessage) {
      this.showNextMessage();
    }
  }
  
  private async showNextMessage() {
    if (this.messageQueue.length === 0) {
      this.isShowingMessage = false;
      return;
    }
    
    this.isShowingMessage = true;
    const message = this.messageQueue.shift()!;
    
    await this.displayMessage(message);
    
    // Show next message after a short delay
    setTimeout(() => {
      this.showNextMessage();
    }, 300);
  }
  
  private displayMessage(message: ReactionMessage): Promise<void> {
    return new Promise((resolve) => {
      if (!this.messagesContainer) {
        resolve();
        return;
      }
      
      const el = document.createElement('div');
      el.className = 'reaction-message';
      
      // Avatar with first letter of nickname
      const avatar = document.createElement('div');
      avatar.className = 'reaction-message-avatar';
      avatar.textContent = message.playerNickname.charAt(0);
      
      // Unique color based on player ID
      const hue = (message.playerId * 137) % 360;
      avatar.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue + 30}, 70%, 50%) 100%)`;
      
      // Content (emoji or text)
      const content = document.createElement('div');
      content.className = 'reaction-message-content';
      
      // Detect if content is emoji or text
      const emojiRegex = /^[\p{Emoji}\u200d]+$/u;
      if (!emojiRegex.test(message.content)) {
        content.classList.add('text');
      }
      content.textContent = message.content;
      
      el.appendChild(avatar);
      el.appendChild(content);
      
      this.messagesContainer.appendChild(el);
      
      // Remove after 3 seconds
      setTimeout(() => {
        el.remove();
        resolve();
      }, 3000);
    });
  }
}
