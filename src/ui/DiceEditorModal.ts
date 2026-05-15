import { t } from '../../shared/i18n';
import { icon } from './icons';
import type { DiceConfig } from '../game/Dice';
import type { Game } from '../game/Game';

export class DiceEditorModal {
  private overlay: HTMLElement | null = null;
  private game: Game;
  private currentConfig: DiceConfig;
  private previewUpdateTimer: number | null = null;
  private static instance: DiceEditorModal | null = null; // Singleton for toggle

  constructor(game: Game) {
    this.game = game;
    
    // Check if there's a saved custom config
    const savedConfig = this.loadSavedConfig();
    if (savedConfig) {
      // Apply saved custom config to dice
      this.currentConfig = savedConfig;
      const bevelSegments = (this.game as any).graphicsSettings?.diceBevelSegments || 3;
      this.game.getDice().forEach(dice => {
        dice.updateConfig(savedConfig, bevelSegments);
      });
    } else {
      // Use current dice config from game
      this.currentConfig = this.game.getDice()[0]?.getConfig() || this.getDefaultConfig();
    }
    
    // Register globally for Game.ts to access
    (window as any).__diceEditorModal = this;
  }

  public static toggle(game: Game) {
    if (DiceEditorModal.instance && DiceEditorModal.instance.overlay) {
      // Already open - close it
      DiceEditorModal.instance.close();
      DiceEditorModal.instance = null;
      (window as any).__diceEditorModal = null;
    } else {
      // Not open - create and show
      DiceEditorModal.instance = new DiceEditorModal(game);
      DiceEditorModal.instance.show();
    }
  }

  // Update editor when dice changes (e.g., from inventory)
  public static updateIfOpen(game: Game) {
    if (DiceEditorModal.instance && DiceEditorModal.instance.overlay) {
      // Clear custom config when switching dice
      localStorage.removeItem('customDiceConfig');
      
      // Get new dice config
      const newConfig = game.getDice()[0]?.getConfig();
      if (newConfig) {
        DiceEditorModal.instance.currentConfig = newConfig;
        DiceEditorModal.instance.updateFormValues(newConfig);
      }
    }
  }
  
  // Public method to update from outside
  public updateFromDiceChange(config: DiceConfig) {
    localStorage.removeItem('customDiceConfig');
    this.currentConfig = config;
    this.updateFormValues(config);
  }

  private loadSavedConfig(): DiceConfig | null {
    try {
      const saved = localStorage.getItem('customDiceConfig');
      if (saved) {
        const config = JSON.parse(saved);
        console.log('[DiceEditor] Loaded config from localStorage:', config);
        return config;
      }
    } catch (e) {
      console.error('Failed to load saved dice config:', e);
    }
    return null;
  }

  private getDefaultConfig(): DiceConfig {
    return {
      baseColor: '#ffffff',
      dotColor: '#000000',
      borderColor: '#ffffff',
      roughness: 0.3,
      metalness: 0.25,
      clearcoat: 0,
      clearcoatRoughness: 0,
      opacity: 1,
      dotSize: 29,
      dotShape: 'circle',
      dotDepth: 1.3,
      bevelRadius: 0.08, // Same as standalone editor
    };
  }

