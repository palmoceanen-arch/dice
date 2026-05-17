// DiceSync - Simplified version 2.0 - No animations, only teleportation
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import type { Dice, DiceConfig } from '../game/Dice';
import type { AudioManager } from '../game/AudioManager';
import { wsClient } from './WebSocketClient';

interface DiceFrame {
  position: [number, number, number];
  quaternion: [number, number, number, number];
  time: number; // Time offset from start in ms
}

interface StreamingThrowData {
  playerId: number;
  playerNickname: string;
  throwPower: number;
  effectId: number | null;
  diceConfig: DiceConfig | null;
  selectedDice?: number[]; // Indices of dice selected for reroll (Palmo's Dice)
}

// Haptic feedback helper
function triggerHaptic(style: 'light' | 'medium' | 'heavy') {
  if (typeof window !== 'undefined' && 
      window.Telegram?.WebApp?.HapticFeedback && 
      typeof window.Telegram.WebApp.HapticFeedback.impactOccurred === 'function') {
    try {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
    } catch {
      // Ignore errors
    }
  }
}

// Spherical linear interpolation for quaternions (optimized - reuse objects)
const _quat1 = new THREE.Quaternion();
const _quat2 = new THREE.Quaternion();

function slerpQuaternion(
  q1: [number, number, number, number],
  q2: [number, number, number, number],
  t: number
): [number, number, number, number] {
  _quat1.set(q1[0], q1[1], q1[2], q1[3]);
  _quat2.set(q2[0], q2[1], q2[2], q2[3]);
  _quat1.slerp(_quat2, t);
  return [_quat1.x, _quat1.y, _quat1.z, _quat1.w];
}

// Linear interpolation for positions
function lerpPosition(
  p1: [number, number, number],
  p2: [number, number, number],
  t: number
): [number, number, number] {
  return [
    p1[0] + (p2[0] - p1[0]) * t,
    p1[1] + (p2[1] - p1[1]) * t,
    p1[2] + (p2[2] - p1[2]) * t,
  ];
}

export class DiceSync {
  private dice: Dice[];
  private audio: AudioManager;
  private game: any; // Reference to Game instance
  private getGameMode: () => string;
  private originalDiceConfig: DiceConfig | null = null; // Store original config to restore after replay
  private colorChangeLocked = false; // Prevent color changes during replay
  private lastAppliedReplayConfig: DiceConfig | null = null; // Cache last applied replay config to avoid redundant updates
  
  // Recording state (streaming mode)
  private isRecording = false;
  private recordInterval: number | null = null;
  private recordStartTime = 0;
  
  // Replay state (streaming mode)
  private isReplaying = false;
  private replayStartTime = 0;
  private replayReceivedTime = 0; // When throw_start was received
  private replayAnimationId: number | null = null;
  private streamingFrames: DiceFrame[][] = []; // Array of frame arrays, one per die
  private streamingData: StreamingThrowData | null = null;
  private streamEnded = false;
  private finalResult: { dice1: number; dice2: number; total: number; diceValues?: number[] } | null = null;
  
  // Sound events buffer for synchronized playback
  private soundEvents: Array<{ type: 'dice_hit' | 'table_hit'; velocity: number; time: number }> = [];
  private lastPlayedSoundIndex = -1;
  
  // Callback when replay finishes
  private onReplayFinished: (() => void) | null = null;

  constructor(dice: Dice[], audio: AudioManager, _scene: THREE.Scene, _world: CANNON.World, getGameMode?: () => string, game?: any) {
    this.dice = dice;
    this.audio = audio;
    this.game = game;
    this.getGameMode = getGameMode || (() => 'free_roll');
  }
  
  // Cancel any ongoing animations (simplified - no more complex animation states)
  public cancelAnimations() {
    // Nothing to cancel anymore - we removed all complex animations
  }
  
  // Set callback for when replay finishes
  setOnReplayFinished(callback: (() => void) | null) {
    this.onReplayFinished = callback;
  }
  
  // Set original dice config (called from Game when player's dice style is set)
  setOriginalDiceConfig(config: DiceConfig) {
    this.originalDiceConfig = config;
  }
  
  // Get original dice config
  getOriginalDiceConfig(): DiceConfig | null {
    return this.originalDiceConfig;
  }
  
  // Check if color changes are allowed (not during replay)
  isColorChangeLocked(): boolean {
    return this.colorChangeLocked;
  }
  
