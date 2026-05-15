// Script to scan textures folder, resize images to 512x512, and generate manifest
// Run: npm run scan-textures

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const texturesDir = path.join(__dirname, 'public', 'textures');
const outputFile = path.join(__dirname, 'public', 'textures', 'manifest.json');
const TARGET_SIZE = 512;

const manifest = [];

// Resize image to 512x512
async function resizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(TARGET_SIZE, TARGET_SIZE, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed to resize ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

// Auto-discover all category folders
const allItems = fs.readdirSync(texturesDir, { withFileTypes: true });
const categories = allItems
  .filter(item => item.isDirectory())
  .map(item => item.name);

console.log(`📁 Found categories: ${categories.join(', ')}\n`);

// Scan each category
for (const category of categories) {
  const categoryPath = path.join(texturesDir, category);
  
  const files = fs.readdirSync(categoryPath);
  
  // Find all texture files (color, normal, or roughness can be base)
  const textureFiles = files.filter(f => 
    f.endsWith('_color.jpg') || 
    f.endsWith('_normal.jpg') || 
    f.endsWith('_roughness.jpg')
  );
  
  // Extract unique texture names
  const textureNames = new Set();
  for (const file of textureFiles) {
    const name = file
      .replace('_color.jpg', '')
      .replace('_normal.jpg', '')
      .replace('_roughness.jpg', '');
    textureNames.add(name);
  }
  
  for (const textureName of textureNames) {
    // Check which maps exist
    const colorFile = `${textureName}_color.jpg`;
    const normalFile = `${textureName}_normal.jpg`;
    const roughnessFile = `${textureName}_roughness.jpg`;
    const metalnessFile = `${textureName}_metalness.jpg`;
    
    const colorExists = files.includes(colorFile);
    const normalExists = files.includes(normalFile);
    const roughnessExists = files.includes(roughnessFile);
    const metalnessExists = files.includes(metalnessFile);
    
    // Need at least normal OR roughness (color is optional)
    if (!normalExists && !roughnessExists) {
      console.log(`✗ Skipping: ${textureName} (${category}) - needs at least normal or roughness map`);
      continue;
    }
    
    // Generate display name
    const displayName = textureName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const maps = [];
    if (colorExists) maps.push('color');
    if (normalExists) maps.push('normal');
    if (roughnessExists) maps.push('roughness');
    if (metalnessExists) maps.push('metalness');
    
    console.log(`📦 Processing: ${displayName} (${category}) [${maps.join(', ')}]`);
    
    // Resize all existing texture files
    const filesToResize = [];
    if (colorExists) filesToResize.push(colorFile);
    if (normalExists) filesToResize.push(normalFile);
    if (roughnessExists) filesToResize.push(roughnessFile);
    if (metalnessExists) filesToResize.push(metalnessFile);
    
    let allResized = true;
    
    for (const file of filesToResize) {
      const inputPath = path.join(categoryPath, file);
      const tempPath = path.join(categoryPath, `temp_${file}`);
      
      // Check if already 512x512
      const metadata = await sharp(inputPath).metadata();
      if (metadata.width === TARGET_SIZE && metadata.height === TARGET_SIZE) {
        console.log(`  ✓ ${file} already ${TARGET_SIZE}x${TARGET_SIZE}`);
        continue;
      }
      
      console.log(`  ⚙️  Resizing ${file} from ${metadata.width}x${metadata.height} to ${TARGET_SIZE}x${TARGET_SIZE}`);
      
      // Resize to temp file
      const resized = await resizeImage(inputPath, tempPath);
      if (resized) {
        // Replace original with resized
        fs.renameSync(tempPath, inputPath);
        console.log(`  ✓ ${file} resized`);
      } else {
        allResized = false;
      }
    }
    
    if (allResized) {
      manifest.push({
        name: textureName,
        displayName,
        category
      });
      console.log(`✓ ${displayName} ready\n`);
    }
  }
}

// Write manifest
fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));

console.log(`\n✅ Manifest created: ${manifest.length} textures found`);
console.log(`📄 Saved to: ${outputFile}`);

