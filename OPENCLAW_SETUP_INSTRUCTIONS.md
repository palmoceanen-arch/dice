# ИНСТРУКЦИИ ПО НАСТРОЙКЕ OPENCLAW
## Пошаговое руководство для полной автоматизации

---

## 📋 ЧТО НУЖНО ПОДГОТОВИТЬ

### 1. Аккаунты на платформах

```
YouTube:
- 3-5 Google аккаунтов
- Верифицированные (телефон)
- Возраст > 1 месяца (желательно)

TikTok:
- 3-5 аккаунтов
- Привязаны к разным email/телефонам
- Возраст > 2 недели

Instagram:
- 3-5 аккаунтов
- Привязаны к разным email/телефонам
- Возраст > 1 месяца

Pinterest:
- 1-2 аккаунта
- Business account (для API)
```

### 2. API ключи и токены

```bash
# YouTube Data API
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token

# Pinterest API
PINTEREST_ACCESS_TOKEN=your_access_token
PINTEREST_BOARD_ID=your_board_id

# OpenRouter (бесплатные AI модели)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

### 3. Структура файлов

```
C:/video-automation/
├── downloads/
├── processed/
├── metadata/
├── logs/
├── sessions/
│   ├── youtube_session.json
│   ├── tiktok_session.json
│   └── instagram_session.json
├── cookies/
│   ├── tiktok_cookies.txt
│   └── instagram_cookies.txt
├── scripts/
│   ├── download_video.py
│   ├── process_video.py
│   ├── upload_youtube.py
│   ├── upload_tiktok.js
│   └── upload_instagram.py
├── skills/
│   └── video_reupload_master.md
└── config/
    ├── accounts.json
    └── openrouter.json
```

---

## 🔧 ПОШАГОВАЯ НАСТРОЙКА

### ШАГ 1: Установка OpenClaw

```bash
# Установка
npm install -g openclaw@latest

# Инициализация
openclaw onboard

# Выберите:
# - AI Provider: OpenRouter
# - Messaging: Telegram
# - Storage: Local
```

### ШАГ 2: Настройка OpenRouter

```bash
# Создайте аккаунт на https://openrouter.ai/
# Получите API ключ (бесплатный)

# Настройте в OpenClaw
openclaw config set AI_PROVIDER openrouter
openclaw config set OPENROUTER_API_KEY sk-or-v1-xxxxx
openclaw config set OPENROUTER_MODEL "google/gemini-2.0-flash-exp:free"
```

### ШАГ 3: Установка зависимостей

```bash
# Python
pip install yt-dlp moviepy pillow instagrapi

# Node.js
npm install googleapis playwright puppeteer axios

# FFmpeg
# Windows: scoop install ffmpeg
# Mac: brew install ffmpeg

# Playwright browsers
playwright install chromium
```

### ШАГ 4: Получение сессий браузера

#### YouTube:

```bash
# Запустите скрипт
node scripts/youtube_login.js

# Войдите в аккаунт вручную
# Нажмите Enter когда закончите
# Сессия сохранится в sessions/youtube_session.json
```

#### TikTok:

```bash
# Запустите скрипт
node scripts/tiktok_login.js

# Войдите в аккаунт вручную
# Нажмите Enter когда закончите
# Сессия сохранится в sessions/tiktok_session.json
```

#### Instagram:

```bash
# Запустите скрипт
node scripts/instagram_login.js

# Войдите в аккаунт вручную
# Нажмите Enter когда закончите
# Сессия сохранится в sessions/instagram_session.json
```

### ШАГ 5: Получение cookies

```bash
# Установите расширение "Get cookies.txt LOCALLY"
# Chrome: https://chrome.google.com/webstore/detail/get-cookiestxt-locally/

# 1. Войдите в TikTok
# 2. Экспортируйте cookies
# 3. Сохраните в cookies/tiktok_cookies.txt

# 4. Войдите в Instagram
# 5. Экспортируйте cookies
# 6. Сохраните в cookies/instagram_cookies.txt
```

### ШАГ 6: Настройка YouTube API

```bash
# 1. Перейдите в Google Cloud Console
#    https://console.cloud.google.com/

# 2. Создайте новый проект

# 3. Включите YouTube Data API v3

# 4. Создайте OAuth 2.0 credentials
#    - Application type: Desktop app
#    - Скачайте client_secret.json

