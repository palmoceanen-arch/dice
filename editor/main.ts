import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import presetsData from '../shared/presets.json';
import { TextureManager, type TextureSet } from './TextureLoader.js';

// ============ DICE CLASS (simplified from game) ============

type DotShape = 'circle' | 'square' | 'diamond';

interface DiceConfig {
  baseColor: string;
  dotColor: string;
  borderColor: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  opacity?: number;
  dotSize?: number;
  dotShape?: DotShape;
  dotDepth?: number;
  bevelRadius?: number;
}

const DEFAULT_DICE_CONFIG: DiceConfig = {
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
  bevelRadius: 0.16,
};

type TextureType = 'felt' | 'leather' | 'velvet' | 'smooth' | 'wood' | 'marble' | 'concrete' | 'diamond' | 'glass' | 'hexagon' | 'brick' | 'scales' | 'waves' | 'dots' | 'stripes' | 'checker';

interface SurfaceConfig {
  color: string;
  texture: TextureType;
  roughness: number;
  metalness: number;
  normalIntensity: number;
  textureScale?: 'small' | 'medium' | 'large';
  clearcoat?: number;
  clearcoatRoughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  realTexture?: string; // ID of real texture from manifest
}

interface BorderConfig {
  color: string;
  roughness: number;
  metalness: number;
}

interface TableConfig {
  floor: SurfaceConfig;
  wall: SurfaceConfig;
  border?: BorderConfig;
}

class EditorDice {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  private config: DiceConfig;
  private static readonly BASE_SIZE = 0.8;
  private static readonly BEVEL_SEGMENTS = 3;

  // Calculate size compensation for bevel radius
  private static getSizeForBevel(bevelRadius: number): number {
    // When bevel increases, the visible "flat" area shrinks
    // Compensate by scaling up the cube slightly
    // At bevel=0, size=0.8; at bevel=0.2, size≈0.88
    return EditorDice.BASE_SIZE + bevelRadius * 0.4;
  }

  constructor(scene: THREE.Scene, world: CANNON.World, material: CANNON.Material, config?: DiceConfig) {
    this.config = { ...DEFAULT_DICE_CONFIG, ...config };
    
    const bevelRadius = this.config.bevelRadius ?? 0.08;
    const size = EditorDice.getSizeForBevel(bevelRadius);
    const geometry = new RoundedBoxGeometry(
      size, size, size,
      EditorDice.BEVEL_SEGMENTS, bevelRadius
    );
    
    const materials = this.createMaterials();
    this.mesh = new THREE.Mesh(geometry, materials);
    this.mesh.castShadow = true;
    scene.add(this.mesh);

    const halfSize = EditorDice.BASE_SIZE / 2;
    this.body = new CANNON.Body({
      mass: 0.5,
      shape: new CANNON.Box(new CANNON.Vec3(halfSize, halfSize, halfSize)),
      material,
      linearDamping: 0.1,
      angularDamping: 0.1,
    });
    world.addBody(this.body);
  }

  updateConfig(config: DiceConfig) {
    const oldBevelRadius = this.config.bevelRadius;
    this.config = { ...DEFAULT_DICE_CONFIG, ...config };
    
    // Recreate geometry if bevelRadius changed
    if (this.config.bevelRadius !== oldBevelRadius) {
      const oldGeometry = this.mesh.geometry;
      const bevelRadius = this.config.bevelRadius ?? 0.08;
      const size = EditorDice.getSizeForBevel(bevelRadius);
      const newGeometry = new RoundedBoxGeometry(
        size, size, size,
        EditorDice.BEVEL_SEGMENTS, bevelRadius
      );
      
      this.mesh.geometry = newGeometry;
      oldGeometry.dispose();
    }
    
    (this.mesh.material as THREE.Material[]).forEach(mat => mat.dispose());
    this.mesh.material = this.createMaterials();
  }

