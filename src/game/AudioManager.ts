export class AudioManager {
  private ctx: AudioContext | null = null;
  private diceHitBuffer: AudioBuffer | null = null;
  private tableHitBuffer: AudioBuffer | null = null;
  isLoaded = false;
  // Tracks whether an `init()` call is currently in-flight. Used to dedupe
  // overlapping init attempts without permanently blocking retries when a
  // previous attempt failed.
  private initInFlight = false;
  // Tracks whether the iOS-style synchronous unlock (AudioContext + silent
  // buffer started inside a user gesture) has already happened. Once true,
  // we don't need to redo it on every subsequent gesture.
  private contextUnlocked = false;
  private lastShakeTime = 0;
  private lastDiceHitTime = 0;
  private lastTableHitTime = 0;

  // Store audio data for recreation
  private diceHitData: ArrayBuffer | null = null;
  private tableHitData: ArrayBuffer | null = null;
  private visibilityHandlerInstalled = false;

  // MUST be called from inside a user gesture (touchstart/click/etc) on
  // mobile, otherwise iOS / Yandex Games' iOS WebView leave the audio
  // context in `suspended` and every subsequent `start()` is a silent no-op.
  // We split init into two halves:
  //   1) `unlockContextSync()` — synchronous bits that need the gesture
  //   2) `loadAndDecodeBuffers()` — async fetch + decode, can run later
  // This way fetch latency on flaky mobile networks doesn't cost us the
  // gesture token.
  async init() {
    // Step 1 always runs (cheap, idempotent), even if a previous attempt
    // failed during step 2. This is how we recover from e.g. a bad first
    // fetch on a flaky mobile network.
    this.unlockContextSync();

    if (this.isLoaded || this.initInFlight) return;
    this.initInFlight = true;

    try {
      await this.loadAndDecodeBuffers();
      this.isLoaded = true;

      if (!this.visibilityHandlerInstalled) {
        this.setupVisibilityHandler();
        this.visibilityHandlerInstalled = true;
      }
    } catch (e) {
      (window as any).debugLog?.('AUDIO', 'init failed, will retry on next gesture:', String(e));
      // Leave isLoaded=false so the next user gesture can retry.
    } finally {
      this.initInFlight = false;
    }
  }

  // Synchronous unlock. Creates the AudioContext and immediately starts a
  // silent buffer source — both inside the calling user gesture — so iOS
  // promotes the context out of `suspended`. Calling `await ctx.resume()`
  // BEFORE the silent source play (the old code path) consumes the gesture
  // token on the first microtask boundary and leaves the context muted on
  // iOS Safari / Yandex mobile WebView.
  private unlockContextSync() {
    if (this.contextUnlocked && this.ctx && this.ctx.state !== 'closed') {
      // Already unlocked. Still kick a resume in case we were backgrounded.
      if (this.ctx.state === 'suspended' || (this.ctx.state as string) === 'interrupted') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();

      // Silent buffer source MUST be started synchronously after context
      // creation, before any await, otherwise iOS won't accept the unlock.
      const silentBuffer = this.ctx.createBuffer(1, 1, 22050);
      const silentSource = this.ctx.createBufferSource();
      silentSource.buffer = silentBuffer;
      silentSource.connect(this.ctx.destination);
      silentSource.start(0);

      // resume() can run async afterwards — once the silent source has been
      // queued, the gesture has done its job.
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      this.contextUnlocked = true;
    } catch (e) {
      (window as any).debugLog?.('AUDIO', 'unlockContextSync failed:', String(e));
    }
  }

  private async loadAndDecodeBuffers() {
    // Load sounds (skip if already loaded once).
    if (!this.diceHitData || !this.tableHitData) {
      // Use Vite's BASE_URL so the bundle works both at the root of a host
      // (Telegram) and inside Yandex Games' versioned subpath.
      const base = import.meta.env.BASE_URL;
      const [diceResp, tableResp] = await Promise.all([
        fetch(`${base}sounds/dice_hit.mp3`),
        fetch(`${base}sounds/table_hit.mp3`)
      ]);

      if (!diceResp.ok || !tableResp.ok) {
        throw new Error(`Audio fetch failed: ${diceResp.status} / ${tableResp.status}`);
      }

      [this.diceHitData, this.tableHitData] = await Promise.all([
        diceResp.arrayBuffer(),
        tableResp.arrayBuffer()
      ]);
    }

    await this.decodeAudioBuffers();
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
            
            // Reset the unlock flag so unlockContextSync re-creates the ctx.
            this.contextUnlocked = false;
            this.unlockContextSync();
            await this.decodeAudioBuffers();
            (window as any).debugLog?.('AUDIO', 'Recreated, new state:', this.ctx?.state);
          }
        }
      }
    });
  }

  private playBuffer(buffer: AudioBuffer | null, volume: number, pitch: number) {
    if (!this.ctx || !buffer || !this.isLoaded) return;

    // iOS Safari and Yandex Games' iOS WebView can leave the context in
    // `suspended` (or the non-standard `interrupted`) state after the app
    // is backgrounded, an interstitial/rewarded ad is shown, or the device
    // goes to lock screen. Always kick a resume — it's a no-op if running.
    const state = this.ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      this.ctx.resume().catch(() => {});
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