# 5. Получите refresh token
python scripts/youtube_auth.py

# 6. Токен сохранится в youtube_token.pickle
```

### ШАГ 7: Тестовый запуск

```bash
# Скачивание
python scripts/download_video.py "https://youtube.com/watch?v=xxxxx"

# Обработка
python scripts/process_video.py downloads/xxxxx.mp4 processed/test.mp4

# Загрузка на YouTube
python scripts/upload_youtube.py processed/test.mp4 "Test Title" "Test Description"

# Загрузка на TikTok
node scripts/upload_tiktok.js processed/test.mp4 "Test Caption"

# Загрузка на Instagram
python scripts/upload_instagram.py processed/test.mp4 "Test Caption"
```

### ШАГ 8: Добавление skill в OpenClaw

```bash
# Скопируйте skill файл
cp skills/video_reupload_master.md ~/.openclaw/skills/

# Добавьте skill
openclaw skill add video_reupload_master

# Проверьте
openclaw skill list
```

### ШАГ 9: Настройка расписания

```bash
# Каждые 6 часов
openclaw cron add "0 */6 * * *" video_reupload_master

# Проверьте расписание
openclaw cron list

# Тестовый запуск (вручную)
openclaw skill run video_reupload_master
```

### ШАГ 10: Мониторинг

```bash
# Просмотр логов
tail -f ~/.openclaw/logs/openclaw.log

# Просмотр логов ошибок
tail -f logs/reupload_errors.log

# Статистика
python scripts/show_stats.py
```

---

## 📊 КОНФИГУРАЦИОННЫЕ ФАЙЛЫ

### config/accounts.json

```json
{
  "youtube": [
    {
      "id": "account1",
      "email": "your_email1@gmail.com",
      "session": "sessions/youtube_session1.json",
      "daily_limit": 10,
      "used_today": 0
    },
    {
      "id": "account2",
      "email": "your_email2@gmail.com",
      "session": "sessions/youtube_session2.json",
      "daily_limit": 10,
      "used_today": 0
    }
  ],
  "tiktok": [
    {
      "id": "account1",
      "username": "your_username1",
      "session": "sessions/tiktok_session1.json",
      "daily_limit": 5,
      "used_today": 0
    }
  ],
  "instagram": [
    {
      "id": "account1",
      "username": "your_username1",
      "session": "sessions/instagram_session1.json",
      "daily_limit": 3,
      "used_today": 0
    }
  ]
}
```

### config/niches.json

```json
{
  "niches": [
    {
      "keyword": "dice game",
      "platforms": ["youtube", "tiktok"],
      "priority": 1,
      "videos_per_run": 3
    },
    {
      "keyword": "telegram mini app",
      "platforms": ["youtube", "instagram"],
      "priority": 2,
      "videos_per_run": 2
    },
    {
      "keyword": "mobile gaming",
      "platforms": ["tiktok", "pinterest"],
      "priority": 3,
      "videos_per_run": 2
    }
  ]
}
```

### config/processing.json

```json
{
  "effects": {
    "enabled": ["speed", "brightness", "mirror"],
    "speed_range": [1.05, 1.15],
    "brightness_range": [1.05, 1.15]
  },
  "watermark": {
    "text": "Street Dice - t.me/streetdice_bot",
    "position": ["center", "bottom"],
    "opacity": 0.6,
    "fontsize": 50
  },
  "trim": {
    "start_seconds": 2,
    "end_seconds": 2
  },
  "resolution": {
    "width": 1080,
    "height": 1920
  }
}
```

---

## 🤖 КОМАНДЫ OPENCLAW

### Управление skills:

```bash
# Список всех skills
openclaw skill list

# Добавить skill
openclaw skill add path/to/skill.md

# Удалить skill
openclaw skill remove skill_name

# Запустить skill вручную
openclaw skill run skill_name

# Обновить skill
openclaw skill update skill_name path/to/skill.md
```

### Управление расписанием:

```bash
# Список задач
openclaw cron list

# Добавить задачу
openclaw cron add "0 */6 * * *" skill_name

# Удалить задачу
openclaw cron remove task_id

# Приостановить задачу
openclaw cron pause task_id

# Возобновить задачу
openclaw cron resume task_id
```

### Управление конфигурацией:

```bash
# Показать конфигурацию
openclaw config show