  public show() {
    if (this.overlay) return; // Already open

    // Hide result element and boost icon
    const resultEl = document.getElementById('result');
    if (resultEl) {
      resultEl.style.display = 'none';
    }
    
    const boostIcon = document.getElementById('boost-icon');
    if (boostIcon) {
      boostIcon.style.display = 'none';
    }

    this.overlay = document.createElement('div');
    this.overlay.id = 'dice-editor-modal';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      backdrop-filter: none;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0 10px 10px 10px;
      pointer-events: none;
      z-index: 98;
    `;

    this.overlay.innerHTML = `
      <div class="mp-confirm-dialog" style="position: relative; width: 100%; max-width: 420px; max-height: 70vh; overflow-y: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 12px 12px 12px 12px; background: transparent; border-radius: 16px; margin: 0; pointer-events: auto;">
        
        <div id="dice-editor-content" style="text-align: left;">
          <!-- Appearance Category -->
          <div class="dice-editor-category">
            <button class="dice-editor-category-header" data-category="appearance">
              <span class="dice-editor-category-icon">▶</span>
              <span>${t('diceEditor.appearance')}</span>
            </button>
            <div class="dice-editor-category-content" data-category-content="appearance" style="display: none;">
              <div class="dice-editor-control">
                <label>${t('diceEditor.baseColor')}</label>
                <input type="color" id="dice-baseColor" value="${this.currentConfig.baseColor}" />
              </div>
              <div class="dice-editor-control">
                <label>${t('diceEditor.borderColor')}</label>
                <input type="color" id="dice-borderColor" value="${this.currentConfig.borderColor}" />
              </div>
              <div class="dice-editor-control">
                <label>${t('diceEditor.bevelRadius')}</label>
                <input type="range" id="dice-bevelRadius" min="0" max="0.2" step="0.01" value="${this.currentConfig.bevelRadius || 0.08}" />
                <span class="dice-editor-value">${(this.currentConfig.bevelRadius || 0.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Pips Category -->
          <div class="dice-editor-category">
            <button class="dice-editor-category-header" data-category="pips">
              <span class="dice-editor-category-icon">▶</span>
              <span>${t('diceEditor.pips')}</span>
            </button>
            <div class="dice-editor-category-content" data-category-content="pips" style="display: none;">
              <div class="dice-editor-control">
                <label>${t('diceEditor.pipColor')}</label>
                <input type="color" id="dice-dotColor" value="${this.currentConfig.dotColor}" />
              </div>
              <div class="dice-editor-control">
                <label>${t('diceEditor.pipSize')}</label>
                <input type="range" id="dice-dotSize" min="10" max="31" step="1" value="${this.currentConfig.dotSize || 29}" />
                <span class="dice-editor-value">${this.currentConfig.dotSize || 29}</span>
              </div>
              <div class="dice-editor-control">
                <label>${t('diceEditor.pipDepth')}</label>
                <input type="range" id="dice-dotDepth" min="0" max="2" step="0.1" value="${this.currentConfig.dotDepth || 1.3}" />
                <span class="dice-editor-value">${(this.currentConfig.dotDepth || 1.3).toFixed(1)}</span>
              </div>
            </div>
          </div>

          <!-- Material Category -->
          <div class="dice-editor-category">
            <button class="dice-editor-category-header" data-category="material">
              <span class="dice-editor-category-icon">▶</span>
              <span>${t('diceEditor.material')}</span>
            </button>
            <div class="dice-editor-category-content" data-category-content="material" style="display: none;">
              <div class="dice-editor-control">
                <label>${t('diceEditor.roughness')}</label>
                <input type="range" id="dice-roughness" min="0" max="1" step="0.05" value="${this.currentConfig.roughness || 0.3}" />
                <span class="dice-editor-value">${((this.currentConfig.roughness || 0.3) * 100).toFixed(0)}%</span>
              </div>
              <div class="dice-editor-control">
                <label>${t('diceEditor.metalness')}</label>
                <input type="range" id="dice-metalness" min="0" max="1" step="0.05" value="${this.currentConfig.metalness || 0.25}" />
                <span class="dice-editor-value">${((this.currentConfig.metalness || 0.25) * 100).toFixed(0)}%</span>
              </div>
              <div class="dice-editor-control">
                <label>${t('diceEditor.clearcoat')}</label>
                <input type="range" id="dice-clearcoat" min="0" max="1" step="0.05" value="${this.currentConfig.clearcoat || 0}" />
                <span class="dice-editor-value">${((this.currentConfig.clearcoat || 0) * 100).toFixed(0)}%</span>
              </div>
              <div class="dice-editor-control">
                <label>${t('diceEditor.clearcoatRoughness')}</label>
                <input type="range" id="dice-clearcoatRoughness" min="0" max="1" step="0.05" value="${this.currentConfig.clearcoatRoughness || 0}" />
                <span class="dice-editor-value">${((this.currentConfig.clearcoatRoughness || 0) * 100).toFixed(0)}%</span>
              </div>
              <div class="dice-editor-control">
                <label>${t('diceEditor.opacity')}</label>
                <input type="range" id="dice-opacity" min="0.1" max="1" step="0.05" value="${this.currentConfig.opacity || 1}" />
                <span class="dice-editor-value">${((this.currentConfig.opacity || 1) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="mp-btn secondary" id="dice-editor-reset" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${t('diceEditor.reset')}</button>
          <button class="mp-btn" id="dice-editor-use-key" style="flex: 0 0 48px; padding: 12px; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 8px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(255,215,0,0.4); display: flex; align-items: center; justify-content: center;">
            <span id="use-key-icon" style="display: inline-flex; width: 20px; height: 20px; color: #000;"></span>
          </button>
          <button class="mp-btn" id="dice-editor-apply" style="flex: 1; padding: 12px; background: #4CAF50; border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${t('diceEditor.apply')}</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .dice-editor-category {
        margin-bottom: 8px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        overflow: hidden;
      }
      #dice-editor-content .dice-editor-category:last-child {
        margin-bottom: 0 !important;
      }
      .dice-editor-category-header {
        width: 100%;
        padding: 12px;
        background: rgba(255,255,255,0.1);
        border: none;
        color: white;
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.2s;
      }
      .dice-editor-category-header:hover {
        background: rgba(255,255,255,0.15);
      }
      .dice-editor-category-header.active {
        background: rgba(76, 175, 80, 0.3);
      }
      .dice-editor-category-icon {
        transition: transform 0.2s;
        font-size: 12px;
      }
      .dice-editor-category-header.active .dice-editor-category-icon {
        transform: rotate(90deg);
      }
      .dice-editor-category-content {
        padding: 12px;
      }
      .dice-editor-control {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .dice-editor-control:last-child {
        margin-bottom: 0;
      }
      .dice-editor-control label {
        flex: 1;
        color: #ccc;
        font-size: 13px;
        min-width: 0;
      }
      .dice-editor-control input[type="color"] {
        width: 50px;
        height: 18px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background: transparent;
      }
      .dice-editor-control input[type="range"] {
        flex: 1;
        min-width: 80px;
        height: 8px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        border: none;
        cursor: pointer;
        outline: none;
      }
      .dice-editor-control input[type="range"]::-webkit-slider-track {
        background: transparent;
        height: 8px;
        border-radius: 4px;
      }
      .dice-editor-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #FFD700;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      }
      .dice-editor-control input[type="range"]::-moz-range-track {
        background: transparent;
        height: 8px;
        border-radius: 4px;
      }
      .dice-editor-control input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #FFD700;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      }
      .dice-editor-value {
        color: white;
        font-size: 13px;
        min-width: 40px;
        text-align: right;
      }
    `;
    this.overlay.appendChild(style);

    document.body.appendChild(this.overlay);

    // Add key icon to Use Key button
    const keyIconContainer = this.overlay.querySelector('#use-key-icon');
    if (keyIconContainer) {
      keyIconContainer.innerHTML = icon('key', 20);
      // Ensure SVG inherits black color
      const svg = keyIconContainer.querySelector('svg');
      if (svg) {
        svg.style.fill = 'currentColor';
        svg.style.color = '#000';
      }
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.overlay) return;

    // Don't close on any clicks - only via toggle button

    // Category toggles
    this.overlay.querySelectorAll('.dice-editor-category-header').forEach(header => {
      header.addEventListener('click', () => {
        const category = header.getAttribute('data-category');
        const content = this.overlay?.querySelector(`[data-category-content="${category}"]`) as HTMLElement;
        const isOpen = content.style.display !== 'none';
        
        if (isOpen) {
          content.style.display = 'none';
          header.classList.remove('active');
        } else {
          content.style.display = 'block';
          header.classList.add('active');
        }
      });
    });

    // Real-time preview updates
    const controls = [
      'dice-baseColor', 'dice-dotColor', 'dice-borderColor',
      'dice-bevelRadius', 'dice-dotSize', 'dice-dotDepth',
      'dice-roughness', 'dice-metalness', 'dice-clearcoat', 
      'dice-clearcoatRoughness', 'dice-opacity'
    ];

    controls.forEach(id => {
      const element = this.overlay?.querySelector(`#${id}`) as HTMLInputElement;
      if (!element) return;

      element.addEventListener('input', () => {
        this.updateValueDisplay(id, element.value);
        this.schedulePreviewUpdate();
      });
    });

    // Reset button
    this.overlay.querySelector('#dice-editor-reset')?.addEventListener('click', () => {
      this.resetToDefault();
    });

    // Apply button
    this.overlay.querySelector('#dice-editor-apply')?.addEventListener('click', () => {
      this.applyChanges();
      // Close editor after applying changes
      this.close();
    });
    
    // Use Key button
    this.overlay.querySelector('#dice-editor-use-key')?.addEventListener('click', () => {
      this.showUseKeyConfirmation();
    });
  }

  private updateValueDisplay(id: string, value: string) {
    const control = this.overlay?.querySelector(`#${id}`)?.closest('.dice-editor-control');
    const valueDisplay = control?.querySelector('.dice-editor-value');
    if (!valueDisplay) return;

    switch (id) {
      case 'dice-bevelRadius':
        valueDisplay.textContent = parseFloat(value).toFixed(2);
        break;
      case 'dice-dotSize':
        valueDisplay.textContent = value;
        break;
      case 'dice-dotDepth':
        valueDisplay.textContent = parseFloat(value).toFixed(1);
        break;
      case 'dice-roughness':
      case 'dice-metalness':
      case 'dice-clearcoat':
      case 'dice-clearcoatRoughness':
      case 'dice-opacity':
        valueDisplay.textContent = `${(parseFloat(value) * 100).toFixed(0)}%`;
        break;
    }
  }

  private schedulePreviewUpdate() {
    if (this.previewUpdateTimer) {
      clearTimeout(this.previewUpdateTimer);
    }

    this.previewUpdateTimer = window.setTimeout(() => {
      this.updatePreview();
    }, 100); // Debounce 100ms
  }

  private updatePreview() {
    const config = this.getCurrentConfig();
    
    // Update all dice with new config
    // Get bevel segments from game's graphics settings
    const bevelSegments = (this.game as any).graphicsSettings?.diceBevelSegments || 3;
    this.game.getDice().forEach(dice => {
      dice.updateConfig(config, bevelSegments);
    });
  }

  private getCurrentConfig(): DiceConfig {
    if (!this.overlay) return this.currentConfig;

    const getValue = (id: string): string => {
      const element = this.overlay?.querySelector(`#${id}`) as HTMLInputElement;
      return element?.value || '';
    };

    return {
      baseColor: getValue('dice-baseColor'),
      dotColor: getValue('dice-dotColor'),
      borderColor: getValue('dice-borderColor'),
      bevelRadius: parseFloat(getValue('dice-bevelRadius')),
      dotSize: parseInt(getValue('dice-dotSize')),
      dotShape: 'circle', // Always circle
      dotDepth: parseFloat(getValue('dice-dotDepth')),
      roughness: parseFloat(getValue('dice-roughness')),
      metalness: parseFloat(getValue('dice-metalness')),
      clearcoat: parseFloat(getValue('dice-clearcoat')),
      clearcoatRoughness: parseFloat(getValue('dice-clearcoatRoughness')),
      opacity: parseFloat(getValue('dice-opacity')),
    };
  }

  private resetToDefault() {
    // Get current dice config from game (equipped dice)
    const currentDiceConfig = this.game.getDice()[0]?.getConfig();
    if (!currentDiceConfig) return;
    
    // Remove custom config from localStorage
    localStorage.removeItem('customDiceConfig');
    
    this.currentConfig = currentDiceConfig;
    this.updateFormValues(currentDiceConfig);
    this.updatePreview();
  }

  private updateFormValues(config: DiceConfig) {
    // Update form values
    if (!this.overlay) return;

    const setValue = (id: string, value: any) => {
      const element = this.overlay?.querySelector(`#${id}`) as HTMLInputElement;
      if (element) {
        element.value = value.toString();
        this.updateValueDisplay(id, value.toString());
      }
    };

    setValue('dice-baseColor', config.baseColor);
    setValue('dice-dotColor', config.dotColor);
    setValue('dice-borderColor', config.borderColor);
    setValue('dice-bevelRadius', config.bevelRadius);
    setValue('dice-dotSize', config.dotSize);
    setValue('dice-dotDepth', config.dotDepth);
    setValue('dice-roughness', config.roughness);
    setValue('dice-metalness', config.metalness);
    setValue('dice-clearcoat', config.clearcoat);
    setValue('dice-clearcoatRoughness', config.clearcoatRoughness);
    setValue('dice-opacity', config.opacity);
    
    // Auto-update preview when form values change
    this.updatePreview();
  }

  private applyChanges() {
    const config = this.getCurrentConfig();
    this.currentConfig = config;

    // Save to localStorage
    console.log('[DiceEditor] Saving config to localStorage:', config);
    localStorage.setItem('customDiceConfig', JSON.stringify(config));

    // Update all dice
    const bevelSegments = (this.game as any).graphicsSettings?.diceBevelSegments || 3;
    this.game.getDice().forEach(dice => {
      dice.updateConfig(config, bevelSegments);
    });
  }

  private showUseKeyConfirmation() {
    // Access wsClient from window (it's globally available)
    const wsClient = (window as any).wsClient;
    
    if (!wsClient) {
      console.error('[DiceEditor] wsClient not available');
      return;
    }
    
    // Check if user has keys
    const keys = wsClient.inventory.filter((i: any) => i.type === 'key' && i.code === 'design_key');
    
    if (keys.length === 0) {
      const overlay = document.createElement('div');
      overlay.className = 'mp-confirm-overlay';
      overlay.style.zIndex = '1200';
      overlay.innerHTML = `
        <div class="mp-confirm-dialog" style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔑</div>
          <div style="color: white; font-size: 18px; margin-bottom: 8px;">No Design Key</div>
          <div style="color: #888; font-size: 14px; margin-bottom: 16px;">
            You need a Design Key to save custom dice.<br>
            Purchase one from the shop for 5000 pips.
          </div>
          <button class="mp-btn secondary" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">Close</button>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.querySelector('button')!.addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
      });
      return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'mp-confirm-overlay';
    overlay.style.zIndex = '1200';
    overlay.innerHTML = `
      <div class="mp-confirm-dialog" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">🔑</div>
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 8px;">Use Design Key?</div>
        <div style="color: #888; font-size: 14px; margin-bottom: 16px;">
          This will save your custom dice permanently.<br>
          You have ${keys.length} key(s) remaining.
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="mp-btn secondary" id="cancel-use-key" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">Cancel</button>
          <button class="mp-btn" id="confirm-use-key" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 8px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(255,215,0,0.4);">Use Key</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('cancel-use-key')!.addEventListener('click', () => overlay.remove());
    document.getElementById('confirm-use-key')!.addEventListener('click', () => {
      this.saveCustomDice();
      overlay.remove();
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
  
  private saveCustomDice() {
    // Access wsClient from window (it's globally available)
    const wsClient = (window as any).wsClient;
    
    if (!wsClient) {
      console.error('[DiceEditor] wsClient not available');
      return;
    }
    
    // Get current dice config
    const config = this.getCurrentConfig();
    
    // Send to server
    wsClient.send({
      type: 'save_custom_dice',
      config
    });
    
    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(30,30,30,0.95);
      color: white;
      padding: 20px;
      border-radius: 12px;
      font-size: 14px;
      z-index: 1300;
      text-align: center;
    `;
    notification.textContent = 'Saving custom dice...';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
    
    // Close editor
    this.close();
  }

  public close() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }

    if (this.previewUpdateTimer) {
      clearTimeout(this.previewUpdateTimer);
      this.previewUpdateTimer = null;
    }

    // Update UI visibility based on current game mode
    this.game.updateUIVisibility();
    
    // Clear global reference
    (window as any).__diceEditorModal = null;
  }
}
