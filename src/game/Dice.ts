import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type DotShape = 'circle' | 'square' | 'diamond';

export interface DiceConfig {
  baseColor: string;      // hex color like "#ffffff"
  dotColor: string;       // hex color like "#1a1a1a"
  borderColor: string;    // hex color like "#cccccc"
  // Material properties
  roughness?: number;     // 0 = mirror, 1 = matte (default 0.3)
  metalness?: number;     // 0 = plastic, 1 = metal (default 0)
  clearcoat?: number;     // 0-1, lacquer coating (default 0.8)
  clearcoatRoughness?: number; // 0-1 (default 0.2)
  // Transparency
  opacity?: number;       // 0-1 (default 1)
  // Dot customization
  dotSize?: number;       // dot radius in pixels (default 18)
  dotShape?: DotShape;    // 'circle' | 'square' | 'diamond' (default 'circle')
  dotDepth?: number;      // normal map depth 0-2 (default 0.7)
  // Geometry
  bevelRadius?: number;   // corner/edge rounding radius (default 0.08, max ~0.2)
}

const DEFAULT_CONFIG: DiceConfig = {
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
  bevelRadius: 0.16, // Match classic_white preset
};

// Merge an incoming partial dice config with DEFAULT_CONFIG without
// letting `undefined` properties overwrite the defaults. The plain
// `{ ...DEFAULT_CONFIG, ...input }` spread copies even explicitly-
// `undefined` keys, which means a config like `{ opacity: undefined }`
// (produced when a preset omits `opacity`) ends up wiping the default
// `opacity: 1`. That makes THREE log `parameter 'opacity' has value of
// undefined` and breaks dice rendering for opponents whose dice preset
// doesn't have every optional field.
function mergeDiceConfig(input: DiceConfig): DiceConfig {
  const merged: DiceConfig = { ...DEFAULT_CONFIG };
  for (const key of Object.keys(input) as (keyof DiceConfig)[]) {
    const value = input[key];
    if (value !== undefined) {
      (merged as Record<string, unknown>)[key as string] = value;
    }
  }
  return merged;
}

// Selection outline (Palmo's Dice reroll selection). Implemented as an
// "inverted hull" silhouette: a slightly inflated copy of the die
// rendered with BackSide so only the rim peeks out around the die's
// own front faces. Two passes:
//   • main:  depthTest=true,  opacity=1   — clean rim, only visible
//             where the inflated back-face is in front of everything
//             (so the back-edges of the cube do NOT show through).
//   • ghost: depthTest=false, opacity≈0.35 — same shell drawn through
//             the table / other dice so the selection stays
//             discoverable when occluded.
const OUTLINE_COLOR = 0xFFD700;
const OUTLINE_SCALE = 1.06;
// Through-occluder silhouette opacity. Rendered via a `depthTest:false`
// pass so the rim around the die stays visible even when the die rests
// on the table (the table mesh would otherwise hide the bottom of the
// outline). At 0.35 the rim was too faint to see through the felt /
// leather / wood materials, so the player couldn't tell which die was
// selected unless they tilted the camera. 0.85 keeps the see-through
// rim distinct without looking like a separate opaque highlight on top
// of the visible silhouette (the main pass at opacity 1 still draws on
// top wherever depth allows).
const OUTLINE_GHOST_OPACITY = 0.85;

export class Dice {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  private config: DiceConfig;
  // Glow-outline child group used to highlight per-die selection (Palmo's
  // Dice reroll). Hidden by default. The two inverted-hull passes are
  // grouped under one Object3D so they inherit the dice transform and
  // can be toggled together. The dice's own materials are pooled in
  // `Dice.materialCache` and therefore shared across instances, so we
  // can't tint the dice itself without bleeding into siblings — a
  // per-instance child outline keeps the highlight isolated.
  private outlineMesh: THREE.Group;
  private selected = false;

  // Interpolation state
  private prevPosition = new THREE.Vector3();
  private prevQuaternion = new THREE.Quaternion();
  private currPosition = new THREE.Vector3();
  private currQuaternion = new THREE.Quaternion();
  
  private static readonly BASE_SIZE = 0.8;
  
