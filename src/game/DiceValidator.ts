// DiceValidator - проверяет валидность броска (кубик не на боку)
import * as THREE from 'three';
import type { Dice } from './Dice';

export interface ValidationResult {
  isValid: boolean;
  invalidDiceIndices: number[];
  reason?: string;
}

export class DiceValidator {
  // Минимальный угол между верхней гранью и вертикалью для валидного броска
  // Увеличено до 0.98 для максимально строгой проверки (≈11°)
  private static readonly MIN_FACE_ALIGNMENT = 0.98; // cos(11°) ≈ 0.982
  
  // Максимальная высота центра кубика над полом (если выше - кубик подвешен/на стене)
  private static readonly MAX_HEIGHT_ABOVE_FLOOR = 0.6; // половина размера кубика (0.8) + небольшой запас
  
  /**
   * Проверяет, валиден ли бросок (все кубики лежат на гранях, а не на ребрах/углах)
   * @param dice - массив кубиков для проверки
   * @returns результат валидации с информацией о невалидных кубиках
   */
  static validateDicePositions(dice: Dice[]): ValidationResult {
    const invalidDiceIndices: number[] = [];
    
    dice.forEach((die, index) => {
      if (!this.isDiceOnValidFace(die)) {
        invalidDiceIndices.push(index);
      }
    });
    
    const isValid = invalidDiceIndices.length === 0;
    
    return {
      isValid,
      invalidDiceIndices,
      reason: isValid ? undefined : 'One or more dice are not resting on a face'
    };
  }
  
  /**
   * Проверяет, лежит ли кубик на одной из своих граней
   * @param dice - кубик для проверки
   * @returns true если кубик лежит на грани, false если на ребре/углу
   */
  private static isDiceOnValidFace(dice: Dice): boolean {
    // Проверка 1: Высота над полом (кубик не должен висеть на стене)
    const height = dice.body.position.y;
    if (height > this.MAX_HEIGHT_ABOVE_FLOOR) {
      return false; // Кубик слишком высоко - висит на стене или подвешен
    }
    
    // Проверка 2: Одна грань должна смотреть ВВЕРХ, другая ВНИЗ
    const up = new THREE.Vector3(0, 1, 0);
    const down = new THREE.Vector3(0, -1, 0);
    
    // Все 6 граней кубика
    const faces = [
      new THREE.Vector3(1, 0, 0),   // +X (грань 1)
      new THREE.Vector3(-1, 0, 0),  // -X (грань 6)
      new THREE.Vector3(0, 1, 0),   // +Y (грань 2)
      new THREE.Vector3(0, -1, 0),  // -Y (грань 5)
      new THREE.Vector3(0, 0, 1),   // +Z (грань 3)
      new THREE.Vector3(0, 0, -1)   // -Z (грань 4)
    ];
    
    // Находим грань, которая смотрит вверх (максимальное выравнивание с up)
    let maxUpAlignment = -1;
    let maxDownAlignment = -1;
    
    faces.forEach(faceDir => {
      const worldDir = faceDir.clone().applyQuaternion(dice.mesh.quaternion);
      
      // Проверяем выравнивание с вертикалью вверх
      const upDot = worldDir.dot(up);
      if (upDot > maxUpAlignment) {
        maxUpAlignment = upDot;
      }
      
      // Проверяем выравнивание с вертикалью вниз
      const downDot = worldDir.dot(down);
      if (downDot > maxDownAlignment) {
        maxDownAlignment = downDot;
      }
    });
    
    // Кубик валиден, если:
    // 1. Одна грань смотрит вверх (maxUpAlignment >= порог)
    // 2. Противоположная грань смотрит вниз (maxDownAlignment >= порог)
    // Это гарантирует, что кубик лежит на грани, а не на ребре
    const isValid = maxUpAlignment >= this.MIN_FACE_ALIGNMENT && 
                    maxDownAlignment >= this.MIN_FACE_ALIGNMENT;
    
    return isValid;
  }
  
  /**
   * Получает угол наклона кубика относительно идеального положения (в градусах)
   * Полезно для отладки и визуализации
   */
  static getDiceTiltAngle(dice: Dice): number {
    const up = new THREE.Vector3(0, 1, 0);
    const faces = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1)
    ];
    
    let maxAlignment = -1;
    
    faces.forEach(faceDir => {
      const worldDir = faceDir.clone().applyQuaternion(dice.mesh.quaternion);
      const alignment = Math.abs(worldDir.dot(up));
      
      if (alignment > maxAlignment) {
        maxAlignment = alignment;
      }
    });
    
    // Преобразуем cos в угол
    const angleRad = Math.acos(Math.min(1, maxAlignment));
    return (angleRad * 180) / Math.PI;
  }
  
  /**
   * Получает информацию о выравнивании граней (для отладки)
   */
  static getDiceAlignmentInfo(dice: Dice): { upAlignment: number; downAlignment: number } {
    const up = new THREE.Vector3(0, 1, 0);
    const down = new THREE.Vector3(0, -1, 0);
    
    const faces = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1)
    ];
    
    let maxUpAlignment = -1;
    let maxDownAlignment = -1;
    
    faces.forEach(faceDir => {
      const worldDir = faceDir.clone().applyQuaternion(dice.mesh.quaternion);
      
      const upDot = worldDir.dot(up);
      if (upDot > maxUpAlignment) {
        maxUpAlignment = upDot;
      }
      
      const downDot = worldDir.dot(down);
      if (downDot > maxDownAlignment) {
        maxDownAlignment = downDot;
      }
    });
    
    return { upAlignment: maxUpAlignment, downAlignment: maxDownAlignment };
  }
  
  /**
   * Получает высоту кубика над полом
   */
  static getDiceHeight(dice: Dice): number {
    return dice.body.position.y;
  }
}