  private createMaterials(): THREE.Material[] {
    const faceValues = [1, 6, 2, 5, 3, 4];
    return faceValues.map(value => {
      const canvas = this.createDotTexture(value);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      
      const bumpCanvas = this.createBumpMap(value);
      const bumpMap = new THREE.CanvasTexture(bumpCanvas);

      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        bumpMap: bumpMap,
        bumpScale: 1.0 * (this.config.dotDepth ?? 0.7), // Positive with dark center = concave
        roughness: this.config.roughness ?? 0.2,
        metalness: this.config.metalness ?? 0,
        clearcoat: this.config.clearcoat ?? 0.8,
        clearcoatRoughness: this.config.clearcoatRoughness ?? 0.15,
        transparent: (this.config.opacity ?? 1) < 1,
        opacity: this.config.opacity ?? 1,
        envMapIntensity: 0.3, // Small amount for metallic materials
      });
      
      // Optimize rendering for transparent materials
      if ((this.config.opacity ?? 1) < 1) {
        material.depthWrite = false;
      }
      
      return material;
    });
  }

  private createBumpMap(value: number): HTMLCanvasElement {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = 'rgb(128, 128, 128)'; // Mid-gray background
    ctx.fillRect(0, 0, size, size);
    
    const dotRadius = this.config.dotSize ?? 18;
    const dotShape = this.config.dotShape ?? 'circle';
    const positions = this.getDotPositions(value, size);
    
    positions.forEach(([cx, cy]) => {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, dotRadius);
      // Dark center (low), light edges (high) for concave dots
      gradient.addColorStop(0, 'rgb(0, 0, 0)'); // Black center (deepest)
      gradient.addColorStop(0.92, 'rgb(0, 0, 0)');
      gradient.addColorStop(0.96, 'rgb(128, 128, 128)');
      gradient.addColorStop(1, 'rgb(128, 128, 128)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      if (dotShape === 'circle') {
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
      } else if (dotShape === 'square') {
        ctx.rect(cx - dotRadius, cy - dotRadius, dotRadius * 2, dotRadius * 2);
      } else if (dotShape === 'diamond') {
        ctx.moveTo(cx, cy - dotRadius);
        ctx.lineTo(cx + dotRadius, cy);
        ctx.lineTo(cx, cy + dotRadius);
        ctx.lineTo(cx - dotRadius, cy);
        ctx.closePath();
      }
      
      ctx.fill();
    });
    
    return canvas;
  }

  private bumpToNormalMap(bumpCanvas: HTMLCanvasElement): HTMLCanvasElement {
    const size = bumpCanvas.width;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Get bump data
    const bumpCtx = bumpCanvas.getContext('2d')!;
    const bumpData = bumpCtx.getImageData(0, 0, size, size);
    const bump = bumpData.data;
    
    // Create normal map
    const normalData = ctx.createImageData(size, size);
    const normal = normalData.data;
    
    const strength = 3.0; // Normal map strength
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        
        // Sample neighboring pixels
        const xLeft = ((x - 1 + size) % size);
        const xRight = ((x + 1) % size);
        const yUp = ((y - 1 + size) % size);
        const yDown = ((y + 1) % size);
        
        const heightL = bump[(y * size + xLeft) * 4] / 255;
        const heightR = bump[(y * size + xRight) * 4] / 255;
        const heightU = bump[(yUp * size + x) * 4] / 255;
        const heightD = bump[(yDown * size + x) * 4] / 255;
        
        // Calculate gradients
        const dx = (heightR - heightL) * strength;
        const dy = (heightD - heightU) * strength;
        
        // Normal vector
        const nx = -dx;
        const ny = -dy;
        const nz = 1.0;
        
        // Normalize
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        
        // Convert to RGB (0-255)
        normal[idx] = ((nx / len) * 0.5 + 0.5) * 255;
        normal[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
        normal[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
        normal[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(normalData, 0, 0);
    return canvas;
  }

  private createNormalMap(value: number): HTMLCanvasElement {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, size, size);
    
    const dotRadius = this.config.dotSize ?? 18;
    const dotShape = this.config.dotShape ?? 'circle';
    const dotDepth = this.config.dotDepth ?? 0.7;
    const positions = this.getDotPositions(value, size);
    
    positions.forEach(([cx, cy]) => {
      const boxSize = dotRadius * 2;
      const imageData = ctx.getImageData(cx - dotRadius, cy - dotRadius, boxSize, boxSize);
      const data = imageData.data;
      
      for (let py = 0; py < boxSize; py++) {
        for (let px = 0; px < boxSize; px++) {
          const dx = px - dotRadius;
          const dy = py - dotRadius;
          
          let isInside = false;
          let normalizedDist = 0;
          
          if (dotShape === 'circle') {
            const dist = Math.sqrt(dx * dx + dy * dy);
            isInside = dist <= dotRadius;
            normalizedDist = dist / dotRadius;
          } else if (dotShape === 'square') {
            isInside = Math.abs(dx) <= dotRadius && Math.abs(dy) <= dotRadius;
            normalizedDist = Math.max(Math.abs(dx), Math.abs(dy)) / dotRadius;
          } else if (dotShape === 'diamond') {
            const dist = Math.abs(dx) + Math.abs(dy);
            isInside = dist <= dotRadius;
            normalizedDist = dist / dotRadius;
          }
          
          if (isInside) {
            let nx = 0, ny = 0, nz = 1;
            
            const flatRadius = 0.88;
            const wallStart = flatRadius;
            const wallEnd = 0.98;
            
            if (normalizedDist < wallStart) {
              nx = 0;
              ny = 0;
              nz = 1;
            } else if (normalizedDist < wallEnd) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist > 0.001) {
                const tiltStrength = Math.min(dotDepth * 0.495, 0.99);
                
                nx = -(dx / dist) * tiltStrength;
                ny = -(dy / dist) * tiltStrength;
                nz = Math.sqrt(1 - tiltStrength * tiltStrength);
              }
            } else {
              const dist = Math.sqrt(dx * dx + dy * dy);
              const edgeFactor = (1 - normalizedDist) / (1 - wallEnd);
              
              if (dist > 0.001) {
                const tiltStrength = Math.min(dotDepth * 0.45, 0.95) * edgeFactor;
                nx = -(dx / dist) * tiltStrength;
                ny = -(dy / dist) * tiltStrength;
                nz = Math.sqrt(1 - tiltStrength * tiltStrength);
              }
            }
            
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            nx /= len; ny /= len; nz /= len;
            
            const idx = (py * boxSize + px) * 4;
            data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
            data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
            data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
            data[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(imageData, cx - dotRadius, cy - dotRadius);
    });
    
    return canvas;
  }

  private createDotTexture(value: number): HTMLCanvasElement {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = this.config.baseColor;
    ctx.fillRect(0, 0, size, size);
    
    const borderWidth = 4;
    ctx.strokeStyle = this.config.borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);
    
    const dotRadius = this.config.dotSize ?? 18;
    const dotShape = this.config.dotShape ?? 'circle';
    const positions = this.getDotPositions(value, size);
    
    positions.forEach(([x, y]) => {
      ctx.fillStyle = this.config.dotColor;
      ctx.beginPath();
      
      if (dotShape === 'circle') {
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      } else if (dotShape === 'square') {
        ctx.rect(x - dotRadius, y - dotRadius, dotRadius * 2, dotRadius * 2);
      } else if (dotShape === 'diamond') {
        ctx.moveTo(x, y - dotRadius);
        ctx.lineTo(x + dotRadius, y);
        ctx.lineTo(x, y + dotRadius);
        ctx.lineTo(x - dotRadius, y);
        ctx.closePath();
      }
      
      ctx.fill();
    });
    
    return canvas;
  }

  private getDotPositions(value: number, size: number): [number, number][] {
    const c = size / 2;
    const o = size / 4;
    const patterns: Record<number, [number, number][]> = {
      1: [[c, c]],
      2: [[o, o], [size - o, size - o]],
      3: [[o, o], [c, c], [size - o, size - o]],
      4: [[o, o], [size - o, o], [o, size - o], [size - o, size - o]],
      5: [[o, o], [size - o, o], [c, c], [o, size - o], [size - o, size - o]],
      6: [[o, o], [size - o, o], [o, c], [size - o, c], [o, size - o], [size - o, size - o]]
    };
    return patterns[value] || [];
  }

  setPosition(x: number, y: number, z: number) {
    this.body.position.set(x, y, z);
  }

  setVelocity(x: number, y: number, z: number) {
    this.body.velocity.set(x, y, z);
  }

  setAngularVelocity(x: number, y: number, z: number) {
    this.body.angularVelocity.set(x, y, z);
  }

  update() {
    this.mesh.position.copy(this.body.position as unknown as THREE.Vector3);
    this.mesh.quaternion.copy(this.body.quaternion as unknown as THREE.Quaternion);
  }

  getConfig(): DiceConfig {
    return { ...this.config };
  }
}

// ============ EDITOR SCENE ============

class Editor {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private world: CANNON.World;
  private dice: EditorDice[] = [];
  private diceMaterial: CANNON.Material;
  private floorMaterial: CANNON.Material;
  
  private tableMesh: THREE.Mesh | null = null;
  private backWallMesh: THREE.Mesh | null = null;
  private leftWallMesh: THREE.Mesh | null = null;
  private rightWallMesh: THREE.Mesh | null = null;
  
  // Border meshes
  private backBorderMesh: THREE.Mesh | null = null;
  private leftBorderMesh: THREE.Mesh | null = null;
  private rightBorderMesh: THREE.Mesh | null = null;
  
  // Lights
  private ambientLight: THREE.AmbientLight | null = null;
  private spotLight: THREE.SpotLight | null = null;
  private directionalLight: THREE.DirectionalLight | null = null;
  
  // Hand box for dice shaking
  private handBoxWalls: CANNON.Body[] = [];
  private handBoxFloor: CANNON.Body | null = null;
  private diceInHand = true;
  
  private tableConfig: TableConfig = {
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
      "color": "#cad3c5",
      "texture": "brick",
      "roughness": 0.75,
      "metalness": 0,
      "normalIntensity": 1,
      "textureScale": "small",
      "clearcoat": 0.4,
      "realTexture": "concrete_concrete"
    },
    "border": {
      "color": "#153b02",
      "roughness": 0.45,
      "metalness": 0
    }
  };

  private diceConfig: DiceConfig = { ...DEFAULT_DICE_CONFIG };
  private normalMapCache = new Map<string, THREE.CanvasTexture>();
  private envMap: THREE.Texture | null = null;
  private pmremGenerator: THREE.PMREMGenerator | null = null;
  
  // Texture loading
  private textureManager: TextureManager;
  private loadedFloorTexture: TextureSet | null = null;
  private loadedWallTexture: TextureSet | null = null;

  constructor(canvas: HTMLCanvasElement, textureManager: TextureManager) {
    this.textureManager = textureManager;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Faster than VSM, still soft
    
    // Handle WebGL context loss/restore (fixes black screen after minimize/restore)
    this.setupWebGLContextHandlers(canvas);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a3d2a);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    this.camera.position.set(0, 10, 8);
    this.camera.lookAt(0, 0, 0);

    this.world = new CANNON.World();
    this.world.gravity.set(0, -40, 0);

    this.diceMaterial = new CANNON.Material('dice');
    this.floorMaterial = new CANNON.Material('floor');

    const diceFloorContact = new CANNON.ContactMaterial(this.diceMaterial, this.floorMaterial, {
      friction: 0.15,     // More slippery
      restitution: 0.45   // Balanced bounce
    });
    this.world.addContactMaterial(diceFloorContact);
    
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    
    this.setupScene();
    this.createHandBox();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Click on canvas to throw/reset
    canvas.addEventListener('click', () => this.handleClick());
  }
  
  // Load default textures from config (called after manifest is loaded)
  async loadDefaultTextures() {
    if (this.tableConfig.floor.realTexture) {
      await this.loadFloorTexture(this.tableConfig.floor.realTexture);
    }
    if (this.tableConfig.wall.realTexture) {
      await this.loadWallTexture(this.tableConfig.wall.realTexture);
    }
  }
  
  // Setup WebGL context loss/restore handlers
  private setupWebGLContextHandlers(canvas: HTMLCanvasElement) {
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.warn('[Editor] WebGL context lost! This causes black screen.');
    }, false);
    
    canvas.addEventListener('webglcontextrestored', () => {
      console.log('[Editor] WebGL context restored, reinitializing renderer...');
      
      // Force renderer to reinitialize
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      
      // Recreate environment map
      if (this.pmremGenerator) {
        this.pmremGenerator.dispose();
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      }
      
      // Update dice materials
      this.dice.forEach(d => {
        const currentConfig = d.getConfig();
        d.updateConfig(currentConfig);
      });
      
      // Force resize and render
      setTimeout(() => {
        this.resize();
        this.renderer.render(this.scene, this.camera);
        console.log('[Editor] WebGL context fully restored');
      }, 100);
    }, false);
  }
  
  private handleClick() {
    if (this.diceInHand) {
      this.throwDice();
    } else {
      // Check if dice stopped
      const allStopped = this.dice.every(d => {
        const vel = d.body.velocity.length();
        const angVel = d.body.angularVelocity.length();
        return vel < 0.5 && angVel < 0.5;
      });
      if (allStopped) {
        this.resetDice();
      }
    }
  }
  
  private createHandBox() {
    const boxSize = 2.5;
    const boxY = 5;
    const boxZ = 3;
    
    // Floor of hand box
    this.handBoxFloor = new CANNON.Body({
      type: CANNON.Body.KINEMATIC,
      shape: new CANNON.Plane(),
      material: this.floorMaterial
    });
    this.handBoxFloor.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.handBoxFloor.position.set(0, boxY - 1, boxZ);
    this.world.addBody(this.handBoxFloor);
    
    // Walls of hand box
    const wallPositions = [
      { x: -boxSize / 2, z: boxZ, rotY: Math.PI / 2 },
      { x: boxSize / 2, z: boxZ, rotY: -Math.PI / 2 },
      { x: 0, z: boxZ - boxSize / 2, rotY: 0 },
      { x: 0, z: boxZ + boxSize / 2, rotY: Math.PI },
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
    ceiling.position.set(0, boxY + 2, boxZ);
    this.world.addBody(ceiling);
    this.handBoxWalls.push(ceiling);
  }
  
  private setHandBoxEnabled(enabled: boolean) {
    const collisionResponse = enabled;
    this.handBoxWalls.forEach(wall => {
      wall.collisionResponse = collisionResponse;
    });
    if (this.handBoxFloor) {
      this.handBoxFloor.collisionResponse = collisionResponse;
    }
  }
  
  private updateEnvMap() {
    if (!this.pmremGenerator) return;
    
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
    let floorColor = new THREE.Color(this.tableConfig.floor.color);
    let wallColor = new THREE.Color(this.tableConfig.wall.color);
    
    // If texture is loaded, use its natural color (white) for env map
    // This prevents colored reflections from textured surfaces
    if (this.loadedFloorTexture?.color) {
      floorColor = new THREE.Color(0xffffff);
    }
    if (this.loadedWallTexture?.color) {
      wallColor = new THREE.Color(0xffffff);
    }
    
    const floorIntensity = 0.8;
    const wallIntensity = 0.05;
    const floorHex = '#' + floorColor.clone().multiplyScalar(floorIntensity).getHexString();
    const wallHex = '#' + wallColor.clone().multiplyScalar(wallIntensity).getHexString();
    
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
    const envMat = new THREE.MeshBasicMaterial({ map: envTexture, side: THREE.BackSide });
    const envMesh = new THREE.Mesh(envGeom, envMat);
    tempScene.add(envMesh);
    
    cubeCamera.update(this.renderer, tempScene);
    
    this.envMap = this.pmremGenerator.fromCubemap(cubeRenderTarget.texture).texture;
    this.scene.environment = this.envMap;
    
    envGeom.dispose();
    envMat.dispose();
    envTexture.dispose();
    cubeRenderTarget.dispose();
  }

  private setupScene() {
    // Floor
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
      metalness: 0.6,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2
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
    this.backBorderMesh.castShadow = true;
    this.backBorderMesh.receiveShadow = true;
    this.scene.add(this.backBorderMesh);
    
    // Left border (extends to wall)
    this.leftBorderMesh = new THREE.Mesh(
      new THREE.BoxGeometry(borderWidth, borderHeight, 15),
      borderMat.clone()
    );
    this.leftBorderMesh.position.set(-6, borderHeight / 2, 0);
    this.leftBorderMesh.castShadow = true;
    this.leftBorderMesh.receiveShadow = true;
    this.scene.add(this.leftBorderMesh);
    
    // Right border (extends to wall)
    this.rightBorderMesh = new THREE.Mesh(
      new THREE.BoxGeometry(borderWidth, borderHeight, 15),
      borderMat.clone()
    );
    this.rightBorderMesh.position.set(6, borderHeight / 2, 0);
    this.rightBorderMesh.castShadow = true;
    this.rightBorderMesh.receiveShadow = true;
    this.scene.add(this.rightBorderMesh);

    // Physics floor
    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: this.floorMaterial
    });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(floorBody);

    // Physics walls
    this.addPhysicsWall(0, 1, -5, 0);
    this.addPhysicsWall(0, 1, 5, Math.PI);
    this.addPhysicsWall(-6, 1, 0, Math.PI / 2);
    this.addPhysicsWall(6, 1, 0, -Math.PI / 2);

    // Visual walls
    const wallGeom = new THREE.PlaneGeometry(12, 6);
    const sideWallGeom = new THREE.PlaneGeometry(15, 6);
    const wallMat = this.createSurfaceMaterial(this.tableConfig.wall, 12, 6);

    this.backWallMesh = new THREE.Mesh(wallGeom, wallMat);
    this.backWallMesh.position.set(0, 3, -5);
    this.backWallMesh.receiveShadow = true;
    this.scene.add(this.backWallMesh);

    const sideWallMat = this.createSurfaceMaterial(this.tableConfig.wall, 15, 6);
    
    this.leftWallMesh = new THREE.Mesh(sideWallGeom, sideWallMat);
    this.leftWallMesh.position.set(-6, 3, 0);
    this.leftWallMesh.rotation.y = Math.PI / 2;
    this.leftWallMesh.receiveShadow = true;
    this.scene.add(this.leftWallMesh);

    this.rightWallMesh = new THREE.Mesh(sideWallGeom, sideWallMat.clone());
    this.rightWallMesh.position.set(6, 3, 0);
    this.rightWallMesh.rotation.y = -Math.PI / 2;
    this.rightWallMesh.receiveShadow = true;
    this.scene.add(this.rightWallMesh);

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0);
    this.scene.add(this.ambientLight);

    // Spotlight positioned from side for depth and shadows
    this.spotLight = new THREE.SpotLight(0xffffff, 2.8);
    this.spotLight.position.set(-5, 15, 5);
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.8; // Very soft edges
    this.spotLight.decay = 0;
    this.spotLight.distance = 0;
    this.spotLight.castShadow = true;
    // Optimized but still good quality shadows
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.radius = 1.5;
    this.spotLight.shadow.camera.near = 5;
    this.spotLight.shadow.camera.far = 30;
    this.spotLight.shadow.bias = -0.0001;
    this.scene.add(this.spotLight);
    
    // Directional light for better highlights on dice
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2.1);
    this.directionalLight.position.set(3, 5, 8);
    this.scene.add(this.directionalLight);
    
    this.updateEnvMap();

    // Create dice
    for (let i = 0; i < 2; i++) {
      const dice = new EditorDice(this.scene, this.world, this.diceMaterial, this.diceConfig);
      this.dice.push(dice);
    }

    this.resetDice();
  }

  private addPhysicsWall(x: number, y: number, z: number, rotY: number) {
    const wallBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane()
    });
    wallBody.position.set(x, y, z);
    wallBody.quaternion.setFromEuler(0, rotY, 0);
    this.world.addBody(wallBody);
  }

  private createSurfaceMaterial(config: SurfaceConfig, width: number, height: number, loadedTexture?: TextureSet | null): THREE.MeshPhysicalMaterial {
    const scale = config.textureScale || 'medium';
    
    // Calculate repeat based on physical size and texture scale
    // textureScale affects how many times texture repeats
    const scaleMultipliers = {
      small: 4,    // 4x4 repeats
      medium: 2,   // 2x2 repeats
      large: 1     // 1x1 repeat
    };
    const scaleMultiplier = scaleMultipliers[scale];
    const textureWorldSize = 10 / scaleMultiplier; // Adjust world size based on scale
    const repeatX = width / textureWorldSize;
    const repeatY = height / textureWorldSize;
    
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(config.color),
      roughness: config.roughness,
      metalness: config.metalness,
      clearcoat: config.clearcoat ?? 0,
      clearcoatRoughness: config.clearcoatRoughness ?? 0.1,
    });
    
    // If we have a loaded real texture, use it
    if (loadedTexture) {
      this.textureManager.applyTextureSet(
        material, 
        loadedTexture, 
        repeatX, 
        repeatY,
        config.roughness,
        config.metalness
      );
      
      // Apply color as tint (multiplies with texture)
      material.color.set(config.color);
      
      // Apply normal scale
      if (material.normalMap) {
        material.normalScale = new THREE.Vector2(config.normalIntensity, config.normalIntensity);
      }
    } else {
      // Use procedural normal map
      const cacheKey = `${config.texture}_${scale}`;
      
      let normalTexture = this.normalMapCache.get(cacheKey);
      if (!normalTexture) {
        const normalMap = this.generateSurfaceNormalMap(config.texture, scale);
        normalTexture = new THREE.CanvasTexture(normalMap);
        normalTexture.wrapS = THREE.RepeatWrapping;
        normalTexture.wrapT = THREE.RepeatWrapping;
        this.normalMapCache.set(cacheKey, normalTexture);
      }

      // Clone texture to set individual repeat values based on geometry size
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

  private generateSurfaceNormalMap(type: TextureType, scale: 'small' | 'medium' | 'large' = 'medium'): HTMLCanvasElement {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    // Initialize to flat normal
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 128;
      data[i + 1] = 128;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }

    const generators: Record<TextureType, () => void> = {
      felt: () => {
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const nx = (Math.random() - 0.5) * 0.4;
            const ny = (Math.random() - 0.5) * 0.4;
            data[idx] = Math.floor((nx + 0.5) * 255);
            data[idx + 1] = Math.floor((ny + 0.5) * 255);
            data[idx + 2] = 230;
          }
        }
      },
      leather: () => {
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const noiseX = Math.sin(x * 0.3 + Math.random() * 2) * 0.2;
            const noiseY = Math.sin(y * 0.3 + Math.random() * 2) * 0.2;
            const nx = noiseX + (Math.random() - 0.5) * 0.15;
            const ny = noiseY + (Math.random() - 0.5) * 0.15;
            data[idx] = Math.floor((nx * 0.4 + 0.5) * 255);
            data[idx + 1] = Math.floor((ny * 0.4 + 0.5) * 255);
            data[idx + 2] = 230;
          }
        }
      },
      velvet: () => {
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const nx = (Math.random() - 0.5) * 0.2;
            const ny = (Math.random() - 0.5) * 0.2;
            data[idx] = Math.floor((nx + 0.5) * 255);
            data[idx + 1] = Math.floor((ny + 0.5) * 255);
            data[idx + 2] = 245;
          }
        }
      },
      smooth: () => {
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const nx = (Math.random() - 0.5) * 0.08;
            const ny = (Math.random() - 0.5) * 0.08;
            data[idx] = Math.floor((nx + 0.5) * 255);
            data[idx + 1] = Math.floor((ny + 0.5) * 255);
            data[idx + 2] = 252;
          }
        }
      },
      wood: () => {
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
      },
      marble: () => {
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
      },
      concrete: () => {
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            // Rough concrete with pits
            const pit = Math.random() > 0.95 ? (Math.random() - 0.5) * 0.6 : 0;
            const nx = (Math.random() - 0.5) * 0.3 + pit;
            const ny = (Math.random() - 0.5) * 0.3 + pit;
            data[idx] = Math.floor((nx + 0.5) * 255);
            data[idx + 1] = Math.floor((ny + 0.5) * 255);
            data[idx + 2] = 225;
          }
        }
      },
      diamond: () => {
        const cellSize = scale === 'small' ? 16 : scale === 'medium' ? 32 : 64;
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            // Diamond/quilted pattern
            const cx = (x % cellSize) - cellSize / 2;
            const cy = (y % cellSize) - cellSize / 2;
            const dist = Math.abs(cx) + Math.abs(cy);
            const edge = dist > cellSize / 2 - 4 && dist < cellSize / 2 + 4;
            
            let nx = 0, ny = 0;
            if (edge) {
              nx = cx / (Math.abs(cx) + 0.1) * 0.4;
              ny = cy / (Math.abs(cy) + 0.1) * 0.4;
            } else {
              // Slight bulge in center
              nx = cx / cellSize * 0.15;
              ny = cy / cellSize * 0.15;
            }
            data[idx] = Math.floor((nx + 0.5) * 255);
            data[idx + 1] = Math.floor((ny + 0.5) * 255);
            data[idx + 2] = edge ? 220 : 240;
          }
        }
      },
      glass: () => {
        // Very smooth with subtle distortions
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
      },
      hexagon: () => {
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
      },
      brick: () => {
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
      },
      scales: () => {
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
            if (edge) { nx *= 1.8; ny *= 1.8; }
            data[idx] = Math.floor((nx + 0.5) * 255);
            data[idx + 1] = Math.floor((ny + 0.5) * 255);
            data[idx + 2] = edge ? 215 : 240;
          }
        }
      },
      waves: () => {
        const waveLen = scale === 'small' ? 20 : scale === 'medium' ? 40 : 80, amplitude = 0.4;
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
      },
      dots: () => {
        const spacing = scale === 'small' ? 10 : scale === 'medium' ? 20 : 40, dotRadius = spacing * 0.3;
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
      },
      stripes: () => {
        const stripeWidth = scale === 'small' ? 8 : scale === 'medium' ? 16 : 32;
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const stripe = ((x + y) % (stripeWidth * 2)) / stripeWidth;
            const inGroove = stripe < 1;
            let nx = 0, ny = 0;
            if (inGroove) {
              const pos = stripe;
              if (pos < 0.3) { nx = 0.3; ny = 0.3; }
              else if (pos > 0.7) { nx = -0.3; ny = -0.3; }
            }
            data[idx] = Math.floor((nx + 0.5) * 255);
            data[idx + 1] = Math.floor((ny + 0.5) * 255);
            data[idx + 2] = inGroove ? 225 : 245;
          }
        }
      },
      checker: () => {
        const cellSize = scale === 'small' ? 16 : scale === 'medium' ? 32 : 64, bevel = Math.max(2, cellSize / 8);
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
      },
    };

    generators[type]();
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  resetDice() {
    this.diceInHand = true;
    this.setHandBoxEnabled(true);
    
    this.dice.forEach((dice, i) => {
      dice.body.type = CANNON.Body.DYNAMIC;
      dice.body.wakeUp();
      dice.setPosition((i - 0.5) * 1.2, 5, 3);
      dice.setVelocity(0, 0, 0);
      dice.setAngularVelocity(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      );
    });
  }

  throwDice() {
    this.diceInHand = false;
    this.setHandBoxEnabled(false);
    
    this.dice.forEach((dice) => {
      dice.body.type = CANNON.Body.DYNAMIC;
      dice.body.wakeUp();
      dice.setVelocity(
        (Math.random() - 0.5) * 5,
        2,
        -15 - Math.random() * 5
      );
      dice.setAngularVelocity(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
    });
  }

  updateDiceConfig(config: Partial<DiceConfig>) {
    this.diceConfig = { ...this.diceConfig, ...config };
    this.dice.forEach(d => d.updateConfig(this.diceConfig));
  }

  updateTableConfig(config: Partial<TableConfig>) {
    if (config.floor) {
      this.tableConfig.floor = { ...this.tableConfig.floor, ...config.floor };
    }
    if (config.wall) {
      this.tableConfig.wall = { ...this.tableConfig.wall, ...config.wall };
    }
    if (config.border) {
      this.tableConfig.border = { ...this.tableConfig.border, ...config.border };
    }
    
    // Clear cache if texture type changed
    if (config.floor?.texture || config.wall?.texture) {
      this.normalMapCache.forEach(t => t.dispose());
      this.normalMapCache.clear();
    }

    const wallColor = new THREE.Color(this.tableConfig.wall.color);
    wallColor.multiplyScalar(0.7);
    this.scene.background = wallColor;

    // Update floor material (preserve loaded texture)
    if (this.tableMesh) {
      (this.tableMesh.material as THREE.Material).dispose();
      this.tableMesh.material = this.createSurfaceMaterial(
        this.tableConfig.floor, 
        20, 
        20, 
        this.loadedFloorTexture
      );
    }

    // Update wall materials (preserve loaded texture)
    const backWallMat = this.createSurfaceMaterial(
      this.tableConfig.wall, 
      12, 
      6, 
      this.loadedWallTexture
    );
    const sideWallMat = this.createSurfaceMaterial(
      this.tableConfig.wall, 
      15, 
      6, 
      this.loadedWallTexture
    );

    if (this.backWallMesh) {
      (this.backWallMesh.material as THREE.Material).dispose();
      this.backWallMesh.material = backWallMat;
    }
    
    if (this.leftWallMesh) {
      (this.leftWallMesh.material as THREE.Material).dispose();
      this.leftWallMesh.material = sideWallMat;
    }
    
    if (this.rightWallMesh) {
      (this.rightWallMesh.material as THREE.Material).dispose();
      this.rightWallMesh.material = sideWallMat.clone();
    }
    
    // Update border materials
    if (config.border && this.tableConfig.border) {
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
    
    this.updateEnvMap();
  }
  
  updateLighting(config: { ambient: number; spot: number; directional: number }) {
    if (this.ambientLight) {
      this.ambientLight.intensity = config.ambient;
    }
    if (this.spotLight) {
      this.spotLight.intensity = config.spot;
    }
    if (this.directionalLight) {
      this.directionalLight.intensity = config.directional;
    }
  }
  
  // Load real texture for floor
  async loadFloorTexture(textureId: string): Promise<boolean> {
    if (!textureId) {
      this.loadedFloorTexture = null;
      this.updateTableConfig({}); // Refresh with procedural
      return true;
    }
    
    console.log(`[Editor] Loading floor texture: ${textureId}`);
    const textureSet = await this.textureManager.loadTextureSet(textureId);
    
    if (!textureSet) {
      console.warn(`[Editor] Failed to load floor texture: ${textureId}`);
      return false;
    }
    
    this.loadedFloorTexture = textureSet;
    
    // Trigger update to apply texture
    this.updateTableConfig({});
    
    console.log(`[Editor] Floor texture loaded: ${textureSet.name}`);
    return true;
  }
  
  // Load real texture for walls
  async loadWallTexture(textureId: string): Promise<boolean> {
    if (!textureId) {
      this.loadedWallTexture = null;
      this.updateTableConfig({}); // Refresh with procedural
      return true;
    }
    
    console.log(`[Editor] Loading wall texture: ${textureId}`);
    const textureSet = await this.textureManager.loadTextureSet(textureId);
    
    if (!textureSet) {
      console.warn(`[Editor] Failed to load wall texture: ${textureId}`);
      return false;
    }
    
    this.loadedWallTexture = textureSet;
    
    // Trigger update to apply texture
    this.updateTableConfig({});
    
    console.log(`[Editor] Wall texture loaded: ${textureSet.name}`);
    return true;
  }

  getDiceConfig(): DiceConfig {
    return { ...this.diceConfig };
  }

  getTableConfig(): TableConfig {
    const config = JSON.parse(JSON.stringify(this.tableConfig));
    
    // Add realTexture info if loaded
    if (this.loadedFloorTexture) {
      config.floor.realTexture = this.loadedFloorTexture.id;
    }
    if (this.loadedWallTexture) {
      config.wall.realTexture = this.loadedWallTexture.id;
    }
    
    return config;
  }

  private resize() {
    const container = this.renderer.domElement.parentElement!;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  start() {
    let lastTime = performance.now();
    const PHYSICS_TIMESTEP = 1 / 60;
    let accumulator = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const now = performance.now();
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      
      // Fixed timestep physics
      accumulator += deltaTime;
      while (accumulator >= PHYSICS_TIMESTEP) {
        this.world.step(PHYSICS_TIMESTEP);
        accumulator -= PHYSICS_TIMESTEP;
        
        // Prevent spiral of death
        if (accumulator > PHYSICS_TIMESTEP * 5) {
          accumulator = 0;
          break;
        }
      }
      
      this.dice.forEach(d => d.update());
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}

// ============ PRESETS FROM JSON ============

// Extract dice configs from presets
const DICE_PRESETS: Record<string, DiceConfig> = {};
for (const [code, data] of Object.entries(presetsData.dice)) {
  DICE_PRESETS[code] = (data as any).config;
}

// Extract table configs from presets  
const TABLE_PRESETS: Record<string, TableConfig> = {};
for (const [code, data] of Object.entries(presetsData.tables)) {
  TABLE_PRESETS[code] = (data as any).config;
}

// ============ UI BINDINGS ============

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

// Create shared texture manager
const textureManager = new TextureManager();

const editor = new Editor(canvas, textureManager);
editor.start();

// Populate preset dropdowns from JSON
const dicePresetSelect = document.getElementById('dice-preset') as HTMLSelectElement;
for (const [code, data] of Object.entries(presetsData.dice)) {
  const option = document.createElement('option');
  option.value = code;
  option.textContent = (data as any).name;
  dicePresetSelect.appendChild(option);
}

const tablePresetSelect = document.getElementById('table-preset') as HTMLSelectElement;
for (const [code, data] of Object.entries(presetsData.tables)) {
  const option = document.createElement('option');
  option.value = code;
  option.textContent = (data as any).name;
  tablePresetSelect.appendChild(option);
}

// Dice controls
const diceInputs = {
  base: document.getElementById('dice-base') as HTMLInputElement,
  dot: document.getElementById('dice-dot') as HTMLInputElement,
  border: document.getElementById('dice-border') as HTMLInputElement,
  dotSize: document.getElementById('dice-dot-size') as HTMLInputElement,
  dotDepth: document.getElementById('dice-dot-depth') as HTMLInputElement,
  bevel: document.getElementById('dice-bevel') as HTMLInputElement,
  roughness: document.getElementById('dice-roughness') as HTMLInputElement,
  metalness: document.getElementById('dice-metalness') as HTMLInputElement,
  clearcoat: document.getElementById('dice-clearcoat') as HTMLInputElement,
  clearcoatRough: document.getElementById('dice-clearcoat-rough') as HTMLInputElement,
  opacity: document.getElementById('dice-opacity') as HTMLInputElement,
};

const dotShapeSelect = document.getElementById('dice-dot-shape') as HTMLSelectElement;

function updateDice() {
  editor.updateDiceConfig({
    baseColor: diceInputs.base.value,
    dotColor: diceInputs.dot.value,
    borderColor: diceInputs.border.value,
    dotSize: parseInt(diceInputs.dotSize.value),
    dotShape: dotShapeSelect.value as DotShape,
    dotDepth: parseFloat(diceInputs.dotDepth.value),
    bevelRadius: parseFloat(diceInputs.bevel.value),
    roughness: parseFloat(diceInputs.roughness.value),
    metalness: parseFloat(diceInputs.metalness.value),
    clearcoat: parseFloat(diceInputs.clearcoat.value),
    clearcoatRoughness: parseFloat(diceInputs.clearcoatRough.value),
    opacity: parseFloat(diceInputs.opacity.value),
  });
}

Object.values(diceInputs).forEach(input => {
  input.addEventListener('input', () => {
    updateDice();
    const valEl = document.getElementById(input.id + '-val');
    if (valEl) valEl.textContent = input.value;
  });
});

dotShapeSelect.addEventListener('change', updateDice);

// Dice preset selector
dicePresetSelect.addEventListener('change', () => {
  const preset = DICE_PRESETS[dicePresetSelect.value];
  if (!preset) return;
  
  // Update inputs
  diceInputs.base.value = preset.baseColor;
  diceInputs.dot.value = preset.dotColor;
  diceInputs.border.value = preset.borderColor;
  diceInputs.dotSize.value = String(preset.dotSize ?? 18);
  dotShapeSelect.value = preset.dotShape ?? 'circle';
  diceInputs.dotDepth.value = String(preset.dotDepth ?? 0.7);
  diceInputs.bevel.value = String(preset.bevelRadius ?? 0.08);
  diceInputs.roughness.value = String(preset.roughness ?? 0.3);
  diceInputs.metalness.value = String(preset.metalness ?? 0);
  diceInputs.clearcoat.value = String(preset.clearcoat ?? 0.8);
  diceInputs.clearcoatRough.value = String(preset.clearcoatRoughness ?? 0.2);
  diceInputs.opacity.value = String(preset.opacity ?? 1);
  
  // Update value displays
  Object.values(diceInputs).forEach(input => {
    const valEl = document.getElementById(input.id + '-val');
    if (valEl) valEl.textContent = input.value;
  });
  
  updateDice();
});

// Floor controls
const floorInputs = {
  color: document.getElementById('floor-color') as HTMLInputElement,
  texture: document.getElementById('floor-texture') as HTMLSelectElement,
  textureScale: document.getElementById('floor-texture-scale') as HTMLSelectElement,
  roughness: document.getElementById('floor-roughness') as HTMLInputElement,
  metalness: document.getElementById('floor-metalness') as HTMLInputElement,
  normal: document.getElementById('floor-normal') as HTMLInputElement,
  clearcoat: document.getElementById('floor-clearcoat') as HTMLInputElement,
};

// Wall controls
const wallInputs = {
  color: document.getElementById('wall-color') as HTMLInputElement,
  texture: document.getElementById('wall-texture') as HTMLSelectElement,
  textureScale: document.getElementById('wall-texture-scale') as HTMLSelectElement,
  roughness: document.getElementById('wall-roughness') as HTMLInputElement,
  metalness: document.getElementById('wall-metalness') as HTMLInputElement,
  normal: document.getElementById('wall-normal') as HTMLInputElement,
  clearcoat: document.getElementById('wall-clearcoat') as HTMLInputElement,
};

// Border controls
const borderInputs = {
  color: document.getElementById('border-color') as HTMLInputElement,
  roughness: document.getElementById('border-roughness') as HTMLInputElement,
  metalness: document.getElementById('border-metalness') as HTMLInputElement,
};

function updateFloor() {
  editor.updateTableConfig({
    floor: {
      color: floorInputs.color.value,
      texture: floorInputs.texture.value as TextureType,
      textureScale: floorInputs.textureScale.value as 'small' | 'medium' | 'large',
      roughness: parseFloat(floorInputs.roughness.value),
      metalness: parseFloat(floorInputs.metalness.value),
      normalIntensity: parseFloat(floorInputs.normal.value),
      clearcoat: parseFloat(floorInputs.clearcoat.value),
    }
  });
}

function updateWall() {
  editor.updateTableConfig({
    wall: {
      color: wallInputs.color.value,
      texture: wallInputs.texture.value as TextureType,
      textureScale: wallInputs.textureScale.value as 'small' | 'medium' | 'large',
      roughness: parseFloat(wallInputs.roughness.value),
      metalness: parseFloat(wallInputs.metalness.value),
      normalIntensity: parseFloat(wallInputs.normal.value),
      clearcoat: parseFloat(wallInputs.clearcoat.value),
    }
  });
}

function updateBorder() {
  editor.updateTableConfig({
    border: {
      color: borderInputs.color.value,
      roughness: parseFloat(borderInputs.roughness.value),
      metalness: parseFloat(borderInputs.metalness.value),
    }
  });
}

Object.values(floorInputs).forEach(input => {
  input.addEventListener('input', () => {
    updateFloor();
    const valEl = document.getElementById(input.id + '-val');
    if (valEl) valEl.textContent = input.value;
  });
});

Object.values(wallInputs).forEach(input => {
  input.addEventListener('input', () => {
    updateWall();
    const valEl = document.getElementById(input.id + '-val');
    if (valEl) valEl.textContent = input.value;
  });
});

Object.values(borderInputs).forEach(input => {
  input.addEventListener('input', () => {
    updateBorder();
    const valEl = document.getElementById(input.id + '-val');
    if (valEl) valEl.textContent = input.value;
  });
});

// Table preset selector
tablePresetSelect.addEventListener('change', async () => {
  const preset = TABLE_PRESETS[tablePresetSelect.value];
  if (!preset) return;
  
  // Update floor inputs
  floorInputs.color.value = preset.floor.color;
  floorInputs.texture.value = preset.floor.texture;
  floorInputs.textureScale.value = preset.floor.textureScale || 'medium';
  floorInputs.roughness.value = String(preset.floor.roughness);
  floorInputs.metalness.value = String(preset.floor.metalness);
  floorInputs.normal.value = String(preset.floor.normalIntensity);
  floorInputs.clearcoat.value = String(preset.floor.clearcoat ?? 0);
  
  // Update wall inputs
  wallInputs.color.value = preset.wall.color;
  wallInputs.texture.value = preset.wall.texture;
  wallInputs.textureScale.value = preset.wall.textureScale || 'medium';
  wallInputs.roughness.value = String(preset.wall.roughness);
  wallInputs.metalness.value = String(preset.wall.metalness);
  wallInputs.normal.value = String(preset.wall.normalIntensity);
  wallInputs.clearcoat.value = String(preset.wall.clearcoat ?? 0);
  
  // Update border inputs
  if (preset.border) {
    borderInputs.color.value = preset.border.color;
    borderInputs.roughness.value = String(preset.border.roughness);
    borderInputs.metalness.value = String(preset.border.metalness);
  }
  
  // Load real textures if specified
  if (preset.floor.realTexture) {
    floorRealTextureSelect.value = preset.floor.realTexture;
    await (editor as any).loadFloorTexture(preset.floor.realTexture);
  } else {
    floorRealTextureSelect.value = '';
    await (editor as any).loadFloorTexture('');
  }
  
  if (preset.wall.realTexture) {
    wallRealTextureSelect.value = preset.wall.realTexture;
    await (editor as any).loadWallTexture(preset.wall.realTexture);
  } else {
    wallRealTextureSelect.value = '';
    await (editor as any).loadWallTexture('');
  }
  
  // Update value displays
  [...Object.values(floorInputs), ...Object.values(wallInputs), ...Object.values(borderInputs)].forEach(input => {
    const valEl = document.getElementById(input.id + '-val');
    if (valEl) valEl.textContent = input.value;
  });
  
  updateFloor();
  updateWall();
  updateBorder();
});

// Lighting controls
const lightInputs = {
  ambient: document.getElementById('light-ambient') as HTMLInputElement,
  spot: document.getElementById('light-spot') as HTMLInputElement,
  directional: document.getElementById('light-directional') as HTMLInputElement,
};

Object.values(lightInputs).forEach(input => {
  input.addEventListener('input', () => {
    if (lightInputs.ambient) {
      (editor as any).updateLighting({
        ambient: parseFloat(lightInputs.ambient.value),
        spot: parseFloat(lightInputs.spot.value),
        directional: parseFloat(lightInputs.directional.value),
      });
    }
    const valEl = document.getElementById(input.id + '-val');
    if (valEl) valEl.textContent = input.value;
  });
});

// Buttons
document.getElementById('btn-throw')!.addEventListener('click', () => editor.throwDice());
document.getElementById('btn-reset')!.addEventListener('click', () => editor.resetDice());

// Real texture loading
const floorRealTextureSelect = document.getElementById('floor-real-texture') as HTMLSelectElement;
const wallRealTextureSelect = document.getElementById('wall-real-texture') as HTMLSelectElement;

// Load manifest and populate dropdowns
(async () => {
  await textureManager.loadManifest();
  const availableTextures = textureManager.getAvailableTextures();
  
  console.log('[Editor] Loaded textures:', availableTextures);

  // Group by category dynamically
  const categories: Record<string, typeof availableTextures> = {};
  
  availableTextures.forEach(tex => {
    if (!categories[tex.category]) {
      categories[tex.category] = [];
    }
    categories[tex.category].push(tex);
  });

  // Add options to both selects
  [floorRealTextureSelect, wallRealTextureSelect].forEach(select => {
    Object.entries(categories).forEach(([category, textures]) => {
      if (textures.length === 0) return;
      
      const optgroup = document.createElement('optgroup');
      optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);
      
      textures.forEach(tex => {
        const option = document.createElement('option');
        option.value = tex.id;
        option.textContent = tex.name;
        optgroup.appendChild(option);
      });
      
      select.appendChild(optgroup);
    });
  });
  
  console.log('[Editor] Texture dropdowns populated');
  
  // Load default textures after manifest is loaded
  await (editor as any).loadDefaultTextures();

  // Floor real texture change
  floorRealTextureSelect.addEventListener('change', async () => {
  const textureId = floorRealTextureSelect.value;
  
  // Show loading indicator
  const parent = floorRealTextureSelect.parentElement!;
  let indicator = parent.querySelector('.texture-loading, .texture-loaded, .texture-error') as HTMLElement;
  if (!indicator) {
    indicator = document.createElement('div');
    parent.appendChild(indicator);
  }
  
  if (!textureId) {
    indicator.remove();
    return;
  }
  
  indicator.className = 'texture-loading';
  indicator.textContent = '⏳ Loading texture...';
  
  const success = await (editor as any).loadFloorTexture(textureId);
  
  if (success) {
    indicator.className = 'texture-loaded';
    indicator.textContent = '✓ Texture loaded!';
    setTimeout(() => indicator.remove(), 3000);
  } else {
    indicator.className = 'texture-error';
    indicator.textContent = '✗ Failed to load (using procedural)';
    setTimeout(() => indicator.remove(), 5000);
  }
  });

  // Wall real texture change
  wallRealTextureSelect.addEventListener('change', async () => {
  const textureId = wallRealTextureSelect.value;
  
  // Show loading indicator
  const parent = wallRealTextureSelect.parentElement!;
  let indicator = parent.querySelector('.texture-loading, .texture-loaded, .texture-error') as HTMLElement;
  if (!indicator) {
    indicator = document.createElement('div');
    parent.appendChild(indicator);
  }
  
  if (!textureId) {
    indicator.remove();
    return;
  }
  
  indicator.className = 'texture-loading';
  indicator.textContent = '⏳ Loading texture...';
  
  const success = await (editor as any).loadWallTexture(textureId);
  
  if (success) {
    indicator.className = 'texture-loaded';
    indicator.textContent = '✓ Texture loaded!';
    setTimeout(() => indicator.remove(), 3000);
  } else {
    indicator.className = 'texture-error';
    indicator.textContent = '✗ Failed to load (using procedural)';
    setTimeout(() => indicator.remove(), 5000);
  }
  });

})(); // End of async texture loading

const exportOutput = document.getElementById('export-output')!;

document.getElementById('btn-export-dice')!.addEventListener('click', () => {
  const config = editor.getDiceConfig();
  const exportConfig: Record<string, unknown> = {
    baseColor: config.baseColor,
    dotColor: config.dotColor,
    borderColor: config.borderColor,
    roughness: config.roughness,
    metalness: config.metalness,
    clearcoat: config.clearcoat,
    clearcoatRoughness: config.clearcoatRoughness,
  };
  
  // Opacity
  if ((config.opacity ?? 1) < 1) exportConfig.opacity = config.opacity;
  
  // Dot customization (only if non-default)
  if ((config.dotSize ?? 18) !== 18) exportConfig.dotSize = config.dotSize;
  if ((config.dotShape ?? 'circle') !== 'circle') exportConfig.dotShape = config.dotShape;
  if ((config.dotDepth ?? 0.7) !== 0.7) exportConfig.dotDepth = config.dotDepth;
  
  // Bevel (only if non-default)
  if ((config.bevelRadius ?? 0.08) !== 0.08) exportConfig.bevelRadius = config.bevelRadius;
  
  const json = JSON.stringify(exportConfig, null, 2);
  
  exportOutput.textContent = json;
  exportOutput.style.display = 'block';
  navigator.clipboard.writeText(json);
  exportOutput.classList.add('copied');
  setTimeout(() => exportOutput.classList.remove('copied'), 300);
});

document.getElementById('btn-export-table')!.addEventListener('click', () => {
  const config = editor.getTableConfig();
  const json = JSON.stringify(config, null, 2);
  
  exportOutput.textContent = json;
  exportOutput.style.display = 'block';
  navigator.clipboard.writeText(json);
  exportOutput.classList.add('copied');
  setTimeout(() => exportOutput.classList.remove('copied'), 300);
});
