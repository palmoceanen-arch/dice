import { wsClient } from './WebSocketClient';
import type { Game } from '../game/Game';
import confetti from 'canvas-confetti';
import { t } from '../../shared/i18n';

interface GameState {
  currentTurn: number | null;
  turnIndex: number;
  playerOrder: number[];
  isInGame: boolean;
  gameMode: string;
  players: Map<number, string>; // playerId -> nickname
  // Street Craps specific
  phase: 'come_out' | 'point';
  pointValue: number | null;
  // Mexico specific
  mexicoPenalties: Record<number, number>;
  mexicoGameOver: boolean;
  // Greedy Pig specific
  greedyPigScores: Record<number, number>;
  greedyPigTurnScore: number;
  greedyPigGameOver: boolean;
  // Palmo's Dice specific
  palmosScores?: Record<number, number>;
  palmosGameOver?: boolean;
  // Betting payouts
  payouts?: Record<number, number>;
  // Player configs cache for preloading
  playerDiceConfigs: Map<number, any>;
}

interface DiceRollData {
  playerId: number;
  playerNickname: string;
  dice1: number;
  dice2: number;
  total: number;
  equippedDiceId: number | null;
  equippedEffectId: number | null;
}

export class GameSync {
  private game: Game;
  private gameState: GameState = {
    currentTurn: null,
    turnIndex: 0,
    playerOrder: [],
    isInGame: false,
    gameMode: 'free_roll',
    players: new Map(),
    phase: 'come_out',
    pointValue: null,
    mexicoPenalties: {},
    mexicoGameOver: false,
    greedyPigScores: {},
    greedyPigTurnScore: 0,
    greedyPigGameOver: false,
    palmosScores: {},
    palmosGameOver: false,
    playerDiceConfigs: new Map(),
  };
  
  // UI elements
  private gameHUD: HTMLElement | null = null;
  private turnIndicator: HTMLElement | null = null;
  private playersList: HTMLElement | null = null;
  private passButton: HTMLElement | null = null;
  private crapsStatus: HTMLElement | null = null;
  private stopButton: HTMLElement | null = null;
  
  // Flag to block Stop button during throw
  private isThrowInProgress = false;
  
  // Flag to prevent double reset from game result + turn_changed
  private diceResetScheduled = false;

  constructor(game: Game) {
    this.game = game;
    this.setupEventListeners();
    this.createGameHUD();
  }