  // Restore original dice config (called when not our turn after replay)
  restoreOriginalDiceConfig() {
    if (this.originalDiceConfig) {
      this.dice.forEach(dice => dice.updateConfig(this.originalDiceConfig!));
    }
  }
  
  // Reset state when leaving game (unlock colors, restore original config)
  resetForSoloMode() {
    // Stop recording if active
    if (this.isRecording) {
      this.isRecording = false;
      if (this.recordInterval) {
        clearInterval(this.recordInterval);
        this.recordInterval = null;
      }
    }
    
    this.colorChangeLocked = false;
    this.isReplaying = false;
    this.lastAppliedReplayConfig = null; // Clear cache
    
    // Reset dice count to 2 for solo mode BEFORE restoring config
    if (this.game) {
      this.game.setDiceCount(2);
    }
    
    // Now restore original dice config (after dice count is correct)
    this.restoreOriginalDiceConfig();
  }
  
  // Preload dice config (apply config while dice are off screen)
  // This is called BEFORE entrance animation to avoid lag when dice appear
  preloadDiceConfig(config: DiceConfig) {
    const startTime = performance.now();
    const configStr = JSON.stringify(config);
    const lastConfigStr = this.lastAppliedReplayConfig ? JSON.stringify(this.lastAppliedReplayConfig) : null;
    
    if (configStr !== lastConfigStr) {
      this.dice.forEach(dice => dice.updateConfig(config));
      this.lastAppliedReplayConfig = config;
      const elapsed = performance.now() - startTime;
      (window as any).debugLog?.('PERF', `Preload config: ${elapsed.toFixed(1)}ms`);
    } else {
      (window as any).debugLog?.('PERF', 'Config cached, skipped');
    }
  }

  // Start recording and streaming frames
  startRecordingStream(throwPower: number, effectId: number | null, selectedDice?: number[]) {
    if (this.isRecording) return;
    
    (window as any).debugLog?.('STREAM', 'Recording started');
    
    this.isRecording = true;
    this.colorChangeLocked = false; // Unlock color changes when we're throwing
    this.recordStartTime = Date.now();
    
    // Send throw_start to server with selected dice info
    wsClient.throwStart(throwPower, effectId, selectedDice);
    
    // Stream keyframes at 15fps (every 66ms) - reduced from 20fps for better performance
    this.recordInterval = window.setInterval(() => {
      this.recordAndStreamFrame();
    }, 66);
    
    // Record first frame immediately
    this.recordAndStreamFrame();
  }
  
  // Record and stream sound event (called from Game.ts collision handler)
  recordSoundEvent(type: 'dice_hit' | 'table_hit', velocity: number) {
    if (!this.isRecording) return;
    
    // Calculate time offset from recording start (same as frame times)
    const time = Date.now() - this.recordStartTime;
    
    // Stream sound with timestamp for synchronized playback
    wsClient.throwSound(type, velocity, time);
  }
  
  // Record and stream current frame - optimized to send all dice in one packet
  private recordAndStreamFrame() {
    if (!this.isRecording) return;
    
    const time = Date.now() - this.recordStartTime;
    
    // Build frame for all dice
    const diceFrames: DiceFrame[] = this.dice.map(dice => ({
      position: [dice.body.position.x, dice.body.position.y, dice.body.position.z] as [number, number, number],
      quaternion: [dice.body.quaternion.x, dice.body.quaternion.y, dice.body.quaternion.z, dice.body.quaternion.w] as [number, number, number, number],
      time
    }));
    
    // Stream all dice in one packet (optimized)
    try {
      wsClient.throwFrame({ diceFrames, time });
    } catch (err) {
      console.error('[DiceSync] Error streaming frame:', err);
    }
  }
  
  // Stop recording and send final result with backup data
  stopRecordingStream(sendThrowEnd: boolean = true): { dice1: number; dice2: number; total: number } {
    
    this.isRecording = false;
    if (this.recordInterval) {
      clearInterval(this.recordInterval);
      this.recordInterval = null;
    }
    
    // Record final frame
    this.recordAndStreamFrame();
    
    // Get final dice values (support variable number of dice)
    const diceValues = this.dice.map(d => d.getTopFace());
    const dice1Value = diceValues[0] || 0;
    const dice2Value = diceValues[1] || 0;
    const total = diceValues.reduce((sum, val) => sum + val, 0);
    
    (window as any).debugLog?.('STREAM', `Recording stopped, sent frames, result: ${diceValues.join('+')}=${total}`);
    
    // Send throw_end only if requested (not for Stop/Pass)
    if (sendThrowEnd) {
      wsClient.throwEnd({ 
        dice1: dice1Value, 
        dice2: dice2Value, 
        total,
        diceValues: diceValues // Always send all dice values
      });
    }
    // Otherwise: don't send throw_end for Stop/Pass — observers will stop
    // replay when they get greedy_pig_result.
    
    return { dice1: dice1Value, dice2: dice2Value, total, diceValues };
  }