  // Material cache for performance (shared across all dice instances)
  private static materialCache = new Map<string, THREE.Material[]>();
  
  // Calculate size compensation for bevel radius
  private static getSizeForBevel(bevelRadius: number): number {
    return Dice.BASE_SIZE + bevelRadius * 0.4;
  }
  
  constructor(scene: THREE.Scene, world: CANNON.World, material?: CANNON.Material, config?: DiceConfig, bevelSegments: number = 3) {
    this.config = config ? mergeDiceConfig(config) : { ...DEFAULT_CONFIG };
    
    const bevelRadius = this.config.bevelRadius;
    const size = Dice.getSizeForBevel(bevelRadius);
    
    // Three.js mesh with rounded corners (visual only)
    const geometry = new RoundedBoxGeometry(
      size, 
      size, 
      size, 
      bevelSegments, 
      bevelRadius
    );
    
    const materials = this.createMaterials();
    this.mesh = new THREE.Mesh(geometry, materials);
    this.mesh.castShadow = true;
    scene.add(this.mesh);

    this.outlineMesh = this.buildOutlineMesh(bevelRadius ?? DEFAULT_CONFIG.bevelRadius!);
    this.mesh.add(this.outlineMesh);
    
    // Cannon.js body - keep simple box for physics (no rounded corners)
    const halfSize = Dice.BASE_SIZE / 2;
    this.body = new CANNON.Body({
      mass: 0.5,
      shape: new CANNON.Box(new CANNON.Vec3(halfSize, halfSize, halfSize)),
      material: material,
      linearDamping: 0.1,
      angularDamping: 0.1,
      allowSleep: true,
      sleepSpeedLimit: 0.5,
      sleepTimeLimit: 0.5
    });
    world.addBody(this.body);
    
    // Initialize interpolation state from body
    this.currPosition.set(this.body.position.x, this.body.position.y, this.body.position.z);
    this.currQuaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
    this.prevPosition.copy(this.currPosition);
    this.prevQuaternion.copy(this.currQuaternion);
  }
  
  // Check if config is different from current (to avoid unnecessary updates)
  private isConfigDifferent(newConfig: DiceConfig): boolean {
    const current = this.config;
    const merged = mergeDiceConfig(newConfig);
    
    // Compare all relevant properties
    return (
      current.baseColor !== merged.baseColor ||
      current.dotColor !== merged.dotColor ||
      current.borderColor !== merged.borderColor ||
      current.roughness !== merged.roughness ||
      current.metalness !== merged.metalness ||
      current.clearcoat !== merged.clearcoat ||
      current.clearcoatRoughness !== merged.clearcoatRoughness ||
      current.opacity !== merged.opacity ||
      current.dotSize !== merged.dotSize ||
      current.dotShape !== merged.dotShape ||
      current.dotDepth !== merged.dotDepth ||
      current.bevelRadius !== merged.bevelRadius
    );
  }
  
  // Update dice appearance with new config
  updateConfig(config: DiceConfig, bevelSegments: number = 3) {
    // Skip update if config is the same (avoid expensive material recreation)
    if (!this.isConfigDifferent(config)) {
      return;
    }
    
    
    const oldBevelRadius = this.config.bevelRadius;
    this.config = mergeDiceConfig(config);
    
    // Recreate geometry if bevelRadius changed
    if (this.config.bevelRadius !== oldBevelRadius) {
      const oldGeometry = this.mesh.geometry;
      const bevelRadius = this.config.bevelRadius;
      const size = Dice.getSizeForBevel(bevelRadius);
      const newGeometry = new RoundedBoxGeometry(
        size, size, size,
        bevelSegments, bevelRadius
      );
      
      this.mesh.geometry = newGeometry;
      oldGeometry.dispose();

      // Keep the selection outline shell sized to the new dice geometry.
      this.rebuildOutlineMesh(bevelRadius ?? DEFAULT_CONFIG.bevelRadius!);
    }
    
    // Try to get materials from cache
    const cacheKey = this.getMaterialCacheKey();
    let newMaterials = Dice.materialCache.get(cacheKey);
    
    if (!newMaterials) {
      // Create new materials and cache them
      newMaterials = this.createMaterials();
      Dice.materialCache.set(cacheKey, newMaterials);
    } else {
    }
    
    // Dispose old materials only if they're not in cache
    const oldMaterials = this.mesh.material as THREE.Material[];
    const oldCacheKey = this.getMaterialCacheKey(this.config);
    if (!Dice.materialCache.has(oldCacheKey)) {
      oldMaterials.forEach((mat) => mat.dispose());
    }
    
    this.mesh.material = newMaterials;
  }
  
