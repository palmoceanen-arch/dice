import * as THREE from 'three';

export interface TextureSet {
  id: string;
  name: string;
  category: string; // Any category folder name
  color?: THREE.Texture;
  normal?: THREE.Texture;
  roughness?: THREE.Texture;
  metalness?: THREE.Texture;
  ao?: THREE.Texture;
}

export interface TextureDefinition {
  id: string;
  name: string;
  category: string; // Any category folder name
  basePath: string; // Base path without suffix (e.g., "/textures/fabric/felt_green")
}

/**
 * Texture loader with automatic discovery from manifest
 * 
 * File naming convention:
 * - texturename_color.jpg
 * - texturename_normal.jpg
 * - texturename_roughness.jpg
 * - texturename_metalness.jpg (optional)
 * - texturename_ao.jpg (optional)
 * 
 * Run "npm run scan-textures" to update manifest.json
 */
export class TextureManager {
  private loader: THREE.TextureLoader;
  private cache = new Map<string, THREE.Texture>();
  private loadedSets = new Map<string, TextureSet>();
  
  // Registry loaded from manifest
  private registry: TextureDefinition[] = [];
  private manifestLoaded = false;

  constructor() {
    this.loader = new THREE.TextureLoader();
  }

  /**
   * Load texture manifest from JSON
   */
  async loadManifest(): Promise<void> {
    if (this.manifestLoaded) return;
    
    try {
      const response = await fetch('/textures/manifest.json');
      const manifest: Array<{ name: string; displayName: string; category: string }> = await response.json();
      
      manifest.forEach(({ name, displayName, category }) => {
        const id = `${category}_${name}`;
        const categoryPath = `/textures/${category}`;
        
        // Check if already registered
        if (this.registry.find(t => t.id === id)) {
          return;
        }
        
        this.registry.push({
          id,
          name: displayName,
          category,
          basePath: `${categoryPath}/${name}`,
        });
        
        console.log(`[TextureManager] Registered: ${id} -> ${categoryPath}/${name}`);
      });
      
      this.manifestLoaded = true;
      console.log(`[TextureManager] Loaded ${manifest.length} textures from manifest`);
      console.log(`[TextureManager] Registry:`, this.registry);
    } catch (error) {
      console.warn('[TextureManager] Failed to load manifest, no textures available', error);
    }
  }

  /**
   * Register a texture manually
   */
  registerTexture(name: string, displayName: string, category: string) {
    const categoryPath = `/textures/${category}`;
    const id = `${category}_${name}`;
    
    // Check if already registered
    if (this.registry.find(t => t.id === id)) {
      return;
    }
    
    this.registry.push({
      id,
      name: displayName,
      category,
      basePath: `${categoryPath}/${name}`,
    });
  }

  /**
   * Get list of registered textures
   */
  getAvailableTextures(): TextureDefinition[] {
    return this.registry;
  }