  // Start streaming replay when throw_start received
  startStreamingReplay(data: StreamingThrowData) {
    if (this.isReplaying) {
      console.warn('[DiceSync] Already replaying, force-finishing current replay');
      (window as any).debugLog?.('STREAM', 'Force finishing current replay');
      this.finishStreamingReplay();
    }
    
    const startTime = performance.now();
    
    this.isReplaying = true;
    this.colorChangeLocked = true; // Lock color changes during replay
    this.replayStartTime = 0; // Will be set when we have enough frames
    this.replayReceivedTime = Date.now(); // Record when throw_start was received
    
    // Initialize frame arrays for each die
    this.streamingFrames = this.dice.map(() => []);
    
    this.streamingData = data;
    this.streamEnded = false;
    this.finalResult = null;
    this.soundEvents = [];
    this.lastPlayedSoundIndex = -1;
    
    // Reset frame index cache for optimization
    this.lastFrameIndices = this.dice.map(() => 0);
    
    (window as any).debugLog?.('STREAM', `Replay started for player ${data.playerId}`);
    
    // Apply dice config (skip if identical to the cached one).
    if (data.diceConfig) {
      const configStr = JSON.stringify(data.diceConfig);
      const lastConfigStr = this.lastAppliedReplayConfig ? JSON.stringify(this.lastAppliedReplayConfig) : null;
      
      if (configStr !== lastConfigStr) {
        this.dice.forEach(dice => dice.updateConfig(data.diceConfig!));
        this.lastAppliedReplayConfig = data.diceConfig;
      }
    }
    
    // Show player name indicator
    this.showPlayerIndicator(data.playerNickname);
    
    // Play initial throw effect
    if (data.throwPower > 0.7) {
      triggerHaptic('heavy');
    } else if (data.throwPower > 0.4) {
      triggerHaptic('medium');
    } else {
      triggerHaptic('light');
    }
    
    // Set physics for dice during replay - all KINEMATIC.
    this.dice.forEach(dice => {
      dice.body.type = CANNON.Body.KINEMATIC;
    });
    
    // DON'T teleport dice to hand here - let the first frame position them.
    // This prevents the "jump" effect where dice teleport to hand then back
    // to their actual position.
    
    // Don't start replay timer yet - wait for first frames. Timer will be
    // set when we have enough frames in animateStreamingReplay.
    this.replayStartTime = 0;
    
    const totalTime = performance.now() - startTime;
    (window as any).debugLog?.('PERF', `Replay start: ${totalTime.toFixed(1)}ms`);
    
    // Start animation loop
    this.animateStreamingReplay();
  }
  
  // Add frame to streaming replay - optimized to receive all dice in one packet
  addStreamingFrame(frame: { diceFrames: DiceFrame[]; time: number }) {
    if (!this.isReplaying) return;
    
    // Add each die's frame to its respective array
    frame.diceFrames.forEach((diceFrame, index) => {
      if (index < this.streamingFrames.length) {
        this.streamingFrames[index].push(diceFrame);
      }
    });
    
    // Log frame reception rate
    const totalFrames = this.streamingFrames[0]?.length || 0;
    if (totalFrames % 10 === 0 && totalFrames > 0) {
      const elapsed = Date.now() - this.replayStartTime;
      if (elapsed > 0) {
        const fps = (totalFrames / elapsed) * 1000;
        (window as any).debugLog?.('STREAM', `Received ${totalFrames} frames, avg ${fps.toFixed(1)} FPS`);
      }
    }
  }
  
  // Play streamed sound - buffer it for synchronized playback
  playStreamingSound(type: 'dice_hit' | 'table_hit', velocity: number, soundTime: number) {
    if (!this.isReplaying) return;
    
    // soundTime is already relative to throw start (same as frame times)
    // Just store it directly - no need to calculate wall clock time
    this.soundEvents.push({ type, velocity, time: soundTime });
    
  }
  
