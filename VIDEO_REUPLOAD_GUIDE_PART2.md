# РУКОВОДСТВО ПО ПЕРЕЗАЛИВУ ВИДЕО - ЧАСТЬ 2
## TikTok, Instagram, Pinterest и автоматизация

---

## 5. ЗАГРУЗКА НА TIKTOK

### Метод: Автоматизация через браузер (Playwright)

```javascript
// scripts/upload_tiktok.js
const { chromium } = require('playwright');
const path = require('path');

async function uploadToTikTok(videoPath, caption, hashtags = []) {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-blink-features=AutomationControlled']
    });
    
    const context = await browser.newContext({
        storageState: 'sessions/tiktok_session.json',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    
    const page = await context.newPage();
    
    try {
        // Переход на страницу загрузки
        await page.goto('https://www.tiktok.com/upload', { 
            waitUntil: 'networkidle' 
        });
        await page.waitForTimeout(3000);
        
        // Загрузка файла
        const fileInput = await page.locator('input[type="file"]').first();
        await fileInput.setInputFiles(path.resolve(videoPath));
        
        console.log('File uploaded, waiting for processing...');
        
        // Ожидание обработки (может занять 30-60 сек)
        await page.waitForSelector('[data-e2e="upload-caption"]', { 
            timeout: 120000 
        });
        
        // Заполнение описания
        const fullCaption = `${caption}\n\n${hashtags.map(t => '#' + t).join(' ')}`;
        await page.fill('[data-e2e="upload-caption"]', fullCaption);
        
        console.log('Caption filled');
        
        // Настройки приватности (опционально)
        // await page.click('text=Who can watch this video');
        // await page.click('text=Everyone');
        
        // Публикация
        await page.click('button[data-e2e="upload-button"]');
        
        console.log('Publish button clicked');
        
        // Ожидание завершения
        await page.waitForSelector('text=Your video is being uploaded', { 
            timeout: 30000 
        });
        
        // Сохранение сессии
        await context.storageState({ 
            path: 'sessions/tiktok_session.json' 
        });
        
        await page.waitForTimeout(5000);
        await browser.close();
        
        return {
            success: true,
            platform: 'tiktok',
            message: 'Video uploaded successfully'
        };
        
    } catch (error) {
        await browser.close();
        return {
            success: false,
            error: error.message
        };
    }
}

// Использование
const videoPath = process.argv[2];
const caption = process.argv[3] || "Check this out!";
const hashtags = ['gaming', 'telegram', 'dice', 'viral'];

uploadToTikTok(videoPath, caption, hashtags)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => console.error(err));
```

### Первоначальная настройка TikTok сессии:

```javascript
// scripts/tiktok_login.js
const { chromium } = require('playwright');

async function loginTikTok() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://www.tiktok.com/login');
    
    console.log('Please login manually...');
    console.log('Press Enter when done');
    
    // Ждем ручного входа
    await new Promise(resolve => {
        process.stdin.once('data', resolve);
    });
    
    // Сохраняем сессию
    await context.storageState({ path: 'sessions/tiktok_session.json' });
    
    console.log('Session saved!');
    await browser.close();
}

loginTikTok();
```

---

## 6. ЗАГРУЗКА НА INSTAGRAM REELS

### Метод 1: Через API (instagrapi)