  // Generate cache key for materials
  private getMaterialCacheKey(cfg?: DiceConfig): string {
    const c = cfg || this.config;
    return JSON.stringify({
      baseColor: c.baseColor,
      dotColor: c.dotColor,
      borderColor: c.borderColor,
      roughness: c.roughness,
      metalness: c.metalness,
      clearcoat: c.clearcoat,
      clearcoatRoughness: c.clearcoatRoughness,
      opacity: c.opacity,
      dotSize: c.dotSize,
      dotShape: c.dotShape,
      dotDepth: c.dotDepth,
    });
  }
  
  // Clear material cache (call when memory is low)
  static clearMaterialCache() {
    console.log('[Dice] Clearing material cache, size:', Dice.materialCache.size);
    Dice.materialCache.forEach(materials => {
      materials.forEach(mat => mat.dispose());
    });
    Dice.materialCache.clear();
  }
  
  private createMaterials(): THREE.Material[] {
    // Dice faces: 1, 6, 2, 5, 3, 4 (standard dice layout)
    const faceValues = [1, 6, 2, 5, 3, 4];
    
    return faceValues.map(value => {
      const canvas = this.createDotTexture(value);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      
      // Create bump map for indented dots effect (more reliable than normal map)
      const bumpCanvas = this.createBumpMap(value);
      const bumpMap = new THREE.CanvasTexture(bumpCanvas);
      
      // Use MeshPhysicalMaterial for clearcoat support
      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        bumpMap: bumpMap,
        bumpScale: 1.0 * this.config.dotDepth, // Strong bump effect, scales with depth
        roughness: this.config.roughness,
        metalness: this.config.metalness,
        clearcoat: this.config.clearcoat,
        clearcoatRoughness: this.config.clearcoatRoughness,
        transparent: this.config.opacity < 1,
        opacity: this.config.opacity,
      });
      
      // Optimize rendering for transparent materials
      if (this.config.opacity < 1) {
        material.depthWrite = false; // Prevent z-fighting artifacts
      }
      
      return material;
    });
  }
  
  // Create bump map for indented dot effect (simpler and more reliable than normal map)
  private createBumpMap(value: number): HTMLCanvasElement {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // White background (no displacement)
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, size, size);
    
    const dotRadius = this.config.dotSize;
    const dotShape = this.config.dotShape;
    const positions = this.getDotPositions(value, size);
    
    // Draw black dots (indented areas) with sharper edges
    positions.forEach(([cx, cy]) => {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, dotRadius);
      gradient.addColorStop(0, 'rgb(0, 0, 0)');      // Black center (deepest)
      gradient.addColorStop(0.92, 'rgb(0, 0, 0)');   // Black almost to edge (sharper transition)
      gradient.addColorStop(0.96, 'rgb(128, 128, 128)'); // Gray transition
      gradient.addColorStop(1, 'rgb(255, 255, 255)'); // White at edge
      
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
  
  // Create normal map for indented dot effect
  private createNormalMap(value: number): HTMLCanvasElement {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Neutral normal (pointing straight out) - RGB(128, 128, 255)
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, size, size);
    
    const dotRadius = this.config.dotSize;
    const dotShape = this.config.dotShape;
    const dotDepth = this.config.dotDepth;
    const positions = this.getDotPositions(value, size);
    
    // Create flat-bottomed indented dots with vertical walls
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
            
            // Almost entire dot is flat bottom, with very narrow vertical wall at edge
            const flatRadius = 0.88; // 88% flat bottom - almost full size
            const wallStart = flatRadius;
            const wallEnd = 0.98; // Very narrow wall region
            
            if (normalizedDist < wallStart) {
              // Flat bottom - normal points straight up
              nx = 0;
              ny = 0;
              nz = 1;
            } else if (normalizedDist < wallEnd) {
              // Nearly vertical wall - very steep angle
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist > 0.001) {
                // Linear scaling: depth 0-2 maps to tilt 0-0.99
                // At depth=0.1: tilt=0.05, at depth=1: tilt=0.5, at depth=2: tilt=0.99
                const tiltStrength = Math.min(dotDepth * 0.495, 0.99);
                
                // Normal tilts INWARD (negative for concave indent)
                nx = -(dx / dist) * tiltStrength;
                ny = -(dy / dist) * tiltStrength;
                nz = Math.sqrt(1 - tiltStrength * tiltStrength);
              }
            } else {
              // Tiny edge transition
              const dist = Math.sqrt(dx * dx + dy * dy);
              const edgeFactor = (1 - normalizedDist) / (1 - wallEnd);
              
              if (dist > 0.001) {
                const tiltStrength = Math.min(dotDepth * 0.45, 0.95) * edgeFactor;
                nx = -(dx / dist) * tiltStrength;
                ny = -(dy / dist) * tiltStrength;
                nz = Math.sqrt(1 - tiltStrength * tiltStrength);
              }
            }
            
            // Normalize
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            nx /= len;
            ny /= len;
            nz /= len;
            
            // Encode to RGB: [-1,1] -> [0,255]
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
    const size = 256; // Higher resolution for better quality
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Background color from config
    ctx.fillStyle = this.config.baseColor;
    ctx.fillRect(0, 0, size, size);
    
    // Subtle inner border/edge highlight
    const borderWidth = 4;
    ctx.strokeStyle = this.config.borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);
    
    const dotRadius = this.config.dotSize;
    const dotShape = this.config.dotShape;
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
    // Reset interpolation state when position is set directly
    this.prevPosition.set(x, y, z);
    this.currPosition.set(x, y, z);
    // Also sync quaternion state to prevent rotation jumps
    this.currQuaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
    this.prevQuaternion.copy(this.currQuaternion);
  }
  
  setVelocity(x: number, y: number, z: number) {
    this.body.velocity.set(x, y, z);
  }
  
  setAngularVelocity(x: number, y: number, z: number) {
    this.body.angularVelocity.set(x, y, z);
  }
  
  // Call before physics step to save previous state
  saveState() {
    this.prevPosition.copy(this.currPosition);
    this.prevQuaternion.copy(this.currQuaternion);
  }
  
  // Call after physics step to update current state
  updateState() {
    this.currPosition.set(this.body.position.x, this.body.position.y, this.body.position.z);
    this.currQuaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
  }
  
  // Interpolate between previous and current state
  update(alpha: number = 1) {
    // Lerp position
    this.mesh.position.lerpVectors(this.prevPosition, this.currPosition, alpha);
    // Slerp quaternion
    this.mesh.quaternion.slerpQuaternions(this.prevQuaternion, this.currQuaternion, alpha);
  }
  
  // Direct update without interpolation (for manual positioning)
  updateDirect() {
    this.mesh.position.copy(this.body.position as unknown as THREE.Vector3);
    this.mesh.quaternion.copy(this.body.quaternion as unknown as THREE.Quaternion);
    // Sync interpolation state
    this.currPosition.copy(this.mesh.position);
    this.currQuaternion.copy(this.mesh.quaternion);
    this.prevPosition.copy(this.mesh.position);
    this.prevQuaternion.copy(this.mesh.quaternion);
  }
  
  getTopFace(): number {
    const up = new THREE.Vector3(0, 1, 0);
    const faces = [
      { dir: new THREE.Vector3(1, 0, 0), value: 1 },
      { dir: new THREE.Vector3(-1, 0, 0), value: 6 },
      { dir: new THREE.Vector3(0, 1, 0), value: 2 },
      { dir: new THREE.Vector3(0, -1, 0), value: 5 },
      { dir: new THREE.Vector3(0, 0, 1), value: 3 },
      { dir: new THREE.Vector3(0, 0, -1), value: 4 }
    ];
    
    let maxDot = -1;
    let topValue = 1;
    
    faces.forEach(face => {
      const worldDir = face.dir.clone().applyQuaternion(this.mesh.quaternion);
      const dot = worldDir.dot(up);
      if (dot > maxDot) {
        maxDot = dot;
        topValue = face.value;
      }
    });
    
    return topValue;
  }
  
  setTopFace(value: number) {
    const rotations: Record<number, THREE.Euler> = {
      1: new THREE.Euler(0, 0, -Math.PI / 2),
      2: new THREE.Euler(0, 0, 0),
      3: new THREE.Euler(Math.PI / 2, 0, 0),
      4: new THREE.Euler(-Math.PI / 2, 0, 0),
      5: new THREE.Euler(Math.PI, 0, 0),
      6: new THREE.Euler(0, 0, Math.PI / 2),
    };
    
    const rotation = rotations[value] || rotations[1];
    const quaternion = new THREE.Quaternion().setFromEuler(rotation);
    
    this.body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    this.updateDirect();
  }
  
  // Get current dice configuration
  getConfig(): DiceConfig {
    return { ...this.config };
  }

  // Build the silhouette outline. The group sits as a child of the dice
  // mesh so it inherits all transforms automatically. We render an
  // inflated rounded-box twice with BackSide:
  //   • ghost pass first (depthTest=false, low opacity) so a faint rim
  //     stays visible through the table / other dice;
  //   • main pass second (depthTest=true, full opacity) so a crisp rim
  //     shows on the visible side and the cube's back edges stay
  //     hidden behind the die's own front faces.
  private buildOutlineMesh(bevelRadius: number): THREE.Group {
    const group = new THREE.Group();
    const geometry = this.buildOutlineGeometry(bevelRadius);

    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: OUTLINE_COLOR,
      side: THREE.BackSide,
      transparent: true,
      opacity: OUTLINE_GHOST_OPACITY,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    const ghostMesh = new THREE.Mesh(geometry, ghostMaterial);
    ghostMesh.renderOrder = 998;
    ghostMesh.castShadow = false;
    ghostMesh.receiveShadow = false;
    // Raycaster.intersectObjects recurses into children; without this
    // override clicks could hit the inflated outline before the dice.
    ghostMesh.raycast = () => {};
    group.add(ghostMesh);

    const mainMaterial = new THREE.MeshBasicMaterial({
      color: OUTLINE_COLOR,
      side: THREE.BackSide,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
    });
    const mainMesh = new THREE.Mesh(geometry, mainMaterial);
    mainMesh.renderOrder = 999;
    mainMesh.castShadow = false;
    mainMesh.receiveShadow = false;
    mainMesh.raycast = () => {};
    group.add(mainMesh);

    group.visible = this.selected;
    return group;
  }

  // Build the inflated rounded-box geometry shared by both outline
  // passes. Matches the dice's own bevel so the silhouette follows the
  // rounded corners.
  private buildOutlineGeometry(bevelRadius: number): THREE.BufferGeometry {
    const size = Dice.getSizeForBevel(bevelRadius) * OUTLINE_SCALE;
    return new RoundedBoxGeometry(size, size, size, 2, bevelRadius);
  }

  // Recreate the outline when the dice's own bevel radius changes (the
  // existing outline geometry no longer matches the new dice silhouette).
  // Both pass meshes share the same geometry, so we swap and dispose once.
  private rebuildOutlineMesh(bevelRadius: number): void {
    const newGeometry = this.buildOutlineGeometry(bevelRadius);
    let oldGeometry: THREE.BufferGeometry | null = null;
    for (const child of this.outlineMesh.children) {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) continue;
      if (!oldGeometry) oldGeometry = mesh.geometry;
      mesh.geometry = newGeometry;
    }
    oldGeometry?.dispose();
  }

  // Show / hide the selection outline for this die.
  setSelected(selected: boolean): void {
    this.selected = selected;
    this.outlineMesh.visible = selected;
  }

  isSelected(): boolean {
    return this.selected;
  }
}
