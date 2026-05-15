export class ShakeDetector {
  private lastX = 0;
  private lastY = 0;
  private lastZ = 0;
  private isActive = false;
  public isMobile: boolean;
  private hasPermission = false;
  private permissionChecked = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private lastMouseMoveTime = 0;
  private readonly MOUSE_THROTTLE = 16; // ~60fps
  
  private intensityHistory: number[] = [];
  
  // Direction change tracking
  private prevX = 0;
  private prevY = 0;
  private prevZ = 0;
  private dirX = 0;  // 1 = increasing, -1 = decreasing
  private dirY = 0;
  private dirZ = 0;
  private turnPointY = 0;  // Y value at last direction change
  private turnPointZ = 0;  // Z value at last direction change
  
  private readonly HISTORY_SIZE = 6;
  private readonly SHAKE_THRESHOLD = 0.3;

  onMove: ((intensity: number, accX: number, accY: number, accZ: number) => void) | null = null;
  onTurn: ((intensity: number) => void) | null = null;  // Direction change - for sound/haptic
  onThrow: ((power: number, deltaY: number, deltaZ: number) => void) | null = null;
  onPermissionGranted: (() => void) | null = null;  // Called when permission is granted

  constructor() {
    this.handleMotion = this.handleMotion.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.checkPermission();
  }

  private async checkPermission() {
    if (!this.isMobile) { 
      this.hasPermission = true; 
      this.permissionChecked = true;
      return; 
    }
    
    // Check if DeviceMotionEvent.requestPermission exists (iOS 13+)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      // Try to check if permission was already granted by listening for a motion event
      const testPermission = new Promise<boolean>((resolve) => {
        let resolved = false;
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(false);
          }
        }, 100);
        
        const testHandler = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            window.removeEventListener('devicemotion', testHandler);
            resolve(true);
          }
        };
        window.addEventListener('devicemotion', testHandler);
      });
      
      const alreadyGranted = await testPermission;
      
      if (alreadyGranted) {
        // Permission was already granted in a previous session
        this.hasPermission = true;
        this.permissionChecked = true;
        return;
      }
      
      // Need to show button and request permission
      const btn = document.getElementById('permission-btn');
      if (btn) {
        btn.style.display = 'block';
        btn.addEventListener('click', async () => {
          try {
            const permission = await (DeviceMotionEvent as any).requestPermission();
            if (permission === 'granted') { 
              this.hasPermission = true; 
              this.permissionChecked = true;
              btn.style.display = 'none';
              // Notify that permission was granted
              if (this.onPermissionGranted) {
                this.onPermissionGranted();
              }
            }
          } catch (e) { console.warn('Permission error:', e); }
        });
      }
      this.permissionChecked = true;
    } else { 
      // Android or older iOS - no permission needed
      this.hasPermission = true; 
      this.permissionChecked = true;
    }
  }

  async start() {
    this.isActive = true;
    this.intensityHistory = [];
    if (this.isMobile) {
      if (!this.hasPermission) return;
      window.addEventListener('devicemotion', this.handleMotion);
    } else {
      window.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  stop() {
    this.isActive = false;
    this.intensityHistory = [];
    window.removeEventListener('devicemotion', this.handleMotion);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  private handleMotion(event: DeviceMotionEvent) {
    if (!this.isActive) return;
    
    const acc = event.acceleration || event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    const diffX = Math.abs(acc.x - this.lastX);
    const diffY = Math.abs(acc.y - this.lastY);
    const diffZ = Math.abs(acc.z - this.lastZ);
    const intensity = (diffX + diffY + diffZ) / 15;

    // Detect direction change (turn points)
    const newDirX = acc.x > this.prevX ? 1 : (acc.x < this.prevX ? -1 : this.dirX);
    const newDirY = acc.y > this.prevY ? 1 : (acc.y < this.prevY ? -1 : this.dirY);
    const newDirZ = acc.z > this.prevZ ? 1 : (acc.z < this.prevZ ? -1 : this.dirZ);
    
    // Direction changed = turn point reached
    let turnHappened = false;
    if (newDirX !== this.dirX && this.dirX !== 0) {
      turnHappened = true;
    }
    if (newDirY !== this.dirY && this.dirY !== 0) {
      this.turnPointY = this.prevY;
      turnHappened = true;
    }
    if (newDirZ !== this.dirZ && this.dirZ !== 0) {
      this.turnPointZ = this.prevZ;
      turnHappened = true;
    }
    
    // Fire onTurn for sound/haptic
    if (turnHappened && intensity > this.SHAKE_THRESHOLD && this.onTurn) {
      this.onTurn(intensity);
    }
    
    this.dirX = newDirX;
    this.dirY = newDirY;
    this.dirZ = newDirZ;
    
    // Delta from last turn point
    const deltaY = acc.y - this.turnPointY;
    const deltaZ = acc.z - this.turnPointZ;
    
    // Throw: forward-down motion from turn point
    const isCorrectDirection = deltaY > 2 && deltaZ < -12;
    const isThrowGesture = this.intensityHistory.length >= 2 && isCorrectDirection;

    this.prevX = acc.x;
    this.prevY = acc.y;
    this.prevZ = acc.z;
    this.lastX = acc.x;
    this.lastY = acc.y;
    this.lastZ = acc.z;

    if (intensity < this.SHAKE_THRESHOLD) return;

    if (isThrowGesture) {
      const power = Math.min(1, intensity / 3);
      if (this.onThrow) this.onThrow(power, deltaY, deltaZ);
      this.intensityHistory = [];
      return;
    }

    this.intensityHistory.push(intensity);
    if (this.intensityHistory.length > this.HISTORY_SIZE) {
      this.intensityHistory.shift();
    }

    if (this.onMove) this.onMove(intensity, acc.x, acc.y, acc.z);
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.isActive) return;
    
    // Throttle to ~60fps
    const now = Date.now();
    if (now - this.lastMouseMoveTime < this.MOUSE_THROTTLE) return;
    this.lastMouseMoveTime = now;
    
    const deltaX = Math.abs(event.clientX - this.lastMouseX);
    const deltaY = Math.abs(event.clientY - this.lastMouseY);
    const intensity = (deltaX + deltaY) / 50;

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    if (intensity < this.SHAKE_THRESHOLD) return;

    // Just accumulate intensity for shake - throw happens on mouseup
    this.intensityHistory.push(intensity);
    if (this.intensityHistory.length > this.HISTORY_SIZE) {
      this.intensityHistory.shift();
    }

    if (this.onMove) this.onMove(intensity, 0, 0, 0);
  }
}