  private setupEventListeners() {
    // Game started
    wsClient.on('game_started', (data: any) => {
      (window as any).debugLog?.('GAME', '========== GAME STARTED ==========');
      (window as any).debugLog?.('GAME', `Players: ${data.lobby?.players?.length || 0}, Items: ${data.lobby?.availableItems?.length || 0}`);
      
      // Remove any existing result popups (from previous game)
      const existingMexicoPopup = document.querySelector('[data-mexico-result]');
      if (existingMexicoPopup) existingMexicoPopup.remove();
      
      const existingGreedyPigPopup = document.querySelector('[data-greedy-pig-result]');
      if (existingGreedyPigPopup) existingGreedyPigPopup.remove();
      
      const existingPalmosPopup = document.querySelector('[data-palmos-result]');
      if (existingPalmosPopup) existingPalmosPopup.remove();
      
      // Reset dice state (unlock colors, restore original config)
      const diceSync = this.game.getDiceSync();
      if (diceSync) {
        diceSync.resetForSoloMode();
      }
      
      this.gameState.isInGame = true;
      this.gameState.currentTurn = data.currentTurn;
      this.gameState.playerOrder = data.playerOrder || [];
      this.gameState.gameMode = data.lobby?.gameMode || 'free_roll';
      this.gameState.phase = data.phase || 'come_out';
      this.gameState.pointValue = data.pointValue || null;
      
      // Set dice count based on game mode
      const diceCount = data.diceCount || this.getDiceCountForMode(this.gameState.gameMode);
      this.game.setDiceCount(diceCount);
      
      // Apply selected table from voting
      if (data.tableConfig) {
        this.game.updateTableAppearance(data.tableConfig);
      }
      
      // Store player nicknames and preload dice configs
      this.gameState.players.clear();
      this.gameState.playerDiceConfigs.clear();
      
      (window as any).debugLog?.('GAME', `Starting preload, availableItems: ${data.lobby?.availableItems?.length || 0}, inventory: ${wsClient.inventory?.length || 0}`);
      
      if (data.lobby?.players) {
        for (const player of data.lobby.players) {
          const oderId = player.oderId || player.userId;
          const nickname = player.nickname || player.user?.nickname || `Player${oderId}`;
          if (oderId) {
            this.gameState.players.set(oderId, nickname);
            
            // Preload dice config for this player (try both locations)
            const equippedDiceId = player.equippedDiceId || player.user?.equippedDiceId;
            (window as any).debugLog?.('GAME', `Player ${oderId} diceId: ${equippedDiceId}`);
            
            if (equippedDiceId) {
              // Try availableItems first
              let diceConfig = this.getDiceConfigById(equippedDiceId, data.lobby.availableItems);
              
              // Fallback to wsClient.inventory if availableItems is empty
              if (!diceConfig && wsClient.inventory) {
                diceConfig = this.getDiceConfigById(equippedDiceId, wsClient.inventory);
              }
              
              if (diceConfig) {
                this.gameState.playerDiceConfigs.set(oderId, diceConfig);
                (window as any).debugLog?.('GAME', `✓ Preloaded config for player ${oderId}`);
              } else {
                (window as any).debugLog?.('GAME', `✗ Failed to preload for player ${oderId}`);
                console.warn('[GameSync] ✗ Failed to preload dice config for player', oderId, 'diceId:', equippedDiceId);
                console.warn('[GameSync] Available dice items:', data.lobby.availableItems?.filter((i: any) => i.type === 'dice').map((i: any) => i.id));
                console.warn('[GameSync] Inventory dice items:', wsClient.inventory?.filter((i: any) => i.type === 'dice').map((i: any) => i.id));
              }
            } else {
              console.warn('[GameSync] ✗ No equippedDiceId for player', oderId);
            }
          }
        }
      }
      
      (window as any).debugLog?.('GAME', `Preload complete: ${this.gameState.playerDiceConfigs.size} configs loaded`);
      
      // Apply synced wall width if provided
      if (data.minAspectRatio) {
        this.game.setSyncedAspectRatio(data.minAspectRatio);
      }
      
      // Initialize Mexico penalties BEFORE updating UI
      if (this.gameState.gameMode === 'mexico') {
        this.gameState.mexicoPenalties = data.penalties || {};
        this.gameState.mexicoGameOver = false;
        // Initialize penalties to 0 for all players if not provided
        if (Object.keys(this.gameState.mexicoPenalties).length === 0) {
          this.gameState.playerOrder.forEach(id => {
            this.gameState.mexicoPenalties[id] = 0;
          });
        }
      }
      
      // Initialize Greedy Pig scores BEFORE updating UI
      if (this.gameState.gameMode === 'greedy_pig') {
        this.gameState.greedyPigScores = data.scores || {};
        this.gameState.greedyPigTurnScore = 0;
        this.gameState.greedyPigGameOver = false;
        // Initialize scores to 0 for all players if not provided
        if (Object.keys(this.gameState.greedyPigScores).length === 0) {
          this.gameState.playerOrder.forEach(id => {
            this.gameState.greedyPigScores[id] = 0;
          });
        }
      }
      
      this.showGameHUD();
      this.updateTurnIndicator();
      this.updatePlayersList();
      this.updateCrapsStatus();
      
      // Disable solo game controls
      this.disableSoloControls();
      
      // Update UI visibility (hide boost icon, show result)
      this.game.updateUIVisibility();
      
      // Reset dice for all players - only first shooter gets dice in hand
      const isMyTurn = data.currentTurn === wsClient.user?.id;
      this.game.onGameStarted(isMyTurn);
      
      // Set throw seed for anti-cheat
      if (data.throwSeed !== undefined) {
        this.game.setThrowSeed(data.throwSeed);
      }
    });
    
    // Game reconnected (after disconnect)
    wsClient.on('game_reconnected', (data: any) => {
      (window as any).debugLog?.('GAME', '========== GAME RECONNECTED ==========');
      (window as any).debugLog?.('GAME', `Players: ${data.lobby?.players?.length || 0}, Items: ${data.lobby?.availableItems?.length || 0}`);
      
      // Reset dice state
      const diceSync = this.game.getDiceSync();
      if (diceSync) {
        diceSync.resetForSoloMode();
      }
      
      this.gameState.isInGame = true;
      this.gameState.currentTurn = data.currentTurn;
      this.gameState.playerOrder = data.playerOrder || [];
      this.gameState.gameMode = data.lobby?.gameMode || 'free_roll';
      this.gameState.phase = data.phase || 'come_out';
      this.gameState.pointValue = data.pointValue || null;
      
      // Apply selected table
      if (data.tableConfig) {
        this.game.updateTableAppearance(data.tableConfig);
      }
      
      // Store player nicknames and preload dice configs (same as game_started)
      this.gameState.players.clear();
      this.gameState.playerDiceConfigs.clear();
      
      (window as any).debugLog?.('GAME', `Starting preload (reconnect), availableItems: ${data.lobby?.availableItems?.length || 0}, inventory: ${wsClient.inventory?.length || 0}`);
      
      if (data.lobby?.players) {
        for (const player of data.lobby.players) {
          const oderId = player.oderId || player.userId;
          const nickname = player.nickname || player.user?.nickname || `Player${oderId}`;
          if (oderId) {
            this.gameState.players.set(oderId, nickname);
            
            // Preload dice config for this player (try both locations)
            const equippedDiceId = player.equippedDiceId || player.user?.equippedDiceId;
            (window as any).debugLog?.('GAME', `Player ${oderId} diceId: ${equippedDiceId}`);
            
            if (equippedDiceId) {
              // Try availableItems first
              let diceConfig = this.getDiceConfigById(equippedDiceId, data.lobby.availableItems);
              
              // Fallback to wsClient.inventory if availableItems is empty
              if (!diceConfig && wsClient.inventory) {
                diceConfig = this.getDiceConfigById(equippedDiceId, wsClient.inventory);
              }
              
              if (diceConfig) {
                this.gameState.playerDiceConfigs.set(oderId, diceConfig);
                (window as any).debugLog?.('GAME', `✓ Preloaded config for player ${oderId}`);
              } else {
                (window as any).debugLog?.('GAME', `✗ Failed to preload for player ${oderId}`);
                console.warn('[GameSync] ✗ Failed to preload dice config for player', oderId, 'diceId:', equippedDiceId);
                console.warn('[GameSync] Available dice items:', data.lobby.availableItems?.filter((i: any) => i.type === 'dice').map((i: any) => i.id));
                console.warn('[GameSync] Inventory dice items:', wsClient.inventory?.filter((i: any) => i.type === 'dice').map((i: any) => i.id));
              }
            } else {
              console.warn('[GameSync] ✗ No equippedDiceId for player', oderId);
            }
          }
        }
      }
      
      (window as any).debugLog?.('GAME', `Preload complete (reconnect): ${this.gameState.playerDiceConfigs.size} configs loaded`);
      
      // Set dice count based on game mode BEFORE any dice operations
      const diceCount = data.diceCount || this.getDiceCountForMode(this.gameState.gameMode);
      
      // For Palmo's Dice with lastFrame, we'll restore positions manually, so skip auto-reset
      const skipAutoReset = this.gameState.gameMode === 'poker_dice' && data.lastFrame && data.currentRound;
      this.game.setDiceCount(diceCount, skipAutoReset);
      
      // Apply synced wall width
      if (data.minAspectRatio) {
        this.game.setSyncedAspectRatio(data.minAspectRatio);
      }
      
      // Restore game mode specific state
      if (this.gameState.gameMode === 'mexico') {
        this.gameState.mexicoPenalties = data.penalties || {};
        this.gameState.mexicoGameOver = false;
      }
      
      if (this.gameState.gameMode === 'greedy_pig') {
        this.gameState.greedyPigScores = data.scores || {};
        this.gameState.greedyPigTurnScore = data.turnScore || 0;
        this.gameState.greedyPigGameOver = false;
      }
      
      if (this.gameState.gameMode === 'poker_dice') {
        this.gameState.palmosScores = data.scores || {};
        this.gameState.palmosGameOver = false;
      }
      
      this.showGameHUD();
      this.updateTurnIndicator();
      this.updatePlayersList();
      this.updateCrapsStatus();
      
      // Disable solo game controls
      this.disableSoloControls();
      
      // Reset dice - check if it's our turn
      const isMyTurn = data.currentTurn === wsClient.user?.id;
      
      (window as any).debugLog?.('GAME', `Reconnect - gameMode: ${this.gameState.gameMode}, isMyTurn: ${isMyTurn}`);
      
      // Special handling for Palmo's Dice reconnect
      if (this.gameState.gameMode === 'poker_dice') {
        (window as any).debugLog?.('GAME', `Palmo's Dice reconnect - hasLastFrame: ${!!data.lastFrame}, hasCurrentRound: ${!!data.currentRound}, currentRoundPlayerId: ${data.currentRound?.playerId}, myUserId: ${wsClient.user?.id}`);
        
        if (isMyTurn) {
          // My turn - check if there's a last frame to restore dice positions
          if (data.lastFrame && data.currentRound && data.currentRound.playerId === wsClient.user?.id) {
            (window as any).debugLog?.('GAME', 'Palmo\'s Dice reconnect: Restoring dice from last frame');
            // Restore dice from last frame (positions + rotations)
            this.game.restoreDiceFromFrame(data.lastFrame);
            
            // Restore Palmo's Dice UI state (enable selection, show buttons)
            this.game.enableDiceSelection();
            // Buttons will be shown by updateTurnIndicator() below
            (window as any).debugLog?.('GAME', 'Palmo\'s Dice UI restored: selection enabled');
          } else {
            // No last frame or first roll - dice in hand
            (window as any).debugLog?.('GAME', 'Palmo\'s Dice reconnect: My turn, dice in hand (no lastFrame or currentRound)');
            this.game.onGameStarted(true);
          }
        } else {
          // Not my turn. Two sub-cases:
          //   (a) The current shooter already threw and is sitting on
          //       a reroll-selection screen. The server includes the
          //       shooter's last `throw_frame` as `data.lastFrame` and
          //       `data.currentRound` describes the dice on the table.
          //       Restore those positions so we see the dice on the
          //       table instead of an empty board.
          //   (b) No throw has happened yet this round (or the shooter
          //       is between rounds). Fall back to the existing
          //       "teleport dice to other player's hand" behaviour;
          //       the next `throw_start` replay will reposition them.
          if (data.lastFrame && data.currentRound) {
            (window as any).debugLog?.('GAME', `Palmo's Dice reconnect: Not my turn, restoring shooter ${data.currentRound.playerId} dice from last frame`);
            this.game.restoreDiceFromFrame(data.lastFrame, data.currentRound.playerId);
          } else {
            (window as any).debugLog?.('GAME', `Palmo's Dice reconnect: Not my turn, teleporting to player ${data.currentTurn}`);
            this.game.teleportDiceToNextPlayer(data.currentTurn);
          }

          // If a throw starts, we'll automatically join the replay via throw_start event
        }
      } else {
        // Other game modes - use standard logic
        this.game.onGameStarted(isMyTurn);
      }
      
      // Set throw seed
      if (data.throwSeed !== undefined) {
        this.game.setThrowSeed(data.throwSeed);
      }
    });
    
    // Street Craps result
    wsClient.on('craps_result', (data: any) => {
      this.gameState.phase = data.phase;
      this.gameState.pointValue = data.pointValue;
      
      // Show result message
      this.showCrapsResult(data.message, data.shooterWins);
      this.updateCrapsStatus();
      
      // Reset dice for everyone after delay
      this.resetDiceForNextTurn(800, data.nextTurn);
    });
    
    // Mexico result
    wsClient.on('mexico_result', (data: any) => {
      
      // Update penalties
      if (data.data?.penalties) {
        this.gameState.mexicoPenalties = data.data.penalties;
      }
      
      // Check for game over and store payouts
      if (data.gameOver) {
        this.gameState.mexicoGameOver = true;
        
        // Store payouts if included
        if (data.payouts) {
          this.gameState.payouts = data.payouts;
        }
      }
      
      // Show result
      this.showMexicoResult(data);
      
      // Update HUD with penalties
      this.updatePlayersList();
      
      // Dice stay on table - no animations
    });
    
    // Greedy Pig result
    wsClient.on('greedy_pig_result', (data: any) => {
      
      // If outcome is 'stop', force stop any ongoing replay (player stopped without throwing)
      if (data.outcome === 'stop') {
        const diceSync = this.game.getDiceSync();
        if (diceSync?.isCurrentlyReplaying()) {
          diceSync.stopReplay();
        }
      }
      
      // Update scores
      if (data.data?.scores) {
        this.gameState.greedyPigScores = data.data.scores;
      }
      
      // Update turn score
      this.gameState.greedyPigTurnScore = data.data?.turnScore || 0;
      
      // Update current turn if it changed (pig_out, double_ones, stop)
      if (data.nextTurn !== null && data.nextTurn !== undefined) {
        this.gameState.currentTurn = data.nextTurn;
        this.gameState.turnIndex = this.gameState.playerOrder.indexOf(data.nextTurn);
      }
      
      // Check for game over and payouts
      if (data.gameOver) {
        this.gameState.greedyPigGameOver = true;
        
        // Store payouts if included
        if (data.payouts) {
          this.gameState.payouts = data.payouts;
        }
      }
      
      // Show result
      this.showGreedyPigResult(data);
      
      // Update HUD with scores
      this.updatePlayersList();
      this.updateTurnIndicator();
      
      // Reset dice for everyone after delay
      if (!data.gameOver) {
        (window as any).debugLog?.('DICE', `greedy_pig_result: nextTurn=${data.nextTurn}, outcome=${data.outcome}`);
        this.resetDiceForNextTurn(800, data.nextTurn);
      }
    });
    
    // Palmo's Dice result (from take action)
    wsClient.on('palmos_result', (data: any) => {
      this.handlePalmosResult(data);
    });
    
    // Poker Dice result (from roll - bust or autoTake)
    wsClient.on('poker_dice_result', (data: any) => {
      this.handlePalmosResult(data);
    });
    
    // Palmo's Dice reroll ready (server confirmed reroll selection)
    wsClient.on('palmos_reroll_ready', (data: any) => {
      (window as any).debugLog?.('PALMOS', `Reroll ready: [${data.selectedDice.join(',')}]`);
      
      // Return selected dice to hand for reroll
      this.game.prepareRerollDice(data.selectedDice);
    });
    
    // Palmo's Dice reroll selection (another player selected dice for reroll)
    wsClient.on('palmos_reroll_selection', (data: any) => {
      (window as any).debugLog?.('PALMOS', `Player ${data.playerNickname} selected dice for reroll: [${data.selectedDice.join(',')}]`);
      
      // Skip own selection (we already see it locally)
      if (data.playerId === wsClient.user?.id) return;
      
      // Show which dice the other player selected by highlighting them
      this.game.showOtherPlayerDiceSelection(data.selectedDice);
    });
    
    // Game payouts (betting winnings)
    wsClient.on('game_payouts', (data: any) => {
      this.gameState.payouts = data.payouts;
    });
    
    // Dice rolled by another player (old system - keep for compatibility)
    wsClient.on('dice_rolled', (data: any) => {
      
      // If it's our own roll, don't show it again
      if (data.playerId === wsClient.user?.id) return;
      
      // Show the roll visually (simple version)
      this.showOtherPlayerRoll(data as DiceRollData);
    });
    
    // Streaming throw events
    wsClient.on('throw_start', (data: any) => {
      
      // Skip own throws
      if (data.playerId === wsClient.user?.id) return;
      
      // Clear dice selection highlight when another player starts throwing
      this.game.clearDiceSelection();
      
      const diceSync = this.game.getDiceSync();

      // The server's `throw_start.diceConfig` is the authoritative current
      // config — it reflects `set_player_items` overrides (Yandex Cloud
      // Save) and any DB equip changes that happened after `game_started`
      // was broadcast. The cache we built from `game_started.availableItems`
      // can be stale (e.g. the Yandex client raced to ship
      // `set_player_items` after the host pressed Start, so opponents got a
      // DB-default item in `availableItems` instead of the player's actual
      // skin). Falling back to the stale cache here used to short-circuit
      // the fresh payload via `||`, freezing opponents on the default
      // colours for the whole game. Prefer the server payload and refresh
      // the cache so subsequent `teleportDiceToHand` / Mexico re-renders
      // pick up the correct skin too.
      const diceConfig = data.diceConfig || this.getPlayerDiceConfig(data.playerId) || null;
      if (data.diceConfig) {
        this.gameState.playerDiceConfigs.set(data.playerId, data.diceConfig);
      }

      if (!diceConfig) {
        console.error('[GameSync] CRITICAL: No config for player', data.playerId, 'in throw_start!');
      }
      
      // Start streaming replay with other player's dice config (or null if not found)
      diceSync.startStreamingReplay({
        playerId: data.playerId,
        playerNickname: data.playerNickname,
        throwPower: data.throwPower,
        effectId: data.effectId,
        diceConfig: diceConfig
      });
    });
    
    wsClient.on('throw_frame', (data: any) => {
      // Skip own frames
      if (data.playerId === wsClient.user?.id) return;
      
      // Add frame to streaming replay
      this.game.getDiceSync().addStreamingFrame(data.frame);
    });
    
    wsClient.on('throw_sound', (data: any) => {
      // Skip own sounds
      if (data.playerId === wsClient.user?.id) return;
      
      // Play sound with timestamp for synchronized playback
      this.game.getDiceSync().playStreamingSound(data.soundType, data.velocity, data.time);
    });
    
    wsClient.on('throw_end', (data: any) => {
      
      // Skip own throws
      if (data.playerId === wsClient.user?.id) return;
      
      // End streaming replay
      this.game.getDiceSync().endStreamingReplay({
        dice1: data.finalResult.dice1,
        dice2: data.finalResult.dice2,
        total: data.finalResult.total,
        diceValues: data.finalResult.diceValues
      });
    });
    
    // Synchronized dice throw (old batch system - keep for compatibility)
    wsClient.on('dice_throw_sync', (data: any) => {
      
      // If it's our own throw, don't replay it
      if (data.playerId === wsClient.user?.id) {
        return;
      }
      
      // Check if throwData exists
      if (!data.throwData) {
        console.error('[GameSync] No throwData in message!');
        return;
      }
      
      
      // Replay the throw with full synchronization (old method)
      // this.game.replayPlayerThrow(data.throwData);
    });
    
    // Turn changed
    wsClient.on('turn_changed', (data: any) => {
      this.gameState.currentTurn = data.playerId;
      this.updateTurnIndicator();
      this.updatePlayersList(); // Update player list to show new current turn
      
      // Update throw seed for anti-cheat
      if (data.throwSeed !== undefined) {
        this.game.setThrowSeed(data.throwSeed);
      }
      
      const isMyTurn = data.playerId === wsClient.user?.id;
      
      // Wait for any replay to finish, then reset dice if it's our turn
      this.waitForReplayAndNotify(isMyTurn);
    });
    
    // Turn passed
    wsClient.on('turn_passed', (data: any) => {
      this.showNotification(`${this.getPlayerNickname(data.fromPlayerId)} passed`);
    });
    
    // Game ended (lobby left)
    wsClient.on('lobby_left', () => {
      this.resetToSoloMode();
    });

    // Game ended by other player disconnect
    wsClient.on('game_ended_by_disconnect', () => {
      this.resetToSoloMode();
    });

    // Surface mid-game disconnects to the player still in the lobby. The
    // server broadcasts this whenever an opponent's WebSocket drops while
    // they were still inGame; the Telegram MultiplayerUI shows the same
    // toast (see src/ui/MultiplayerUI.ts) but the Yandex build lazy-mounts
    // its lobby UI so we route the notification through GameSync, which
    // is mounted from `main` in both builds.
    wsClient.on('player_disconnected', (data: any) => {
      if (!data || data.oderId === wsClient.user?.id) return;
      const nickname = this.getPlayerNickname(data.oderId) || data.nickname || 'Игрок';
      this.showNotification(`${nickname} отключился, ожидание переподключения…`);
    });

    // Rematch vote progress. The server broadcasts this after every
    // `restart_game` press so each client can update the "Waiting…"
    // count on its post-game modal.
    wsClient.on('restart_vote_update', (data: any) => {
      if (!data) return;
      const voted = Array.isArray(data.votedPlayerIds) ? data.votedPlayerIds.length : 0;
      const total = typeof data.totalPlayers === 'number' ? data.totalPlayers : 0;
      const btn = document.querySelector<HTMLButtonElement>(
        'button[data-role="rematch"]'
      );
      if (!btn) return;
      const meVoted = Array.isArray(data.votedPlayerIds) && wsClient.user?.id != null
        ? data.votedPlayerIds.includes(wsClient.user.id)
        : false;
      if (meVoted) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'default';
        btn.textContent = total > 0 ? `Waiting… ${voted}/${total}` : 'Waiting…';
      } else {
        btn.textContent = total > 0 ? `New Game (${voted}/${total})` : 'New Game';
      }
    });

