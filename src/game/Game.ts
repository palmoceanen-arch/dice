import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Dice } from './Dice';
import { ShakeDetector } from './ShakeDetector';
import { AudioManager } from './AudioManager';
import { GameSync } from '../multiplayer/GameSync';
import { DiceSync } from '../multiplayer/DiceSync';
import { wsClient } from '../multiplayer/WebSocketClient';
import { DiceValidator } from './DiceValidator';
import { icon } from '../ui/icons';
import { WallText } from './WallText';

// Graphics quality presets
export type GraphicsQuality = 'low' | 'medium' | 'high';

interface GraphicsSettings {
  pixelRatio: number;
  shadowsEnabled: boolean;
  antialias: boolean;
  diceBevelSegments: number;
}

const GRAPHICS_PRESETS: Record<GraphicsQuality, GraphicsSettings> = {
  low: {
    pixelRatio: 1,
    shadowsEnabled: false,
    antialias: false,
    diceBevelSegments: 1,
  },
  medium: {
    pixelRatio: Math.min(window.devicePixelRatio, 1.75), // Better quality, still performant
    shadowsEnabled: false,
    antialias: false, // Disable antialias - pixelRatio handles sharpness
    diceBevelSegments: 2, // Reduce from 3 to 2 (less geometry)
  },
  high: {
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    shadowsEnabled: true,
    antialias: true,
    diceBevelSegments: 3,
  },
};

// Surface configuration for floor or wall
export interface SurfaceConfig {
  color: string;
  texture: 'felt' | 'leather' | 'velvet' | 'smooth' | 'wood' | 'marble' | 'concrete' | 'diamond' | 'glass' | 'hexagon' | 'brick' | 'scales' | 'waves' | 'dots' | 'stripes' | 'checker';
  roughness: number;
  metalness: number;
  normalIntensity: number;
  textureScale?: 'small' | 'medium' | 'large'; // small=4x4, medium=2x2, large=1x1
  clearcoat?: number;
  clearcoatRoughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  realTexture?: string; // ID of real texture from manifest (e.g., "wood_oak", "concrete_concrete")
}

// Border configuration
export interface BorderConfig {
  color: string;
  roughness: number;
  metalness: number;
}

// New table configuration interface with separate floor/wall settings
export interface TableConfig {
  floor: SurfaceConfig;
  wall: SurfaceConfig;
  border?: BorderConfig;
}

// Legacy table config for backward compatibility
interface LegacyTableConfig {
  floorColor: string;
  wallColor: string;
  floorRoughness?: number;
  wallRoughness?: number;
  textureType?: 'felt' | 'leather' | 'velvet' | 'smooth';
}

const DEFAULT_TABLE_CONFIG: TableConfig = {
  "floor": {
    "color": "#1b4b02",
    "texture": "felt",
    "roughness": 0.85,
    "metalness": 0.5,
    "normalIntensity": 2,
    "textureScale": "small",
    "clearcoat": 0,
    "realTexture": "fabric_velour_velvet"
  },
  "wall": {
    "color": "#e0e0e0",
    "texture": "brick",
    "roughness": 1,
    "metalness": 0.65,
    "normalIntensity": 1.7,
    "textureScale": "small",
    "clearcoat": 0,
    "realTexture": "concrete_concrete"
  },
  "border": {
    "color": "#153b02",
    "roughness": 0.45,
    "metalness": 0
  }
};

// Convert legacy config to new format
function normalizeTableConfig(config: any): TableConfig {
  // Already new format
  if (config.floor && config.wall) {
    return config as TableConfig;
  }
  // Legacy format - convert
  const legacy = config as LegacyTableConfig;
  return {
    floor: {
      color: legacy.floorColor || '#2d5a3d',
      texture: legacy.textureType || 'felt',
      roughness: legacy.floorRoughness ?? 0.9,
      metalness: 0,
      normalIntensity: 0.6,
    },
    wall: {
      color: legacy.wallColor || '#1a3d2a',
      texture: legacy.textureType || 'felt',
      roughness: legacy.wallRoughness ?? 0.95,
      metalness: 0,
      normalIntensity: 0.6,
    },
  };
}

// Haptic feedback helper with throttling
const hapticSupported = typeof window !== 'undefined' && 
  window.Telegram?.WebApp?.HapticFeedback && 
  typeof window.Telegram.WebApp.HapticFeedback.impactOccurred === 'function';

let lastHapticTime = 0;
const hapticThrottle = 50; // ms

function triggerHaptic(style: 'light' | 'medium' | 'heavy') {
  if (!hapticSupported) return;
  const now = Date.now();
  if (now - lastHapticTime < hapticThrottle) return;
  lastHapticTime = now;
  try {
    window.Telegram?.WebApp.HapticFeedback.impactOccurred(style);
  } catch {
    // Ignore errors
  }
}

function triggerHapticNotification(type: 'success' | 'error' | 'warning') {
  if (!hapticSupported) return;
  try {
    window.Telegram?.WebApp.HapticFeedback.notificationOccurred(type);
  } catch {
    // Ignore errors
  }
}

export class Game {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private world: CANNON.World;
  private dice: Dice[] = [];
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private shakeDetector: ShakeDetector;
  
  // Palmo's Dice: track selected dice for reroll
  private selectedDiceForReroll: Set<number> = new Set();
  private diceSelectionEnabled = false;
  private lastRerollSelection: number[] = []; // Store last reroll selection for streaming
  // Outline meshes for selected dice (rendered through floor)
  private diceOutlineMeshes: Map<number, THREE.LineSegments> = new Map();
  
  private isHolding = false;
  private shakeIntensity = 0;
  private diceInHand = true;
  
  private hintEl: HTMLElement;
  private resultEl: HTMLElement;
  
  // Hand box walls for dice shaking
  private handBoxWalls: CANNON.Body[] = [];
  private handBoxFloor: CANNON.Body | null = null;
  
  // Side walls (physics + visual)
  private leftWall: CANNON.Body | null = null;
  private rightWall: CANNON.Body | null = null;
  private leftWallMesh: THREE.Mesh | null = null;
  private rightWallMesh: THREE.Mesh | null = null;
  private backWallMesh: THREE.Mesh | null = null;
  private tableMesh: THREE.Mesh | null = null;
  
  // Border meshes
  private backBorderMesh: THREE.Mesh | null = null;
  private leftBorderMesh: THREE.Mesh | null = null;
  private rightBorderMesh: THREE.Mesh | null = null;
  
  private tableConfig: TableConfig = DEFAULT_TABLE_CONFIG;
  
  private diceMaterial!: CANNON.Material;
  private floorMaterial!: CANNON.Material;
  private wallMaterial!: CANNON.Material;
  private audio: AudioManager;
  private gameSync: GameSync;
  private diceSync: DiceSync;

  // Locked dimensions (set once on init, don't change with keyboard)
  private lockedWidth: number = 0;
  private lockedHeight: number = 0;
  private sideWallsInitialized: boolean = false;
  
  // Control settings
  private controlMode: 'motion' | 'manual' = 'motion';
  private requireReadyConfirmation = false;
  private isWaitingForReady = false;
  private readyOverlay: HTMLElement | null = null;
  
  // Manual mode state
  private manualTouchId: number | null = null;
  private manualTouchStartY = 0;
  private manualLastY = 0;
  private manualIsDragging = false;
  
  // Anti-cheat: server-provided seed for randomization
  private throwSeed: number = 0;
  
  // Callback to check if UI menu is open
  private isMenuOpenCallback: (() => boolean) | null = null;
  
  // Environment map for metal reflections
  private envMap: THREE.Texture | null = null;
  private pmremGenerator: THREE.PMREMGenerator | null = null;
  
  // FPS counter
  private fpsCounter: HTMLElement | null = null;
  private frameCount = 0;
  private lastFpsUpdate = 0;
  
  // Graphics quality
  private graphicsQuality: GraphicsQuality = 'high';
  private graphicsSettings: GraphicsSettings = GRAPHICS_PRESETS.high;
  
  // Invalid roll detection (dice on edge/corner)
  private invalidRollCheckTimeout: number | null = null;
  private invalidRollWaitTime = 3000; // 3 seconds to wait before reroll
  
  // Wall text for displaying pips
  private wallText: WallText | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    // Load graphics quality from localStorage
    this.loadGraphicsQuality();
    
    // Three.js setup with quality settings
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: this.graphicsSettings.antialias,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(this.graphicsSettings.pixelRatio);
    this.renderer.shadowMap.enabled = this.graphicsSettings.shadowsEnabled;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Soft shadows, good quality
    