  // End streaming replay
  endStreamingReplay(data: { 
    dice1: number; 
    dice2: number; 
    total: number;
    diceValues?: number[];
  }) {
    if (!this.isReplaying) return;
    
    const totalFrames = this.streamingFrames.reduce((sum, frames) => sum + frames.length, 0);
    (window as any).debugLog?.('STREAM', `Stream ended, ${totalFrames} frames received`);
    
    // If we haven't started playback yet and have no frames, this is a problem
    if (this.replayStartTime === 0 && totalFrames === 0) {
      console.error('[DiceSync] CRITICAL: Stream ended but no frames received!');
      (window as any).debugLog?.('STREAM', 'ERROR: No frames received!');
      // Force finish to avoid stuck state
      this.finishStreamingReplay();
      return;
    }
    
    this.streamEnded = true;
    this.finalResult = { 
      dice1: data.dice1, 
      dice2: data.dice2, 
      total: data.total,
      diceValues: data.diceValues 
    };
  }
  
  // Animation loop for streaming replay with buffering for high refresh rate displays
  private animateStreamingReplay() {
    if (!this.isReplaying) return;
    
    // Wait for initial frames before starting playback
    const frameCount = Math.min(...this.streamingFrames.map(frames => frames.length));
    const waitTime = Date.now() - this.replayReceivedTime;
    
    // Start playback if:
    // 1. We have at least 3 frames, OR
    // 2. We've been waiting more than 500ms (network is slow, start with what we have)
    const shouldStart = frameCount >= 3 || waitTime > 500;
    
    if (!shouldStart) {
      // Not enough frames yet and haven't waited long enough, keep waiting
      this.replayAnimationId = requestAnimationFrame(() => this.animateStreamingReplay());
      return;
    }
    
    // Start timer on first frame batch. Align replayStartTime with the
    // first received frame's `time`. Frames are timestamped relative to
    // the original throw start (e.g. ms since recordStartTime on the
    // thrower's side). For a normal replay the first frame has time ≈ 0
    // so this is equivalent to `Date.now()`. For a mid-throw reconnect
    // the first received frame can have time = 2000+, and without the
    // shift `playbackTime` (=elapsed - bufferDelay) sits at 0 while the
    // earliest frame is at 2000, leaving the dice frozen at one position
    // for several seconds until elapsed catches up. Shifting the start
    // back by `firstFrameTime` lets the replay jump straight to the
    // live point of the throw.
    if (this.replayStartTime === 0) {
      let firstFrameTime = 0;
      for (const frames of this.streamingFrames) {
        if (frames.length > 0) {
          const t = frames[0].time;
          if (firstFrameTime === 0 || t < firstFrameTime) {
            firstFrameTime = t;
          }
        }
      }
      this.replayStartTime = Date.now() - firstFrameTime;
      // Sounds whose `time` is older than the first received frame come
      // from before we joined the throw — mark them as already-played so
      // we don't fire them all at once when playback starts.
      if (firstFrameTime > 0) {
        let skipUpTo = -1;
        for (let i = 0; i < this.soundEvents.length; i++) {
          if (this.soundEvents[i].time < firstFrameTime) {
            skipUpTo = i;
          } else {
            break;
          }
        }
        this.lastPlayedSoundIndex = skipUpTo;
      }
      (window as any).debugLog?.('STREAM', `Playback started: ${frameCount} frames, ${this.soundEvents.length} sounds, after ${waitTime}ms, offset=${firstFrameTime}ms`);
    }
    
    const now = Date.now();
    const elapsed = now - this.replayStartTime;
    
    // Adaptive buffer based on frame availability and reception speed
    const avgFps = frameCount / (elapsed / 1000);
    let bufferDelay: number;
    
    if (avgFps < 15) {
      bufferDelay = 50;
    } else if (frameCount < 10) {
      bufferDelay = 150;
    } else if (frameCount < 20) {
      bufferDelay = 100;
    } else {
      bufferDelay = 50;
    }
    
    const playbackTime = Math.max(0, elapsed - bufferDelay);
    
    // Interpolate each dice if we have frames
    this.dice.forEach((dice, index) => {
      if (this.streamingFrames[index] && this.streamingFrames[index].length > 0) {
        this.interpolateDice(index, this.streamingFrames[index], playbackTime);
      }
    });
    
    // Play sounds that should have happened by now (synchronized with playback time)
    this.playSoundsUpToTime(playbackTime);
    
    // Check if we should finish
    if (this.streamEnded) {
      const maxTime = Math.max(...this.streamingFrames.map(frames => 
        frames.length > 0 ? frames[frames.length - 1].time : 0
      ));
      
      // Wait until we've played all frames plus buffer
      if (elapsed >= maxTime + 200) {
        // Finished
        this.finishStreamingReplay();
        return;
      }
    }
    
    this.replayAnimationId = requestAnimationFrame(() => this.animateStreamingReplay());
  }
  