```python
# scripts/upload_instagram.py
#!/usr/bin/env python3
"""
Загрузка Reels на Instagram через API
"""
from instagrapi import Client
from instagrapi.types import Usertag, Location
import sys
import json
import os

def upload_to_instagram(video_path, caption, hashtags=None):
    """
    Загружает Reel на Instagram
    
    Args:
        video_path: Путь к видео
        caption: Описание
        hashtags: Список хештегов
    """
    # Загружаем сессию
    cl = Client()
    
    session_file = 'sessions/instagram_session.json'
    if os.path.exists(session_file):
        cl.load_settings(session_file)
        cl.login(cl.username, cl.password)
    else:
        # Первый вход
        username = os.getenv('INSTAGRAM_USERNAME')
        password = os.getenv('INSTAGRAM_PASSWORD')
        cl.login(username, password)
        cl.dump_settings(session_file)
    
    # Формируем полный caption
    if hashtags:
        full_caption = f"{caption}\n\n{' '.join(['#' + tag for tag in hashtags])}"
    else:
        full_caption = caption
    
    try:
        # Загрузка Reel
        media = cl.clip_upload(
            video_path,
            caption=full_caption,
            # extra_data={
            #     "custom_accessibility_caption": "",
            #     "like_and_view_counts_disabled": 0,
            #     "disable_comments": 0,
            # }
        )
        
        return {
            'success': True,
            'media_id': media.pk,
            'url': f"https://instagram.com/reel/{media.code}"
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python upload_instagram.py <video> <caption>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    caption = sys.argv[2]
    hashtags = ['gaming', 'telegram', 'dice', 'reels']
    
    result = upload_to_instagram(video_path, caption, hashtags)
    print(json.dumps(result, indent=2))
```

### Метод 2: Через браузер (Playwright)

```javascript
// scripts/upload_instagram_browser.js
const { chromium } = require('playwright');

async function uploadToInstagram(videoPath, caption, hashtags = []) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        storageState: 'sessions/instagram_session.json',
        viewport: { width: 375, height: 812 }, // Mobile viewport
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    });
    
    const page = await context.newPage();
    
    try {
        await page.goto('https://www.instagram.com/');
        await page.waitForTimeout(2000);
        
        // Кнопка создания
        await page.click('[aria-label="New post"]');
        await page.waitForTimeout(1000);
        
        // Выбор Reel
        await page.click('text=Reel');
        
        // Загрузка файла
        const fileInput = await page.locator('input[type="file"]');
        await fileInput.setInputFiles(videoPath);
        
        console.log('File uploaded, waiting...');
        await page.waitForTimeout(5000);
        
        // Далее
        await page.click('text=Next');
        await page.waitForTimeout(2000);
        await page.click('text=Next');
        await page.waitForTimeout(2000);
        
        // Заполнение caption
        const fullCaption = `${caption}\n\n${hashtags.map(t => '#' + t).join(' ')}`;
        await page.fill('[aria-label="Write a caption..."]', fullCaption);
        
        // Публикация
        await page.click('text=Share');
        
        console.log('Publish clicked');
        await page.waitForTimeout(10000);
        
        // Сохранение сессии
        await context.storageState({ path: 'sessions/instagram_session.json' });
        
        await browser.close();
        
        return {
            success: true,
            platform: 'instagram'
        };
        
    } catch (error) {
        await browser.close();
        return {
            success: false,
            error: error.message
        };
    }
}

const videoPath = process.argv[2];
const caption = process.argv[3] || "Check this out!";
const hashtags = ['gaming', 'telegram', 'dice', 'reels'];

uploadToInstagram(videoPath, caption, hashtags)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => console.error(err));
```

---

## 7. ЗАГРУЗКА НА PINTEREST

### Через API

```python
# scripts/upload_pinterest.py
#!/usr/bin/env python3
"""
Загрузка видео на Pinterest
"""
import requests
import json
import sys
import os

def upload_to_pinterest(video_path, title, description, board_id):
    """
    Загружает видео на Pinterest
    
    Требуется Pinterest API access token
    """
    access_token = os.getenv('PINTEREST_ACCESS_TOKEN')
    
    # 1. Загрузка видео
    upload_url = 'https://api.pinterest.com/v5/media'
    
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    
    with open(video_path, 'rb') as video_file:
        files = {
            'file': video_file
        }
        
        data = {
            'media_type': 'video'
        }
        
        response = requests.post(upload_url, headers=headers, files=files, data=data)
        media_id = response.json()['media_id']
    
    # 2. Создание Pin
    pin_url = 'https://api.pinterest.com/v5/pins'
    
    pin_data = {
        'board_id': board_id,
        'title': title,
        'description': description,
        'media_source': {
            'source_type': 'video_id',
            'media_id': media_id
        }
    }
    
    response = requests.post(pin_url, headers=headers, json=pin_data)
    
    if response.status_code == 201:
        pin_data = response.json()
        return {
            'success': True,
            'pin_id': pin_data['id'],
            'url': pin_data['link']
        }
    else:
        return {
            'success': False,
            'error': response.text
        }

if __name__ == "__main__":
    video_path = sys.argv[1]
    title = sys.argv[2]
    description = sys.argv[3]
    board_id = sys.argv[4]
    
    result = upload_to_pinterest(video_path, title, description, board_id)
    print(json.dumps(result, indent=2))
```