    // Handle WebGL context loss/restore (fixes black screen after minimize/restore)
    this.setupWebGLContextHandlers();
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a3d2a);
    
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    this.camera.position.set(0, 10, 8);
    this.camera.lookAt(0, 0, 0);
    
    // Cannon.js physics - optimized
    this.world = new CANNON.World();
    this.world.gravity.set(0, -40, 0);
    this.world.allowSleep = true;
    
    // Reduced solver iterations for performance
    (this.world.solver as CANNON.GSSolver).iterations = 10;
    
    // Contact materials for realistic bouncing
    this.diceMaterial = new CANNON.Material('dice');
    this.floorMaterial = new CANNON.Material('floor');
    this.wallMaterial = new CANNON.Material('wall');
    
    const diceFloorContact = new CANNON.ContactMaterial(this.diceMaterial, this.floorMaterial, {
      friction: 0.15,     // Reduced from 0.3 - more slippery
      restitution: 0.45   // Balanced bounce
    });
    
    const diceWallContact = new CANNON.ContactMaterial(this.diceMaterial, this.wallMaterial, {
      friction: 0.1,      // Even more slippery on walls
      restitution: 0.3    // Less bouncy walls
    });
    
    const diceDiceContact = new CANNON.ContactMaterial(this.diceMaterial, this.diceMaterial, {
      friction: 0.1,      // Reduced from 0.2 - even more slippery
      restitution: 0.6    // Slightly more bouncy than floor
    });
    
    this.world.addContactMaterial(diceFloorContact);
    this.world.addContactMaterial(diceWallContact);
    this.world.addContactMaterial(diceDiceContact);
    
    // Collision event for haptic feedback and sound
    this.world.addEventListener('beginContact', (event: { bodyA: CANNON.Body; bodyB: CANNON.Body }) => {
      if (this.diceInHand) return;
      
      const isDiceA = this.dice.some(d => d.body === event.bodyA);
      const isDiceB = this.dice.some(d => d.body === event.bodyB);
      
      // Скорость столкновения
      const relVel = event.bodyA.velocity.vsub(event.bodyB.velocity).length();
      
      if (isDiceA && isDiceB) {
        // Кубик о кубик
        if (relVel > 0.5) {
          this.audio.playDiceHit(relVel);
          // Record sound for multiplayer replay
          if (this.diceSync) {
            this.diceSync.recordSoundEvent('dice_hit', relVel);
          }
        }
        if (relVel > 1) {
          triggerHaptic('light');
        }
      } else if (isDiceA || isDiceB) {
        // Кубик о стол/стену
        if (relVel > 0.5) {
          this.audio.playTableHit(relVel);
          // Record sound for multiplayer replay
          if (this.diceSync) {
            this.diceSync.recordSoundEvent('table_hit', relVel);
          }
        }
        
        // Вибрация
        if (relVel > 5) {
          triggerHaptic('heavy');
        } else if (relVel > 2) {
          triggerHaptic('medium');
        } else if (relVel > 0.5) {
          triggerHaptic('light');
        }
      }
    });
    
    // Shake detector
    this.shakeDetector = new ShakeDetector();
    
    // UI elements
    this.hintEl = document.getElementById('hint')!;
    this.resultEl = document.getElementById('result')!;
    
    // Boost icon
    const boostIcon = document.getElementById('boost-icon');
    if (boostIcon) {
      boostIcon.addEventListener('click', () => {
        // Only show boosts in online mode (not in lobby or game)
        if (!this.gameSync.isMultiplayerActive()) {
          import('../ui/BoostsModal').then(({ BoostsModal }) => {
            BoostsModal.toggle();
          });
        }
      });
    }
    
    // FPS counter
    this.createFpsCounter();
    
    // Audio
    this.audio = new AudioManager();
    
    // Multiplayer sync (will be initialized after dice are created)
    this.gameSync = new GameSync(this);
    
    // DiceSync will be initialized after setupScene creates dice
    this.diceSync = null as any;
    
    // Initialize PMREM generator for environment map
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    
    // Load control settings from localStorage
    this.loadControlSettings();
    
    this.setupScene();
    this.setupControls();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  
  // Setup WebGL context loss/restore handlers
  private setupWebGLContextHandlers() {
    this.canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.warn('[Game] WebGL context lost! This causes black screen.');
      (window as any).debugLog?.('RENDER', 'WebGL context LOST');
      
      // Log memory info if available
      if ((performance as any).memory) {
        const mem = (performance as any).memory;
        console.warn('[Game] Memory at context loss:', {
          used: Math.round(mem.usedJSHeapSize / 1048576) + 'MB',
          total: Math.round(mem.totalJSHeapSize / 1048576) + 'MB',
          limit: Math.round(mem.jsHeapSizeLimit / 1048576) + 'MB'
        });
      }
    }, false);
    
    this.canvas.addEventListener('webglcontextrestored', () => {
      console.log('[Game] WebGL context restored, reinitializing renderer...');
      (window as any).debugLog?.('RENDER', 'WebGL context RESTORED');
      
      // Try to trigger garbage collection if available
      if ((window as any).gc) {
        try {
          (window as any).gc();
          console.log('[Game] Forced garbage collection');
        } catch (e) {
          // Ignore
        }
      }
      
      // Force renderer to reinitialize
      this.renderer.setPixelRatio(this.graphicsSettings.pixelRatio);
      this.renderer.shadowMap.enabled = this.graphicsSettings.shadowsEnabled;
      
      // Clear renderer state
      this.renderer.clear(true, true, true);
      
      // Recreate all textures and materials
      this.clearNormalMapCache();
      this.updateEnvMap();
      
      // Update table materials
      if (this.tableMesh) {
        const oldMat = this.tableMesh.material as THREE.Material;
        oldMat.dispose();
        this.tableMesh.material = this.createSurfaceMaterial(this.tableConfig.floor, 20, 20);
      }
      
      // Update wall materials
      if (this.backWallMesh) {
        const oldMat = this.backWallMesh.material as THREE.Material;
        oldMat.dispose();
        this.backWallMesh.material = this.createSurfaceMaterial(this.tableConfig.wall, 12, 6);
      }
      
      if (this.leftWallMesh) {
        const oldMat = this.leftWallMesh.material as THREE.Material;
        oldMat.dispose();
        this.leftWallMesh.material = this.createSurfaceMaterial(this.tableConfig.wall, 15, 6);
      }
      
      if (this.rightWallMesh) {
        const oldMat = this.rightWallMesh.material as THREE.Material;
        oldMat.dispose();
        this.rightWallMesh.material = this.createSurfaceMaterial(this.tableConfig.wall, 15, 6);
      }
      
      // Update dice materials
      this.dice.forEach(d => {
        const currentConfig = d.getConfig();
        d.updateConfig(currentConfig, this.graphicsSettings.diceBevelSegments);
      });
      
      // Force resize and render
      setTimeout(() => {
        this.resize();
        this.renderer.render(this.scene, this.camera);
        console.log('[Game] WebGL context fully restored');
        
        // Log memory after restore
        if ((performance as any).memory) {
          const mem = (performance as any).memory;
          console.log('[Game] Memory after restore:', {
            used: Math.round(mem.usedJSHeapSize / 1048576) + 'MB',
            total: Math.round(mem.totalJSHeapSize / 1048576) + 'MB',
            limit: Math.round(mem.jsHeapSizeLimit / 1048576) + 'MB'
          });
        }
      }, 100);
    }, false);
  }
  
  // Graphics quality methods
  private loadGraphicsQuality() {
    const saved = localStorage.getItem('graphicsQuality') as GraphicsQuality | null;
    if (saved && GRAPHICS_PRESETS[saved]) {
      this.graphicsQuality = saved;
      this.graphicsSettings = GRAPHICS_PRESETS[saved];
    }
    
    // Auto-detect low memory devices and force low quality
    if ((performance as any).memory) {
      const mem = (performance as any).memory;
      const limitMB = mem.jsHeapSizeLimit / 1048576;
      
      // If heap limit is less than 512MB, force low quality
      if (limitMB < 512 && this.graphicsQuality !== 'low') {
        console.warn(`[Game] Low memory detected (${Math.round(limitMB)}MB limit), forcing low quality`);
        this.graphicsQuality = 'low';
        this.graphicsSettings = GRAPHICS_PRESETS.low;
        localStorage.setItem('graphicsQuality', 'low');
      }
    }
  }
  
  public getGraphicsQuality(): GraphicsQuality {
    return this.graphicsQuality;
  }
  
  public setGraphicsQuality(quality: GraphicsQuality) {
    if (this.graphicsQuality === quality) return;
    
    this.graphicsQuality = quality;
    this.graphicsSettings = GRAPHICS_PRESETS[quality];
    localStorage.setItem('graphicsQuality', quality);
    
    // Apply settings that can be changed at runtime
    this.renderer.setPixelRatio(this.graphicsSettings.pixelRatio);
    this.renderer.shadowMap.enabled = this.graphicsSettings.shadowsEnabled;
    
    // Update shadows on existing meshes
    this.dice.forEach(d => {
      d.mesh.castShadow = this.graphicsSettings.shadowsEnabled;
    });
    if (this.tableMesh) {
      this.tableMesh.receiveShadow = this.graphicsSettings.shadowsEnabled;
    }
    
    // Update dice materials (bevel segments)
    this.dice.forEach(d => {
      const currentConfig = d.getConfig();
      d.updateConfig(currentConfig, this.graphicsSettings.diceBevelSegments);
    });
    
    // Note: antialias and dice bevel segments require page reload to take effect
    console.log(`[Game] Graphics quality set to: ${quality}`);
  }


  private setupScene() {
    // Table (floor) - extended to fill view with velvet texture
    const tableGeom = new THREE.PlaneGeometry(20, 20);
    const tableMat = this.createSurfaceMaterial(this.tableConfig.floor, 20, 20);
    this.tableMesh = new THREE.Mesh(tableGeom, tableMat);
    this.tableMesh.rotation.x = -Math.PI / 2;
    this.tableMesh.receiveShadow = true;
    this.scene.add(this.tableMesh);
    
    // Table border/rail (decorative edge between table and walls)
    const borderHeight = 0.08;
    const borderWidth = 0.12;
    const borderConfig = this.tableConfig.border || {
      color: "#2a2520",
      roughness: 0.3,
      metalness: 0.6
    };
    const borderMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(borderConfig.color),
      roughness: borderConfig.roughness,
      metalness: borderConfig.metalness,
    });
    
    // Back border (visible from camera)
    this.backBorderMesh = new THREE.Mesh(
      new THREE.BoxGeometry(12, borderHeight, borderWidth),
      borderMat
    );
    this.backBorderMesh.position.set(0, borderHeight / 2, -5);
    this.backBorderMesh.castShadow = this.graphicsSettings.shadowsEnabled;
    this.backBorderMesh.receiveShadow = this.graphicsSettings.shadowsEnabled;
    this.scene.add(this.backBorderMesh);
    
    // Left border (extends to wall)
    this.leftBorderMesh = new THREE.Mesh(
      new THREE.BoxGeometry(borderWidth, borderHeight, 15),
      borderMat.clone()
    );
    this.leftBorderMesh.position.set(-5, borderHeight / 2, 0);
    this.leftBorderMesh.castShadow = this.graphicsSettings.shadowsEnabled;
    this.leftBorderMesh.receiveShadow = this.graphicsSettings.shadowsEnabled;
    this.scene.add(this.leftBorderMesh);
    
    // Right border (extends to wall)
    this.rightBorderMesh = new THREE.Mesh(
      new THREE.BoxGeometry(borderWidth, borderHeight, 15),
      borderMat.clone()
    );
    this.rightBorderMesh.position.set(5, borderHeight / 2, 0);
    this.rightBorderMesh.castShadow = this.graphicsSettings.shadowsEnabled;
    this.rightBorderMesh.receiveShadow = this.graphicsSettings.shadowsEnabled;
    this.scene.add(this.rightBorderMesh);
    
    // Physics floor
    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: this.floorMaterial
    });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(floorBody);
    
    // Back wall (visible)
    this.addWall(0, 1, -5, 0);
    
    // Front wall (invisible, in front of camera)
    this.addWall(0, 1, 5, Math.PI);
    
    // Side walls (will be positioned in updateSideWalls)
    const sideWallGeom = new THREE.PlaneGeometry(15, 6);
    const sideWallMat = this.createSurfaceMaterial(this.tableConfig.wall, 15, 6);
    
    // Left wall
    this.leftWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: this.wallMaterial
    });
    this.leftWall.position.set(-5, 1, 0);
    this.leftWall.quaternion.setFromEuler(0, Math.PI / 2, 0);
    this.world.addBody(this.leftWall);
    
    this.leftWallMesh = new THREE.Mesh(sideWallGeom, sideWallMat);
    this.leftWallMesh.position.set(-5, 3, 0);
    this.leftWallMesh.rotation.y = Math.PI / 2;
    this.leftWallMesh.receiveShadow = true;
    this.scene.add(this.leftWallMesh);
    
    // Right wall
    this.rightWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: this.wallMaterial
    });
    this.rightWall.position.set(5, 1, 0);
    this.rightWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);
    this.world.addBody(this.rightWall);
    
    this.rightWallMesh = new THREE.Mesh(sideWallGeom.clone(), sideWallMat.clone());
    this.rightWallMesh.position.set(5, 3, 0);
    this.rightWallMesh.rotation.y = -Math.PI / 2;
    this.rightWallMesh.receiveShadow = true;
    this.scene.add(this.rightWallMesh);
    
    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0);
    this.scene.add(ambient);
    
    // SpotLight for realistic shadows
    const spotLight = new THREE.SpotLight(0xffffff, 2.8);
    spotLight.position.set(-5, 15, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    spotLight.decay = 0;
    spotLight.distance = 0;
    spotLight.castShadow = this.graphicsSettings.shadowsEnabled;
    // Optimized but still good quality shadows
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.radius = 1.5;
    spotLight.shadow.camera.near = 5;
    spotLight.shadow.camera.far = 30;
    spotLight.shadow.bias = -0.0001;
    this.scene.add(spotLight);
    
    // Directional light for better highlights on dice
    const tableLight = new THREE.DirectionalLight(0xffffff, 2.1);
    tableLight.position.set(3, 5, 8);
    this.scene.add(tableLight);
    
    // Back wall (visible, receives shadows)
    const wallGeom = new THREE.PlaneGeometry(12, 6);
    const wallMat = this.createSurfaceMaterial(this.tableConfig.wall, 12, 6);
    this.backWallMesh = new THREE.Mesh(wallGeom, wallMat);
    this.backWallMesh.position.set(0, 3, -5);
    this.backWallMesh.receiveShadow = true;
    this.scene.add(this.backWallMesh);
    
    // Create wall text for displaying pips
    // Позиция: по центру стены (x=0)
    this.wallText = new WallText(
      this.scene,
      new THREE.Vector3(0, 2.5, -4.9), // По центру (x=0)
      6, // ширина
      3  // высота
    );
    // Pips are synced exclusively from the server (auth_success / pips_updated).
    // We intentionally do NOT seed from localStorage to avoid desync between
    // wall display and top-right corner.
    
    // Create dice
    // Don't load custom dice config at startup - it should only apply when user explicitly uses editor
    for (let i = 0; i < 2; i++) {
      const dice = new Dice(this.scene, this.world, this.diceMaterial, undefined, this.graphicsSettings.diceBevelSegments);
      dice.mesh.castShadow = this.graphicsSettings.shadowsEnabled;
      this.dice.push(dice);
    }
    
    // Initialize DiceSync now that dice are created
    this.diceSync = new DiceSync(
      this.dice, 
      this.audio, 
      this.scene, 
      this.world,
      () => this.gameSync.getGameMode(),
      this // Pass Game instance
    );
    
    // Create invisible hand box for shaking dice
    this.createHandBox();
    
    // Create initial environment map
    this.updateEnvMap();
    
    this.resetDiceToHand();
  }
  
  // Update environment map based on table colors (for metal reflections)
  private updateEnvMap() {
    if (!this.pmremGenerator) return;
    
    // Dispose old env map
    if (this.envMap) {
      this.envMap.dispose();
    }
    
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
    
    const tempScene = new THREE.Scene();
    
    const envGeom = new THREE.SphereGeometry(50, 32, 32);
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext('2d')!;
    
    // Get actual colors from materials (considering loaded textures)
    // If realTexture is used, use white/neutral color for env map
    // (floorColor and wallColor are not used in current implementation)
    
    // Create dark base
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 256);
    
    // Add bright spots at edges (back wall - opposite from camera)
    // Left edge
    const spotRadius = 120;
    
    const spotGradient1 = ctx.createRadialGradient(0, 128, 0, 0, 128, spotRadius);
    spotGradient1.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    spotGradient1.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    spotGradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = spotGradient1;
    ctx.fillRect(0, 0, 256, 256);
    
    // Right edge
    const spotGradient2 = ctx.createRadialGradient(512, 128, 0, 512, 128, spotRadius);
    spotGradient2.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    spotGradient2.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    spotGradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = spotGradient2;
    ctx.fillRect(256, 0, 256, 256);
    
    const envTexture = new THREE.CanvasTexture(envCanvas);
    const envMat = new THREE.MeshBasicMaterial({ 
      map: envTexture, 
      side: THREE.BackSide 
    });
    const envMesh = new THREE.Mesh(envGeom, envMat);
    tempScene.add(envMesh);
    
    cubeCamera.update(this.renderer, tempScene);
    
    this.envMap = this.pmremGenerator.fromCubemap(cubeRenderTarget.texture).texture;
    this.scene.environment = this.envMap;
    
    // Cleanup
    envGeom.dispose();
    envMat.dispose();
    envTexture.dispose();
    cubeRenderTarget.dispose();
  }
  
  // Cache for normal map textures (avoid regenerating random patterns)
  private normalMapCache = new Map<string, THREE.CanvasTexture>();
  
  // Clear texture cache (call when texture generation changes)
  private clearNormalMapCache() {
    this.normalMapCache.forEach(texture => texture.dispose());
    this.normalMapCache.clear();
  }
  
  // Create material for table/walls from SurfaceConfig
  private createSurfaceMaterial(config: SurfaceConfig, width: number, height: number): THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial {
    const type = config.texture || 'felt';
    const scale = config.textureScale || 'medium';
    
    // Calculate repeat based on texture scale
    const scaleMultipliers = {
      small: 4,    // 4x4 repeats
      medium: 2,   // 2x2 repeats
      large: 1     // 1x1 repeat
    };
    const scaleMultiplier = scaleMultipliers[scale];
    const textureWorldSize = 10 / scaleMultiplier;
    const repeatX = width / textureWorldSize;
    const repeatY = height / textureWorldSize;
    
    // Use lighter MeshStandardMaterial on low/medium settings
    const useLightMaterial = this.graphicsQuality === 'low' || this.graphicsQuality === 'medium';
    
    const material = useLightMaterial 
      ? new THREE.MeshStandardMaterial({
          color: new THREE.Color(config.color),
          roughness: config.roughness,
          metalness: config.metalness,
        })
      : new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(config.color),
          roughness: config.roughness,
          metalness: config.metalness,
          clearcoat: config.clearcoat ?? 0,
          clearcoatRoughness: config.clearcoatRoughness ?? 0.1,
        });
    
    // If realTexture is specified, load it instead of procedural
    if (config.realTexture) {
      this.loadRealTexture(config.realTexture, material, repeatX, repeatY, config);
    } else {
      // Use procedural normal map
      const cacheKey = `${type}_${scale}`;
      let normalTexture = this.normalMapCache.get(cacheKey);
      if (!normalTexture) {
        const normalMap = this.generateSurfaceNormalMap(type, scale);
        normalTexture = new THREE.CanvasTexture(normalMap);
        normalTexture.wrapS = THREE.RepeatWrapping;
        normalTexture.wrapT = THREE.RepeatWrapping;
        this.normalMapCache.set(cacheKey, normalTexture);
      }
      
      const textureClone = normalTexture.clone();
      textureClone.repeat.set(repeatX, repeatY);
      textureClone.needsUpdate = true;
      
      material.normalMap = textureClone;
      material.normalScale = new THREE.Vector2(config.normalIntensity, config.normalIntensity);
    }
    
    // Emissive (for neon/glow effects)
    if (config.emissive) {
      material.emissive = new THREE.Color(config.emissive);
      material.emissiveIntensity = config.emissiveIntensity ?? 0.5;
    }
    
    return material;
  }
  
  // Load real texture from /textures/ folder
  // Color map is optional - can use just normal/roughness for procedural coloring
  private loadRealTexture(
    textureId: string, 
    material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial, 
    repeatX: number, 
    repeatY: number,
    config: SurfaceConfig
  ) {
    // Parse textureId: "category_name" -> category="category", name="name"
    const parts = textureId.split('_');
    if (parts.length < 2) {
      console.warn(`[Game] Invalid realTexture ID: ${textureId}`);
      return;
    }
    
    const category = parts[0];
    const name = parts.slice(1).join('_');
    const basePath = `/textures/${category}/${name}`;
    
    const loader = new THREE.TextureLoader();
    
    // Load color map (optional)
    loader.load(
      `${basePath}_color.jpg`,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
        material.map = texture;
        // Apply color as tint (multiplies with texture)
        material.color.set(config.color);
        material.needsUpdate = true;
      },
      undefined,
      () => {
        // Color map is optional - just use material color if not found
        console.log(`[Game] No color map for ${textureId}, using material color`);
      }
    );
    
    // Load normal map
    loader.load(`${basePath}_normal.jpg`, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatY);
      material.normalMap = texture;
      material.normalScale = new THREE.Vector2(config.normalIntensity, config.normalIntensity);
      material.needsUpdate = true;
    });
    
    // Load roughness map
    loader.load(`${basePath}_roughness.jpg`, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatY);
      material.roughnessMap = texture;
      material.roughness = config.roughness; // Use as multiplier
      material.needsUpdate = true;
    });
    
    // Try to load metalness map (optional)
    loader.load(
      `${basePath}_metalness.jpg`, 
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
        material.metalnessMap = texture;
        material.metalness = config.metalness; // Use as multiplier
        material.needsUpdate = true;
      },
      undefined,
      () => {} // Ignore error if metalness doesn't exist
    );
  }
  
  // Generate normal map for different surface types
  private generateSurfaceNormalMap(type: string, scale: 'small' | 'medium' | 'large' = 'medium'): HTMLCanvasElement {
    // Reduce texture size on low-end devices to save memory
    const size = this.graphicsQuality === 'low' ? 128 : 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Start with neutral normal (128, 128, 255)
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    // Initialize to neutral
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 128;     // R
      data[i + 1] = 128; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A
    }
    
    switch (type) {
      case 'felt':
        this.generateFeltNormals(data, size, scale);
        break;
      case 'leather':
        this.generateLeatherNormals(data, size, scale);
        break;
      case 'velvet':
        this.generateVelvetNormals(data, size, scale);
        break;
      case 'wood':
        this.generateWoodNormals(data, size, scale);
        break;
      case 'marble':
        this.generateMarbleNormals(data, size, scale);
        break;
      case 'concrete':
        this.generateConcreteNormals(data, size, scale);
        break;
      case 'diamond':
        this.generateDiamondNormals(data, size, scale);
        break;
      case 'glass':
        this.generateGlassNormals(data, size, scale);
        break;
      case 'hexagon':
        this.generateHexagonNormals(data, size, scale);
        break;
      case 'brick':
        this.generateBrickNormals(data, size, scale);
        break;
      case 'scales':
        this.generateScalesNormals(data, size, scale);
        break;
      case 'waves':
        this.generateWavesNormals(data, size, scale);
        break;
      case 'dots':
        this.generateDotsNormals(data, size, scale);
        break;
      case 'stripes':
        this.generateStripesNormals(data, size, scale);
        break;
      case 'checker':
        this.generateCheckerNormals(data, size, scale);
        break;
      case 'smooth':
      default:
        this.generateSmoothNormals(data, size, scale);
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }
  
  // Felt - fine random grain with more pronounced bumps
  private generateFeltNormals(data: Uint8ClampedArray, size: number, _scale: 'small' | 'medium' | 'large') {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        // Stronger random noise for more visible texture
        const nx = (Math.random() - 0.5) * 0.4;
        const ny = (Math.random() - 0.5) * 0.4;
        
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = 230; // Lower Z for more pronounced effect
      }
    }
  }
  
  // Leather - organic grain
  private generateLeatherNormals(data: Uint8ClampedArray, size: number, _scale: 'small' | 'medium' | 'large') {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        // Organic bumps using sin with noise offset
        const noiseX = Math.sin(x * 0.3 + Math.random() * 2) * 0.2;
        const noiseY = Math.sin(y * 0.3 + Math.random() * 2) * 0.2;
        
        // Add fine grain
        const nx = noiseX + (Math.random() - 0.5) * 0.15;
        const ny = noiseY + (Math.random() - 0.5) * 0.15;
        
        data[idx] = Math.floor((nx * 0.4 + 0.5) * 255);
        data[idx + 1] = Math.floor((ny * 0.4 + 0.5) * 255);
        data[idx + 2] = 230;
      }
    }
  }
  
  // Velvet - soft random texture
  private generateVelvetNormals(data: Uint8ClampedArray, size: number, _scale: 'small' | 'medium' | 'large') {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        // Soft random variation
        const nx = (Math.random() - 0.5) * 0.2;
        const ny = (Math.random() - 0.5) * 0.2;
        
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = 245;
      }
    }
  }
  
  // Smooth - very subtle texture
  private generateSmoothNormals(data: Uint8ClampedArray, size: number, _scale: 'small' | 'medium' | 'large') {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        // Very subtle noise
        const nx = (Math.random() - 0.5) * 0.08;
        const ny = (Math.random() - 0.5) * 0.08;
        
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = 252;
      }
    }
  }
  
  // Wood - horizontal grain pattern
  private generateWoodNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    // Scale affects grain frequency: small=dense, medium=normal, large=wide
    const freq = scale === 'small' ? 1.0 : scale === 'medium' ? 0.5 : 0.25;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const grain = Math.sin(y * freq + Math.sin(x * 0.1) * 3) * 0.3;
        const noise = (Math.random() - 0.5) * 0.1;
        const nx = noise;
        const ny = grain + noise;
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
        data[idx + 2] = 235;
      }
    }
  }
  
  // Marble - veins pattern
  private generateMarbleNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const freq = scale === 'small' ? 0.1 : scale === 'medium' ? 0.05 : 0.025;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const vein = Math.sin(x * freq + y * freq * 0.6 + Math.sin(x * freq * 0.4) * 5) * 0.25;
        const noise = (Math.random() - 0.5) * 0.05;
        const nx = vein + noise;
        const ny = Math.cos(x * freq * 0.8 + y * freq) * 0.15 + noise;
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = 240;
      }
    }
  }
  
  // Concrete - rough with pits
  private generateConcreteNormals(data: Uint8ClampedArray, size: number, _scale: 'small' | 'medium' | 'large') {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const pit = Math.random() > 0.95 ? (Math.random() - 0.5) * 0.6 : 0;
        const nx = (Math.random() - 0.5) * 0.3 + pit;
        const ny = (Math.random() - 0.5) * 0.3 + pit;
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = 225;
      }
    }
  }
  
  // Glass - very smooth with subtle distortions
  private generateGlassNormals(data: Uint8ClampedArray, size: number, _scale: 'small' | 'medium' | 'large') {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const wave = Math.sin(x * 0.1) * Math.sin(y * 0.1) * 0.02;
        const nx = wave + (Math.random() - 0.5) * 0.02;
        const ny = wave + (Math.random() - 0.5) * 0.02;
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = 254;
      }
    }
  }
  
  // Diamond - quilted pattern
  private generateDiamondNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const cellSize = scale === 'small' ? 16 : scale === 'medium' ? 32 : 64;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const cx = (x % cellSize) - cellSize / 2;
        const cy = (y % cellSize) - cellSize / 2;
        const dist = Math.abs(cx) + Math.abs(cy);
        const edge = dist > cellSize / 2 - 4 && dist < cellSize / 2 + 4;
        
        let nx = 0, ny = 0;
        if (edge) {
          nx = cx / (Math.abs(cx) + 0.1) * 0.4;
          ny = cy / (Math.abs(cy) + 0.1) * 0.4;
        } else {
          nx = cx / cellSize * 0.15;
          ny = cy / cellSize * 0.15;
        }
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = edge ? 220 : 240;
      }
    }
  }
  
  // Hexagon - honeycomb pattern (tileable)
  private generateHexagonNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const cols = scale === 'small' ? 16 : scale === 'medium' ? 8 : 4;
    const hexW = size / cols;
    const hexH = hexW * 0.866;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        const row = Math.floor(y / (hexH * 0.75));
        const offsetX = (row % 2) * (hexW / 2);
        
        const cellX = (x + offsetX) % hexW;
        const cellY = y % (hexH * 0.75);
        
        const hx = cellX - hexW / 2;
        const hy = cellY - hexH * 0.375;
        
        const dist = Math.max(Math.abs(hx) * 1.15 + Math.abs(hy) * 0.58, Math.abs(hy));
        const radius = hexW * 0.45;
        const edge = dist > radius * 0.85 && dist < radius * 1.1;
        
        let nx = 0, ny = 0;
        if (edge) {
          const len = Math.sqrt(hx * hx + hy * hy) + 0.1;
          nx = (hx / len) * 0.5;
          ny = (hy / len) * 0.5;
        }
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = edge ? 210 : 245;
      }
    }
  }
  
  // Brick - brick wall pattern (tileable)
  private generateBrickNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const rows = scale === 'small' ? 4 : scale === 'medium' ? 2 : 1;
    const bricksPerRow = scale === 'small' ? 4 : scale === 'medium' ? 2 : 1;
    const brickH = size / rows;
    const brickW = size / bricksPerRow;
    const mortarW = scale === 'small' ? 2 : scale === 'medium' ? 4 : 6;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        const row = Math.floor(y / brickH);
        const offsetX = (row % 2) * (brickW / 2);
        const bx = ((x + offsetX) % brickW);
        const by = y % brickH;
        
        const inMortarX = bx < mortarW;
        const inMortarY = by < mortarW;
        
        let nx = 0, ny = 0;
        if (inMortarX || inMortarY) {
          if (inMortarY && !inMortarX) ny = 0.4;
          if (inMortarX && !inMortarY) nx = 0.4;
          if (inMortarX && inMortarY) { nx = 0.3; ny = 0.3; }
        } else {
          nx = (Math.random() - 0.5) * 0.1;
          ny = (Math.random() - 0.5) * 0.1;
        }
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = (inMortarX || inMortarY) ? 200 : 240;
      }
    }
  }
  
  // Scales - fish scale / roof tile pattern (tileable)
  private generateScalesNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const cols = scale === 'small' ? 16 : scale === 'medium' ? 8 : 4;
    const scaleW = size / cols;
    const scaleH = scaleW * 0.75;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        const row = Math.floor(y / scaleH);
        const offsetX = (row % 2) * (scaleW / 2);
        const sx = (((x + offsetX) % scaleW) + scaleW) % scaleW - scaleW / 2;
        const sy = ((y % scaleH) + scaleH) % scaleH - scaleH;
        
        const dist = Math.sqrt(sx * sx + sy * sy);
        const radius = scaleW * 0.55;
        const inScale = dist < radius;
        const edge = dist > radius * 0.8 && dist < radius * 1.05;
        
        let nx = 0, ny = 0;
        if (inScale && dist > 0.1) {
          nx = (sx / dist) * 0.2;
          ny = (sy / dist) * 0.2 + 0.08;
        }
        if (edge) {
          nx *= 1.8;
          ny *= 1.8;
        }
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = edge ? 215 : 240;
      }
    }
  }
  
  // Waves - wavy pattern
  private generateWavesNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const waveLen = scale === 'small' ? 20 : scale === 'medium' ? 40 : 80;
    const amplitude = 0.4;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        const phase = (x / waveLen) * Math.PI * 2;
        const ny = Math.cos(phase) * amplitude;
        const nx = (Math.random() - 0.5) * 0.1;
        
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = 235;
      }
    }
  }
  
  // Dots - perforated pattern
  private generateDotsNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const spacing = scale === 'small' ? 10 : scale === 'medium' ? 20 : 40;
    const dotRadius = spacing * 0.3;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        const dx = (x % spacing) - spacing / 2;
        const dy = (y % spacing) - spacing / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let nx = 0, ny = 0;
        if (dist < dotRadius && dist > 0.1) {
          const depth = 1 - dist / dotRadius;
          nx = -(dx / dist) * depth * 0.5;
          ny = -(dy / dist) * depth * 0.5;
        }
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = dist < dotRadius ? 220 : 250;
      }
    }
  }
  
  // Stripes - diagonal stripes
  private generateStripesNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const stripeWidth = scale === 'small' ? 8 : scale === 'medium' ? 16 : 32;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        const stripe = ((x + y) % (stripeWidth * 2)) / stripeWidth;
        const inGroove = stripe < 1;
        
        let nx = 0, ny = 0;
        if (inGroove) {
          const pos = stripe;
          if (pos < 0.3) {
            nx = 0.3; ny = 0.3;
          } else if (pos > 0.7) {
            nx = -0.3; ny = -0.3;
          }
        }
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = inGroove ? 225 : 245;
      }
    }
  }
  
  // Checker - checkerboard with beveled edges
  private generateCheckerNormals(data: Uint8ClampedArray, size: number, scale: 'small' | 'medium' | 'large') {
    const cellSize = scale === 'small' ? 16 : scale === 'medium' ? 32 : 64;
    const bevel = Math.max(2, cellSize / 8);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        const cx = x % cellSize;
        const cy = y % cellSize;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const isWhite = (cellX + cellY) % 2 === 0;
        
        let nx = 0, ny = 0;
        if (cx < bevel) nx = isWhite ? 0.3 : -0.3;
        else if (cx > cellSize - bevel) nx = isWhite ? -0.3 : 0.3;
        if (cy < bevel) ny = isWhite ? 0.3 : -0.3;
        else if (cy > cellSize - bevel) ny = isWhite ? -0.3 : 0.3;
        
        data[idx] = Math.floor((nx + 0.5) * 255);
        data[idx + 1] = Math.floor((ny + 0.5) * 255);
        data[idx + 2] = 240;
      }
    }
  }
  
  private createHandBox() {
    const boxSize = 2.5;  // Size of the hand box
    const boxY = 5;       // Height of the box
    const boxZ = 3;       // Z position (in front of camera)
    
    // Floor of hand box
    this.handBoxFloor = new CANNON.Body({
      type: CANNON.Body.KINEMATIC,
      shape: new CANNON.Plane(),
      material: this.floorMaterial
    });
    this.handBoxFloor.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.handBoxFloor.position.set(0, boxY - 1, boxZ);
    this.world.addBody(this.handBoxFloor);
    
    // Walls of hand box (left, right, front, back)
    const wallPositions = [
      { x: -boxSize / 2, z: boxZ, rotY: Math.PI / 2 },   // Left
      { x: boxSize / 2, z: boxZ, rotY: -Math.PI / 2 },   // Right
      { x: 0, z: boxZ - boxSize / 2, rotY: 0 },          // Front
      { x: 0, z: boxZ + boxSize / 2, rotY: Math.PI },    // Back
    ];
    
    wallPositions.forEach(pos => {
      const wall = new CANNON.Body({
        type: CANNON.Body.KINEMATIC,
        shape: new CANNON.Plane()
      });
      wall.position.set(pos.x, boxY, pos.z);
      wall.quaternion.setFromEuler(0, pos.rotY, 0);
      this.world.addBody(wall);
      this.handBoxWalls.push(wall);
    });
    
    // Ceiling
    const ceiling = new CANNON.Body({
      type: CANNON.Body.KINEMATIC,
      shape: new CANNON.Plane()
    });
    ceiling.quaternion.setFromEuler(Math.PI / 2, 0, 0);
    ceiling.position.set(0, boxY + 1.5, boxZ);
    this.world.addBody(ceiling);
    this.handBoxWalls.push(ceiling);
  }
  
  private addWall(x: number, y: number, z: number, rotY: number) {
    const wallBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: this.wallMaterial
    });
    wallBody.position.set(x, y, z);
    wallBody.quaternion.setFromEuler(0, rotY, 0);
    this.world.addBody(wallBody);
  }


  private setupControls() {
    // Touch to init audio (required by browsers)
    let audioInitialized = false;
    const initAudioOnce = async () => {
      if (audioInitialized) return;
      audioInitialized = true;
      await this.audio.init();
    };
    
    // Init audio on ANY touch/click
    const initHandler = async () => {
      await initAudioOnce();
    };
    document.addEventListener('touchstart', initHandler, { once: true, passive: true });
    document.addEventListener('click', initHandler, { once: true });
    
    // Desktop controls - hold and drag to shake, swipe up to throw
    if (!this.shakeDetector.isMobile) {
      let lastMouseY = 0;
      let lastMouseX = 0;
      let startMouseY = 0;
      let mouseShakeAccum = 0;
      let isDragging = false;
      
      const onStart = (e: MouseEvent) => {
        e.preventDefault();
        initAudioOnce();
        
        if (!this.diceInHand) return;
        
        this.isHolding = true;
        this.shakeIntensity = 0;
        this.resultEl.textContent = '';
        lastMouseY = e.clientY;
        lastMouseX = e.clientX;
        startMouseY = e.clientY;
        mouseShakeAccum = 0;
        isDragging = false;
      };
      
      const onMove = (e: MouseEvent) => {
        if (!this.isHolding || !this.diceInHand) return;
        
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        // Simulate shake from mouse movement (reduced intensity like mobile manual mode)
        const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (movement > 2) {
          isDragging = true; // Mark as dragging if moved
          const intensity = Math.min(1, movement / 50);
          this.shakeIntensity = Math.min(1, this.shakeIntensity + intensity * 0.05);
          mouseShakeAccum += movement;
          
          // Shake dice visually (reduced force)
          this.shakeDiceInHand(deltaX * 0.1, deltaY * 0.1, 0);
          this.audio.playShake(this.shakeIntensity);
          
          if (intensity > 0.4) {
            triggerHaptic('light');
          }
        }
      };
      
      const onEnd = (e: MouseEvent) => {
        e.preventDefault();
        if (!this.isHolding) return;
        
        this.isHolding = false;
        
        // Calculate upward swipe (startY - endY, positive = swiped up)
        const totalDeltaY = startMouseY - e.clientY;
        
        // Throw only if swiped up enough
        if (this.diceInHand && totalDeltaY > 30) {
          const swipeStrength = Math.min(200, totalDeltaY - 30); // 0-200 range
          const deltaY = 3 + swipeStrength * 0.04;  // 3-11 forward motion
          const deltaZ = -10 - swipeStrength * 0.1; // -10 to -30 downward motion
          this.throwDice(1, deltaY, deltaZ);
        }
      };
      
      this.canvas.addEventListener('mousedown', onStart as EventListener);
      this.canvas.addEventListener('mousemove', onMove as EventListener);
      this.canvas.addEventListener('mouseup', onEnd as EventListener);
      this.canvas.addEventListener('mouseleave', () => {
        if (this.isHolding) {
          this.isHolding = false;
        }
      });
      
      // Desktop click handler for dice selection (Palmo's Dice mode)
      this.canvas.addEventListener('click', (e) => {
        console.log('[PALMOS] Desktop click event', { isDragging, clientX: e.clientX, clientY: e.clientY });
        // Don't handle click if it was a drag operation
        if (isDragging) {
          console.log('[PALMOS] Click ignored (was dragging)');
          isDragging = false;
          return;
        }
        (window as any).debugLog?.('PALMOS', 'Canvas click event received (desktop)');
        this.handleDiceClick(e);
      });
    } else {
      // Mobile controls
      this.setupMobileControls(initAudioOnce);
    }
    
    // Movement detection - update dice visuals + sound/haptic
    let lastMoveUpdate = 0;
    this.shakeDetector.onMove = (intensity: number, accX: number, accY: number, accZ: number) => {
      if (!this.diceInHand) return;
      if (this.isMenuOpen()) return;
      if (this.isWaitingForReady) return;
      
      // In manual mode on mobile, only respond if dragging
      if (this.controlMode === 'manual' && this.shakeDetector.isMobile && !this.manualIsDragging) {
        return;
      }
      
      // Throttle to 60fps for smooth animation
      const now = Date.now();
      if (now - lastMoveUpdate < 16) return;
      lastMoveUpdate = now;
      
      this.shakeIntensity = Math.min(1, this.shakeIntensity + intensity * 0.12);
      this.shakeDiceInHand(accX, accY, accZ);
      this.audio.playShake(this.shakeIntensity);
      
      if (intensity > 0.4) {
        triggerHaptic('medium');
      } else {
        triggerHaptic('light');
      }
    };
    
    // Turn detection - sound and haptic on direction change
    this.shakeDetector.onTurn = (intensity: number) => {
      if (!this.diceInHand) return;
      if (this.isMenuOpen()) return;
      if (this.isWaitingForReady) return;
      
      // In manual mode on mobile, only respond if dragging
      if (this.controlMode === 'manual' && this.shakeDetector.isMobile && !this.manualIsDragging) {
        return;
      }
      
      this.audio.playShake(this.shakeIntensity);
      
      if (intensity > 0.4) {
        triggerHaptic('medium');
      } else {
        triggerHaptic('light');
      }
    };
    
    // Throw when sudden spike in intensity (motion mode only)
    this.shakeDetector.onThrow = (power: number, deltaY: number, deltaZ: number) => {
      // Only auto-throw in motion mode
      if (this.controlMode === 'manual') return;
      if (this.isWaitingForReady) return;
      
      if (this.diceInHand && this.shakeIntensity > 0.2) {
        this.throwDice(power, deltaY, deltaZ);
      }
    };
  }
  
  private setupMobileControls(initAudioOnce: () => Promise<void>) {
    // Permission granted callback
    this.shakeDetector.onPermissionGranted = () => {
      if (this.controlMode === 'motion') {
        this.shakeDetector.start();
      }
    };
    
    // Start motion detection if in motion mode
    if (this.controlMode === 'motion') {
      setTimeout(() => this.shakeDetector.start(), 500);
    }
    
    // Manual mode touch controls
    this.canvas.addEventListener('touchstart', async (e) => {
      if (this.controlMode !== 'manual') return;
      if (!this.diceInHand) return;
      if (this.isMenuOpen()) return;
      
      await initAudioOnce();
      
      const touch = e.touches[0];
      this.manualTouchId = touch.identifier;
      this.manualTouchStartY = touch.clientY;
      this.manualLastY = touch.clientY;
      this.manualIsDragging = true;
      this.isHolding = true;
      this.shakeIntensity = 0;
      
      triggerHaptic('light');
    }, { passive: true });
    
    this.canvas.addEventListener('touchmove', (e) => {
      if (this.controlMode !== 'manual') return;
      if (!this.manualIsDragging) return;
      
      const touch = Array.from(e.touches).find(t => t.identifier === this.manualTouchId);
      if (!touch) return;
      
      const deltaY = this.manualLastY - touch.clientY;
      this.manualLastY = touch.clientY;
      
      // Simulate gentle shake based on drag movement
      const intensity = Math.abs(deltaY) / 40;
      if (intensity > 0.1) {
        this.shakeIntensity = Math.min(1, this.shakeIntensity + intensity * 0.1);
        // Apply very gentle force to dice - just enough to show movement
        this.shakeDiceInHand(
          (Math.random() - 0.5) * intensity * 1.5,
          deltaY * 0.1,
          (Math.random() - 0.5) * intensity * 1.5
        );
        this.audio.playShake(this.shakeIntensity);
        triggerHaptic('light');
      }
    }, { passive: true });
    
    this.canvas.addEventListener('touchend', (e) => {
      if (this.controlMode !== 'manual') return;
      if (!this.manualIsDragging) return;
      
      const touch = Array.from(e.changedTouches).find(t => t.identifier === this.manualTouchId);
      if (!touch) return;
      
      const totalDeltaY = this.manualTouchStartY - touch.clientY;
      
      this.manualIsDragging = false;
      this.isHolding = false;
      this.manualTouchId = null;
      
      // Throw if swiped up enough
      if (totalDeltaY > 50 && this.diceInHand) {
        // Convert swipe distance to throw power
        // 50px = weak throw, 200px+ = strong throw
        const swipeStrength = Math.min(200, totalDeltaY - 50); // 0-200 range
        const deltaY = 3 + swipeStrength * 0.04;  // 3-11 forward motion
        const deltaZ = -10 - swipeStrength * 0.1; // -10 to -30 downward motion
        this.throwDice(1, deltaY, deltaZ);
      }
    }, { passive: true });
    
    // Also handle touchcancel
    this.canvas.addEventListener('touchcancel', () => {
      this.manualIsDragging = false;
      this.isHolding = false;
      this.manualTouchId = null;
    }, { passive: true });
    
    // Click handler for dice selection (Palmo's Dice mode)
    // Track last touch time to prevent double-firing (touchend + click)
    let lastTouchTime = 0;
    
    this.canvas.addEventListener('touchend', (e) => {
      (window as any).debugLog?.('PALMOS', 'Canvas touchend event received');
      lastTouchTime = Date.now();
      
      // Only handle single tap (not drag)
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        this.handleDiceClick(touch);
      }
    }, { passive: true });
    
    // Prevent click event after touchend (mobile devices fire both)
    this.canvas.addEventListener('click', (e) => {
      if (Date.now() - lastTouchTime < 500) {
        (window as any).debugLog?.('PALMOS', 'Click ignored (after touch)');
        return;
      }
      (window as any).debugLog?.('PALMOS', 'Canvas click event received');
      this.handleDiceClick(e);
    });
  }
  
  private resetDiceToHand() {
    // In multiplayer, only reset if it's our turn or we're not in game
    if (this.gameSync.isMultiplayerActive() && !this.gameSync.isMyTurn()) {
      return;
    }
    
    this.diceInHand = true;
    this.shakeIntensity = 0;
    
    // Enable hand box physics
    this.handBoxWalls.forEach(w => w.collisionResponse = true);
    if (this.handBoxFloor) this.handBoxFloor.collisionResponse = true;
    
    this.dice.forEach((dice, i) => {
      // Make dice dynamic so they can roll in hand
      dice.body.type = CANNON.Body.DYNAMIC;
      dice.body.wakeUp();
      dice.setPosition(
        (i - 0.5) * 1.0, // Increased spacing from 0.8 to 1.0
        5,
        3
      );
      dice.setVelocity(0, 0, 0);
      dice.setAngularVelocity(0, 0, 0);
    });
    this.hintEl.textContent = '';
  }
  
  // Prepare selected dice for reroll (Palmo's Dice mode)
  public prepareRerollDice(selectedIndices: number[]) {
    (window as any).debugLog?.('PALMOS', `Preparing reroll for dice: [${selectedIndices.join(',')}]`);
    
    // Store selection for streaming
    this.lastRerollSelection = selectedIndices;
    
    this.diceInHand = true;
    this.shakeIntensity = 0;
    
    // Clear selection
    this.clearDiceSelection();
    
    // Disable dice selection during reroll
    this.disableDiceSelection();
    
    // Enable hand box physics
    this.handBoxWalls.forEach(w => w.collisionResponse = true);
    if (this.handBoxFloor) this.handBoxFloor.collisionResponse = true;
    
    // Only move selected dice to hand, leave others on table
    this.dice.forEach((dice, i) => {
      if (selectedIndices.includes(i)) {
        // Selected dice - move to hand
        dice.body.type = CANNON.Body.DYNAMIC;
        dice.body.wakeUp();
        
        // Position in hand (centered based on number of selected dice)
        const selectedCount = selectedIndices.length;
        const selectedIndex = selectedIndices.indexOf(i);
        const offset = (selectedIndex - (selectedCount - 1) / 2) * 1.0;
        
        dice.setPosition(offset, 5, 3);
        dice.setVelocity(0, 0, 0);
        dice.setAngularVelocity(0, 0, 0);
        
        (window as any).debugLog?.('PALMOS', `Dice ${i} moved to hand`);
      } else {
        // Not selected - make static so it stays on table
        dice.body.type = CANNON.Body.STATIC;
        dice.body.sleep();
        
        (window as any).debugLog?.('PALMOS', `Dice ${i} stays on table`);
      }
    });
    
    this.hintEl.textContent = '';
    (window as any).debugLog?.('PALMOS', 'Reroll dice ready');
    (window as any).debugLog?.('PALMOS', `About to check recording: diceSync=${!!this.diceSync}, multiplayer=${this.gameSync.isMultiplayerActive()}`);
    
    // Start recording stream for multiplayer (with selected dice info)
    if (this.diceSync && this.gameSync.isMultiplayerActive()) {
      (window as any).debugLog?.('PALMOS', 'prepareRerollDice: Starting recording for multiplayer');
      
      // Stop any existing recording first (from previous throw or turn start)
      if (this.diceSync.isCurrentlyRecording()) {
        (window as any).debugLog?.('PALMOS', 'prepareRerollDice: Stopping previous recording');
        this.diceSync.stopRecordingStream(false); // Don't send throw_end
      }
      
      // Now start new recording with selected dice
      (window as any).debugLog?.('PALMOS', `prepareRerollDice: Starting new recording with selectedDice: [${selectedIndices.join(',')}]`);
      this.diceSync.startRecordingStream(0, this.gameSync.getEquippedEffectId(), selectedIndices);
      (window as any).debugLog?.('PALMOS', `prepareRerollDice: Recording started, isRecording: ${this.diceSync.isCurrentlyRecording()}`);
    } else {
      (window as any).debugLog?.('PALMOS', `prepareRerollDice: NOT starting recording - diceSync: ${!!this.diceSync}, multiplayer: ${this.gameSync.isMultiplayerActive()}`);
    }
  }
  
  private shakeDiceInHand(accX: number = 0, accY: number = 0, accZ: number = 0) {
    // Apply acceleration as force to dice - they roll inside the hand box
    const forceMult = 15;
    
    this.dice.forEach((dice) => {
      // Only shake dice that are in hand (DYNAMIC), skip STATIC dice on table
      if (dice.body.type !== CANNON.Body.DYNAMIC) {
        return;
      }
      
      // Apply force based on phone acceleration
      dice.body.applyForce(
        new CANNON.Vec3(accX * forceMult, -accZ * forceMult * 0.5, accY * forceMult),
        dice.body.position
      );
      
      // Keep dice awake
      dice.body.wakeUp();
    });
  }


  private throwDice(_power: number = 0.5, deltaY: number = 5, deltaZ: number = -20) {
    console.log('[Game] throwDice called', {
      isMultiplayer: this.gameSync.isMultiplayerActive(),
      isMyTurn: this.gameSync.isMyTurn(),
      isReplaying: this.diceSync?.isCurrentlyReplaying(),
      diceInHand: this.diceInHand,
      isMenuOpen: this.isMenuOpen()
    });
    
    // Check if menu is open - block throws
    if (this.isMenuOpen()) {
      console.log('[Game] Menu is open, cannot throw');
      return;
    }
    
    // Check if multiplayer is active and if it's our turn
    if (this.gameSync.isMultiplayerActive() && !this.gameSync.isMyTurn()) {
      console.log('[Game] Not your turn in multiplayer');
      return;
    }
    
    // Check if we're replaying another player's throw
    if (this.diceSync?.isCurrentlyReplaying()) {
      console.log('[Game] Cannot throw while replaying');
      return;
    }
    
    // Check if dice are in hand
    if (!this.diceInHand) {
      console.log('[Game] Dice not in hand, cannot throw');
      return;
    }
    
    this.diceInHand = false;
    this.hintEl.textContent = '';
    
    // Block Stop/Pass buttons during throw
    this.gameSync.setThrowInProgress(true);
    
    // Disable hand box walls so dice can fly out
    this.handBoxWalls.forEach(w => w.collisionResponse = false);
    if (this.handBoxFloor) this.handBoxFloor.collisionResponse = false;
    
    triggerHaptic('heavy');
    
    // Recording already started in forceResetDiceToHand(), just continue streaming
    // (no need to call startRecordingStream again)
    
    // Seeded random function for anti-cheat
    // Uses seed to add unpredictable variation to spin that can't be pre-calculated
    const seededRandom = () => {
      // Simple seeded PRNG (mulberry32)
      let t = this.throwSeed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    
    // Calculate throw direction from accelerometer data
    // deltaY = forward motion (typically 3-10), deltaZ = downward motion (typically -15 to -35)
    const forwardPower = 8 + Math.abs(deltaY) * 3;   // Base + forward speed
    const downPower = Math.abs(deltaZ) * 0.5;        // Downward force
    
    this.dice.forEach((dice) => {
      // Only throw dice that are in hand (DYNAMIC), skip STATIC dice on table
      if (dice.body.type !== CANNON.Body.DYNAMIC) {
        (window as any).debugLog?.('PALMOS', `Skipping static dice ${this.dice.indexOf(dice)}`);
        return;
      }
      
      dice.body.wakeUp();
      
      // Throw direction - consistent based on gesture
      dice.setVelocity(
        (Math.random() - 0.5) * forwardPower * 0.4,   // Side spread
        Math.max(-5, 3 - downPower * 0.3),            // Vertical
        -(forwardPower + downPower * 0.4)             // Forward speed
      );
      
      // Spin with seed-based randomization (±20% variation)
      // Add strong vertical spin (around X axis) - dice tumble forward (top goes away from player)
      const totalPower = forwardPower + downPower;
      const baseSpin = 15 + totalPower * 0.5;
      const spinVariation = 1 + (seededRandom() - 0.5) * 0.4; // 0.8 to 1.2
      
      // Strong forward tumble (negative X = top goes forward/away)
      // Seed adds variation to strength, not direction
      const verticalSpinStrength = 35 + seededRandom() * 20; // 35-55 strong vertical spin
      
      dice.setAngularVelocity(
        -verticalSpinStrength * spinVariation, // Negative X = forward tumble (top away from player)
        (seededRandom() - 0.5) * baseSpin * 0.3,  // Small Y wobble
        (seededRandom() - 0.5) * baseSpin * 0.3   // Small Z wobble
      );
    });
    
    setTimeout(() => this.waitForDiceToStop(), 500);
  }
  
  private waitForDiceToStop() {
    const checkInterval = setInterval(() => {
      const allStopped = this.dice.every(d => {
        const vel = d.body.velocity.length();
        const angVel = d.body.angularVelocity.length();
        return vel < 0.02 && angVel < 0.02;
      });
      
      if (allStopped) {
        clearInterval(checkInterval);
        this.checkDiceValidityAndShowResult();
      }
    }, 100);
  }
  
  private checkDiceValidityAndShowResult() {
    (window as any).debugLog?.('DICE', '========== CHECKING VALIDITY ==========');
    
    // Проверяем, валиден ли бросок (кубики не на боку)
    const validation = DiceValidator.validateDicePositions(this.dice);
    
    // Логируем углы наклона и высоту
    const info = this.dice.map((dice, i) => {
      const angle = DiceValidator.getDiceTiltAngle(dice);
      const height = DiceValidator.getDiceHeight(dice);
      return `D${i}:${angle.toFixed(1)}°/h${height.toFixed(2)}`;
    });
    (window as any).debugLog?.('DICE', `Status: ${info.join(', ')}`);
    
    if (!validation.isValid) {
      (window as any).debugLog?.('DICE', `❌ INVALID! Dice: ${validation.invalidDiceIndices.join(',')}`);
      
      // ВАЖНО: Останавливаем запись БЕЗ отправки результата
      if (this.diceSync && this.diceSync.isCurrentlyRecording()) {
        (window as any).debugLog?.('DICE', 'Stopping recording (no result sent)');
        this.diceSync.stopRecordingStream(false);
      }
      
      // Показываем индикатор невалидного броска
      this.showInvalidRollIndicator();
      
      // Ждем 3 секунды, затем проверяем снова
      this.invalidRollCheckTimeout = window.setTimeout(() => {
        this.recheckAndRerollIfNeeded();
      }, this.invalidRollWaitTime);
    } else {
      (window as any).debugLog?.('DICE', '✅ VALID - showing result');
      // Валидный бросок - показываем результат
      this.showResult();
    }
  }
  
  private showInvalidRollIndicator() {
    // Удаляем предыдущий индикатор, если есть
    const existing = document.getElementById('invalid-roll-indicator');
    if (existing) existing.remove();
    
    const indicator = document.createElement('div');
    indicator.id = 'invalid-roll-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 20px 28px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      z-index: 10000;
      pointer-events: auto;
      cursor: pointer;
      transition: opacity 0.3s ease;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    indicator.innerHTML = `
      <div style="color: white; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        ${icon('refresh', 40)}
      </div>
      <div style="color: white; font-size: 14px; font-weight: 500; text-align: center;">
        Rerolling...
      </div>
    `;
    
    // Клик по индикатору скрывает его
    indicator.addEventListener('click', () => {
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 300);
    });
    
    document.body.appendChild(indicator);
  }
  
  private hideInvalidRollIndicator() {
    const indicator = document.getElementById('invalid-roll-indicator');
    if (indicator) {
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 300);
    }
  }
  
  private recheckAndRerollIfNeeded() {
    (window as any).debugLog?.('DICE', 'Rechecking after 3s wait...');
    
    // Проверяем еще раз - может быть кубик упал за это время
    const validation = DiceValidator.validateDicePositions(this.dice);
    
    // Логируем финальные углы и высоту
    const info = this.dice.map((dice, i) => {
      const angle = DiceValidator.getDiceTiltAngle(dice);
      const height = DiceValidator.getDiceHeight(dice);
      return `D${i}:${angle.toFixed(1)}°/h${height.toFixed(2)}`;
    });
    (window as any).debugLog?.('DICE', `Final: ${info.join(', ')}`);
    
    if (!validation.isValid) {
      (window as any).debugLog?.('DICE', '🔄 Still invalid - resetting to hand');
      
      // Скрываем индикатор
      this.hideInvalidRollIndicator();
      
      triggerHapticNotification('warning');
      
      // Возвращаем кубики в руку (не автоматический бросок)
      setTimeout(() => {
        this.performAutomaticReroll();
      }, 500);
    } else {
      (window as any).debugLog?.('DICE', '✅ Corrected itself - showing result');
      
      // Скрываем индикатор
      this.hideInvalidRollIndicator();
      
      this.showResult();
    }
  }
  
  private performAutomaticReroll() {
    (window as any).debugLog?.('DICE', '🔄 Performing automatic reroll (invalid roll)');
    
    // Запись уже остановлена в checkDiceValidityAndShowResult
    
    // Check if this is a Palmo's Dice reroll (only some dice were thrown)
    const isPalmosReroll = this.lastRerollSelection.length > 0;
    
    if (isPalmosReroll) {
      (window as any).debugLog?.('PALMOS', `Invalid roll in Palmo's reroll, re-preparing dice: [${this.lastRerollSelection.join(',')}]`);
      
      // Re-prepare the same dice for reroll (don't reset all dice)
      // This will start a new recording stream automatically
      this.prepareRerollDice(this.lastRerollSelection);
    } else {
      // Normal full reroll - return all dice to hand
      (window as any).debugLog?.('DICE', 'Invalid roll in full throw, resetting all dice to hand');
      
      // Reset dice to hand and START a new stream for the reroll
      // (so other players can see the replay)
      this.forceResetDiceToHand(false); // skipStreamStart = false - allow stream to start
    }
    
    // Очищаем UI
    this.hintEl.textContent = '';
    this.resultEl.textContent = '';
    this.resultEl.style.color = '';
  }
  
  private showResult() {
    // Очищаем таймер проверки невалидного броска, если он был
    if (this.invalidRollCheckTimeout) {
      clearTimeout(this.invalidRollCheckTimeout);
      this.invalidRollCheckTimeout = null;
    }
    
    const values = this.dice.map(d => d.getTopFace());
    
    // For Mexico mode, show score differently (higher die as tens + lower as ones)
    const gameMode = this.gameSync.getGameMode();
    let displayText: string;
    let earnedPips = 0;
    
    if (gameMode === 'mexico') {
      const high = Math.max(values[0], values[1]);
      const low = Math.min(values[0], values[1]);
      const score = high * 10 + low;
      displayText = `${values[0]} + ${values[1]} = ${score}`;
      earnedPips = score;
    } else {
      // Normal sum for other modes
      const total = values.reduce((a, b) => a + b, 0);
      displayText = `${values[0]} + ${values[1]} = ${total}`;
      earnedPips = total;
    }
    
    // Only show result text in multiplayer mode
    if (this.gameSync.isMultiplayerActive()) {
      this.resultEl.textContent = displayText;
    } else {
      this.resultEl.textContent = '';
    }
    
    // Update pips in solo mode (client-side for instant feedback)
    if (!this.gameSync.isMultiplayerActive() && this.wallText) {
      // Calculate boost multiplier and bonus
      let finalEarnedPips = earnedPips;
      
      import('../ui/BoostsModal').then(({ BoostsModal }) => {
        const { multiplier, bonus, reason } = BoostsModal.calculatePipsMultiplier(values[0], values[1]);
        
        if (multiplier > 1 || bonus > 0) {
          finalEarnedPips = Math.floor(earnedPips * multiplier) + bonus;
          
          // Show boost notification - flying number from boost icon
          this.showBoostAnimation(values[0], values[1], earnedPips, multiplier, bonus, finalEarnedPips);
        }
        
        // Check connection before awarding pips (use wsClient from window)
        const wsClient = (window as any).wsClient;
        
        if (!wsClient) {
          console.error('[PIPS] wsClient not found in window');
          return;
        }
        
        // Only award pips if connected and authenticated
        if (!wsClient.isConnected || !wsClient.isAuthenticated) {
          console.warn('[PIPS] Not connected - pips not awarded', {
            isConnected: wsClient.isConnected,
            isAuthenticated: wsClient.isAuthenticated
          });
          // No visual warning - status already shows offline
          return;
        }
        
        // Don't award pips if connection is poor or unstable
        if (wsClient.connectionHealth === 'poor' || wsClient.connectionHealth === 'unstable') {
          console.warn('[PIPS] Poor connection - pips not awarded', { 
            health: wsClient.connectionHealth 
          });
          // No visual warning - status already shows unstable
          return;
        }
        
        console.log('[PIPS] Awarding pips', { 
          finalEarnedPips, 
          connectionHealth: wsClient.connectionHealth 
        });
        
        const currentPips = this.wallText!.getPips();
        const newPips = currentPips + finalEarnedPips;
        
        // Instant update on client (server is source of truth and will
        // confirm the new balance via solo_roll_complete response).
        this.wallText!.animateChange(newPips, 800);
        
        // Send to server for database sync (background)
        wsClient.send({
          type: 'solo_roll_complete',
          dice1: values[0],
          dice2: values[1],
          total: values.reduce((a, b) => a + b, 0),
          earnedPips: finalEarnedPips,
          boostMultiplier: multiplier,
          boostBonus: bonus
        });
      });
    }
    
    // Send to multiplayer if active
    if (this.gameSync.isMultiplayerActive()) {
      // Stop streaming and send final result
      if (this.diceSync) {
        this.diceSync.stopRecordingStream();
      }
      
      // Clear reroll selection after throw
      this.lastRerollSelection = [];
      
      this.hintEl.textContent = 'Waiting...';
      
      // Enable dice selection for Palmo's Dice mode after roll
      const isMyTurn = this.gameSync.isMyTurn();
      console.log('[PALMOS] After roll check:', { gameMode, isMyTurn, diceInHand: this.diceInHand });
      (window as any).debugLog?.('PALMOS', `After roll: mode=${gameMode}, myTurn=${isMyTurn}`);
      
      if (gameMode === 'poker_dice' && isMyTurn) {
        console.log('[PALMOS] Enabling dice selection after roll');
        // Make all dice dynamic again (some might be static from reroll)
        this.dice.forEach(dice => {
          dice.body.type = CANNON.Body.DYNAMIC;
        });
        
        this.enableDiceSelection();
        (window as any).debugLog?.('PALMOS', 'Dice selection enabled');
        
        // Unblock buttons - throw is complete, dice stay on table
        this.gameSync.setThrowInProgress(false);
        console.log('[PALMOS] Throw completed, buttons unblocked');
        (window as any).debugLog?.('PALMOS', 'Throw completed, buttons unblocked');
      }
      
      // Dice exit animation is now handled by GameSync when turn_changed or greedy_pig_result is received
    } else {
      this.hintEl.textContent = 'Tap to roll again';
      // Allow new throw on next touch for solo mode
      setTimeout(() => {
        this.resetDiceToHand();
      }, 1500);
    }
    
    triggerHapticNotification('success');
  }
  
  private resize() {
    // Lock dimensions on first resize (initial load)
    // This prevents keyboard from affecting the game view
    if (this.lockedWidth === 0 || this.lockedHeight === 0) {
      this.lockedWidth = window.innerWidth;
      this.lockedHeight = window.innerHeight;
    }
    
    const width = this.lockedWidth;
    const height = this.lockedHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    
    // Update side walls based on aspect ratio
    this.updateSideWalls();
  }
  
  private updateSideWalls() {
    // Only update walls once on initial load
    if (this.sideWallsInitialized) return;
    this.sideWallsInitialized = true;
    
    // Calculate visible width at back wall (z = -5) based on camera
    const fov = this.camera.fov * Math.PI / 180;
    const aspect = this.lockedWidth / this.lockedHeight;
    
    // Distance from camera to back wall
    // Camera at z=8, back wall at z=-5, so distance = 13
    const distanceToBackWall = 13;
    
    // Visible height at that distance
    const visibleHeight = 2 * Math.tan(fov / 2) * distanceToBackWall;
    // Visible width
    const visibleWidth = visibleHeight * aspect;
    
    // Wall position = half of visible width, but max 6
    const wallX = Math.min(6, visibleWidth / 2);
    
    // Update physics walls positions
    if (this.leftWall) this.leftWall.position.x = -wallX;
    if (this.rightWall) this.rightWall.position.x = wallX;
    
    // Update visual walls
    if (this.leftWallMesh) this.leftWallMesh.position.x = -wallX;
    if (this.rightWallMesh) this.rightWallMesh.position.x = wallX;
    
    // Update border rails to match wall positions
    if (this.leftBorderMesh) this.leftBorderMesh.position.x = -wallX;
    if (this.rightBorderMesh) this.rightBorderMesh.position.x = wallX;
  }
  
  start() {
    // this.lastFrameTime = performance.now(); // Not used
    
    // Fix for black screen after minimize/restore in Telegram Mini App
    // Resize renderer when page becomes visible again to force WebGL refresh
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page hidden - force clear to free memory
        (window as any).debugLog?.('RENDER', 'Page hidden, clearing renderer');
        try {
          this.renderer.clear();
          this.renderer.clearColor();
          this.renderer.clearDepth();
          
          // Log memory before clearing
          if ((performance as any).memory) {
            const mem = (performance as any).memory;
            console.log('[Game] Memory when hiding:', {
              used: Math.round(mem.usedJSHeapSize / 1048576) + 'MB',
              total: Math.round(mem.totalJSHeapSize / 1048576) + 'MB',
              limit: Math.round(mem.jsHeapSizeLimit / 1048576) + 'MB'
            });
          }
        } catch (e) {
          console.warn('[Game] Error clearing renderer:', e);
        }
      } else {
        // Page visible again
        const gl = this.renderer.getContext();
        const isLost = gl.isContextLost();
        (window as any).debugLog?.('RENDER', 'Visibility restored, contextLost:', isLost);
        
        // Log memory after restore
        if ((performance as any).memory) {
          const mem = (performance as any).memory;
          console.log('[Game] Memory when restoring:', {
            used: Math.round(mem.usedJSHeapSize / 1048576) + 'MB',
            total: Math.round(mem.totalJSHeapSize / 1048576) + 'MB',
            limit: Math.round(mem.jsHeapSizeLimit / 1048576) + 'MB'
          });
        }
        
        if (isLost) {
          console.warn('[Game] WebGL context is lost after visibility restore. Waiting for restore event...');
          // Context restore will be handled by webglcontextrestored event
          return;
        }
        
        // Small delay to let the WebView fully restore
        setTimeout(() => {
          (window as any).debugLog?.('RENDER', 'Calling resize...');
          this.resize();
          // Force a render
          this.renderer.render(this.scene, this.camera);
          (window as any).debugLog?.('RENDER', 'Forced render done');
        }, 100);
      }
    });
    
    // Track render loop health
    let lastRenderTime = performance.now();
    let renderStallCount = 0;
    
    // Fixed timestep physics accumulator
    const PHYSICS_TIMESTEP = 1 / 60; // 60 Hz physics
    const MAX_SUBSTEPS = 5; // Prevent spiral of death on slow devices
    let physicsAccumulator = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Skip rendering if page is hidden to save resources
      if (document.hidden) {
        return;
      }
      
      const now = performance.now();
      const deltaTime = Math.min((now - lastRenderTime) / 1000, 0.1); // Cap at 100ms to prevent huge jumps
      
      // Detect render stalls (more than 2 seconds between frames)
      if (now - lastRenderTime > 2000) {
        renderStallCount++;
        (window as any).debugLog?.('RENDER', 'STALL detected! Gap:', Math.round(now - lastRenderTime), 'ms, count:', renderStallCount);
      }
      lastRenderTime = now;
      
      // FPS counter (update every 500ms)
      this.frameCount++;
      if (now - this.lastFpsUpdate >= 500) {
        const fps = Math.round(this.frameCount / ((now - this.lastFpsUpdate) / 1000));
        this.updateFpsCounter(fps);
        this.frameCount = 0;
        this.lastFpsUpdate = now;
      }
      
      // Fixed timestep physics with accumulator and interpolation
      physicsAccumulator += deltaTime;
      
      // Run physics steps
      while (physicsAccumulator >= PHYSICS_TIMESTEP) {
        // Save current state as previous (for interpolation)
        this.dice.forEach(d => d.saveState());
        
        // Step physics
        this.world.step(PHYSICS_TIMESTEP);
        
        // Read new state from physics
        this.dice.forEach(d => d.updateState());
        
        physicsAccumulator -= PHYSICS_TIMESTEP;
        
        // Prevent spiral of death - if we're too far behind, catch up
        if (physicsAccumulator > PHYSICS_TIMESTEP * MAX_SUBSTEPS) {
          physicsAccumulator = 0;
          break;
        }
      }
      
      // Calculate interpolation alpha
      // After physics steps, accumulator contains leftover time until next step
      // alpha = 1 means "show currState" (just after physics step, accumulator ≈ 0)
      // alpha = 0 means "show prevState" (just before next physics step, accumulator ≈ TIMESTEP)
      // We want the opposite: interpolate FROM prev TO curr as time passes
      // So: alpha = 1 - (time until next step / TIMESTEP) = 1 - (TIMESTEP - accumulator) / TIMESTEP
      // Simplified: alpha = accumulator / TIMESTEP... wait that's wrong too
      
      // Let me think again:
      // - prevState = state at time T (before last physics step)
      // - currState = state at time T + TIMESTEP (after last physics step)
      // - We want to render at time T + TIMESTEP + accumulator
      // - But we can only interpolate between T and T+TIMESTEP
      // - So we should show currState (alpha = 1) plus some extrapolation
      // - OR we accept 1-frame latency and interpolate properly
      
      // Standard approach: accept latency, interpolate between prev and curr
      // alpha = accumulator / TIMESTEP gives us position between prev and curr
      // When accumulator = 0 (just did physics), alpha = 0, show prev (1 step behind)
      // When accumulator = TIMESTEP (about to do physics), alpha = 1, show curr
      
      // This introduces 1 physics frame of latency but is smooth
      const alpha = Math.min(1, physicsAccumulator / PHYSICS_TIMESTEP);
      
      // this.lastFrameTime = now; // Not used
      
      // Update dice meshes with interpolation
      this.dice.forEach(d => d.update(alpha));
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
  
  // FPS counter visibility
  private fpsVisible = false;
  private fpsClickCount = 0;
  private fpsClickTimeout: number | null = null;
  private fpsToggleButton: HTMLElement | null = null;
  
  private createFpsCounter() {
    // Create invisible toggle button (bottom-left corner)
    this.fpsToggleButton = document.createElement('div');
    this.fpsToggleButton.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 40px;
      z-index: 999;
      cursor: default;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      outline: none;
    `;
    this.fpsToggleButton.addEventListener('click', () => this.handleFpsToggleClick());
    document.body.appendChild(this.fpsToggleButton);
    
    // Create FPS counter (hidden by default)
    this.fpsCounter = document.createElement('div');
    this.fpsCounter.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      font-family: monospace;
      font-size: 14px;
      font-weight: bold;
      padding: 4px 8px;
      background: rgba(0,0,0,0.5);
      border-radius: 4px;
      z-index: 1000;
      pointer-events: none;
      display: none;
    `;
    document.body.appendChild(this.fpsCounter);
    this.lastFpsUpdate = performance.now();
  }
  
  private handleFpsToggleClick() {
    this.fpsClickCount++;
    
    // Reset timeout
    if (this.fpsClickTimeout) {
      clearTimeout(this.fpsClickTimeout);
    }
    
    // If 5 clicks reached, toggle FPS and debug log visibility
    if (this.fpsClickCount >= 5) {
      this.fpsVisible = !this.fpsVisible;
      if (this.fpsCounter) {
        this.fpsCounter.style.display = this.fpsVisible ? 'block' : 'none';
      }
      
      // Also toggle debug overlay
      const debugOverlay = document.getElementById('debug-overlay');
      if (debugOverlay) {
        debugOverlay.style.display = this.fpsVisible ? 'block' : 'none';
      }
      
      this.fpsClickCount = 0;
    } else {
      // Reset click count after 1 second of no clicks
      this.fpsClickTimeout = window.setTimeout(() => {
        this.fpsClickCount = 0;
      }, 1000);
    }
  }
  
  private updateFpsCounter(fps: number) {
    if (!this.fpsCounter || !this.fpsVisible) return;
    
    let color = '#4CAF50'; // green
    if (fps < 35) {
      color = '#f44336'; // red
    } else if (fps < 55) {
      color = '#FFC107'; // yellow
    }
    
    this.fpsCounter.style.color = color;
    this.fpsCounter.textContent = `${fps} FPS`;
  }
  
  // Public method for GameSync to reset dice when it's player's turn
  public resetForNewTurn() {
    this.resetDiceToHand();
  }
  
  // Called by GameSync when turn changes to us
  public onTurnChanged(isMyTurn: boolean) {
    console.log('[Game] Turn changed, isMyTurn:', isMyTurn);
    if (isMyTurn) {
      // Stop any ongoing replay immediately when turn comes to us
      if (this.diceSync?.isCurrentlyReplaying()) {
        console.log('[Game] Stopping replay - our turn now');
        this.diceSync.stopReplay();
      }
      
      console.log('[Game] Resetting dice to hand for our turn');
      this.forceResetDiceToHand();
      
      // Show ready dialog if enabled and in motion mode during multiplayer
      if (this.requireReadyConfirmation && this.controlMode === 'motion' && this.gameSync.isMultiplayerActive()) {
        // Stop motion detection until ready
        if (this.shakeDetector.isMobile) {
          this.shakeDetector.stop();
        }
        this.showReadyDialog();
      }
    }
  }
  
  // Force reset dice to hand (ignores multiplayer checks)
  private forceResetDiceToHand(skipStreamStart: boolean = false) {
    (window as any).debugLog?.('DICE', `forceResetDiceToHand called, diceInHand=${this.diceInHand}, skipStreamStart=${skipStreamStart}`);
    
    // Always reset, even if dice are already in hand (to ensure physics is enabled)
    
    // Double-check it's actually our turn in multiplayer
    if (this.gameSync.isMultiplayerActive() && !this.gameSync.isMyTurn()) {
      (window as any).debugLog?.('DICE', 'Not our turn, skipping reset');
      return;
    }
    
    // If already in hand and not in multiplayer, skip (avoid double reset when leaving lobby)
    if (this.diceInHand && !this.gameSync.isMultiplayerActive()) {
      (window as any).debugLog?.('DICE', 'Already in hand (solo mode), skipping reset');
      return;
    }
    
    this.shakeIntensity = 0;
    
    // Enable hand box physics
    this.handBoxWalls.forEach(w => w.collisionResponse = true);
    if (this.handBoxFloor) this.handBoxFloor.collisionResponse = true;
    
    // Target positions in hand
    const targetPositions = this.dice.map((_, i) => ({
      x: (i - 0.5) * 1.0, // Increased spacing from 0.8 to 1.0
      y: 5,
      z: 3
    }));
    
    // In multiplayer, teleport dice to hand with our config
    if (this.gameSync.isMultiplayerActive() && this.diceSync) {
      (window as any).debugLog?.('DICE', 'Multiplayer mode - setting DYNAMIC physics');
      
      // Get our dice config
      const myDiceConfig = wsClient.getEquippedDiceConfig();
      
      // Apply config if needed
      if (myDiceConfig) {
        this.dice.forEach(dice => dice.updateConfig(myDiceConfig as any));
      }
      
      // Set dice to hand positions with DYNAMIC physics
      this.dice.forEach((dice, i) => {
        dice.body.type = CANNON.Body.DYNAMIC; // Enable physics for throwing
        dice.body.wakeUp();
        dice.setPosition(targetPositions[i].x, targetPositions[i].y, targetPositions[i].z);
        dice.setVelocity(0, 0, 0);
        dice.setAngularVelocity(0, 0, 0);
      });
      
      (window as any).debugLog?.('DICE', `Dice set to DYNAMIC, type=${this.dice[0].body.type}`);
      
      // Set diceInHand immediately
      this.diceInHand = true;
      this.gameSync.setThrowInProgress(false);
      
      // Start streaming frames immediately (including hand movements before throw)
      // Only in multiplayer mode and if not skipping stream start
      if (!skipStreamStart && this.diceSync && this.gameSync.isMultiplayerActive()) {
        // Pass selected dice info if this is a reroll in Palmo's Dice
        const selectedDice = this.lastRerollSelection.length > 0 ? this.lastRerollSelection : undefined;
        this.diceSync.startRecordingStream(0, this.gameSync.getEquippedEffectId(), selectedDice);
      }
    } else {
      // Solo mode - just set positions directly
      console.log('[Game] Setting dice positions directly');
      this.dice.forEach((dice, i) => {
        dice.body.type = CANNON.Body.DYNAMIC;
        dice.body.wakeUp();
        dice.setPosition(targetPositions[i].x, targetPositions[i].y, targetPositions[i].z);
        dice.setVelocity(0, 0, 0);
        dice.setAngularVelocity(0, 0, 0);
      });
      this.diceInHand = true;
      this.gameSync.setThrowInProgress(false);
    }
    
    this.hintEl.textContent = '';
  }
  
  // Public method to get dice sync instance
  public getDiceSync() {
    return this.diceSync;
  }
  
  // Public method to check if dice are in hand
  public isDiceInHand(): boolean {
    return this.diceInHand;
  }
  
  // Public method to set dice in hand state
  public setDiceInHand(inHand: boolean) {
    this.diceInHand = inHand;
  }
  
  // Public method to get hand positions for dice
  public getHandPositions(): { x: number; y: number; z: number }[] {
    return this.dice.map((_, i) => ({
      x: (i - 0.5) * 1.0, // Increased spacing from 0.8 to 1.0
      y: 5,
      z: 3
    }));
  }
  
  // Public method to check if in multiplayer game
  public isInMultiplayerGame(): boolean {
    return this.gameSync.isMultiplayerActive();
  }
  
  // Update UI visibility based on game mode
  public updateUIVisibility() {
    const isMultiplayer = this.gameSync.isMultiplayerActive();
    const resultEl = document.getElementById('result');
    const boostIcon = document.getElementById('boost-icon');
    
    (window as any).debugLog?.('UI', `updateUIVisibility: multiplayer=${isMultiplayer}, result=${!!resultEl}, boost=${!!boostIcon}`);
    
    if (isMultiplayer) {
      // In multiplayer: show result, hide boost icon
      if (resultEl) resultEl.style.display = '';
      if (boostIcon) boostIcon.style.display = 'none';
      (window as any).debugLog?.('UI', 'Multiplayer mode: result visible, boost hidden');
    } else {
      // In online mode: hide result, show boost icon
      if (resultEl) resultEl.style.display = 'none';
      if (boostIcon) boostIcon.style.display = 'flex';
      (window as any).debugLog?.('UI', 'Online mode: result hidden, boost visible');
    }
  }
  
  // Set synced aspect ratio for multiplayer (use narrowest device)
  public setSyncedAspectRatio(aspectRatio: number) {
    console.log('[Game] Setting synced aspect ratio:', aspectRatio);
    
    // Calculate wall position based on synced aspect ratio
    const fov = this.camera.fov * Math.PI / 180;
    const distanceToBackWall = 13;
    const visibleHeight = 2 * Math.tan(fov / 2) * distanceToBackWall;
    const visibleWidth = visibleHeight * aspectRatio;
    const wallX = Math.min(6, visibleWidth / 2);
    
    // Update physics walls positions
    if (this.leftWall) this.leftWall.position.x = -wallX;
    if (this.rightWall) this.rightWall.position.x = wallX;
    
    // Update visual walls
    if (this.leftWallMesh) this.leftWallMesh.position.x = -wallX;
    if (this.rightWallMesh) this.rightWallMesh.position.x = wallX;
    
    console.log('[Game] Walls set to x:', wallX);
  }
  
  // Reset walls to local aspect ratio (when leaving multiplayer)
  public resetWallsToLocal() {
    const fov = this.camera.fov * Math.PI / 180;
    const aspect = this.lockedWidth / this.lockedHeight;
    const distanceToBackWall = 13;
    const visibleHeight = 2 * Math.tan(fov / 2) * distanceToBackWall;
    const visibleWidth = visibleHeight * aspect;
    const wallX = Math.min(6, visibleWidth / 2);
    
    if (this.leftWall) this.leftWall.position.x = -wallX;
    if (this.rightWall) this.rightWall.position.x = wallX;
    if (this.leftWallMesh) this.leftWallMesh.position.x = -wallX;
    if (this.rightWallMesh) this.rightWallMesh.position.x = wallX;
  }
  
  // Called when multiplayer game starts - reset dice for all, only shooter gets dice in hand
  public onGameStarted(isMyTurn: boolean) {
    console.log('[Game] Game started, isMyTurn:', isMyTurn);
    
    // Hide wall text in multiplayer
    if (this.wallText) {
      this.wallText.setVisible(false);
    }
    
    // Reset dice state
    this.shakeIntensity = 0;
    this.resultEl.textContent = '';
    this.hintEl.textContent = '';
    
    if (isMyTurn) {
      // First shooter - put dice in hand
      this.forceResetDiceToHand();
      
      // Show ready dialog if enabled and in motion mode
      if (this.requireReadyConfirmation && this.controlMode === 'motion') {
        // Stop motion detection until ready
        if (this.shakeDetector.isMobile) {
          this.shakeDetector.stop();
        }
        this.showReadyDialog();
      }
    } else {
      // Not shooter - hide dice (move them off-screen/invisible)
      this.hideDice();
    }
  }
  
  // Hide dice when it's not our turn (move off-screen)
  private hideDice() {
    this.diceInHand = false;
    
    // Disable hand box physics
    this.handBoxWalls.forEach(w => w.collisionResponse = false);
    if (this.handBoxFloor) this.handBoxFloor.collisionResponse = false;
    
    this.dice.forEach((dice) => {
      // Make dice kinematic and move off-screen
      dice.body.type = CANNON.Body.KINEMATIC;
      dice.setPosition(0, -10, 0); // Below the floor
      dice.setVelocity(0, 0, 0);
      dice.setAngularVelocity(0, 0, 0);
    });
  }
  
  // Public: move dice off-screen because another player's turn is starting.
  // Called by GameSync when it's not our turn (e.g. after a take in Palmo's
  // Dice or when reconnecting mid-game). The actual dice positions for the
  // active player will arrive via the throw_start / throw_frame stream.
  public teleportDiceToNextPlayer(_nextPlayerId: number) {
    // Clear any selection visuals from the previous turn first
    this.clearDiceSelection();
    this.disableDiceSelection();
    this.hideDice();
  }
  
  // Set callback to check if menu is open
  public setMenuOpenCallback(callback: () => boolean) {
    this.isMenuOpenCallback = callback;
  }
  
  // Check if menu is open
  private isMenuOpen(): boolean {
    return this.isMenuOpenCallback ? this.isMenuOpenCallback() : false;
  }
  
  // Get dice array (for editor)
  public getDice() {
    return this.dice;
  }
  
  // Set number of dice (for different game modes)
  public setDiceCount(count: number, skipAutoReset: boolean = false) {
    console.log(`[Game] setDiceCount called with count=${count}, current=${this.dice.length}, skipAutoReset=${skipAutoReset}`);
    
    if (count < 1 || count > 10) {
      console.error(`Invalid dice count: ${count}. Must be between 1 and 10.`);
      return;
    }
    
    const currentCount = this.dice.length;
    if (currentCount === count) {
      console.log(`[Game] Dice count already correct (${count}), skipping`);
      return; // Already correct count
    }
    
    console.log(`[Game] Changing dice count from ${currentCount} to ${count}`);
    
    // Save original dice config before recreating DiceSync
    const originalConfig = this.diceSync ? this.diceSync.getOriginalDiceConfig() : null;
    
    if (count < currentCount) {
      // Remove excess dice
      for (let i = currentCount - 1; i >= count; i--) {
        const dice = this.dice[i];
        this.scene.remove(dice.mesh);
        this.world.removeBody(dice.body);
        dice.mesh.geometry.dispose();
        if (Array.isArray(dice.mesh.material)) {
          dice.mesh.material.forEach(m => m.dispose());
        } else {
          dice.mesh.material.dispose();
        }
      }
      this.dice.length = count;
    } else {
      // Add more dice - apply current config to new dice
      const currentConfig = this.dice[0]?.getConfig();
      for (let i = currentCount; i < count; i++) {
        const dice = new Dice(this.scene, this.world, this.diceMaterial, currentConfig, this.graphicsSettings.diceBevelSegments);
        dice.mesh.castShadow = this.graphicsSettings.shadowsEnabled;
        this.dice.push(dice);
      }
    }
    
    // Recreate DiceSync with new dice array
    this.diceSync = new DiceSync(
      this.dice,
      this.audio,
      this.scene,
      this.world,
      () => this.gameSync.getGameMode(),
      this
    );
    
    // Restore original dice config if it existed
    if (originalConfig) {
      this.diceSync.setOriginalDiceConfig(originalConfig);
    }
    
    // Reset dice to hand (unless skipped for reconnect)
    if (!skipAutoReset) {
      this.resetDiceToHand();
    } else {
      console.log(`[Game] Skipping auto-reset for reconnect`);
    }
  }
  
  // Get current dice count
  public getDiceCount(): number {
    return this.dice.length;
  }
  
  // Restore dice from last frame (for Palmo's Dice reconnect)
  public restoreDiceFromFrame(frame: any) {
    (window as any).debugLog?.('GAME', `Restoring dice from last frame, frame:`, frame);
    
    if (!frame || !frame.dice || frame.dice.length !== this.dice.length) {
      (window as any).debugLog?.('GAME', `Invalid frame data: hasFrame=${!!frame}, hasDice=${!!frame?.dice}, frameLength=${frame?.dice?.length}, diceLength=${this.dice.length}`);
      return;
    }
    
    (window as any).debugLog?.('GAME', `Frame valid, restoring ${frame.dice.length} dice`);
    
    // Disable hand box physics
    this.handBoxWalls.forEach(w => w.collisionResponse = false);
    if (this.handBoxFloor) this.handBoxFloor.collisionResponse = false;
    
    // Restore each die from frame data
    frame.dice.forEach((diceData: any, i: number) => {
      const dice = this.dice[i];
      
      // Set dice to KINEMATIC (frozen on table)
      dice.body.type = CANNON.Body.KINEMATIC;
      dice.body.collisionResponse = true;
      
      // Restore position
      dice.setPosition(diceData.x, diceData.y, diceData.z);
      
      // Restore rotation
      dice.body.quaternion.set(
        diceData.qx,
        diceData.qy,
        diceData.qz,
        diceData.qw
      );
      
      // Stop all motion
      dice.setVelocity(0, 0, 0);
      dice.setAngularVelocity(0, 0, 0);
    });
    
    this.diceInHand = false;
    
    (window as any).debugLog?.('GAME', `Dice restored from frame, diceInHand=${this.diceInHand}`);
  }
  
  // Update dice appearance with new config
  public updateDiceAppearance(config: any) {
    this.dice.forEach(dice => {
      dice.updateConfig(config, this.graphicsSettings.diceBevelSegments);
    });
  }
  
  // Update table appearance with new config (supports both old and new format)
  public updateTableAppearance(config: any) {
    // Normalize config to new format
    const newConfig = normalizeTableConfig(config);
    
    // Compare configs as JSON strings for reliable comparison
    const currentConfigStr = JSON.stringify(this.tableConfig);
    const newConfigStr = JSON.stringify(newConfig);
    
    console.log('[Game] updateTableAppearance - current:', currentConfigStr);
    console.log('[Game] updateTableAppearance - new:', newConfigStr);
    
    // Skip if config is the same (avoid material recreation bugs)
    if (currentConfigStr === newConfigStr) {
      console.log('[Game] Table config unchanged, skipping update');
      return;
    }
    
    // Clear texture cache if textures changed
    if (this.tableConfig.floor.texture !== newConfig.floor.texture || 
        this.tableConfig.wall.texture !== newConfig.wall.texture) {
      this.clearNormalMapCache();
    }
    
    console.log('[Game] Updating table appearance:', newConfig);
    this.tableConfig = newConfig;
    
    // Update scene background to match wall color (darker)
    const wallColor = new THREE.Color(this.tableConfig.wall.color);
    wallColor.multiplyScalar(0.7);
    this.scene.background = wallColor;
    
    // Update table mesh
    if (this.tableMesh) {
      const oldMat = this.tableMesh.material as THREE.Material;
      oldMat.dispose();
      this.tableMesh.material = this.createSurfaceMaterial(this.tableConfig.floor, 20, 20);
    }
    
    // Update wall meshes
    const wallMat = this.createSurfaceMaterial(this.tableConfig.wall, 12, 6);
    
    if (this.backWallMesh) {
      const oldMat = this.backWallMesh.material as THREE.Material;
      oldMat.dispose();
      this.backWallMesh.material = wallMat;
    }
    
    if (this.leftWallMesh) {
      const oldMat = this.leftWallMesh.material as THREE.Material;
      oldMat.dispose();
      this.leftWallMesh.material = this.createSurfaceMaterial(this.tableConfig.wall, 15, 6);
    }
    
    if (this.rightWallMesh) {
      const oldMat = this.rightWallMesh.material as THREE.Material;
      oldMat.dispose();
      this.rightWallMesh.material = this.createSurfaceMaterial(this.tableConfig.wall, 15, 6);
    }
    
    // Update border meshes
    if (this.tableConfig.border) {
      const borderMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(this.tableConfig.border.color),
        roughness: this.tableConfig.border.roughness,
        metalness: this.tableConfig.border.metalness,
      });
      
      if (this.backBorderMesh) {
        (this.backBorderMesh.material as THREE.Material).dispose();
        this.backBorderMesh.material = borderMat;
      }
      if (this.leftBorderMesh) {
        (this.leftBorderMesh.material as THREE.Material).dispose();
        this.leftBorderMesh.material = borderMat.clone();
      }
      if (this.rightBorderMesh) {
        (this.rightBorderMesh.material as THREE.Material).dispose();
        this.rightBorderMesh.material = borderMat.clone();
      }
    }
    
    // Update environment map with new colors
    this.updateEnvMap();
  }
  
  // Control mode settings
  public setControlMode(mode: 'motion' | 'manual') {
    this.controlMode = mode;
    localStorage.setItem('controlMode', mode);
    
    if (mode === 'motion') {
      // Start motion detection
      if (this.shakeDetector.isMobile) {
        this.shakeDetector.start();
      }
    } else {
      // Stop motion detection for manual mode
      if (this.shakeDetector.isMobile) {
        this.shakeDetector.stop();
      }
    }
  }
  
  public getControlMode(): 'motion' | 'manual' {
    return this.controlMode;
  }
  
  public setRequireReadyConfirmation(require: boolean) {
    this.requireReadyConfirmation = require;
    localStorage.setItem('requireReadyConfirmation', require ? '1' : '0');
  }
  
  public getRequireReadyConfirmation(): boolean {
    return this.requireReadyConfirmation;
  }
  
  // Show Ready? dialog before throw in multiplayer
  private showReadyDialog() {
    if (this.readyOverlay) return;
    
    this.isWaitingForReady = true;
    this.readyOverlay = document.createElement('div');
    this.readyOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    this.readyOverlay.innerHTML = `
      <div style="
        background: rgba(30,30,30,0.95);
        padding: 32px 48px;
        border-radius: 16px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      ">
        <div style="color: white; font-size: 24px; font-weight: 600; margin-bottom: 8px;">Ready?</div>
        <div style="color: #888; font-size: 14px;">Tap to throw</div>
      </div>
    `;
    
    document.body.appendChild(this.readyOverlay);
    
    const handleReady = () => {
      this.hideReadyDialog();
      // Start motion detection after ready
      if (this.controlMode === 'motion' && this.shakeDetector.isMobile) {
        this.shakeDetector.start();
      }
    };
    
    this.readyOverlay.addEventListener('click', handleReady);
    this.readyOverlay.addEventListener('touchstart', handleReady, { passive: true });
  }
  
  private hideReadyDialog() {
    if (this.readyOverlay) {
      this.readyOverlay.remove();
      this.readyOverlay = null;
    }
    this.isWaitingForReady = false;
  }
  
  // Load settings from localStorage
  private loadControlSettings() {
    const savedMode = localStorage.getItem('controlMode');
    if (savedMode === 'motion' || savedMode === 'manual') {
      this.controlMode = savedMode;
    }
    
    const savedReady = localStorage.getItem('requireReadyConfirmation');
    this.requireReadyConfirmation = savedReady === '1';
  }
  
  // Set throw seed from server for anti-cheat
  public setThrowSeed(seed: number) {
    this.throwSeed = seed;
  }
  
  // Preview dice appearance (for shop)
  public previewDice(config: any) {
    if (!config) return;
    const diceConfig = {
      baseColor: config.baseColor ?? '#e5e5d7',
      dotColor: config.dotColor ?? '#383838',
      borderColor: config.borderColor ?? '#e5e5d7',
      roughness: config.roughness ?? 0.3,
      metalness: config.metalness ?? 0,
      clearcoat: config.clearcoat ?? 0,
      clearcoatRoughness: config.clearcoatRoughness ?? 0,
      opacity: config.opacity ?? 1,
      dotSize: config.dotSize ?? 29,
      dotShape: config.dotShape ?? 'circle',
      dotDepth: config.dotDepth ?? 1.3,
      bevelRadius: config.bevelRadius ?? 0.08,
    };
    this.updateDiceAppearance(diceConfig);
    
    // Update editor if open - use global reference
    const editorModal = (window as any).__diceEditorModal;
    if (editorModal) {
      editorModal.updateFromDiceChange(diceConfig);
    }
  }
  
  // Preview table appearance (for shop)
  public previewTable(config: any) {
    if (!config) return;
    this.updateTableAppearance(config);
  }
  
  // Pips management methods
  // Server is the single source of truth. We never persist pips to
  // localStorage so the wall display always reflects the latest value
  // pushed from the server.
  public getPips(): number {
    return this.wallText?.getPips() ?? 0;
  }
  
  public setPips(value: number) {
    if (this.wallText) {
      this.wallText.setPips(value);
    }
  }
  
  public addPips(amount: number) {
    if (this.wallText) {
      const newValue = this.wallText.getPips() + amount;
      this.wallText.animateChange(newValue, 800);
    }
  }
  
  public showWallText(visible: boolean) {
    if (this.wallText) {
      this.wallText.setVisible(visible);
    }
  }
  
  // Show boost animation - flying number from boost icon
  private showBoostAnimation(
    dice1: number, 
    dice2: number, 
    basePips: number, 
    multiplier: number, 
    bonus: number,
    finalPips: number
  ) {
    const boostIcon = document.getElementById('boost-icon');
    if (!boostIcon) return;
    
    // Get boost icon position
    const iconRect = boostIcon.getBoundingClientRect();
    const startX = iconRect.left + iconRect.width / 2;
    const startY = iconRect.top + iconRect.height / 2;
    
    // Create flying number
    const flyingNumber = document.createElement('div');
    flyingNumber.textContent = `+${finalPips}`;
    flyingNumber.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      transform: translate(-50%, -50%);
      color: #FFD700;
      font-size: 24px;
      font-weight: 900;
      font-family: 'Alfa Slab One', serif;
      z-index: 3000;
      pointer-events: none;
      opacity: 0;
      transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    document.body.appendChild(flyingNumber);
    
    // Animate
    requestAnimationFrame(() => {
      flyingNumber.style.top = `${startY - 100}px`;
      flyingNumber.style.opacity = '1';
      
      // Fade out
      setTimeout(() => {
        flyingNumber.style.opacity = '0';
      }, 1000);
    });
    
    // Remove after animation
    setTimeout(() => {
      flyingNumber.remove();
    }, 2500);
  }
  
  // Show connection warning when pips cannot be awarded
  private showConnectionWarning(message: string) {
    // Create warning element
    const warning = document.createElement('div');
    warning.textContent = message;
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(244, 67, 54, 0.95);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: bold;
      z-index: 10001;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      text-align: center;
      max-width: 80%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(warning);
    
    // Show
    requestAnimationFrame(() => {
      warning.style.opacity = '1';
    });
    
    // Hide and remove
    setTimeout(() => {
      warning.style.opacity = '0';
      setTimeout(() => {
        warning.remove();
      }, 300);
    }, 3000);
  }
  
  // === Palmo's Dice: Dice Selection for Reroll ===
  
  private handleDiceClick(event: MouseEvent | Touch) {
    console.log('[PALMOS] handleDiceClick called', {
      enabled: this.diceSelectionEnabled,
      inHand: this.diceInHand,
      eventType: event instanceof MouseEvent ? 'mouse' : 'touch',
      clientX: event.clientX,
      clientY: event.clientY
    });
    (window as any).debugLog?.('PALMOS', `handleDiceClick: enabled=${this.diceSelectionEnabled}, inHand=${this.diceInHand}`);
    
    // Only allow selection in Palmo's Dice mode when selection is enabled
    if (!this.diceSelectionEnabled) {
      console.log('[PALMOS] Selection not enabled, ignoring click');
      (window as any).debugLog?.('PALMOS', 'Selection not enabled, ignoring click');
      return;
    }
    if (this.diceInHand) {
      console.log('[PALMOS] Dice in hand, ignoring click');
      (window as any).debugLog?.('PALMOS', 'Dice in hand, ignoring click');
      return; // Can't select dice in hand
    }
    
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    console.log('[PALMOS] Mouse normalized:', this.mouse.x.toFixed(2), this.mouse.y.toFixed(2));
    (window as any).debugLog?.('PALMOS', `Mouse pos: ${this.mouse.x.toFixed(2)}, ${this.mouse.y.toFixed(2)}`);
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections with dice meshes
    const diceMeshes = this.dice.map(d => d.mesh);
    const intersects = this.raycaster.intersectObjects(diceMeshes);
    
    console.log('[PALMOS] Raycaster intersects:', intersects.length);
    (window as any).debugLog?.('PALMOS', `Intersects: ${intersects.length}`);
    
    if (intersects.length > 0) {
      // Find which die was clicked
      const clickedMesh = intersects[0].object;
      const diceIndex = this.dice.findIndex(d => d.mesh === clickedMesh);
      
      console.log('[PALMOS] Clicked dice index:', diceIndex);
      (window as any).debugLog?.('PALMOS', `Clicked dice index: ${diceIndex}`);
      
      if (diceIndex !== -1) {
        this.toggleDiceSelection(diceIndex);
      }
    }
  }
  
  private toggleDiceSelection(diceIndex: number) {
    if (this.selectedDiceForReroll.has(diceIndex)) {
      // Deselect
      this.selectedDiceForReroll.delete(diceIndex);
      this.unhighlightDice(diceIndex);
    } else {
      // Select
      this.selectedDiceForReroll.add(diceIndex);
      this.highlightDice(diceIndex);
    }
    
    (window as any).debugLog?.('PALMOS', `Selected: ${Array.from(this.selectedDiceForReroll).join(',')}`);
  }
  
  private highlightDice(diceIndex: number) {
    const dice = this.dice[diceIndex];
    if (!dice) return;
    
    // Apply emissive glow to each face material (dice uses materials[])
    const mesh = dice.mesh;
    const mats = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
    const matArr: THREE.MeshStandardMaterial[] = Array.isArray(mats) ? mats : [mats];
    for (const mat of matArr) {
      if (!(mat as any)._originalEmissive) {
        (mat as any)._originalEmissive = mat.emissive.clone();
        (mat as any)._originalEmissiveIntensity = mat.emissiveIntensity;
      }
      mat.emissive.setHex(0xFFD700);
      mat.emissiveIntensity = 0.6;
    }
    
    // Add gold wireframe outline that's visible through the floor.
    // The outline is attached as a child of the dice mesh so it follows
    // position/rotation automatically. depthTest=false makes it render on
    // top of everything including the floor and the dice's own back faces,
    // so the selection is visible even when the dice rests on the table.
    if (!this.diceOutlineMeshes.has(diceIndex)) {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const outlineMat = new THREE.LineBasicMaterial({
        color: 0xFFD700,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.95,
      });
      const outline = new THREE.LineSegments(edges, outlineMat);
      // Slightly inflate so the line sits just outside the dice surface
      outline.scale.setScalar(1.04);
      outline.renderOrder = 999;
      mesh.add(outline);
      this.diceOutlineMeshes.set(diceIndex, outline);
    }
    
    // Play feedback
    this.audio.playDiceHit(0.3);
    triggerHaptic('light');
  }
  
  private unhighlightDice(diceIndex: number) {
    const dice = this.dice[diceIndex];
    if (!dice) return;
    
    const mesh = dice.mesh;
    const mats = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
    const matArr: THREE.MeshStandardMaterial[] = Array.isArray(mats) ? mats : [mats];
    for (const mat of matArr) {
      if ((mat as any)._originalEmissive) {
        mat.emissive.copy((mat as any)._originalEmissive);
        mat.emissiveIntensity = (mat as any)._originalEmissiveIntensity || 0;
      }
    }
    
    // Remove outline mesh
    const outline = this.diceOutlineMeshes.get(diceIndex);
    if (outline) {
      mesh.remove(outline);
      outline.geometry.dispose();
      (outline.material as THREE.LineBasicMaterial).dispose();
      this.diceOutlineMeshes.delete(diceIndex);
    }
    
    // Play feedback
    this.audio.playDiceHit(0.2);
    triggerHaptic('light');
  }
  
  public enableDiceSelection() {
    console.log('[PALMOS] enableDiceSelection called');
    this.diceSelectionEnabled = true;
    (window as any).debugLog?.('PALMOS', 'Selection enabled');
  }
  
  public disableDiceSelection() {
    console.log('[PALMOS] disableDiceSelection called');
    this.diceSelectionEnabled = false;
    // Clear all selections
    this.clearDiceSelection();
    (window as any).debugLog?.('PALMOS', 'Selection disabled');
  }
  
  public clearDiceSelection() {
    // Unhighlight all selected dice
    this.selectedDiceForReroll.forEach(index => {
      this.unhighlightDice(index);
    });
    this.selectedDiceForReroll.clear();
  }
  
  public getSelectedDiceForReroll(): number[] {
    return Array.from(this.selectedDiceForReroll);
  }
  
  public isAnyDiceSelected(): boolean {
    return this.selectedDiceForReroll.size > 0;
  }
  
  // Show which dice another player selected for reroll (visual feedback)
  public showOtherPlayerDiceSelection(selectedIndices: number[]) {
    (window as any).debugLog?.('PALMOS', `Showing other player's selection: [${selectedIndices.join(',')}]`);
    
    // Clear any existing selection first
    this.clearDiceSelection();
    
    // Highlight the selected dice
    selectedIndices.forEach(index => {
      if (index >= 0 && index < this.dice.length) {
        this.highlightDice(index);
      }
    });
    
    // Show notification
    this.showNotification(`Выбрано кубиков для переброса: ${selectedIndices.length}`);
  }
  
  private showNotification(message: string) {
    // Create temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      z-index: 1000;
      pointer-events: none;
      animation: fadeInOut 2s ease-in-out;
    `;
    notification.textContent = message;
    
    // Add fade animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 2000);
  }
}
