# ПОЛНОЕ РУКОВОДСТВО ПО ПЕРЕЗАЛИВУ ВИДЕО
## Для OpenClaw: Автоматизация загрузки на YouTube, TikTok, Instagram, Pinterest

---

## 📋 ОГЛАВЛЕНИЕ

1. Подготовка системы
2. Скачивание видео
3. Обработка видео
4. Загрузка на YouTube Shorts
5. Загрузка на TikTok
6. Загрузка на Instagram Reels
7. Загрузка на Pinterest
8. Автоматизация через OpenClaw
9. Обход ограничений и блокировок
10. Лучшие практики

---

## 1. ПОДГОТОВКА СИСТЕМЫ

### Установка необходимых инструментов

```bash
# Python и зависимости
pip install yt-dlp
pip install moviepy
pip install pillow
pip install instagrapi
pip install TikTokApi

# Node.js пакеты
npm install googleapis
npm install playwright
npm install puppeteer
npm install axios

# FFmpeg (обработка видео)
# Windows: scoop install ffmpeg
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# Playwright browsers
playwright install chromium
```

### Структура папок

```
video-automation/
├── downloads/          # Скачанные видео
├── processed/          # Обработанные видео
├── metadata/           # Метаданные (заголовки, описания)
├── logs/              # Логи
├── sessions/          # Сохраненные сессии браузера
├── scripts/           # Скрипты автоматизации
└── config/            # Конфигурационные файлы
```

---

## 2. СКАЧИВАНИЕ ВИДЕО

### Скрипт: `scripts/download_video.py`

```python
#!/usr/bin/env python3
"""
Скачивание видео с YouTube, TikTok, Instagram
"""
import yt_dlp
import sys
import os
import json

def download_video(url, output_dir="downloads", platform="auto"):
    """
    Скачивает видео с различных платформ
    
    Args:
        url: URL видео
        output_dir: Папка для сохранения
        platform: youtube, tiktok, instagram, auto
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Базовые настройки
    ydl_opts = {
        'format': 'best[height<=1080]',
        'outtmpl': f'{output_dir}/%(id)s.%(ext)s',
        'quiet': False,
        'no_warnings': False,
    }
    
    # Специфичные настройки для платформ
    if 'tiktok' in url.lower():
        ydl_opts['format'] = 'best'
        # TikTok часто блокирует, используем cookies
        ydl_opts['cookiefile'] = 'cookies/tiktok_cookies.txt'
    
    elif 'instagram' in url.lower():
        ydl_opts['format'] = 'best'
        ydl_opts['cookiefile'] = 'cookies/instagram_cookies.txt'
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Сохраняем метаданные
            metadata = {
                'id': info.get('id'),
                'title': info.get('title'),
                'description': info.get('description'),
                'duration': info.get('duration'),
                'views': info.get('view_count'),
                'likes': info.get('like_count'),
                'uploader': info.get('uploader'),
                'upload_date': info.get('upload_date'),
                'filename': filename,
                'source_url': url
            }
            
            metadata_file = f"{output_dir}/{info['id']}_metadata.json"
            with open(metadata_file, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, ensure_ascii=False)
            
            return {
                'success': True,
                'filename': filename,
                'metadata': metadata
            }
    
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python download_video.py <url>")
        sys.exit(1)
    
    url = sys.argv[1]
    result = download_video(url)
    print(json.dumps(result, indent=2))
```

### Получение cookies для обхода блокировок

```bash
# Установите расширение "Get cookies.txt LOCALLY"
# Chrome: https://chrome.google.com/webstore/detail/get-cookiestxt-locally/
# Firefox: https://addons.mozilla.org/firefox/addon/cookies-txt/

# 1. Войдите в TikTok/Instagram в браузере
# 2. Экспортируйте cookies через расширение
# 3. Сохраните в cookies/tiktok_cookies.txt
# 4. Сохраните в cookies/instagram_cookies.txt
```

---

## 3. ОБРАБОТКА ВИДЕО

### Скрипт: `scripts/process_video.py`