---

## 8. АВТОМАТИЗАЦИЯ ЧЕРЕЗ OPENCLAW

### Главный Skill: `skills/video_reupload_master.md`

```markdown
# Video Reupload Master

## Description
Полностью автоматизированный перезалив видео на все платформы

## Schedule
Every 6 hours: 00:00, 06:00, 12:00, 18:00

## Configuration
```json
{
  "sources": [
    {"platform": "youtube", "keyword": "dice game", "max_videos": 3},
    {"platform": "tiktok", "keyword": "telegram mini app", "max_videos": 2}
  ],
  "targets": ["youtube", "tiktok", "instagram", "pinterest"],
  "processing": {
    "effects": ["speed", "brightness", "mirror"],
    "watermark": "Street Dice - t.me/streetdice_bot",
    "trim_start": 2,
    "trim_end": 2
  },
  "limits": {
    "youtube": 10,
    "tiktok": 5,
    "instagram": 3,
    "pinterest": 10
  }
}
```

## Workflow

### Step 1: Search & Download (15 min)
```bash
# Поиск видео
python scripts/search_videos.py "dice game" > temp/search_results.json

# Скачивание топ-3
for url in $(cat temp/search_results.json | jq -r '.[0:3].url'); do
  python scripts/download_video.py "$url"
