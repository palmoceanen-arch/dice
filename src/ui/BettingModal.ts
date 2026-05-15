import { wsClient } from '../multiplayer/WebSocketClient';
import { t } from '../../shared/i18n';
import { icon } from './icons';

export interface BetInfo {
  userId: number;
  nickname?: string;
  amount: number;
  confirmed: boolean;
}

export class BettingModal {
  private static overlay: HTMLElement | null = null;
  private static currentBet: number = 0;
  private static confirmed: boolean = false;
  private static minBet: number = 10;
  private static userBalance: number = 0;
  private static pot: number = 0;
  private static allBets: BetInfo[] = [];

  static init() {
    console.log('[BettingModal] Initialized');
  }

  static show(minBet: number = 10, balance: number = 0) {
    if (this.overlay) return;

    this.minBet = minBet;
    this.userBalance = balance;
    this.currentBet = minBet;
    this.confirmed = false;

    this.overlay = document.createElement('div');
    this.overlay.className = 'betting-modal-overlay';
    this.overlay.innerHTML = `
      <div class="betting-modal">
        <div class="betting-header">
          <span class="balance">💰 ${balance.toLocaleString()} pips</span>
          <button class="close-btn">✕</button>
        </div>
        
        <div class="betting-content">
          <h3>${t('betting.title')}</h3>
          <p class="betting-subtitle">${t('betting.subtitle')}</p>
          
          <div class="bet-options">
            <button class="bet-btn" data-amount="10">10</button>
            <button class="bet-btn" data-amount="50">50</button>
            <button class="bet-btn" data-amount="100">100</button>
            <button class="bet-btn" data-amount="500">500</button>
          </div>
          
          <div class="custom-bet">
            <label>${t('betting.customAmount')}</label>
            <input type="number" class="custom-bet-input" min="${minBet}" max="${balance}" value="${minBet}" />
          </div>
          
          <div class="pot-display">
            <div class="pot-label">${t('betting.pot')}</div>
            <div class="pot-amount">0 pips</div>
          </div>
          
          <div class="players-bets"></div>
        </div>
        
        <div class="betting-footer">
          <button class="confirm-btn" disabled>
            ✓ ${t('betting.confirm')} ${minBet} pips
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    this.attachEventListeners();
    this.updateUI();
  }

  private static attachEventListeners() {
    if (!this.overlay) return;

    // Close button
    const closeBtn = this.overlay.querySelector('.close-btn');
    closeBtn?.addEventListener('click', () => this.hide());

    // Bet option buttons
    const betBtns = this.overlay.querySelectorAll('.bet-btn');
    betBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const amount = parseInt((e.target as HTMLElement).dataset.amount || '0');
        this.selectBet(amount);
      });
    });

    // Custom bet input
    const customInput = this.overlay.querySelector('.custom-bet-input') as HTMLInputElement;
    customInput?.addEventListener('input', (e) => {
      const amount = parseInt((e.target as HTMLInputElement).value || '0');
      this.selectBet(amount);
    });

    // Confirm button
    const confirmBtn = this.overlay.querySelector('.confirm-btn');
    confirmBtn?.addEventListener('click', () => this.confirmBet());

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });
  }

  private static selectBet(amount: number) {
    if (this.confirmed) return;
    if (amount < this.minBet || amount > this.userBalance) return;

    this.currentBet = amount;
    
    console.log('[BETTING] Selecting bet:', amount);
    
    // Send to server
    wsClient.send({
      type: 'place_bet',
      amount
    });

    this.updateUI();
  }

  private static confirmBet() {
    if (this.confirmed) return;
    if (this.currentBet < this.minBet) return;

    console.log('[BETTING] Confirming bet:', this.currentBet);
    
    this.confirmed = true;
    
    // Send confirmation to server
    wsClient.send({
      type: 'confirm_bet'
    });

    this.updateUI();
  }

  private static updateUI() {
    if (!this.overlay) return;

    // Update bet buttons
    const betBtns = this.overlay.querySelectorAll('.bet-btn');
    betBtns.forEach(btn => {
      const amount = parseInt((btn as HTMLElement).dataset.amount || '0');
      btn.classList.toggle('active', amount === this.currentBet);
      btn.classList.toggle('disabled', amount > this.userBalance || this.confirmed);
    });

    // Update custom input
    const customInput = this.overlay.querySelector('.custom-bet-input') as HTMLInputElement;
    if (customInput) {
      customInput.value = this.currentBet.toString();
      customInput.disabled = this.confirmed;
    }

    // Update confirm button
    const confirmBtn = this.overlay.querySelector('.confirm-btn');
    if (confirmBtn) {
      confirmBtn.textContent = this.confirmed
        ? `✓ ${t('betting.waiting')}`
        : `✓ ${t('betting.confirm')} ${this.currentBet} pips`;
      confirmBtn.classList.toggle('confirmed', this.confirmed);
      (confirmBtn as HTMLButtonElement).disabled = this.confirmed || this.currentBet < this.minBet;
    }

    // Update pot
    const potAmount = this.overlay.querySelector('.pot-amount');
    if (potAmount) {
      potAmount.textContent = `${this.pot.toLocaleString()} pips`;
    }

    // Update players bets
    this.updatePlayersBets();
  }

  private static updatePlayersBets() {
    if (!this.overlay) return;

    const container = this.overlay.querySelector('.players-bets');
    if (!container) return;

    if (this.allBets.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="bets-list">
        <div class="bets-header">${t('betting.playersBets')}</div>
        ${this.allBets.map(bet => `
          <div class="bet-item ${bet.confirmed ? 'confirmed' : 'pending'}">
            <span class="bet-player">${bet.nickname || `Player ${bet.userId}`}</span>
            <span class="bet-amount">${bet.amount} pips</span>
            <span class="bet-status">${bet.confirmed ? '✓' : '⏳'}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  static updatePot(pot: number, bets: BetInfo[]) {
    console.log('[BETTING] updatePot called:', { pot, bets, betsCount: bets.length });
    
    this.pot = pot;
    this.allBets = bets;
    
    // Если банк еще 0 (ставки не подтверждены), показываем предварительный банк
    if (pot === 0 && bets.length > 0) {
      // Вычисляем сумму всех размещенных ставок
      const preliminaryPot = bets.reduce((sum, bet) => sum + bet.amount, 0);
      console.log('[BETTING] Calculated preliminary pot:', preliminaryPot);
      this.pot = preliminaryPot;
    }
    
    this.updateUI();
  }

  static updateBalance(newBalance: number) {
    this.userBalance = newBalance;
    
    if (this.overlay) {
      const balanceEl = this.overlay.querySelector('.balance');
      if (balanceEl) {
        balanceEl.textContent = `💰 ${newBalance.toLocaleString()} pips`;
      }
    }
  }

  static onBetConfirmed() {
    this.confirmed = true;
    this.updateUI();
  }

  static onBettingComplete() {
    // Close modal after a short delay
    setTimeout(() => {
      this.hide();
    }, 2000);
  }

  static hide() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    
    this.currentBet = 0;
    this.confirmed = false;
    this.pot = 0;
    this.allBets = [];
  }

  static isOpen(): boolean {
    return this.overlay !== null;
  }
}