```python
#!/usr/bin/env python3
"""
Обработка видео: обрезка, эффекты, водяной знак
"""
from moviepy.editor import *
from moviepy.video.fx.all import *
import sys
import os
import random

def process_video(input_file, output_file, config=None):
    """
    Обрабатывает видео для перезалива
    
    Трансформации для обхода детекции:
    - Обрезка (trim)
    - Изменение скорости (speed)
    - Зеркальное отражение (mirror)
    - Изменение яркости/контраста
    - Добавление водяного знака
    - Изменение разрешения
    """
    if config is None:
        config = {
            'max_duration': 60,  # Максимум 60 сек для Shorts
            'target_resolution': (1080, 1920),  # 9:16 вертикальное
            'effects': ['speed', 'brightness'],  # Эффекты
            'watermark_text': 'Street Dice',
            'watermark_position': ('center', 'bottom'),
            'trim_start': 0,  # Обрезать начало (сек)
            'trim_end': 0,    # Обрезать конец (сек)
        }
    
    print(f"Processing: {input_file}")
    video = VideoFileClip(input_file)
    
    # 1. Обрезка по времени
    duration = video.duration
    if duration > config['max_duration']:
        # Случайный отрезок из середины
        start = random.randint(5, int(duration - config['max_duration'] - 5))
        video = video.subclip(start, start + config['max_duration'])
    
    # Обрезка начала/конца (убрать интро/аутро)
    if config['trim_start'] > 0:
        video = video.subclip(config['trim_start'])
    if config['trim_end'] > 0:
        video = video.subclip(0, video.duration - config['trim_end'])
    
    # 2. Применение эффектов
    for effect in config['effects']:
        if effect == 'speed':
            # Ускорение на 5-15%
            speed_factor = random.uniform(1.05, 1.15)
            video = video.fx(speedx, speed_factor)
            print(f"Applied speed: {speed_factor:.2f}x")
        
        elif effect == 'mirror':
            # Зеркальное отражение
            video = video.fx(mirror_x)
            print("Applied mirror effect")
        
        elif effect == 'brightness':
            # Изменение яркости
            brightness_factor = random.uniform(1.05, 1.15)
            video = video.fx(colorx, brightness_factor)
            print(f"Applied brightness: {brightness_factor:.2f}x")
        
        elif effect == 'contrast':
            # Увеличение контраста
            video = video.fx(lum_contrast, 0, 30, 128)
            print("Applied contrast")
    
    # 3. Изменение разрешения (9:16 вертикальное)
    target_w, target_h = config['target_resolution']
    
    # Масштабируем по высоте
    video = video.resize(height=target_h)
    
    # Обрезаем по ширине (центр)
    if video.w > target_w:
        video = video.crop(x_center=video.w/2, width=target_w, height=target_h)
    
    # 4. Добавление водяного знака
    if config.get('watermark_text'):
        txt = TextClip(
            config['watermark_text'],
            fontsize=50,
            color='white',
            font='Arial-Bold',
            stroke_color='black',
            stroke_width=3
        )
        txt = txt.set_position(config['watermark_position'])
        txt = txt.set_duration(video.duration)
        txt = txt.set_opacity(0.6)
        
        video = CompositeVideoClip([video, txt])
        print(f"Added watermark: {config['watermark_text']}")
    
    # 5. Экспорт
    video.write_videofile(
        output_file,
        codec='libx264',
        audio_codec='aac',
        fps=30,
        preset='medium',
        bitrate='5000k'
    )
    
    print(f"Saved: {output_file}")
    return output_file

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_video.py <input> <output>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    result = process_video(input_file, output_file)
    print(f"Done: {result}")
```

---

## 4. ЗАГРУЗКА НА YOUTUBE SHORTS

### Метод 1: YouTube Data API (Официальный)

#### Настройка API:

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект
3. Включите "YouTube Data API v3"
4. Создайте OAuth 2.0 credentials
5. Скачайте `client_secret.json`

#### Получение токена:

```python
# scripts/youtube_auth.py
from google_auth_oauthlib.flow import InstalledAppFlow
import pickle

SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

flow = InstalledAppFlow.from_client_secrets_file(
    'client_secret.json', SCOPES)
credentials = flow.run_local_server(port=8080)

# Сохраняем токен
with open('youtube_token.pickle', 'wb') as token:
    pickle.dump(credentials, token)

print("Token saved!")
```

#### Скрипт загрузки:

```python
# scripts/upload_youtube.py
#!/usr/bin/env python3
"""
Загрузка видео на YouTube Shorts через API
"""
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.credentials import Credentials
import pickle
import sys
import json

def upload_to_youtube(video_path, title, description, tags=None, category_id='20'):
    """
    Загружает видео на YouTube
    
    Args:
        video_path: Путь к видео файлу
        title: Заголовок (max 100 символов)
        description: Описание (max 5000 символов)
        tags: Список тегов (max 500 символов)
        category_id: '20' = Gaming
    """
    # Загружаем сохраненный токен
    with open('youtube_token.pickle', 'rb') as token:
        credentials = pickle.load(token)
    
    youtube = build('youtube', 'v3', credentials=credentials)
    
    # Подготовка метаданных
    body = {
        'snippet': {
            'title': title[:100],  # Макс 100 символов
            'description': description[:5000],  # Макс 5000 символов
            'tags': tags or [],
            'categoryId': category_id,
        },
        'status': {
            'privacyStatus': 'public',  # public, private, unlisted
            'selfDeclaredMadeForKids': False,
        },
    }
    
    # Добавляем #Shorts в описание для детекции
    if '#Shorts' not in body['snippet']['description']:
        body['snippet']['description'] += '\n\n#Shorts'
    
    # Загрузка файла
    media = MediaFileUpload(
        video_path,
        chunksize=-1,
        resumable=True,
        mimetype='video/*'
    )
    
    request = youtube.videos().insert(
        part='snippet,status',
        body=body,
        media_body=media
    )
    
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Upload progress: {int(status.progress() * 100)}%")
    
    video_id = response['id']
    video_url = f"https://youtube.com/shorts/{video_id}"
    
    return {
        'success': True,
        'video_id': video_id,
        'url': video_url
    }

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python upload_youtube.py <video> <title> <description>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    title = sys.argv[2]
    description = sys.argv[3]
    tags = ['gaming', 'telegram', 'dice', 'shorts']
    
    result = upload_to_youtube(video_path, title, description, tags)
    print(json.dumps(result, indent=2))
```

### Метод 2: Автоматизация через браузер (Playwright)

```javascript
// scripts/upload_youtube_browser.js
const { chromium } = require('playwright');

async function uploadToYouTubeBrowser(videoPath, title, description) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        storageState: 'sessions/youtube_session.json'
    });
    const page = await context.newPage();
    
    // Переход на страницу загрузки
    await page.goto('https://studio.youtube.com');
    await page.waitForTimeout(2000);
    
    // Кнопка "Create"
    await page.click('button[aria-label="Create"]');
    await page.click('text=Upload videos');
    
    // Загрузка файла
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(videoPath);
    
    // Ожидание обработки
    await page.waitForSelector('text=Details', { timeout: 60000 });
    
    // Заполнение метаданных
    await page.fill('[aria-label="Add a title"]', title);
    await page.fill('[aria-label="Tell viewers about your video"]', description + '\n\n#Shorts');
    
    // Выбор "Not made for kids"
    await page.click('text=No, it\'s not made for kids');
    
    // Далее
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);
    
    // Публикация
    await page.click('button:has-text("Publish")');
    
    // Ожидание завершения
    await page.waitForSelector('text=Video published', { timeout: 120000 });
    
    // Получение URL
    const videoUrl = await page.locator('a[href*="youtube.com/watch"]').getAttribute('href');
    
    await browser.close();
    
    return {
        success: true,
        url: videoUrl
    };
}

// Использование
const videoPath = process.argv[2];
const title = process.argv[3];
const description = process.argv[4];

uploadToYouTubeBrowser(videoPath, title, description)
    .then(result => console.log(JSON.stringify(result)))
    .catch(err => console.error(err));
```

---

## 5. ЗАГРУЗКА НА TIKTOK