# Установить значение
openclaw config set KEY value

# Удалить значение
openclaw config unset KEY

# Экспорт конфигурации
openclaw config export > config_backup.json

# Импорт конфигурации
openclaw config import config_backup.json
```

---

## 🔍 ОТЛАДКА И РЕШЕНИЕ ПРОБЛЕМ

### Проблема: Видео не скачивается

```bash
# Проверьте cookies
ls -la cookies/

# Обновите cookies (они устаревают)
# Экспортируйте заново из браузера

# Проверьте yt-dlp
yt-dlp --version
yt-dlp --update

# Тест скачивания
yt-dlp "https://youtube.com/watch?v=xxxxx" -o "test.mp4"
```

### Проблема: Загрузка не работает

```bash
# Проверьте сессии
ls -la sessions/

# Обновите сессии (они устаревают через 30 дней)
node scripts/youtube_login.js
node scripts/tiktok_login.js
node scripts/instagram_login.js

# Проверьте лимиты
cat config/accounts.json | jq '.youtube[].used_today'

# Сбросьте счетчики (в полночь автоматически)
python scripts/reset_daily_limits.py
```

### Проблема: OpenClaw не запускается

```bash
# Проверьте статус
openclaw status

# Перезапустите
openclaw restart

# Проверьте логи
tail -f ~/.openclaw/logs/openclaw.log

# Проверьте конфигурацию
openclaw config show
```

### Проблема: Аккаунт заблокирован

```bash
# Используйте резервный аккаунт
# Обновите config/accounts.json

# Добавьте задержки между загрузками
# Увеличьте delay в скриптах

# Используйте прокси
# Настройте в config/proxies.json
```

---

## 📈 МОНИТОРИНГ И АНАЛИТИКА

### Скрипт статистики: `scripts/show_stats.py`

```python
#!/usr/bin/env python3
import json
import os
from datetime import datetime, timedelta

def show_stats():
    # Загрузка данных
    with open('logs/upload_history.json', 'r') as f:
        history = json.load(f)
    
    # Статистика за последние 24 часа
    now = datetime.now()
    day_ago = now - timedelta(days=1)
    
    recent = [h for h in history if datetime.fromisoformat(h['timestamp']) > day_ago]
    
    print("📊 СТАТИСТИКА ЗА 24 ЧАСА")
    print(f"Всего видео обработано: {len(recent)}")
    print(f"YouTube: {len([h for h in recent if h['platform'] == 'youtube'])}")
    print(f"TikTok: {len([h for h in recent if h['platform'] == 'tiktok'])}")
    print(f"Instagram: {len([h for h in recent if h['platform'] == 'instagram'])}")
    print(f"Pinterest: {len([h for h in recent if h['platform'] == 'pinterest'])}")
    
    # Успешность
    successful = [h for h in recent if h['success']]
    success_rate = len(successful) / len(recent) * 100 if recent else 0
    print(f"\nУспешность: {success_rate:.1f}%")
    
    # Просмотры (если есть данные)
    total_views = sum([h.get('views', 0) for h in recent])
    print(f"Всего просмотров: {total_views:,}")

if __name__ == "__main__":
    show_stats()
```

---

## ✅ ФИНАЛЬНЫЙ ЧЕКЛИСТ

### Перед запуском:
- [ ] OpenClaw установлен и настроен
- [ ] Все зависимости установлены
- [ ] API ключи получены и настроены
- [ ] Аккаунты созданы на всех платформах
- [ ] Сессии браузера сохранены
- [ ] Cookies экспортированы
- [ ] Тестовый запуск выполнен успешно
- [ ] Skills добавлены в OpenClaw
- [ ] Расписание настроено
- [ ] Мониторинг работает

### После запуска:
- [ ] Проверяйте логи ежедневно
- [ ] Обновляйте сессии раз в месяц
- [ ] Обновляйте cookies раз в неделю
- [ ] Анализируйте статистику еженедельно
- [ ] Оптимизируйте на основе данных
- [ ] Масштабируйте успешные ниши

---

**Готово! Теперь у вас есть полная инструкция для настройки OpenClaw и автоматизации перезалива видео.**

**Следующий шаг: Запустите тестовый цикл и убедитесь, что все работает!**