    // Rematch could not start (e.g. opponent ran out of pips). Re-enable
    // the New Game button so the player can decide what to do next; the
    // backend has already cleared the vote tally.
    wsClient.on('restart_failed', (data: any) => {
      const btn = document.querySelector<HTMLButtonElement>(
        'button[data-role="rematch"]'
      );
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.textContent = 'New Game';
      }
      const message =
        (data && typeof data.message === 'string' && data.message) ||
        (data?.reason === 'insufficient_pips'
          ? 'Not enough pips for the rematch bet'
          : 'Could not start the rematch');
      this.showNotification(message);
    });

    wsClient.on('player_reconnected', (data: any) => {
      if (!data || data.oderId === wsClient.user?.id) return;
      const nickname = this.getPlayerNickname(data.oderId) || data.nickname || 'Игрок';
      this.showNotification(`${nickname} переподключился`);

      // Server piggy-backs the reconnecting player's equipped items on
      // `player_reconnected` so peers who were already in the lobby
      // (i.e. joined BEFORE this player came back) can fill in the dice
      // / table / effect configs they missed. Without this, after a
      // both-disconnected scenario the first reconnector permanently
      // renders the late arrival's dice in the default skin.
      const incomingItems: any[] = Array.isArray(data.availableItems) ? data.availableItems : [];
      if (incomingItems.length > 0) {
        // Merge items into the lobby's availableItems list (de-duped by id)
        // so any code path that resolves configs through the lobby
        // (e.g. fallback in getPlayerDiceConfig) sees the new entries.
        // `multiplayerUI` lives on the window global (see main.ts) and is
        // not in this module's lexical scope — referencing the bare name
        // here would throw `ReferenceError: multiplayerUI is not defined`
        // and abort the entire reconnect-config sync.
        const multiplayerUI = (window as any).multiplayerUI;
        const lobby = multiplayerUI?.currentLobby;
        if (lobby) {
          if (!Array.isArray(lobby.availableItems)) {
            lobby.availableItems = [];
          }
          const known = new Set<number>(lobby.availableItems.map((i: any) => i.id));
          for (const item of incomingItems) {
            if (!known.has(item.id)) {
              lobby.availableItems.push(item);
              known.add(item.id);
            }
          }

          // Refresh the reconnecting player's equipped slot ids on the
          // lobby snapshot so `getPlayerDiceConfig`'s fallback path
          // (which reads `currentLobby.players[].user.equippedDiceId`)
          // resolves to the freshly-merged catalog entries.
          if (Array.isArray(lobby.players)) {
            const lobbyPlayer = lobby.players.find(
              (p: any) => (p.oderId ?? p.userId) === data.oderId,
            );
            if (lobbyPlayer) {
              if (!lobbyPlayer.user) lobbyPlayer.user = {};
              if (data.equippedDiceId != null) lobbyPlayer.user.equippedDiceId = data.equippedDiceId;
              if (data.equippedTableId != null) lobbyPlayer.user.equippedTableId = data.equippedTableId;
              if (data.equippedEffectId != null) lobbyPlayer.user.equippedEffectId = data.equippedEffectId;
            }
          }
        }

        // Update the per-player dice config cache directly so the next
        // throw uses the correct colours without waiting for any other
        // round-trip.
        if (data.equippedDiceId) {
          const diceConfig = this.getDiceConfigById(data.equippedDiceId, incomingItems);
          if (diceConfig) {
            this.gameState.playerDiceConfigs.set(data.oderId, diceConfig);
            (window as any).debugLog?.('GAME', `Player ${data.oderId} dice config updated on reconnect`);
          }
        }
      }
    });
  }
  
  private resetToSoloMode() {
    
    // Remove any existing result popups
    const existingMexicoPopup = document.querySelector('[data-mexico-result]');
    if (existingMexicoPopup) existingMexicoPopup.remove();
    
    const existingGreedyPigPopup = document.querySelector('[data-greedy-pig-result]');
    if (existingGreedyPigPopup) existingGreedyPigPopup.remove();
    
    const existingPalmosPopup = document.querySelector('[data-palmos-result]');
    if (existingPalmosPopup) existingPalmosPopup.remove();
    
    this.gameState.isInGame = false;
    this.gameState.currentTurn = null;
    this.gameState.playerOrder = [];
    this.gameState.players.clear();
    this.gameState.playerDiceConfigs.clear();
    this.gameState.phase = 'come_out';
    this.gameState.pointValue = null;
    this.gameState.mexicoPenalties = {};
    this.gameState.mexicoGameOver = false;
    this.hideGameHUD();
    this.enableSoloControls();
    
    // Update UI visibility (show boost icon, hide result)
    this.game.updateUIVisibility();
    
    // Clear any throw indicators and restore original dice config
    const diceSync = this.game.getDiceSync();
    if (diceSync) {
      diceSync.clearIndicators();
      diceSync.resetForSoloMode();
    }
    
    // Reset walls to local aspect ratio
    this.game.resetWallsToLocal();
    
    // Restore player's own equipped table
    const tableConfig = wsClient.getEquippedTableConfig();
    if (tableConfig) {
      this.game.updateTableAppearance(tableConfig as any);
    }
    
    // Show wall text in solo mode
    this.game.showWallText(true);
    
    // Reset dice for solo play
    this.game.onTurnChanged(true);
  }
  
  private createGameHUD() {
    this.gameHUD = document.createElement('div');
    this.gameHUD.id = 'game-hud';
    this.gameHUD.style.cssText = `
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.2);
      border-radius: 12px;
      padding: 6px 12px;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: white;
      font-size: 14px;
      display: none;
      z-index: 90;
      text-align: center;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    `;
    
    this.gameHUD.innerHTML = `
      <div id="craps-status" style="margin-bottom: 6px; font-weight: 600; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: none;"></div>
      <div id="turn-indicator" style="margin-bottom: 6px; font-weight: 600; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"></div>
      <div id="players-list" style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 6px; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"></div>
      <div style="display: flex; gap: 8px; justify-content: center;">
        <button id="pass-turn-btn" style="
          padding: 6px 12px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: none;
        ">${t('buttons.pass')}</button>
        <button id="stop-turn-btn" style="
          padding: 6px 12px;
          background: #4CAF50;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: none;
        ">${t('buttons.stop')}</button>
        <button id="palmos-take-btn" style="
          padding: 6px 12px;
          background: #4CAF50;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: none;
        ">${t('buttons.take')}</button>
        <button id="palmos-reroll-btn" style="
          padding: 6px 12px;
          background: #FF9800;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: none;
        ">${t('buttons.reroll')}</button>
      </div>
    `;
    
    document.body.appendChild(this.gameHUD);
    
    this.turnIndicator = document.getElementById('turn-indicator');
    this.playersList = document.getElementById('players-list');
    this.passButton = document.getElementById('pass-turn-btn');
    this.stopButton = document.getElementById('stop-turn-btn');
    this.crapsStatus = document.getElementById('craps-status');
    
    // Palmo's Dice buttons
    const palmosTakeBtn = document.getElementById('palmos-take-btn');
    const palmosRerollBtn = document.getElementById('palmos-reroll-btn');
    
    palmosTakeBtn?.addEventListener('click', () => {
      (window as any).debugLog?.('PALMOS', `Take btn clicked! throwInProgress=${this.isThrowInProgress}`);
      
      // Don't allow Take while throw is in progress
      if (this.isThrowInProgress) {
        (window as any).debugLog?.('PALMOS', 'Take blocked by throwInProgress');
        return;
      }
      
      // Disable button to prevent double-click
      if (palmosTakeBtn) {
        palmosTakeBtn.style.pointerEvents = 'none';
        palmosTakeBtn.style.opacity = '0.5';
      }
      
      // Send take command
      (window as any).debugLog?.('PALMOS', 'Sending take command to server');
      wsClient.palmosTake();
    });
    
    palmosRerollBtn?.addEventListener('click', () => {
      (window as any).debugLog?.('PALMOS', `Reroll btn clicked! throwInProgress=${this.isThrowInProgress}`);
      
      // Don't allow Reroll while throw is in progress
      if (this.isThrowInProgress) {
        (window as any).debugLog?.('PALMOS', 'Reroll blocked by throwInProgress');
        return;
      }
      
      // Get selected dice from game
      const selectedDice = this.game.getSelectedDiceForReroll();
      (window as any).debugLog?.('PALMOS', `Selected dice count: ${selectedDice.length}`);
      
      if (selectedDice.length === 0) {
        (window as any).debugLog?.('PALMOS', 'No dice selected, ignoring reroll');
        return;
      }
      
      // Disable button to prevent double-click
      if (palmosRerollBtn) {
        palmosRerollBtn.style.pointerEvents = 'none';
        palmosRerollBtn.style.opacity = '0.5';
      }
      
      // Send reroll command
      (window as any).debugLog?.('PALMOS', `Sending reroll: [${selectedDice.join(',')}]`);
      wsClient.palmosReroll(selectedDice);
    });
    
    this.passButton?.addEventListener('click', () => {
      // Don't allow Pass while throw is in progress
      if (this.isThrowInProgress) {
        return;
      }
      
      // Only allow Pass while dice are in hand (before throw)
      if (!this.game.isDiceInHand()) {
        return;
      }
      
      // Disable button to prevent double-click
      if (this.passButton) {
        this.passButton.style.pointerEvents = 'none';
        this.passButton.style.opacity = '0.5';
      }
      
      // Mark dice as not in hand
      this.game.setDiceInHand(false);
      
      // Stop recording and send throw_end (with cancelled flag) to notify observers
      const diceSync = this.game.getDiceSync();
      if (diceSync && diceSync.isCurrentlyRecording()) {
        diceSync.stopRecordingStream(false); // false = don't send real result, send cancelled
      }
      
      // Send pass command
      wsClient.passTurn();
    });
    
    this.stopButton?.addEventListener('click', () => {
      
      // Don't allow Stop while throw is in progress
      if (this.isThrowInProgress) {
        return;
      }
      
      // Only allow Stop while dice are in hand (before throw)
      if (!this.game.isDiceInHand()) {
        return;
      }
      
      // Disable button to prevent double-click
      if (this.stopButton) {
        this.stopButton.style.pointerEvents = 'none';
        this.stopButton.style.opacity = '0.5';
      }
      
      // Mark dice as not in hand
      this.game.setDiceInHand(false);
      
      // Stop recording and send throw_end (with cancelled flag) to notify observers
      const diceSync = this.game.getDiceSync();
      if (diceSync && diceSync.isCurrentlyRecording()) {
        diceSync.stopRecordingStream(false); // false = don't send real result, send cancelled
      }
      
      // Send stop command
      wsClient.greedyPigStop();
    });
  }
  
  private showGameHUD() {
    if (this.gameHUD) {
      this.gameHUD.style.display = 'block';
    }
    // Reaction wheel is now opened by clicking result text
  }
  
  private hideGameHUD() {
    if (this.gameHUD) {
      this.gameHUD.style.display = 'none';
    }
    // Reaction wheel is now opened by clicking result text
  }
  
  private updateTurnIndicator() {
    if (!this.turnIndicator) return;
    
    const isMyTurn = this.gameState.currentTurn === wsClient.user?.id;
    
    // Hide turn indicator text - we show players list instead
    this.turnIndicator.style.display = 'none';
    
    // Get buttons
    const palmosTakeBtn = document.getElementById('palmos-take-btn');
    const palmosRerollBtn = document.getElementById('palmos-reroll-btn');
    
    // Show/hide pass button (only for free_roll mode)
    if (isMyTurn && this.gameState.gameMode === 'free_roll' && this.passButton) {
      this.passButton.style.display = 'inline-block';
      // Only enable if throw is not in progress
      if (!this.isThrowInProgress) {
        this.passButton.style.pointerEvents = 'auto';
        this.passButton.style.opacity = '1';
      }
    } else if (this.passButton) {
      this.passButton.style.display = 'none';
    }
    
    // Show/hide stop button (only for greedy_pig mode when it's my turn and I have turn score)
    if (isMyTurn && this.gameState.gameMode === 'greedy_pig' && this.gameState.greedyPigTurnScore > 0 && this.stopButton) {
      this.stopButton.style.display = 'inline-block';
      this.stopButton.textContent = `${t('buttons.stop')} (+${this.gameState.greedyPigTurnScore})`;
      // Only enable if throw is not in progress
      if (!this.isThrowInProgress) {
        this.stopButton.style.pointerEvents = 'auto';
        this.stopButton.style.opacity = '1';
      }
    } else if (this.stopButton) {
      this.stopButton.style.display = 'none';
    }
    
    // Show/hide Palmo's Dice buttons (only for poker_dice mode when it's my turn and dice have been thrown)
    if (isMyTurn && this.gameState.gameMode === 'poker_dice' && !this.game.isDiceInHand() && palmosTakeBtn && palmosRerollBtn) {
      (window as any).debugLog?.('PALMOS', `Showing buttons, throwInProgress=${this.isThrowInProgress}`);
      palmosTakeBtn.style.display = 'inline-block';
      palmosRerollBtn.style.display = 'inline-block';
      
      // Only enable if throw is not in progress
      if (!this.isThrowInProgress) {
        palmosTakeBtn.style.pointerEvents = 'auto';
        palmosTakeBtn.style.opacity = '1';
        palmosRerollBtn.style.pointerEvents = 'auto';
        palmosRerollBtn.style.opacity = '1';
        (window as any).debugLog?.('PALMOS', 'Buttons enabled');
      } else {
        (window as any).debugLog?.('PALMOS', 'Buttons disabled (throw in progress)');
      }
    } else {
      if (palmosTakeBtn) palmosTakeBtn.style.display = 'none';
      if (palmosRerollBtn) palmosRerollBtn.style.display = 'none';
    }
  }
  
  private updateCrapsStatus() {
    if (!this.crapsStatus) return;
    
    if (this.gameState.gameMode === 'street_craps') {
      this.crapsStatus.style.display = 'block';
      
      if (this.gameState.phase === 'come_out') {
        this.crapsStatus.innerHTML = `<span style="color: #FFD700;">COME OUT ROLL</span>`;
      } else {
        this.crapsStatus.innerHTML = `<span style="color: #00BFFF;">POINT: ${this.gameState.pointValue}</span>`;
      }
    } else if (this.gameState.gameMode === 'mexico') {
      this.crapsStatus.style.display = 'block';
      this.crapsStatus.innerHTML = `<span style="color: #FFD700; cursor: pointer;" data-game-rules="mexico">🇲🇽 MEXICO</span>`;
    } else if (this.gameState.gameMode === 'greedy_pig') {
      this.crapsStatus.style.display = 'block';
      this.crapsStatus.innerHTML = `<span style="color: #FF69B4; cursor: pointer;" data-game-rules="greedy_pig">🐷 GREEDY PIG</span>`;
    } else if (this.gameState.gameMode === 'poker_dice') {
      this.crapsStatus.style.display = 'block';
      this.crapsStatus.innerHTML = `<span style="color: #FFD700; cursor: pointer;" data-game-rules="poker_dice">🎲 PALMO'S DICE</span>`;
    } else {
      this.crapsStatus.style.display = 'none';
    }
    
    // Add click handler for game rules
    const rulesSpan = this.crapsStatus.querySelector('[data-game-rules]');
    if (rulesSpan) {
      rulesSpan.addEventListener('click', () => {
        const mode = rulesSpan.getAttribute('data-game-rules');
        if (mode) {
          // Emit event to MultiplayerUI to show rules
          window.dispatchEvent(new CustomEvent('showGameRules', { detail: { mode } }));
        }
      });
    }
  }
  
  private showCrapsResult(message: string, shooterWins: boolean | null) {
    // Get shooter nickname for explicit winner display
    const shooterNickname = this.getPlayerNickname(this.gameState.currentTurn);
    
    // Build message with explicit winner
    let displayMessage = message;
    if (shooterWins === true) {
      displayMessage = `${shooterNickname} ${t('gameResults.wins')} ${message}`;
      
      // Launch confetti if it's me who won
      if (this.gameState.currentTurn === wsClient.user?.id) {
        this.celebrateWinner();
      }
    } else if (shooterWins === false) {
      displayMessage = `${shooterNickname} ${t('gameResults.loses')} ${message}`;
    }
    
    // Get border color with 30% opacity for background
    const borderColor = shooterWins === true ? '#4CAF50' : shooterWins === false ? '#f44336' : '#FFD700';
    const bgColor = shooterWins === true ? 'rgba(76, 175, 80, 0.3)' : shooterWins === false ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255, 215, 0, 0.3)';
    
    const resultEl = document.createElement('div');
    resultEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${bgColor};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 400;
      z-index: 1000;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid ${borderColor};
      max-width: 70vw;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
    `;
    
    resultEl.textContent = displayMessage;
    document.body.appendChild(resultEl);
    
    setTimeout(() => resultEl.remove(), 3000);
  }
  
  private showMexicoResult(data: any) {
    const { scoreName, losers, eliminated } = data.data || {};
    // outcome, winners, gameOver are at top level
    const outcome = data.outcome;
    const winners = data.winners;
    const gameOver = data.gameOver;
    
    
    let message = scoreName || data.message;
    let bgColor = 'rgba(255, 215, 0, 0.3)';
    let borderColor = '#FFD700';
    let showNewGameButton = false;
    
    if (outcome === 'round_end') {
      const loserNames = (losers || []).map((id: number) => this.getPlayerNickname(id)).join(', ');
      message = `${scoreName}\n${loserNames} ${t('gameResults.getsPenalty')}`;
      bgColor = 'rgba(244, 67, 54, 0.3)';
      borderColor = '#f44336';
      
      if (eliminated && eliminated.length > 0) {
        const elimNames = eliminated.map((id: number) => this.getPlayerNickname(id)).join(', ');
        message += `\n${elimNames} ${t('gameResults.eliminated')}`;
      }
    } else if (outcome === 'game_over' || (gameOver && winners && winners.length > 0)) {
      const winnerName = this.getPlayerNickname(winners[0]);
      
      // Check if there's a payout for the winner
      const payout = this.gameState.payouts?.[winners[0]];
      
      if (payout && payout > 0) {
        message = `🏆 ${winnerName} ${t('gameResults.wins')}\n💰 +${payout} pips`;
      } else {
        message = `🏆 ${winnerName} ${t('gameResults.wins')}`;
      }
      
      bgColor = 'rgba(76, 175, 80, 0.3)';
      borderColor = '#4CAF50';
      showNewGameButton = true;
      
      // Запускаем конфетти только для победителя!
      if (winners[0] === wsClient.user?.id) {
        this.celebrateWinner();
      }
    }
    
    const resultEl = document.createElement('div');
    resultEl.setAttribute('data-mexico-result', 'true');
    resultEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${bgColor};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 400;
      z-index: 1000;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid ${borderColor};
      max-width: 70vw;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
      white-space: pre-line;
    `;
    
    resultEl.textContent = message;

    if (showNewGameButton) {
      resultEl.appendChild(this.buildGameOverButtons(resultEl));
    }

    document.body.appendChild(resultEl);

    // Mid-game results auto-dismiss and accept click-to-close. Game-over
    // sticks until the player picks "New Game" / "Exit".
    if (!showNewGameButton) {
      resultEl.style.cursor = 'pointer';
      resultEl.addEventListener('click', () => resultEl.remove());
      setTimeout(() => resultEl.remove(), 3000);
    }
  }
  
  private showGreedyPigResult(data: any) {
    const { outcome, message, gameOver, winners, payouts } = data;
    const { turnScore, scores, bankedScore, newTotal, lostTurnScore, lostTotalScore } = data.data || {};
    
    // Debug logging for payouts
    
    let displayMessage = message;
    let bgColor = 'rgba(255, 215, 0, 0.3)';
    let borderColor = '#FFD700';
    let showNewGameButton = false;
    let autoRemove = true;
    
    if (outcome === 'roll') {
      // Successful roll - show turn score
      const currentTotal = scores?.[data.playerId] || 0;
      displayMessage = `+${data.total}\n${t('gameResults.turn')}: ${turnScore}\n${t('gameResults.total')}: ${currentTotal}`;
      bgColor = 'rgba(76, 175, 80, 0.3)';
      borderColor = '#4CAF50';
    } else if (outcome === 'pig_out') {
      // Single 1 - lost turn score
      displayMessage = `${t('gameResults.pigOut')}\n${t('gameResults.lostTurnPoints', { points: lostTurnScore })}`;
      bgColor = 'rgba(244, 67, 54, 0.3)';
      borderColor = '#f44336';
    } else if (outcome === 'double_ones') {
      // Double 1s - lost everything
      displayMessage = `${t('gameResults.snakeEyes')}\n${t('gameResults.lostEverything', { turnPoints: lostTurnScore, totalPoints: lostTotalScore })}`;
      bgColor = 'rgba(244, 67, 54, 0.5)';
      borderColor = '#f44336';
    } else if (outcome === 'stop') {
      // Player stopped
      displayMessage = `${t('gameResults.banked', { points: bankedScore })}\n${t('gameResults.total')}: ${newTotal}`;
      bgColor = 'rgba(76, 175, 80, 0.3)';
      borderColor = '#4CAF50';
    } else if (outcome === 'game_over' || gameOver) {
      // Game over
      const winnerName = this.getPlayerNickname(winners?.[0]);
      const winnerScore = scores?.[winners?.[0]] || newTotal || 0;
      
      // Check if there's a payout for the winner
      const payout = payouts?.[winners?.[0]];
      
      
      if (payout && payout > 0) {
        displayMessage = `🏆 ${winnerName} ${t('gameResults.wins')}\n${t('gameResults.score')}: ${winnerScore}\n💰 +${payout} pips`;
      } else {
        displayMessage = `🏆 ${winnerName} ${t('gameResults.wins')}\n${t('gameResults.score')}: ${winnerScore}`;
      }
      
      bgColor = 'rgba(76, 175, 80, 0.3)';
      borderColor = '#4CAF50';
      showNewGameButton = true;
      autoRemove = false;
      
      // Запускаем конфетти только для победителя!
      if (winners?.[0] === wsClient.user?.id) {
        this.celebrateWinner();
      }
    }
    
    const resultEl = document.createElement('div');
    resultEl.setAttribute('data-greedy-pig-result', 'true');
    resultEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${bgColor};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 400;
      z-index: 1000;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid ${borderColor};
      max-width: 70vw;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
      white-space: pre-line;
    `;
    
    resultEl.textContent = displayMessage;

    if (showNewGameButton) {
      resultEl.appendChild(this.buildGameOverButtons(resultEl));
    }

    document.body.appendChild(resultEl);

    // Mid-game results auto-dismiss and accept click-to-close. Game-over
    // sticks until the player picks "New Game" / "Exit".
    if (!showNewGameButton) {
      resultEl.style.cursor = 'pointer';
      resultEl.addEventListener('click', () => resultEl.remove());
      if (autoRemove) {
        const delay = outcome === 'roll' ? 1000 : 2500;
        setTimeout(() => resultEl.remove(), delay);
      }
    }

    // Update turn indicator to show/hide Stop button
    this.updateTurnIndicator();
  }
  
  private handlePalmosResult(data: any) {
    // Update scores
    if (data.data?.scores) {
      this.gameState.palmosScores = data.data.scores;
    }
    
    // Update current turn if it changed
    if (data.nextTurn !== null && data.nextTurn !== undefined) {
      this.gameState.currentTurn = data.nextTurn;
      this.gameState.turnIndex = this.gameState.playerOrder.indexOf(data.nextTurn);
    }
    
    // Check for game over and payouts
    if (data.gameOver) {
      this.gameState.palmosGameOver = true;
      
      // Store payouts if included
      if (data.payouts) {
        this.gameState.payouts = data.payouts;
      }
    }
    
    // Show result ONLY for: take action, bust, autoTake, or game over
    const shouldShowResult = data.action === 'take' || data.data?.bust || data.data?.autoTake || data.gameOver;
    if (shouldShowResult) {
      this.showPalmosResult(data);
    }
    
    // Update HUD with scores
    this.updatePlayersList();
    this.updateTurnIndicator();
    
    // Disable dice selection after action
    if (data.action === 'take' || data.data?.bust) {
      this.game.disableDiceSelection();
    }
    
    // Reset dice only if turn changed (take, bust, autoTake) or game over
    const shouldResetDice = data.action === 'take' || data.data?.bust || data.data?.autoTake || data.gameOver;
    if (shouldResetDice && !data.gameOver) {
      setTimeout(() => {
        const nextTurn = data.nextTurn;
        const isMyTurn = nextTurn === wsClient.user?.id;
        
        if (isMyTurn) {
          // My turn - reset to hand
          this.game.setDiceInHand(false);
          this.game.onTurnChanged(true);
        } else {
          // Not my turn - teleport dice to next player
          this.game.teleportDiceToNextPlayer(nextTurn);
        }
      }, 2000);
    }
  }
  
  private showPalmosResult(data: any) {
    const { outcome, message, gameOver, winners, payouts, action } = data;
    const { hand, points, newScore, scores, bust, onesCount, autoTake } = data.data || {};
    
    
    let displayMessage = message;
    let bgColor = 'rgba(255, 215, 0, 0.3)';
    let borderColor = '#FFD700';
    let showNewGameButton = false;
    let autoRemove = true;
    
    if (outcome === 'game_over' || gameOver) {
      // Game over - check this FIRST before other conditions
      const winnerName = this.getPlayerNickname(winners?.[0]);
      const winnerScore = scores?.[winners?.[0]] || newScore || 0;
      
      // Check if there's a payout for the winner
      const payout = payouts?.[winners?.[0]];
      
      
      if (payout && payout > 0) {
        displayMessage = `🏆 ${winnerName} ${t('gameResults.wins')}\n${t('gameResults.score')}: ${winnerScore}\n💰 +${payout} pips`;
      } else {
        displayMessage = `🏆 ${winnerName} ${t('gameResults.wins')}\n${t('gameResults.score')}: ${winnerScore}`;
      }
      
      bgColor = 'rgba(76, 175, 80, 0.3)';
      borderColor = '#4CAF50';
      showNewGameButton = true;
      autoRemove = false;
      
      // Celebrate winner
      if (winners?.[0] === wsClient.user?.id) {
        this.celebrateWinner();
      }
    } else if (bust) {
      // Bust - lost points (from data.bust flag)
      displayMessage = `${t('gameResults.bust')}\n${onesCount} единиц\n-20 очков\n${t('gameResults.total')}: ${newScore}`;
      bgColor = 'rgba(244, 67, 54, 0.3)';
      borderColor = '#f44336';
    } else if (autoTake) {
      // Automatic take after 3rd roll
      displayMessage = `${hand}\n+${points} очков\n${t('gameResults.total')}: ${newScore}`;
      bgColor = 'rgba(76, 175, 80, 0.3)';
      borderColor = '#4CAF50';
    } else if (action === 'take') {
      // Player took points
      displayMessage = `${hand}\n+${points} очков\n${t('gameResults.total')}: ${newScore}`;
      bgColor = 'rgba(76, 175, 80, 0.3)';
      borderColor = '#4CAF50';
    } else if (outcome === 'roll') {
      // Show current hand after roll
      displayMessage = `${hand}\n${points} очков`;
      bgColor = 'rgba(255, 215, 0, 0.3)';
      borderColor = '#FFD700';
    }
    
    const resultEl = document.createElement('div');
    resultEl.setAttribute('data-palmos-result', 'true');
    resultEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${bgColor};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 400;
      z-index: 1000;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid ${borderColor};
      max-width: 70vw;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
      white-space: pre-line;
    `;
    
    resultEl.textContent = displayMessage;

    if (showNewGameButton) {
      resultEl.appendChild(this.buildGameOverButtons(resultEl));
    }

    document.body.appendChild(resultEl);

    // Mid-game results auto-dismiss and accept click-to-close. Game-over
    // sticks until the player picks "New Game" / "Exit".
    if (!showNewGameButton) {
      resultEl.style.cursor = 'pointer';
      resultEl.addEventListener('click', () => resultEl.remove());
      if (autoRemove) {
        const delay = outcome === 'roll' ? 1500 : 2500;
        setTimeout(() => resultEl.remove(), delay);
      }
    }

    // Update turn indicator to show/hide buttons
    this.updateTurnIndicator();
  }
  
  private updatePlayersList() {
    if (!this.playersList) return;
    
    // For Mexico mode, use special layout with penalties
    if (this.gameState.gameMode === 'mexico') {
      this.renderMexicoPlayersList();
      return;
    }
    
    // For Greedy Pig mode, use special layout with scores
    if (this.gameState.gameMode === 'greedy_pig') {
      this.renderGreedyPigPlayersList();
      return;
    }
    
    // For Palmo's Dice mode, use special layout with scores
    if (this.gameState.gameMode === 'poker_dice') {
      this.renderPalmosDicePlayersList();
      return;
    }
    
    // Reset layout to horizontal for non-Mexico modes
    this.playersList.style.flexDirection = 'row';
    this.playersList.style.alignItems = 'center';
    
    const currentTurnIndex = this.gameState.playerOrder.indexOf(this.gameState.currentTurn!);
    const totalPlayers = this.gameState.playerOrder.length;
    
    // Build display list: if more than 3 players, show prev/current/next
    let displayPlayers: { playerId: number; role: 'prev' | 'current' | 'next' | 'other' }[] = [];
    
    if (totalPlayers <= 3) {
      // Show all players
      displayPlayers = this.gameState.playerOrder.map(playerId => ({
        playerId,
        role: playerId === this.gameState.currentTurn ? 'current' as const : 'other' as const
      }));
    } else {
      // Show prev, current, next
      const prevIndex = (currentTurnIndex - 1 + totalPlayers) % totalPlayers;
      const nextIndex = (currentTurnIndex + 1) % totalPlayers;
      
      displayPlayers = [
        { playerId: this.gameState.playerOrder[prevIndex], role: 'prev' as const },
        { playerId: this.gameState.playerOrder[currentTurnIndex], role: 'current' as const },
        { playerId: this.gameState.playerOrder[nextIndex], role: 'next' as const },
      ];
    }
    
    const playersHtml = displayPlayers.map(({ playerId, role }) => {
      const nickname = this.getPlayerNickname(playerId);
      const isCurrentTurn = role === 'current';
      
      return `
        <div style="
          padding: 4px 8px;
          background: ${isCurrentTurn ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
          border-radius: 6px;
          font-size: 12px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          ${isCurrentTurn ? '▶ ' : ''}${nickname}
        </div>
      `;
    }).join('');
    
    this.playersList.innerHTML = playersHtml;
  }
  
  private renderMexicoPlayersList() {
    if (!this.playersList) return;
    
    // If game is over, show all players with final penalties
    if (this.gameState.mexicoGameOver) {
      const playersHtml = this.gameState.playerOrder.map(playerId => {
        const nickname = this.getPlayerNickname(playerId);
        const penalties = this.gameState.mexicoPenalties[playerId] || 0;
        const isWinner = penalties < 5;
        
        // Build lives display - small squares
        const livesDisplay = Array(5).fill(0).map((_, i) => 
          i < penalties ? '▪' : '▫'
        ).join('');
        
        return `
          <div style="
            padding: 3px 6px;
            background: ${isWinner ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
            border-radius: 4px;
            font-size: 11px;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ${isWinner ? 'color: #4CAF50;' : 'color: white;'}
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            ${penalties >= 5 ? 'opacity: 0.5;' : ''}
          ">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${isWinner ? '🏆 ' : ''}${nickname}</span>
            <span style="font-size: 10px; letter-spacing: 2px;">${livesDisplay}</span>
          </div>
        `;
      }).join('');
      
      this.playersList.style.flexDirection = 'column';
      this.playersList.style.alignItems = 'stretch';
      this.playersList.innerHTML = playersHtml;
      return;
    }
    
    // Get active players (not eliminated - penalties < 5)
    const activePlayers = this.gameState.playerOrder.filter(id => 
      (this.gameState.mexicoPenalties[id] || 0) < 5
    );
    
    // If no active players (shouldn't happen), show all
    if (activePlayers.length === 0) {
      this.playersList.innerHTML = '';
      return;
    }
    
    // Build display list: prev, current, next (only from active players)
    let displayPlayers: { playerId: number; role: 'prev' | 'current' | 'next' }[] = [];
    
    if (activePlayers.length <= 3) {
      // Show all active players
      displayPlayers = activePlayers.map(playerId => ({
        playerId,
        role: playerId === this.gameState.currentTurn ? 'current' as const : 
              activePlayers.indexOf(playerId) < activePlayers.indexOf(this.gameState.currentTurn!) ? 'prev' as const : 'next' as const
      }));
    } else {
      // Show prev, current, next
      const currentActiveIndex = activePlayers.indexOf(this.gameState.currentTurn!);
      const prevIndex = (currentActiveIndex - 1 + activePlayers.length) % activePlayers.length;
      const nextIndex = (currentActiveIndex + 1) % activePlayers.length;
      
      displayPlayers = [
        { playerId: activePlayers[prevIndex], role: 'prev' as const },
        { playerId: activePlayers[currentActiveIndex], role: 'current' as const },
        { playerId: activePlayers[nextIndex], role: 'next' as const },
      ];
    }
    
    // Build HTML with penalties on each line
    const playersHtml = displayPlayers.map(({ playerId, role }) => {
      const nickname = this.getPlayerNickname(playerId);
      const isCurrentTurn = role === 'current';
      const penalties = this.gameState.mexicoPenalties[playerId] || 0;
      
      // Build lives display - small squares
      const livesDisplay = Array(5).fill(0).map((_, i) => 
        i < penalties ? '▪' : '▫'
      ).join('');
      
      return `
        <div style="
          padding: 3px 6px;
          background: ${isCurrentTurn ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
          border-radius: 4px;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ${isCurrentTurn ? 'color: #4CAF50;' : 'color: white;'}
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        ">
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${nickname}</span>
          <span style="font-size: 10px; letter-spacing: 2px;">${livesDisplay}</span>
        </div>
      `;
    }).join('');
    
    // Update layout to vertical for Mexico
    this.playersList.style.flexDirection = 'column';
    this.playersList.style.alignItems = 'stretch';
    this.playersList.innerHTML = playersHtml;
  }
  
  private renderGreedyPigPlayersList() {
    if (!this.playersList) return;
    
    // If game is over, show all players with final scores
    if (this.gameState.greedyPigGameOver) {
      // Sort by score descending
      const sortedPlayers = [...this.gameState.playerOrder].sort((a, b) => 
        (this.gameState.greedyPigScores[b] || 0) - (this.gameState.greedyPigScores[a] || 0)
      );
      
      const playersHtml = sortedPlayers.map((playerId, index) => {
        const nickname = this.getPlayerNickname(playerId);
        const score = this.gameState.greedyPigScores[playerId] || 0;
        const isWinner = index === 0;
        
        return `
          <div style="
            padding: 3px 6px;
            background: ${isWinner ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
            border-radius: 4px;
            font-size: 11px;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ${isWinner ? 'color: #4CAF50;' : 'color: white;'}
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          ">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${isWinner ? '🏆 ' : ''}${nickname}</span>
            <span style="font-weight: 600;">${score}</span>
          </div>
        `;
      }).join('');
      
      this.playersList.style.flexDirection = 'column';
      this.playersList.style.alignItems = 'stretch';
      this.playersList.innerHTML = playersHtml;
      return;
    }
    
    // Build display list: prev, current, next
    let displayPlayers: { playerId: number; role: 'prev' | 'current' | 'next' }[] = [];
    const totalPlayers = this.gameState.playerOrder.length;
    const currentTurnIndex = this.gameState.playerOrder.indexOf(this.gameState.currentTurn!);
    
    if (totalPlayers <= 3) {
      // Show all players
      displayPlayers = this.gameState.playerOrder.map(playerId => ({
        playerId,
        role: playerId === this.gameState.currentTurn ? 'current' as const : 
              this.gameState.playerOrder.indexOf(playerId) < currentTurnIndex ? 'prev' as const : 'next' as const
      }));
    } else {
      // Show prev, current, next
      const prevIndex = (currentTurnIndex - 1 + totalPlayers) % totalPlayers;
      const nextIndex = (currentTurnIndex + 1) % totalPlayers;
      
      displayPlayers = [
        { playerId: this.gameState.playerOrder[prevIndex], role: 'prev' as const },
        { playerId: this.gameState.playerOrder[currentTurnIndex], role: 'current' as const },
        { playerId: this.gameState.playerOrder[nextIndex], role: 'next' as const },
      ];
    }
    
    // Build HTML with scores on each line
    const playersHtml = displayPlayers.map(({ playerId, role }) => {
      const nickname = this.getPlayerNickname(playerId);
      const isCurrentTurn = role === 'current';
      const score = this.gameState.greedyPigScores[playerId] || 0;
      
      // Show turn score for current player
      const turnScoreDisplay = isCurrentTurn && this.gameState.greedyPigTurnScore > 0 
        ? ` (+${this.gameState.greedyPigTurnScore})` 
        : '';
      
      return `
        <div style="
          padding: 3px 6px;
          background: ${isCurrentTurn ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
          border-radius: 4px;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ${isCurrentTurn ? 'color: #4CAF50;' : 'color: white;'}
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        ">
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${nickname}</span>
          <span style="font-weight: 600;">${score}${turnScoreDisplay}</span>
        </div>
      `;
    }).join('');
    
    // Update layout to vertical
    this.playersList.style.flexDirection = 'column';
    this.playersList.style.alignItems = 'stretch';
    this.playersList.innerHTML = playersHtml;
  }
  
  private renderPalmosDicePlayersList() {
    if (!this.playersList) return;
    
    // If game is over, show all players with final scores
    if (this.gameState.palmosGameOver) {
      // Sort by score descending
      const sortedPlayers = [...this.gameState.playerOrder].sort((a, b) => 
        (this.gameState.palmosScores?.[b] || 0) - (this.gameState.palmosScores?.[a] || 0)
      );
      
      const playersHtml = sortedPlayers.map((playerId, index) => {
        const nickname = this.getPlayerNickname(playerId);
        const score = this.gameState.palmosScores?.[playerId] || 0;
        const isWinner = index === 0;
        
        return `
          <div style="
            padding: 3px 6px;
            background: ${isWinner ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
            border-radius: 4px;
            font-size: 11px;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ${isWinner ? 'color: #4CAF50;' : 'color: white;'}
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          ">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${isWinner ? '🏆 ' : ''}${nickname}</span>
            <span style="font-weight: 600;">${score}/200</span>
          </div>
        `;
      }).join('');
      
      this.playersList.style.flexDirection = 'column';
      this.playersList.style.alignItems = 'stretch';
      this.playersList.innerHTML = playersHtml;
      return;
    }
    
    // Build display list: prev, current, next
    let displayPlayers: { playerId: number; role: 'prev' | 'current' | 'next' }[] = [];
    const totalPlayers = this.gameState.playerOrder.length;
    const currentTurnIndex = this.gameState.playerOrder.indexOf(this.gameState.currentTurn!);
    
    if (totalPlayers <= 3) {
      // Show all players
      displayPlayers = this.gameState.playerOrder.map(playerId => ({
        playerId,
        role: playerId === this.gameState.currentTurn ? 'current' as const : 
              this.gameState.playerOrder.indexOf(playerId) < currentTurnIndex ? 'prev' as const : 'next' as const
      }));
    } else {
      // Show prev, current, next
      const prevIndex = (currentTurnIndex - 1 + totalPlayers) % totalPlayers;
      const nextIndex = (currentTurnIndex + 1) % totalPlayers;
      
      displayPlayers = [
        { playerId: this.gameState.playerOrder[prevIndex], role: 'prev' as const },
        { playerId: this.gameState.playerOrder[currentTurnIndex], role: 'current' as const },
        { playerId: this.gameState.playerOrder[nextIndex], role: 'next' as const },
      ];
    }
    
    // Build HTML with scores on each line
    const playersHtml = displayPlayers.map(({ playerId, role }) => {
      const nickname = this.getPlayerNickname(playerId);
      const isCurrentTurn = role === 'current';
      const score = this.gameState.palmosScores?.[playerId] || 0;
      
      return `
        <div style="
          padding: 3px 6px;
          background: ${isCurrentTurn ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
          border-radius: 4px;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ${isCurrentTurn ? 'color: #4CAF50;' : 'color: white;'}
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        ">
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${nickname}</span>
          <span style="font-weight: 600;">${score}/200</span>
        </div>
      `;
    }).join('');
    
    // Update layout to vertical
    this.playersList.style.flexDirection = 'column';
    this.playersList.style.alignItems = 'stretch';
    this.playersList.innerHTML = playersHtml;
  }
  
  // Builds the "New Game" (host only) + "Exit" button row attached to a
  // game-over result modal. Same UX in Mexico / Greedy Pig / Palmos: every
  // player can leave the lobby and bounce back to the menu; only the host
  // gets the restart button. Until the user picks one, the modal stays put
  // so the result doesn't auto-dismiss.
  private buildGameOverButtons(resultEl: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.style.cssText = `
      margin-top: 16px;
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    `;

    const baseBtn = `
      padding: 10px 24px;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Every player now sees the "New Game" button; the server collects
    // votes from all current lobby players and only restarts when
    // everyone has agreed (and has enough pips for the current bet).
    // Until then we leave the modal on screen so each side knows what
    // to do — clicking the button just locks it into a "waiting" state.
    const newGameBtn = document.createElement('button');
    newGameBtn.textContent = 'New Game';
    newGameBtn.style.cssText = baseBtn + 'background: #4CAF50;';
    newGameBtn.dataset.role = 'rematch';
    newGameBtn.addEventListener('click', () => {
      if (newGameBtn.disabled) return;
      newGameBtn.disabled = true;
      newGameBtn.textContent = 'Waiting…';
      newGameBtn.style.opacity = '0.7';
      newGameBtn.style.cursor = 'default';
      wsClient.restartGame();
    });
    container.appendChild(newGameBtn);

    const exitBtn = document.createElement('button');
    exitBtn.textContent = 'Exit';
    exitBtn.style.cssText = baseBtn + 'background: rgba(255,255,255,0.15);';
    exitBtn.addEventListener('click', () => {
      resultEl.remove();
      // `lobby_left` listener in setupEventListeners() will call
      // resetToSoloMode() and return the UI to the lobby/menu.
      wsClient.leaveLobby();
    });
    container.appendChild(exitBtn);

    return container;
  }

  private celebrateWinner() {
    // Запускаем конфетти с разных сторон
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Конфетти слева
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Конфетти справа
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }
  
  private getPlayerNickname(playerId: number | null): string {
    if (!playerId) return 'Unknown';
    if (playerId === wsClient.user?.id) return wsClient.user.nickname;
    
    // Get from stored players map
    const nickname = this.gameState.players.get(playerId);
    if (nickname) return nickname;
    
    return `Player${playerId}`;
  }
  
  private showOtherPlayerRoll(data: DiceRollData) {
    // Create a temporary visual indicator
    const rollIndicator = document.createElement('div');
    rollIndicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      z-index: 1000;
      text-align: center;
    `;
    
    // Format result based on game mode
    let resultText: string;
    if (this.gameState.gameMode === 'mexico') {
      const high = Math.max(data.dice1, data.dice2);
      const low = Math.min(data.dice1, data.dice2);
      const score = high * 10 + low;
      resultText = `${data.dice1} + ${data.dice2} = ${score}`;
    } else {
      resultText = `${data.dice1} + ${data.dice2} = ${data.total}`;
    }
    
    rollIndicator.innerHTML = `
      <div style="margin-bottom: 8px;">${data.playerNickname}</div>
      <div style="font-size: 24px;">🎲 ${resultText}</div>
    `;
    
    document.body.appendChild(rollIndicator);
    
    // Remove after 2 seconds
    setTimeout(() => {
      rollIndicator.remove();
    }, 2000);
  }
  
  private disableSoloControls() {
    // Disable the original game's shake detection and controls
    // The game should only respond to multiplayer events now
  }
  
  private enableSoloControls() {
    // Re-enable solo game controls
  }
  
  private showNotification(message: string) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      background: rgba(0,0,0,0.8);
      color: white;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 2000);
  }
  
  // Public methods for the Game class to call
  public onDiceRolled(dice1: number, dice2: number) {
    // Only send if we're in a multiplayer game and it's our turn
    if (!this.gameState.isInGame) return;
    
    const isMyTurn = this.gameState.currentTurn === wsClient.user?.id;
    if (!isMyTurn && this.gameState.gameMode === 'free_roll') {
      return;
    }
    
    // Send roll to server (old system)
    wsClient.rollDice(dice1, dice2);
  }
  
  public onDiceThrown(throwData: any) {
    // Only send if we're in a multiplayer game and it's our turn
    if (!this.gameState.isInGame) return;
    
    const isMyTurn = this.gameState.currentTurn === wsClient.user?.id;
    if (!isMyTurn && this.gameState.gameMode === 'free_roll') {
      return;
    }
    
    // Send synchronized throw data to server
    wsClient.throwDiceSync(throwData);
  }
  
  public isMultiplayerActive(): boolean {
    return this.gameState.isInGame;
  }
  
  public isMyTurn(): boolean {
    return this.gameState.currentTurn === wsClient.user?.id;
  }
  
  public getEquippedDiceId(): number | null {
    return wsClient.user?.equippedDiceId || null;
  }
  
  public getEquippedEffectId(): number | null {
    return wsClient.user?.equippedEffectId || null;
  }
  
  public getGameMode(): string {
    return this.gameState.gameMode;
  }
  
  // Get dice config for a specific player (preloaded or from lobby).
  // Public so Game can re-skin the dice when teleporting them to the
  // active player's slot on reconnect / turn change.
  public getPlayerDiceConfig(playerId: number): any | null {
    (window as any).debugLog?.('DICE', `getPlayerDiceConfig(${playerId}) called`);
    
    // First try preloaded config (faster)
    const preloaded = this.gameState.playerDiceConfigs.get(playerId);
    if (preloaded) {
      (window as any).debugLog?.('DICE', `Found preloaded config for player ${playerId}`);
      return preloaded;
    }
    
    (window as any).debugLog?.('DICE', `No preloaded config for player ${playerId}, trying fallback`);
    (window as any).debugLog?.('DICE', `Preloaded configs available:`, Array.from(this.gameState.playerDiceConfigs.keys()));
    
    // Fallback: try to get from lobby data (stored in MultiplayerUI)
    const multiplayerUI = (window as any).multiplayerUI;
    if (multiplayerUI?.currentLobby?.players) {
      const player = multiplayerUI.currentLobby.players.find((p: any) => 
        (p.oderId || p.userId) === playerId
      );
      
      if (player) {
        const equippedDiceId = player.equippedDiceId || player.user?.equippedDiceId;
        (window as any).debugLog?.('DICE', `Player ${playerId} equippedDiceId: ${equippedDiceId}`);
        
        if (equippedDiceId) {
          // Try to get from availableItems first
          if (multiplayerUI.currentLobby.availableItems) {
            const diceConfig = this.getDiceConfigById(equippedDiceId, multiplayerUI.currentLobby.availableItems);
            if (diceConfig) {
              // Cache it for next time
              this.gameState.playerDiceConfigs.set(playerId, diceConfig);
              return diceConfig;
            }
          }
          
          // Fallback to inventory
          const diceItem = wsClient.inventory.find(
            (item: any) => item.type === 'dice' && item.id === equippedDiceId
          );
          
          if (diceItem?.config) {
            // Cache it for next time
            this.gameState.playerDiceConfigs.set(playerId, diceItem.config);
            return diceItem.config;
          }
        } else {
          (window as any).debugLog?.('DICE', `Player ${playerId} has no equippedDiceId`);
        }
      } else {
        (window as any).debugLog?.('DICE', `Player ${playerId} not found in lobby players`);
      }
    } else {
      (window as any).debugLog?.('DICE', `No multiplayerUI or currentLobby available`);
    }
    
    (window as any).debugLog?.('DICE', `No config found for player ${playerId}`);
    return null;
  }
  
  // Block Stop/Pass buttons during throw
  public setThrowInProgress(inProgress: boolean) {
    (window as any).debugLog?.('PALMOS', `setThrowInProgress: ${inProgress}`);
    this.isThrowInProgress = inProgress;
    
    // Update button visual state
    if (this.stopButton) {
      if (inProgress) {
        this.stopButton.style.pointerEvents = 'none';
        this.stopButton.style.opacity = '0.5';
      } else {
        this.stopButton.style.pointerEvents = 'auto';
        this.stopButton.style.opacity = '1';
      }
    }
    if (this.passButton) {
      if (inProgress) {
        this.passButton.style.pointerEvents = 'none';
        this.passButton.style.opacity = '0.5';
      } else {
        this.passButton.style.pointerEvents = 'auto';
        this.passButton.style.opacity = '1';
      }
    }
    
    // Update Palmo's Dice buttons
    const palmosTakeBtn = document.getElementById('palmos-take-btn');
    const palmosRerollBtn = document.getElementById('palmos-reroll-btn');
    
    if (palmosTakeBtn) {
      if (inProgress) {
        palmosTakeBtn.style.pointerEvents = 'none';
        palmosTakeBtn.style.opacity = '0.5';
      } else {
        palmosTakeBtn.style.pointerEvents = 'auto';
        palmosTakeBtn.style.opacity = '1';
      }
    }
    if (palmosRerollBtn) {
      if (inProgress) {
        palmosRerollBtn.style.pointerEvents = 'none';
        palmosRerollBtn.style.opacity = '0.5';
      } else {
        palmosRerollBtn.style.pointerEvents = 'auto';
        palmosRerollBtn.style.opacity = '1';
      }
    }
  }
  
  // Wait for replay to finish before notifying game about turn change
  // Track timeout to cancel it if needed
  private replayWaitTimeoutId: number | null = null;
  private replayWaitIntervalId: number | null = null;
  
  
  // Helper to get dice config by ID from available items
  private getDiceConfigById(diceId: number, availableItems?: any[]): any | null {
    if (!availableItems) return null;
    
    const diceItem = availableItems.find(
      item => item.type === 'dice' && item.id === diceId
    );
    
    if (!diceItem?.config) return null;
    
    // Build the config by copying only properties that are actually
    // defined. We used to enumerate every supported field explicitly
    // here, which meant fields the preset omits (e.g. classic_white has
    // no `opacity` or `dotShape`) ended up as `opacity: undefined` in
    // the returned object. When that config is later merged into the
    // dice's `{ ...DEFAULT_CONFIG, ...config }`, the spread overwrites
    // the defaults with `undefined`, producing THREE warnings and
    // visually wrong dice (which appears to the user as "other
    // players' textures don't show up").
    const result: Record<string, unknown> = {
      baseColor: diceItem.config.baseColor || '#e5e5d7',
      dotColor: diceItem.config.dotColor || '#383838',
      borderColor: diceItem.config.borderColor || '#e5e5d7',
    };
    const passthrough = [
      'roughness',
      'metalness',
      'clearcoat',
      'clearcoatRoughness',
      'opacity',
      'dotSize',
      'dotShape',
      'dotDepth',
      'bevelRadius',
    ];
    for (const key of passthrough) {
      if (diceItem.config[key] !== undefined) {
        result[key] = diceItem.config[key];
      }
    }
    return result;
  }
  
  private waitForReplayAndNotify(isMyTurn: boolean) {
    const diceSync = this.game.getDiceSync();
    
    // Cancel any previous wait
    if (this.replayWaitTimeoutId) {
      clearTimeout(this.replayWaitTimeoutId);
      this.replayWaitTimeoutId = null;
    }
    if (this.replayWaitIntervalId) {
      clearInterval(this.replayWaitIntervalId);
      this.replayWaitIntervalId = null;
    }
    
    // Only wait for replay to finish
    const isReplaying = diceSync.isCurrentlyReplaying();
    
    if (isReplaying) {
      
      // Check every 100ms if replay is done
      this.replayWaitIntervalId = window.setInterval(() => {
        if (!diceSync.isCurrentlyReplaying()) {
          if (this.replayWaitIntervalId) {
            clearInterval(this.replayWaitIntervalId);
            this.replayWaitIntervalId = null;
          }
          if (this.replayWaitTimeoutId) {
            clearTimeout(this.replayWaitTimeoutId);
            this.replayWaitTimeoutId = null;
          }
          
          
          // Use universal reset method (will be skipped if already scheduled from game result)
          this.resetDiceForNextTurn(800);
        }
      }, 100);
      
      // Safety timeout - force notify after 5 seconds max
      this.replayWaitTimeoutId = window.setTimeout(() => {
        if (this.replayWaitIntervalId) {
          clearInterval(this.replayWaitIntervalId);
          this.replayWaitIntervalId = null;
        }
        this.replayWaitTimeoutId = null;
        this.resetDiceForNextTurn(800);
      }, 5000);
    } else {
      // Not replaying - immediately reset
      this.resetDiceForNextTurn(800);
    }
  }
  
  // Universal method to reset dice after any throw result
  private resetDiceForNextTurn(delay: number = 800, nextTurnOverride?: number | null) {
    // Prevent double reset
    if (this.diceResetScheduled) {
      (window as any).debugLog?.('DICE', 'Reset already scheduled, skipping duplicate');
      return;
    }
    
    // For Palmo's Dice, don't reset dice to hand - they stay on table for selection
    if (this.gameState.gameMode === 'poker_dice') {
      return;
    }
    
    this.diceResetScheduled = true;
    
    setTimeout(() => {
      this.diceResetScheduled = false; // Clear flag after execution
      
      // If nextTurn is null, it means same player continues (use current turn)
      // If nextTurn is a number, turn passed to that player
      const nextTurn = nextTurnOverride === null ? this.gameState.currentTurn : 
                       nextTurnOverride !== undefined ? nextTurnOverride : 
                       this.gameState.currentTurn;
      const isMyTurn = nextTurn === wsClient.user?.id;
      
      // Determine if this is a fast consecutive throw (same player in Greedy Pig)
      // Fast throw = same player continues (nextTurn === currentTurn)
      // Note: currentTurn is already updated in greedy_pig_result handler
      const isFastThrow = this.gameState.gameMode === 'greedy_pig' && 
                          nextTurnOverride === null; // null means same player continues
      
      (window as any).debugLog?.('DICE', `resetDiceForNextTurn: isMyTurn=${isMyTurn}, nextTurn=${nextTurn}, currentTurn=${this.gameState.currentTurn}, override=${nextTurnOverride}, fastThrow=${isFastThrow}`);
      
      if (isMyTurn) {
        // My turn - enable physics with my dice config
        (window as any).debugLog?.('DICE', 'My turn - resetting dice to hand');
        this.game.setDiceInHand(false);
        this.game.onTurnChanged(true);
      } else {
        // Not my turn - teleport with current player's dice config
        const diceSync = this.game.getDiceSync();
        if (diceSync) {
          const handPositions = this.game.getHandPositions();
          
          // Get current player's preloaded dice config
          const currentPlayerConfig = nextTurn ? this.getPlayerDiceConfig(nextTurn) : null;
          
          (window as any).debugLog?.('DICE', `Teleporting with player ${nextTurn} config:`, currentPlayerConfig ? 'found' : 'null');
          
          // CRITICAL: If config is null, we MUST NOT teleport - it will show wrong dice!
          // This should never happen if server sends availableItems correctly
          if (!currentPlayerConfig) {
            console.error('[GameSync] CRITICAL: No config found for player', nextTurn, '- skipping teleport!');
            console.error('[GameSync] Preloaded configs:', Array.from(this.gameState.playerDiceConfigs.keys()));
            console.error('[GameSync] Player order:', this.gameState.playerOrder);
            // Don't teleport - keep dice where they are
            return;
          }
          
          // Teleport with animation (skip animation for fast consecutive throws)
          diceSync.teleportDiceToHand(handPositions, currentPlayerConfig, !isFastThrow);
        }
      }
    }, delay);
  }
  
  // Helper method to get dice count for a game mode
  private getDiceCountForMode(gameMode: string): number {
    switch (gameMode) {
      case 'poker_dice':
        return 5;
      case 'free_roll':
      case 'street_craps':
      case 'mexico':
      case 'greedy_pig':
      default:
        return 2;
    }
  }
}