  /**
   * Load a texture set by ID
   * Returns null if textures fail to load (use procedural fallback)
   */
  async loadTextureSet(id: string): Promise<TextureSet | null> {
    console.log(`[TextureManager] loadTextureSet called with id: ${id}`);
    console.log(`[TextureManager] Current registry:`, this.registry.map(t => t.id));
    
    // Check cache first
    if (this.loadedSets.has(id)) {
      return this.loadedSets.get(id)!;
    }

    const definition = this.registry.find(t => t.id === id);
    if (!definition) {
      console.warn(`[TextureManager] Texture not registered: ${id}`);
      return null;
    }

    try {
      const textureSet: TextureSet = {
        id: definition.id,
        name: definition.name,
        category: definition.category,
      };

      // Try to load each texture map using naming convention
      const loadPromises: Promise<void>[] = [];

      // Color map
      loadPromises.push(
        this.loadTexture(`${definition.basePath}_color.jpg`).then(tex => {
          if (tex) {
            tex.colorSpace = THREE.SRGBColorSpace;
            textureSet.color = tex;
          }
        }).catch(() => {})
      );

      // Normal map
      loadPromises.push(
        this.loadTexture(`${definition.basePath}_normal.jpg`).then(tex => {
          if (tex) textureSet.normal = tex;
        }).catch(() => {})
      );

      // Roughness map
      loadPromises.push(
        this.loadTexture(`${definition.basePath}_roughness.jpg`).then(tex => {
          if (tex) textureSet.roughness = tex;
        }).catch(() => {})
      );

      // Metalness map (optional)
      loadPromises.push(
        this.loadTexture(`${definition.basePath}_metalness.jpg`).then(tex => {
          if (tex) textureSet.metalness = tex;
        }).catch(() => {})
      );

      // AO map (optional)
      loadPromises.push(
        this.loadTexture(`${definition.basePath}_ao.jpg`).then(tex => {
          if (tex) textureSet.ao = tex;
        }).catch(() => {})
      );

      await Promise.all(loadPromises);

      // Check if we got at least color or normal map
      if (!textureSet.color && !textureSet.normal) {
        console.warn(`[TextureManager] No textures found for ${id} at ${definition.basePath}`);
        return null;
      }

      // Cache the loaded set
      this.loadedSets.set(id, textureSet);
      
      console.log(`[TextureManager] Loaded texture set: ${definition.name}`);
      return textureSet;
    } catch (error) {
      console.error(`[TextureManager] Failed to load texture set ${id}:`, error);
      return null;
    }
  }

  /**
   * Load a single texture with caching
   */
  private async loadTexture(path: string): Promise<THREE.Texture | null> {
    // Check cache
    if (this.cache.has(path)) {
      return this.cache.get(path)!.clone();
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (texture) => {
          // Configure texture
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.anisotropy = 4; // Better quality at angles
          
          // Cache it
          this.cache.set(path, texture);
          
          resolve(texture);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Apply texture set to a material
   * Color map is now optional - can use just normal/roughness for procedural coloring
   */
  applyTextureSet(
    material: THREE.MeshPhysicalMaterial,
    textureSet: TextureSet,
    repeatX: number = 1,
    repeatY: number = 1,
    roughnessMultiplier: number = 1.0,
    metalnessMultiplier: number = 1.0
  ): void {
    // Color map is optional
    if (textureSet.color) {
      const colorMap = textureSet.color.clone();
      colorMap.repeat.set(repeatX, repeatY);
      colorMap.needsUpdate = true;
      material.map = colorMap;
    }

    if (textureSet.normal) {
      const normalMap = textureSet.normal.clone();
      normalMap.repeat.set(repeatX, repeatY);
      normalMap.needsUpdate = true;
      material.normalMap = normalMap;
    }

    if (textureSet.roughness) {
      const roughnessMap = textureSet.roughness.clone();
      roughnessMap.repeat.set(repeatX, repeatY);
      roughnessMap.needsUpdate = true;
      material.roughnessMap = roughnessMap;
      // Use multiplier so slider still works
      material.roughness = roughnessMultiplier;
    }

    if (textureSet.metalness) {
      const metalnessMap = textureSet.metalness.clone();
      metalnessMap.repeat.set(repeatX, repeatY);
      metalnessMap.needsUpdate = true;
      material.metalnessMap = metalnessMap;
      // Use multiplier so slider still works
      material.metalness = metalnessMultiplier;
    }

    if (textureSet.ao) {
      const aoMap = textureSet.ao.clone();
      aoMap.repeat.set(repeatX, repeatY);
      aoMap.needsUpdate = true;
      material.aoMap = aoMap;
      material.aoMapIntensity = 0.5;
    }

    material.needsUpdate = true;
  }

  /**
   * Dispose of all cached textures
   */
  dispose(): void {
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
    
    this.loadedSets.forEach(set => {
      set.color?.dispose();
      set.normal?.dispose();
      set.roughness?.dispose();
      set.metalness?.dispose();
      set.ao?.dispose();
    });
    this.loadedSets.clear();
  }
}
