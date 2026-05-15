export class AudioManager {
  private ctx: AudioContext | null = null;
  private diceHitBuffer: AudioBuffer | null = null;
  private tableHitBuffer: AudioBuffer | null = null;
  isLoaded = false;
  private isInitialized = false;
  private lastShakeTime = 0;
  private lastDiceHitTime = 0;
  private lastTableHitTime = 0;
  
  // Store audio data for recreation
  private diceHitData: ArrayBuffer | null = null;
  private tableHitData: ArrayBuffer | null = null;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    
    try {
      // Create AudioContext - must be called from user gesture on iOS
      await this.createAudioContext();
      
      // Load sounds
      const [diceResp, tableResp] = await Promise.all([
        fetch('/sounds/dice_hit.mp3'),
        fetch('/sounds/table_hit.mp3')
      ]);
      
      if (!diceResp.ok || !tableResp.ok) {
        return;
      }
      
      // Store raw data for potential recreation
      [this.diceHitData, this.tableHitData] = await Promise.all([
        diceResp.arrayBuffer(),
        tableResp.arrayBuffer()
      ]);
      
      // Decode audio
      await this.decodeAudioBuffers();
      this.isLoaded = true;
      
      // Setup visibility change handler to recover from suspended/interrupted state
      this.setupVisibilityHandler();
    } catch (e) {
      // Audio init failed silently
    }
  }
  
  private async createAudioContext() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Resume if suspended (iOS)
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    
    // Play silent buffer to unlock audio on iOS
    const silentBuffer = this.ctx.createBuffer(1, 1, 22050);
    const silentSource = this.ctx.createBufferSource();
    silentSource.buffer = silentBuffer;
    silentSource.connect(this.ctx.destination);
    silentSource.start(0);
  }
  
  private async decodeAudioBuffers() {
    if (!this.ctx || !this.diceHitData || !this.tableHitData) return;
    
    // Need to clone ArrayBuffer because decodeAudioData detaches it
    this.diceHitBuffer = await this.ctx.decodeAudioData(this.diceHitData.slice(0));
    this.tableHitBuffer = await this.ctx.decodeAudioData(this.tableHitData.slice(0));
  }
  
  private setupVisibilityHandler() {
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden && this.ctx) {
        // Check if context is in a bad state
        const state = this.ctx.state;
        (window as any).debugLog?.('AUDIO', 'Visibility restored, state:', state);
        
        if (state === 'suspended' || state === 'interrupted' || (state as string) === 'closed') {
          (window as any).debugLog?.('AUDIO', 'Attempting to recover...');
          
          try {
            // First try to resume
            await this.ctx.resume();
            (window as any).debugLog?.('AUDIO', 'Resume OK, new state:', this.ctx.state);
          } catch (e) {
            (window as any).debugLog?.('AUDIO', 'Resume FAILED, recreating...', String(e));
            // If resume fails, recreate the context
            try {
              this.ctx.close().catch(() => {});
            } catch (e) {}
            
            await this.createAudioContext();
            await this.decodeAudioBuffers();
            (window as any).debugLog?.('AUDIO', 'Recreated, new state:', this.ctx?.state);
          }
        }
      }
    });
  }

  private playBuffer(buffer: AudioBuffer | null, volume: number, pitch: number) {
    if (!this.ctx || !buffer || !this.isLoaded) return;
    
    // Always try to resume on iOS
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    try {
      const source = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      
      source.buffer = buffer;
      source.playbackRate.value = pitch;
      gain.gain.value = volume;
      
      source.connect(gain);
      gain.connect(this.ctx.destination);
      source.start(0);
    } catch (e) {
      // Play error silently
    }
  }

  playShake(intensity: number) {
    if (!this.isLoaded) return;
    
    const now = Date.now();
    if (now - this.lastShakeTime < 50) return;  // Reduced from 200ms
    this.lastShakeTime = now;
    
    if (intensity < 0.2) return;  // Reduced from 0.4
    
    const volume = 0.2 + intensity * 0.4;
    const pitch = 0.6 + intensity * 0.3;
    this.playBuffer(this.diceHitBuffer, volume, pitch);
  }

  playDiceHit(velocity: number) {
    if (!this.isLoaded) return;
    
    const now = Date.now();
    if (now - this.lastDiceHitTime < 100) return;
    this.lastDiceHitTime = now;
    
    if (velocity < 1) return;
    
    const intensity = Math.min(1, velocity / 10);
    const volume = 0.05 + intensity * 0.7;  // Lower base, higher multiplier for more contrast
    const pitch = 0.6 + intensity * 0.3;
    this.playBuffer(this.diceHitBuffer, volume, pitch);
  }

  playTableHit(velocity: number) {
    if (!this.isLoaded) return;
    
    const now = Date.now();
    if (now - this.lastTableHitTime < 80) return;
    this.lastTableHitTime = now;
    
    if (velocity < 1) return;
    
    const intensity = Math.min(1, velocity / 10);
    const volume = 0.05 + intensity * 0.85;  // Lower base, higher multiplier for more contrast
    const pitch = 0.6 + intensity * 0.3;
    this.playBuffer(this.tableHitBuffer, volume, pitch);
  }
}