  // Play all sounds up to current playback time (synchronized with visual)
  private playSoundsUpToTime(currentTime: number) {
    // Find all sounds that should have played by now
    for (let i = this.lastPlayedSoundIndex + 1; i < this.soundEvents.length; i++) {
      const sound = this.soundEvents[i];
      
      // If sound time is in the past (accounting for buffer), play it
      if (sound.time <= currentTime) {
        if (sound.type === 'dice_hit') {
          this.audio.playDiceHit(sound.velocity);
          if (sound.velocity > 1) triggerHaptic('light');
        } else {
          this.audio.playTableHit(sound.velocity);
          if (sound.velocity > 5) {
            triggerHaptic('heavy');
          } else if (sound.velocity > 2) {
            triggerHaptic('medium');
          } else if (sound.velocity > 0.5) {
            triggerHaptic('light');
          }
        }
        
        this.lastPlayedSoundIndex = i;
      } else {
        // Sounds are chronological, so we can stop here
        break;
      }
    }
  }
  
  // Cached frame indices for optimization
  private lastFrameIndices: number[] = [];
  
  // Find keyframes and interpolate position/rotation with smooth extrapolation
  private interpolateDice(diceIndex: number, frames: DiceFrame[], currentTime: number) {
    if (frames.length === 0) return;
    
    // Start search from last known index (frames are chronological)
    const lastIndex = this.lastFrameIndices[diceIndex] || 0;
    let frameA = frames[0];
    let frameB = frames[0];
    let foundIndex = 0;
    
    // Optimized search: start from last known position
    for (let i = Math.max(0, lastIndex - 1); i < frames.length - 1; i++) {
      if (frames[i].time <= currentTime && frames[i + 1].time >= currentTime) {
        frameA = frames[i];
        frameB = frames[i + 1];
        foundIndex = i;
        break;
      }
      if (frames[i].time > currentTime) {
        frameA = frames[i];
        frameB = frames[i];
        foundIndex = i;
        break;
      }
    }
    
    // If past all frames, use last frame
    if (currentTime >= frames[frames.length - 1].time) {
      frameA = frames[frames.length - 1];
      frameB = frameA;
      foundIndex = frames.length - 1;
    }
    
    // Cache the found index for next frame
    this.lastFrameIndices[diceIndex] = foundIndex;
    
    // Calculate interpolation factor
    const timeDiff = frameB.time - frameA.time;
    let t = timeDiff > 0 ? Math.min(1, (currentTime - frameA.time) / timeDiff) : 0;
    
    // Log interpolation issues (only occasionally to avoid spam)
    if (timeDiff > 100 && Math.random() < 0.1) {
      (window as any).debugLog?.('STREAM', `Gap: ${timeDiff}ms, t=${t.toFixed(2)}, frames=${frames.length}`);
    }
    
    // Catmull-Rom spline interpolation for smoother motion on high refresh rate displays
    if (foundIndex > 0 && foundIndex < frames.length - 2 && timeDiff > 0) {
      // Get 4 control points for Catmull-Rom spline
      const p0 = frames[Math.max(0, foundIndex - 1)];
      const p1 = frameA;
      const p2 = frameB;
      const p3 = frames[Math.min(frames.length - 1, foundIndex + 2)];
      
      // Catmull-Rom interpolation for position
      const position = this.catmullRomPosition(
        p0.position, p1.position, p2.position, p3.position, t
      );
      
      // Slerp for rotation (quaternions don't work well with Catmull-Rom)
      const quaternion = slerpQuaternion(p1.quaternion, p2.quaternion, t);
      
      // Apply to dice
      const dice = this.dice[diceIndex];
      dice.body.position.set(position[0], position[1], position[2]);
      dice.body.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
      dice.updateDirect();
    } else {
      // Fallback to linear interpolation at edges
      const position = lerpPosition(frameA.position, frameB.position, t);
      const quaternion = slerpQuaternion(frameA.quaternion, frameB.quaternion, t);
      
      const dice = this.dice[diceIndex];
      dice.body.position.set(position[0], position[1], position[2]);
      dice.body.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
      dice.updateDirect();
    }
  }
  