done
```

### Step 2: Process Videos (20 min)
```bash
# Обработка каждого видео
for input in downloads/*.mp4; do
  output="processed/$(basename $input)"
  python scripts/process_video.py "$input" "$output"
done
```

### Step 3: Generate Metadata (5 min)
Use OpenRouter free AI to generate:
- 5 title variations
- 3 description variations
- 10 hashtags

```
Prompt: "Generate viral title for short video about dice game in Telegram. 
Max 60 characters. Make it catchy and engaging."
```

### Step 4: Upload to Platforms (30 min)
```bash
# YouTube
for video in processed/*.mp4; do
  python scripts/upload_youtube.py "$video" "Title" "Description"
done

# TikTok
for video in processed/*.mp4; do
  node scripts/upload_tiktok.js "$video" "Caption"
done

# Instagram
for video in processed/*.mp4; do
  python scripts/upload_instagram.py "$video" "Caption"
done

# Pinterest
for video in processed/*.mp4; do
  python scripts/upload_pinterest.py "$video" "Title" "Description" "board_id"
done
```

### Step 5: Track Results (5 min)
```bash
# Сохранение метаданных
python scripts/save_upload_metadata.py

# Отправка отчета в Telegram
python scripts/send_report.py
```

### Step 6: Cleanup
```bash
# Удаление исходных файлов (старше 7 дней)
find downloads/ -type f -mtime +7 -delete

# Архивирование обработанных (старше 30 дней)
find processed/ -type f -mtime +30 -exec mv {} archive/ \;
```

## Error Handling
- If download fails → skip, try next video
- If processing fails → log error, continue
- If upload fails → retry 3x, then skip
- If platform blocks → switch to backup account
- All errors logged to: logs/reupload_errors.log

## Success Metrics
- Videos processed: > 10 per run
- Upload success rate: > 80%
- Total views (24h): > 10,000
- Cost: $0 (fully automated)
```

---

## 9. ОБХОД ОГРАНИЧЕНИЙ И БЛОКИРОВОК

### Лимиты платформ (2026):

```
YouTube:
- 10 загрузок в день (новый аккаунт)
- 50 загрузок в день (верифицированный)
- Решение: Несколько аккаунтов

TikTok:
- 5 видео в день (безопасно)
- 10 видео в день (риск)
- Решение: Ротация аккаунтов

Instagram:
- 3 Reels в день (безопасно)
- 5 Reels в день (риск)
- Решение: Несколько аккаунтов

Pinterest:
- 10-20 Pins в день
- Решение: Один аккаунт достаточно
```

### Техники обхода детекции:

1. **Изменение видео:**
   - Обрезка начала/конца (2-5 сек)
   - Изменение скорости (5-15%)
   - Зеркальное отражение
   - Изменение яркости/контраста
   - Добавление водяного знака
   - Изменение разрешения

2. **Ротация аккаунтов:**
   ```python
   accounts = [
       {'username': 'account1', 'session': 'session1.json'},
       {'username': 'account2', 'session': 'session2.json'},
       {'username': 'account3', 'session': 'session3.json'},
   ]
   
   current_account = accounts[upload_count % len(accounts)]
   ```

3. **Использование прокси:**
   ```python
   proxies = {
       'http': 'http://proxy1.com:8080',
       'https': 'http://proxy1.com:8080',
   }
   ```

4. **Задержки между загрузками:**
   ```python
   import time
   import random
   
   # Случайная задержка 5-15 минут
   delay = random.randint(300, 900)
   time.sleep(delay)
   ```

---

## 10. ЛУЧШИЕ ПРАКТИКИ

### Контент:

1. **Выбор источников:**
   - Видео с 10k+ просмотров
   - Длительность 15-60 сек
   - Вертикальный формат (9:16)
   - Без водяных знаков (или минимальных)

2. **Обработка:**
   - Всегда применяйте минимум 2-3 эффекта
   - Добавляйте свой водяной знак
   - Обрезайте начало/конец
   - Меняйте скорость на 5-10%

3. **Метаданные:**
   - Уникальные заголовки (не копируйте)
   - Релевантные хештеги (5-10 штук)
   - Описание с CTA (призыв к действию)
   - Ссылка на вашу игру

### Безопасность:

1. **Аккаунты:**
   - Используйте 3-5 аккаунтов на платформу
   - Разные email/телефоны
   - Разные IP (прокси/VPN)
   - Постепенный прогрев (начните с 1-2 видео в день)

2. **Автоматизация:**
   - Случайные задержки между действиями
   - Имитация человеческого поведения
   - Не загружайте ночью (подозрительно)
   - Варьируйте время загрузок

3. **Мониторинг:**
   - Отслеживайте блокировки
   - Проверяйте статус аккаунтов ежедневно
   - Имейте резервные аккаунты
   - Логируйте все действия

### Оптимизация:

1. **A/B тестирование:**
   - Тестируйте разные ниши
   - Тестируйте разные эффекты
   - Тестируйте разные заголовки
   - Анализируйте результаты еженедельно

2. **Масштабирование:**
   - Начните с 5-10 видео в день
   - Увеличивайте постепенно
   - Фокусируйтесь на работающих нишах
   - Автоматизируйте успешные процессы

3. **Аналитика:**
   - Отслеживайте просмотры
   - Отслеживайте вовлеченность
   - Отслеживайте переходы на игру
   - Оптимизируйте на основе данных

---

## ЧЕКЛИСТ ЗАПУСКА

### Подготовка (День 1):
- [ ] Установлены все инструменты
- [ ] Созданы папки для файлов
- [ ] Настроены API ключи
- [ ] Созданы аккаунты на платформах

### Настройка (День 2):
- [ ] Получены cookies для скачивания
- [ ] Сохранены сессии браузера
- [ ] Протестированы скрипты вручную
- [ ] Настроен OpenClaw

### Тестирование (День 3):
- [ ] Скачано 1 тестовое видео
- [ ] Обработано с эффектами
- [ ] Загружено на все платформы
- [ ] Проверены результаты

### Автоматизация (День 4-7):
- [ ] Добавлен skill в OpenClaw
- [ ] Настроено расписание
- [ ] Запущен первый автоматический цикл
- [ ] Мониторинг результатов

---

**Готово! Теперь у вас есть полное руководство для OpenClaw по автоматическому перезаливу видео на все платформы.**
