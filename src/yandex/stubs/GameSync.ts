// Stub of ../multiplayer/GameSync for the solo-only Yandex Games build.
// Every multiplayer check returns "off", which short-circuits the networked
// code paths inside game/Game.ts.

export class GameSync {
  constructor(_game: any) {
    // intentionally empty
  }

  isMultiplayerActive(): boolean {
    return false;
  }

  isMyTurn(): boolean {
    return true;
  }

  getGameMode(): string {
    return 'solo';
  }

  getEquippedEffectId(): number | null {
    return null;
  }

  getEquippedDiceId(): number | null {
    return null;
  }

  setThrowInProgress(_v: boolean): void {
    // no-op
  }

  onDiceRolled(_d1: number, _d2: number): void {
    // no-op
  }

  onDiceThrown(_data: any): void {
    // no-op
  }
}
