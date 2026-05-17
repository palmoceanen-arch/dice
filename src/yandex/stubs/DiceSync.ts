// Stub of ../multiplayer/DiceSync for the solo-only Yandex Games build.
// Recording / replay / streaming are no-ops since there is no peer to sync
// throws to.

export class DiceSync {
  private originalDiceConfig: any = null;

  constructor(
    _dice: any,
    _audio: any,
    _scene: any,
    _world: any,
    _getGameMode: () => string,
    _game?: any,
  ) {
    // intentionally empty
  }

  cancelAnimations(): void {
    // no-op
  }

  recordSoundEvent(_type: 'dice_hit' | 'table_hit', _velocity: number): void {
    // no-op
  }

  startRecordingStream(
    _initialFrame: number,
    _effectId: number | null,
    _selectedIndices?: number[],
  ): void {
    // no-op
  }

  stopRecordingStream(_sendEnd: boolean = true): void {
    // no-op
  }

  isCurrentlyRecording(): boolean {
    return false;
  }

  isCurrentlyReplaying(): boolean {
    return false;
  }

  stopReplay(): void {
    // no-op
  }

  getReplayTime(): number {
    return 0;
  }

  clearIndicators(): void {
    // no-op
  }

  teleportDiceToHand(
    _targetPositions: { x: number; y: number; z: number }[],
    _diceConfig?: any,
    _animate: boolean = true,
  ): void {
    // no-op
  }

  setOriginalDiceConfig(config: any): void {
    this.originalDiceConfig = config;
  }

  getOriginalDiceConfig(): any {
    return this.originalDiceConfig;
  }
}
