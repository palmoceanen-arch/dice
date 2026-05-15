import * as THREE from 'three';

/**
 * WallText - динамический текст на задней стене
 * Оптимизирован для минимального влияния на FPS
 */
export class WallText {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public texture: THREE.CanvasTexture; // Публичный для установки anisotropy
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;
  
  private pips: number = 0;
  private fontSize: number = 300; // В 2 раза больше (было 150)
  private textColor: string = '#D4D4C8'; // Более выцветший бежевый/серый
  
  // Оптимизация: обновляем текстуру только когда нужно
  private needsUpdate: boolean = false;
  private animationFrameId: number | null = null;
  
  constructor(scene: THREE.Scene, position: THREE.Vector3, width: number, height: number) {
    // Увеличенное разрешение для большого шрифта (1024x512)
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 512;
    
    this.ctx = this.canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false
    })!;
    
    // Включаем сглаживание для canvas
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    
    // Создаем текстуру из canvas
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
    // anisotropy не устанавливаем (по умолчанию 1)
    
    // Создаем материал с прозрачностью
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.95,
      side: THREE.FrontSide,
      depthWrite: false,
      depthTest: true
    });
    
    // Создаем плоскость для текста
    const geometry = new THREE.PlaneGeometry(width * 0.9, height * 0.4);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.copy(position);
    this.mesh.position.z += 0.01;
    this.mesh.renderOrder = 1;
    
    // НЕ вращаем - пусть перспектива камеры сама создаст нужный эффект
    // Текст будет иметь ту же перспективу что и стена
    
    scene.add(this.mesh);
    
    console.log('[WallText] Created at position:', position, 'size:', width, height);
    console.log('[WallText] Canvas resolution:', this.canvas.width, 'x', this.canvas.height);
    console.log('[WallText] Mesh visible:', this.mesh.visible);
    
    // Ждем загрузки шрифта перед первым рендером
    if (document.fonts && document.fonts.load) {
      document.fonts.load('300px "Alfa Slab One"').then(() => {
        console.log('[WallText] Alfa Slab One font loaded, updating canvas');
        this.updateCanvasImmediate();
      }).catch(() => {
        console.warn('[WallText] Failed to load Alfa Slab One, using fallback');
        this.updateCanvasImmediate();
      });
    } else {
      // Fallback для старых браузеров
      this.updateCanvasImmediate();
    }
  }
  
  /**
   * Установить количество pips
   */
  public setPips(value: number) {
    if (this.pips !== value) {
      this.pips = value;
      this.scheduleUpdate();
    }
  }
  
  /**
   * Получить текущее количество pips
   */
  public getPips(): number {
    return this.pips;
  }
  
  /**
   * Добавить pips (без анимации)
   */
  public addPips(amount: number) {
    this.setPips(this.pips + amount);
  }
  
  /**
   * Установить цвет текста
   */
  public setTextColor(color: string) {
    this.textColor = color;
    this.scheduleUpdate();
  }
  
  /**
   * Установить размер шрифта
   */
  public setFontSize(size: number) {
    this.fontSize = size;
    this.scheduleUpdate();
  }
  
  /**
   * Запланировать обновление (debounce для производительности)
   */
  private scheduleUpdate() {
    if (this.animationFrameId !== null) {
      return; // Уже запланировано
    }
    
    this.needsUpdate = true;
    this.animationFrameId = requestAnimationFrame(() => {
      this.animationFrameId = null;
      if (this.needsUpdate) {
        this.updateCanvasImmediate();
        this.needsUpdate = false;
      }
    });
  }
  
  /**
   * Немедленное обновление canvas (используется внутри)
   */
  private updateCanvasImmediate() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // Очищаем canvas
    ctx.clearRect(0, 0, w, h);
    
    // DEBUG: Рисуем фон чтобы видеть границы
    if ((window as any).__debugWallText) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(0, 0, w, h);
    }
    
    // Форматируем число с разделителями тысяч
    const formattedPips = this.pips.toLocaleString('en-US');
    
    // Используем Alfa Slab One как в результате броска
    ctx.font = `${this.fontSize}px 'Alfa Slab One', serif`;
    ctx.textAlign = 'center'; // По центру
    ctx.textBaseline = 'middle';
    
    // Рисуем основной текст (цифры) - по центру canvas
    ctx.fillStyle = this.textColor;
    ctx.fillText(formattedPips, w / 2, h / 2 - 80); // Выше (было -30)
    
    // Рисуем подпись "PIPS" - тоже по центру, 30% от размера цифр
    ctx.font = `600 ${this.fontSize * 0.3}px 'Montserrat', sans-serif`;
    ctx.fillStyle = this.textColor;
    ctx.fillText('PIPS', w / 2, h / 2 + 120); // Ниже (было +50)
    
    // Обновляем текстуру
    this.texture.needsUpdate = true;
    
    // DEBUG: Логируем обновление
    if ((window as any).__debugWallText) {
      console.log('[WallText] Updated canvas with pips:', this.pips);
    }
  }
  
  /**
   * Показать/скрыть текст
   */
  public setVisible(visible: boolean) {
    this.mesh.visible = visible;
  }
  
  /**
   * Анимация появления нового значения (ОТКЛЮЧЕНА для производительности)
   */
  public animateChange(newValue: number, duration: number = 500) {
    // Просто устанавливаем значение без анимации
    this.setPips(newValue);
  }
  
  /**
   * Очистка ресурсов
   */
  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.texture.dispose();
    this.material.dispose();
    this.mesh.geometry.dispose();
  }
  
  /**
   * Обновление текстуры (вызывается из render loop если нужно)
   * Возвращает true если было обновление
   */
  public update(): boolean {
    // Ничего не делаем - обновление происходит через requestAnimationFrame
    return false;
  }
}