  // Catmull-Rom spline interpolation for smooth position curves
  private catmullRomPosition(
    p0: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    t: number
  ): [number, number, number] {
    const t2 = t * t;
    const t3 = t2 * t;
    
    // Catmull-Rom basis functions
    const v0 = (2 * p1[0]);
    const v1 = (-p0[0] + p2[0]);
    const v2 = (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]);
    const v3 = (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]);
    const x = 0.5 * (v0 + v1 * t + v2 * t2 + v3 * t3);
    
    const w0 = (2 * p1[1]);
    const w1 = (-p0[1] + p2[1]);
    const w2 = (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]);
    const w3 = (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]);
    const y = 0.5 * (w0 + w1 * t + w2 * t2 + w3 * t3);
    
    const u0 = (2 * p1[2]);
    const u1 = (-p0[2] + p2[2]);
    const u2 = (2 * p0[2] - 5 * p1[2] + 4 * p2[2] - p3[2]);
    const u3 = (-p0[2] + 3 * p1[2] - 3 * p2[2] + p3[2]);
    const z = 0.5 * (u0 + u1 * t + u2 * t2 + u3 * t3);
    
    return [x, y, z];
  }
  
  private finishStreamingReplay() {
    (window as any).debugLog?.('STREAM', 'Finishing replay');
    
    if (this.replayAnimationId) {
      cancelAnimationFrame(this.replayAnimationId);
      this.replayAnimationId = null;
    }
    
    // Ensure final position briefly to show result
    this.dice.forEach((dice, index) => {
      const frames = this.streamingFrames[index];
      if (frames && frames.length > 0) {
        const lastFrame = frames[frames.length - 1];
        dice.body.position.set(lastFrame.position[0], lastFrame.position[1], lastFrame.position[2]);
        dice.body.quaternion.set(lastFrame.quaternion[0], lastFrame.quaternion[1], lastFrame.quaternion[2], lastFrame.quaternion[3]);
        dice.updateDirect();
      }
    });
    
    // Show result
    if (this.finalResult && this.streamingData) {
      this.showReplayResult(this.streamingData.playerNickname, this.finalResult);
    }
    
    this.isReplaying = false;
    this.streamingData = null;
    
    // Clear frames immediately to free memory
    this.streamingFrames = [];
    this.soundEvents = [];
    this.lastPlayedSoundIndex = -1;
    
    this.colorChangeLocked = false;
    this.lastAppliedReplayConfig = null;
    
    // Notify that replay finished
    if (this.onReplayFinished) {
      this.onReplayFinished();
    }
  }
  
  // Teleport dice to hand position with smooth animation
  public teleportDiceToHand(targetPositions: { x: number; y: number; z: number }[], diceConfig?: any, animate: boolean = true) {
    (window as any).debugLog?.('DICE', `teleportDiceToHand: animate=${animate}, hasConfig=${!!diceConfig}`);
    
    // Apply dice config if provided, otherwise restore original (my) config
    if (diceConfig) {
      this.preloadDiceConfig(diceConfig);
    } else {
      // No config provided - restore my own config
      this.restoreOriginalDiceConfig();
    }
    
    if (animate) {
      // Smooth animation to hand (0.3 seconds)
      this.animateDiceToHand(targetPositions);
    } else {
      // Instant teleport (for initial game start)
      this.dice.forEach((dice, i) => {
        dice.body.type = CANNON.Body.KINEMATIC;
        dice.body.position.set(
          targetPositions[i].x,
          targetPositions[i].y,
          targetPositions[i].z
        );
        dice.body.quaternion.set(0, 0, 0, 1);
        dice.body.velocity.set(0, 0, 0);
        dice.body.angularVelocity.set(0, 0, 0);
        dice.updateDirect();
      });
    }
  }
  
  // Animate dice to hand position smoothly
  private animateDiceToHand(targetPositions: { x: number; y: number; z: number }[]) {
    const startTime = Date.now();
    const duration = 300; // 0.3 seconds
    
    // Store start positions
    const startPositions = this.dice.map(dice => ({
      x: dice.body.position.x,
      y: dice.body.position.y,
      z: dice.body.position.z,
    }));
    
    // Set dice to kinematic during animation
    this.dice.forEach(dice => {
      dice.body.type = CANNON.Body.KINEMATIC;
      dice.body.velocity.set(0, 0, 0);
      dice.body.angularVelocity.set(0, 0, 0);
    });
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate positions
      this.dice.forEach((dice, i) => {
        const start = startPositions[i];
        const target = targetPositions[i];
        
        dice.body.position.set(
          start.x + (target.x - start.x) * eased,
          start.y + (target.y - start.y) * eased,
          start.z + (target.z - start.z) * eased
        );
        
        // Smoothly rotate to neutral orientation
        const targetQuat = new THREE.Quaternion(0, 0, 0, 1);
        const currentQuat = new THREE.Quaternion(
          dice.body.quaternion.x,
          dice.body.quaternion.y,
          dice.body.quaternion.z,
          dice.body.quaternion.w
        );
        currentQuat.slerp(targetQuat, eased * 0.5); // Slower rotation
        
        dice.body.quaternion.set(currentQuat.x, currentQuat.y, currentQuat.z, currentQuat.w);
        dice.updateDirect();
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final position
        this.dice.forEach((dice, i) => {
          dice.body.position.set(
            targetPositions[i].x,
            targetPositions[i].y,
            targetPositions[i].z
          );
          dice.body.quaternion.set(0, 0, 0, 1);
          dice.updateDirect();
        });
      }
    };
    
    animate();
  }

  private showPlayerIndicator(playerNickname: string): void {
    // Remove previous indicator if exists
    const existing = document.getElementById('throwing-indicator');
    if (existing) existing.remove();
    
    const indicator = document.createElement('div');
    indicator.id = 'throwing-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 133px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.2);
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 100;
      pointer-events: none;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    indicator.innerHTML = `<span style="opacity: 0.7;">${playerNickname}</span> shooting...`;
    
    document.body.appendChild(indicator);
    
    // Remove when throw ends (will be replaced by result)
    setTimeout(() => {
      indicator.remove();
    }, 5000);
  }

  private showReplayResult(playerNickname: string, result: { dice1: number; dice2: number; total: number; diceValues?: number[] }): void {
    // Remove throwing indicator
    const throwingIndicator = document.getElementById('throwing-indicator');
    if (throwingIndicator) throwingIndicator.remove();
    
    // Remove previous result indicator if exists
    const existing = document.getElementById('last-throw-indicator');
    if (existing) existing.remove();
    
    const resultIndicator = document.createElement('div');
    resultIndicator.id = 'last-throw-indicator';
    resultIndicator.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.2);
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 100;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Format result based on game mode
    let resultText: string;
    const gameMode = this.getGameMode();
    const diceValues = result.diceValues || [result.dice1, result.dice2];
    
    if (gameMode === 'mexico') {
      const high = Math.max(result.dice1, result.dice2);
      const low = Math.min(result.dice1, result.dice2);
      const score = high * 10 + low;
      resultText = `${result.dice1} + ${result.dice2} = ${score}`;
    } else if (gameMode === 'poker_dice') {
      resultText = diceValues.join(' + ') + ' = ' + result.total;
    } else {
      resultText = `${result.dice1} + ${result.dice2} = ${result.total}`;
    }
    
    resultIndicator.innerHTML = `
      <span style="opacity: 0.7;">${playerNickname}:</span> ${resultText}
    `;
    
    document.body.appendChild(resultIndicator);
    
    this.audio.playDiceHit(0.5);
    triggerHaptic('medium');
    
    // Don't auto-remove - keep it visible until next throw
  }

  public isCurrentlyReplaying(): boolean {
    return this.isReplaying;
  }
  
  // Force stop replay (called when turn changes to us)
  public stopReplay() {
    if (this.isReplaying) {
      this.finishStreamingReplay();
    }
  }
  
  // Check if currently recording a throw (dice in flight)
  public isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  public getReplayTime(): number {
    return this.isReplaying ? Date.now() - this.replayStartTime : 0;
  }
  
  // Clear all indicators (called when leaving game)
  public clearIndicators(): void {
    const throwingIndicator = document.getElementById('throwing-indicator');
    if (throwingIndicator) throwingIndicator.remove();
    
    const lastThrowIndicator = document.getElementById('last-throw-indicator');
    if (lastThrowIndicator) lastThrowIndicator.remove();
  }
}
