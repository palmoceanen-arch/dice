# АВТОМАТИЗАЦИЯ МАРКЕТИНГА STREET DICE С OPENCLAW
## Полностью бесплатная автоматизация маркетинга

---

## 🤖 ЧТО ТАКОЕ OPENCLAW?

**OpenClaw** (ранее Moltbot/Clawdbot) - это open-source AI-ассистент, который:
- ✅ Работает на вашем компьютере/сервере (бесплатно)
- ✅ Подключается к Telegram, WhatsApp, Discord, Slack
- ✅ Может выполнять задачи по расписанию (cron jobs)
- ✅ Имеет доступ к файлам, браузеру, API
- ✅ Помнит контекст и учится
- ✅ Расширяется через плагины (skills)

**Для маркетинга это означает:**
- Автоматическая публикация контента
- Мониторинг упоминаний и трендов
- Автоответы в сообществах
- Сбор аналитики
- Генерация контента
- Все это 24/7 без вашего участия

---

## 📦 УСТАНОВКА OPENCLAW

### Системные требования:
- Windows/Mac/Linux
- Node.js 18+
- 4GB RAM минимум
- Стабильный интернет

### Быстрая установка:

```bash
# Установка через npm
npm install -g openclaw@latest

# Запуск мастера настройки
openclaw onboard

# Следуйте инструкциям:
# 1. Выберите AI модель (Claude/OpenAI/локальная)
# 2. Подключите Telegram
# 3. Настройте права доступа
```

### Подключение Telegram:

```bash
# В процессе onboarding выберите Telegram
# Получите токен бота от @BotFather
# Введите токен в OpenClaw
# Готово - теперь можете управлять через Telegram
```

---

## 🎯 АВТОМАТИЗАЦИЯ ДЛЯ STREET DICE

### 1. АВТОМАТИЧЕСКАЯ ПУБЛИКАЦИЯ КОНТЕНТА

#### Skill #1: Ежедневные посты в Telegram-канале

**Создайте файл:** `skills/daily_channel_post.md`

```markdown
# Daily Channel Post

## Description
Posts daily content to Street Dice Telegram channel

## Schedule
Every day at 10:00 AM Moscow time

## Task
1. Generate engaging post about Street Dice:
   - Random topic: game tips, player stories, dice facts, or memes
   - Include emoji
   - Add call-to-action with bot link
   - Keep it under 200 characters
2. Post to Telegram channel @streetdice_channel
3. Log the post for analytics

## Example Output
🎲 Знаете ли вы? В Palmo's Dice комбинация "Большой стрит" (1-2-3-4-5) дает 60 очков! 

Попробуйте собрать её сегодня 👉 t.me/streetdice_bot

## API Credentials
TELEGRAM_CHANNEL_TOKEN=your_token_here
CHANNEL_ID=@streetdice_channel
```

**Активация:**
```bash
openclaw skill add skills/daily_channel_post.md
openclaw cron add "0 10 * * *" daily_channel_post
```

---

#### Skill #2: Автопостинг топ-бросков

**Создайте файл:** `skills/post_top_rolls.md`

```markdown
# Post Top Rolls

## Description
Fetches top dice rolls from database and posts to channel

## Schedule
Every day at 20:00 Moscow time

## Task
1. Connect to PostgreSQL database
2. Query top 3 rolls of the day:
   ```sql
   SELECT user_nickname, dice_result, game_mode, created_at
   FROM match_history
   WHERE DATE(created_at) = CURRENT_DATE
   ORDER BY score DESC
   LIMIT 3
   ```
3. Format as engaging post with emoji
4. Post to Telegram channel
5. Add hashtag #TopRolls

## Database Connection
DB_HOST=your_neon_host
DB_NAME=streetdice
DB_USER=your_user
DB_PASSWORD=your_password

## Example Output
🏆 ТОП-3 БРОСКА ДНЯ

1️⃣ @player1 - Пятёрка! (100 очков)
2️⃣ @player2 - Каре (70 очков)  
3️⃣ @player3 - Фулл-хаус (50 очков)

Сможешь попасть в топ завтра? 🎲
t.me/streetdice_bot

#TopRolls
```

---

#### Skill #3: Кросс-постинг в соцсети

**Используйте Mixpost skill для OpenClaw:**

```bash
# Установка Mixpost skill
openclaw skill install mixpost

# Настройка
openclaw config set MIXPOST_API_KEY your_key
openclaw config set MIXPOST_ACCOUNTS "telegram,twitter,facebook"
```

**Создайте файл:** `skills/cross_post_content.md`

```markdown
# Cross-Post Content

## Description
Posts same content to multiple platforms

## Schedule
3 times per day: 10:00, 15:00, 20:00 Moscow time

## Task
1. Generate short engaging content about Street Dice
2. Adapt format for each platform:
   - Telegram: full text + emoji
   - Twitter: short + hashtags
   - Facebook: longer + link
3. Post via Mixpost API
4. Track engagement

## Content Templates
- "Встряхни телефон и брось кости в Telegram! 🎲"
- "Играй с друзьями на pips в Street Dice"
- "Реалистичная физика костей прямо в мессенджере"
- "Кастомизируй свои кубики и выигрывай!"

## Hashtags
#TelegramGames #StreetDice #DiceGame #MiniApp #Gaming
```

---

### 2. МОНИТОРИНГ И АВТООТВЕТЫ

#### Skill #4: Мониторинг упоминаний

**Создайте файл:** `skills/monitor_mentions.md`

```markdown
# Monitor Mentions

## Description
Monitors Telegram groups for mentions of dice games and responds

## Schedule
Every 30 minutes

## Task
1. Search in monitored Telegram groups for keywords:
   - "игра в кости"
   - "dice game"
   - "telegram mini app"
   - "игры telegram"
2. If found and no response yet:
   - Generate natural response mentioning Street Dice
   - Not spammy, helpful tone
   - Include link only if appropriate
3. Log all mentions for analytics

## Monitored Groups
- @telegram_games_chat
- @miniapps_community
- @ton_gaming
- (add more groups)

## Response Examples
"Если ищете игру в кости, попробуйте Street Dice - там реальная физика, встряхиваешь телефон и кубики летят. Можно играть с друзьями на pips."

"Street Dice has realistic physics - you shake your phone and dice roll with real 3D physics. Pretty cool for a Telegram game."

## Rules
- Max 1 response per group per day
- Don't respond to own messages
- Be helpful, not promotional
```

---

#### Skill #5: Автоответы на вопросы

**Создайте файл:** `skills/auto_reply_support.md`

```markdown
# Auto Reply Support

## Description
Automatically replies to common questions in bot chat

## Trigger
When user sends message to @streetdice_bot

## Task
1. Analyze user message
2. If it's a common question, reply automatically:
   - "Как играть?" → Send game rules
   - "Как получить pips?" → Explain earning system
   - "Как пригласить друга?" → Send referral instructions
   - "Не работает" → Send troubleshooting steps
3. If complex question, flag for manual review
4. Track all questions for FAQ improvement

## Knowledge Base
Load from: knowledge_base/faq.json

## Response Style
- Friendly and helpful
- Use emoji
- Keep it short
- Always end with "Нужна ещё помощь? Напиши /help"
```

---

### 3. КОНТЕНТ-ГЕНЕРАЦИЯ

#### Skill #6: Генерация идей для видео

**Создайте файл:** `skills/generate_video_ideas.md`

```markdown
# Generate Video Ideas

## Description
Generates TikTok/Shorts video ideas based on trends

## Schedule
Every Monday at 9:00 AM

## Task
1. Analyze trending topics in gaming/telegram
2. Generate 10 video ideas for Street Dice:
   - Hook (first 3 seconds)
   - Main content (10-15 seconds)
   - CTA (last 3 seconds)
3. Save to file: content_ideas/week_[date].md
4. Send summary to Telegram

## Trend Sources
- TikTok trending sounds
- YouTube Shorts popular formats
- Reddit r/telegram, r/mobilegaming
- Twitter gaming hashtags

## Output Format
### Video Idea #1: "POV: You shake your phone"
- Hook: "Wait, you can shake your phone to roll dice?"
- Content: Show phone shake → dice flying in 3D
- CTA: "Try it in Street Dice"
- Estimated virality: 7/10
- Best platform: TikTok

[9 more ideas...]
```

---

#### Skill #7: Генерация креативов

**Создайте файл:** `skills/generate_creatives.md`

```markdown
# Generate Creatives

## Description
Generates text for social media posts and ads

## Schedule
Every day at 8:00 AM

## Task
1. Generate 5 different post variations:
   - Educational (game tips)
   - Emotional (player stories)
   - Entertaining (memes, jokes)
   - Promotional (features, updates)
   - Social proof (testimonials, stats)
2. Each with 3 length variants: short, medium, long
3. Save to: creatives/daily_[date].json
4. Best 3 send to Telegram for approval

## AI Prompt Template
"Generate engaging social media post about Street Dice - a 3D dice game in Telegram with realistic physics. Target audience: 18-35, gamers, crypto enthusiasts. Tone: [educational/emotional/entertaining]. Length: [short/medium/long]. Include emoji and CTA."

## Output Example
{
  "type": "educational",
  "length": "short",
  "text": "🎲 Секрет победы в Palmo's Dice: не жадничай! Лучше взять 30 очков, чем рисковать и сгореть. #StreetDice",
  "platforms": ["telegram", "twitter"],
  "cta": "t.me/streetdice_bot"
}
```

---

### 4. АНАЛИТИКА И ОТЧЕТЫ

#### Skill #8: Ежедневный отчет

**Создайте файл:** `skills/daily_report.md`

```markdown
# Daily Report

## Description
Generates daily analytics report

## Schedule
Every day at 23:00 Moscow time

## Task
1. Connect to database and fetch metrics:
   - New users today
   - Active users (DAU)
   - Games played
   - Pips earned
   - Purchases made
   - Referrals
2. Compare with yesterday (% change)
3. Calculate key metrics:
   - Retention Day 1
   - K-factor
   - ARPU
4. Generate visual report (text-based chart)
5. Send to private Telegram channel

## Database Queries
```sql
-- New users
SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE;

-- Active users
SELECT COUNT(DISTINCT user_id) FROM match_history 
WHERE DATE(created_at) = CURRENT_DATE;

-- Games played
SELECT COUNT(*) FROM match_history 
WHERE DATE(created_at) = CURRENT_DATE;

-- Referrals
SELECT COUNT(*) FROM referrals 
WHERE DATE(created_at) = CURRENT_DATE;
```

## Report Format
📊 ОТЧЕТ ЗА [DATE]

👥 Пользователи:
• Новых: 45 (+12% vs вчера)
• Активных: 234 (-3%)
• Retention D1: 32%

🎮 Активность:
• Игр сыграно: 567 (+8%)
• Pips заработано: 45,230
• Покупок: 12 (1,200₽)

🔗 Виральность:
• Новых рефералов: 23
• K-factor: 0.51
• Топ-реферер: @user123 (8 друзей)

📈 Тренд: ↗️ Рост активности
⚠️ Внимание: Retention снизился на 2%
```

---

#### Skill #9: Еженедельный анализ

**Создайте файл:** `skills/weekly_analysis.md`

```markdown
# Weekly Analysis

## Description
Deep analysis of weekly performance with recommendations

## Schedule
Every Monday at 10:00 AM

## Task
1. Analyze full week of data
2. Identify trends and patterns
3. Compare with previous week
4. Generate actionable recommendations
5. Create visual charts (ASCII art)
6. Send detailed report to Telegram

## Analysis Areas
- User acquisition (which channels work best)
- Retention cohorts
- Monetization (conversion funnel)
- Viral growth (referral performance)
- Content performance (which posts got most engagement)
- Technical issues (errors, crashes)

## Recommendations Format
🎯 РЕКОМЕНДАЦИИ НА НЕДЕЛЮ:

1. ФОКУС: Retention упал до 28% - добавить ежедневные задания
2. ВОЗМОЖНОСТЬ: TikTok дал 45% новых юзеров - удвоить контент
3. ПРОБЛЕМА: Конверсия в покупку 2% - протестировать новые офферы
4. УСПЕХ: K-factor вырос до 0.6 - усилить реферальные награды
```

---

### 5. АВТОМАТИЗАЦИЯ КОМЬЮНИТИ

#### Skill #10: Модерация канала

**Создайте файл:** `skills/moderate_channel.md`

```markdown
# Moderate Channel

## Description
Automatically moderates Telegram channel comments

## Trigger
On new message in channel

## Task
1. Check message for:
   - Spam links
   - Offensive language
   - Scam attempts
   - Off-topic content
2. If violation detected:
   - Delete message
   - Warn user (first time)
   - Ban user (repeat offender)
   - Log incident
3. If question detected:
   - Try to answer automatically
   - Or tag admin

## Spam Detection
- Links to other bots/channels (except whitelisted)
- Repeated messages
- Promotional content
- Crypto scams

## Auto-Responses
- "Как играть?" → Pin message with rules
- "Не работает" → Send troubleshooting
- "Промокод?" → Send current promo code
```

---

#### Skill #11: Приветствие новых участников

**Создайте файл:** `skills/welcome_new_members.md`

```markdown
# Welcome New Members

## Description
Welcomes new members in Telegram group/channel

## Trigger
On new member joined

## Task
1. Send personalized welcome message
2. Explain what the channel is about
3. Share quick start guide
4. Invite to play first game
5. Mention referral program

## Welcome Message Template
Привет, {username}! 👋

Добро пожаловать в Street Dice - игру в кости с реальной физикой прямо в Telegram!

🎲 Что здесь:
• Ежедневные турниры
• Топ-броски игроков
• Новости и обновления
• Конкурсы с призами

🚀 Начни играть: t.me/streetdice_bot
💎 Получи 500 бесплатных pips с кодом: WELCOME500

Есть вопросы? Спрашивай! 😊
```

---

### 6. ПРОДВИНУТАЯ АВТОМАТИЗАЦИЯ

#### Skill #12: Поиск партнеров

**Создайте файл:** `skills/find_partners.md`

```markdown
# Find Partners

## Description
Automatically finds and reaches out to potential partner channels

## Schedule
Every week on Wednesday at 14:00

## Task
1. Search Telegram for channels:
   - Keywords: "telegram games", "mini apps", "gaming"
   - Subscribers: 10k-100k
   - Active (posted in last 7 days)
2. Analyze channel:
   - Topic relevance
   - Engagement rate
   - Audience quality
3. If good match:
   - Find admin contact
   - Generate personalized outreach message
   - Save to: partnerships/prospects_[date].json
4. Send top 10 prospects to Telegram for review

## Outreach Template
Привет! Я представляю Street Dice - игру в кости для Telegram.

Заметил ваш канал [{channel_name}] - отличный контент про {topic}!

Хотим предложить сотрудничество:
• Ваши подписчики получают эксклюзивный промокод
• Вы получаете % от их покупок
• Мы предоставляем статистику

Интересно обсудить? 

[Your contact]
```

---

#### Skill #13: Конкурентный анализ

**Создайте файл:** `skills/competitor_analysis.md`

```markdown
# Competitor Analysis

## Description
Monitors competitor games and reports insights

## Schedule
Every 3 days at 11:00 AM

## Task
1. Monitor competitor Telegram channels:
   - @notcoin
   - @hamster_kombat
   - @catizen
   - (add more)
2. Track their:
   - Post frequency
   - Content types
   - Engagement (views, reactions)
   - New features announced
   - Promotions/events
3. Analyze what works best
4. Generate report with insights
5. Suggest ideas to copy/improve

## Report Format
🔍 КОНКУРЕНТНЫЙ АНАЛИЗ [DATE]

📊 Notcoin:
• Активность: 2 поста/день
• Лучший пост: "Новый сезон" (45k views)
• Новое: Добавили стейкинг
• Инсайт: Сезонность работает - можем добавить

🐹 Hamster Kombat:
• Активность: 3 поста/день
• Лучший пост: Мем про хомяка (67k views)
• Новое: Партнерство с биржей
• Инсайт: Мемы дают больше охвата

💡 РЕКОМЕНДАЦИИ:
1. Добавить сезонные ивенты
2. Больше мемного контента
3. Рассмотреть партнерства
```

---

#### Skill #14: Автоматический A/B тест

**Создайте файл:** `skills/ab_test_posts.md`

```markdown
# A/B Test Posts

## Description
Automatically tests different post variations

## Schedule
Every day at 12:00 and 18:00

## Task
1. Generate 2 variations of same post:
   - Variant A: Emotional angle
   - Variant B: Rational angle
2. Post both to channel (2 hours apart)
3. After 24 hours, measure:
   - Views
   - Reactions
   - Click-through rate
   - Conversions
4. Determine winner
5. Log results for learning
6. Adjust future content strategy

## Example Test
Variant A (Emotional):
"🔥 Только что игрок выиграл 50,000 pips одним броском! 
Представляешь этот адреналин? 
Попробуй сам: t.me/streetdice_bot"

Variant B (Rational):
"📊 Статистика: игроки зарабатывают в среднем 2,000 pips в день.
С бустами можно x5 больше.
Начни зарабатывать: t.me/streetdice_bot"

## Metrics Tracking
- Views: A=1,234 vs B=1,456 (B wins +18%)
- CTR: A=2.3% vs B=1.8% (A wins +28%)
- Conversions: A=12 vs B=8 (A wins +50%)
- Winner: Variant A (emotional works better)
```

---

## 🔧 НАСТРОЙКА ОКРУЖЕНИЯ

### Файл конфигурации: `.env`

```bash
# AI Model
ANTHROPIC_API_KEY=your_claude_key
# или
OPENAI_API_KEY=your_openai_key
# или используйте локальную модель (бесплатно)

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=@streetdice_channel
TELEGRAM_GROUP_ID=@streetdice_chat
TELEGRAM_ADMIN_ID=your_user_id

# Database
DATABASE_URL=your_neon_postgres_url

# Social Media (опционально)
TWITTER_API_KEY=your_key
FACEBOOK_ACCESS_TOKEN=your_token

# Mixpost (для кросс-постинга)
MIXPOST_API_KEY=your_key
```

---

## 📅 РАСПИСАНИЕ АВТОМАТИЗАЦИИ

### Ежедневно:
```
08:00 - Генерация креативов на день
10:00 - Пост в канал (основной контент)
12:00 - A/B тест (вариант A)
15:00 - Кросс-пост в соцсети
18:00 - A/B тест (вариант B)
20:00 - Топ-броски дня
23:00 - Ежедневный отчет
```

### Каждые 30 минут:
```
- Мониторинг упоминаний
- Автоответы на вопросы
- Модерация канала
```

### Еженедельно:
```
Понедельник 09:00 - Генерация идей для видео
Понедельник 10:00 - Еженедельный анализ
Среда 14:00 - Поиск партнеров
Пятница 11:00 - Конкурентный анализ
```

---

## 💰 СТОИМОСТЬ

### Полностью бесплатный вариант:
```
✅ OpenClaw - бесплатно (open-source)
✅ Локальная AI модель (Ollama) - бесплатно
✅ Telegram Bot API - бесплатно
✅ Ваш компьютер/сервер - уже есть
✅ Все skills - бесплатно (open-source)

ИТОГО: 0₽/месяц
```

### С платными AI моделями (лучшее качество):
```
✅ OpenClaw - бесплатно
✅ Claude API - ~$10-30/месяц (зависит от использования)
✅ Telegram Bot API - бесплатно
✅ VPS (если нужен 24/7) - $5-10/месяц

ИТОГО: $15-40/месяц
```

---

## 🚀 БЫСТРЫЙ СТАРТ

### День 1: Установка и базовая настройка
```bash
# 1. Установите OpenClaw
npm install -g openclaw@latest

# 2. Запустите настройку
openclaw onboard

# 3. Подключите Telegram
# Следуйте инструкциям в терминале

# 4. Проверьте работу
# Отправьте сообщение боту: "Привет!"
```

### День 2: Первые автоматизации
```bash
# 1. Создайте папку для skills
mkdir -p ~/.openclaw/skills

# 2. Скопируйте туда skills из этого гайда
# Начните с простых: daily_channel_post, auto_reply_support

# 3. Активируйте skills
openclaw skill add ~/.openclaw/skills/daily_channel_post.md
openclaw skill add ~/.openclaw/skills/auto_reply_support.md

# 4. Настройте расписание
openclaw cron add "0 10 * * *" daily_channel_post
```

### День 3: Расширение автоматизации
```bash
# Добавьте больше skills
openclaw skill add ~/.openclaw/skills/post_top_rolls.md
openclaw skill add ~/.openclaw/skills/monitor_mentions.md
openclaw skill add ~/.openclaw/skills/daily_report.md

# Настройте расписания
openclaw cron add "0 20 * * *" post_top_rolls
openclaw cron add "*/30 * * * *" monitor_mentions
openclaw cron add "0 23 * * *" daily_report
```

---

## 📊 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ

### Через 1 неделю:
- ✅ 7 автоматических постов в канале
- ✅ Автоответы на 50+ вопросов
- ✅ 7 ежедневных отчетов
- ✅ Экономия 10-15 часов вашего времени

### Через 1 месяц:
- ✅ 90+ автоматических постов
- ✅ 200+ автоответов
- ✅ 30 отчетов с аналитикой
- ✅ 10+ найденных партнеров
- ✅ Экономия 40-60 часов

### Через 3 месяца:
- ✅ Полностью автоматизированный контент-маркетинг
- ✅ Стабильный поток контента 24/7
- ✅ Данные для принятия решений
- ✅ Масштабируемая система
- ✅ Экономия 120-180 часов

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

### Ограничения:
1. **Качество AI**: Локальные модели слабее Claude/GPT
2. **Telegram лимиты**: Не более 20 сообщений/минуту в группы
3. **Модерация**: Всегда проверяйте автоматический контент
4. **Спам**: Не злоупотребляйте автопостингом

### Рекомендации:
1. **Начните с малого**: 2-3 skills, потом расширяйте
2. **Мониторьте**: Проверяйте логи и результаты
3. **Итерируйте**: Улучшайте prompts на основе результатов
4. **Бэкап**: Сохраняйте конфигурацию и skills
5. **Тестируйте**: Сначала в тестовом канале

---

## 🔗 ПОЛЕЗНЫЕ РЕСУРСЫ

### Документация:
- OpenClaw Docs: https://docs.clawd.bot/
- OpenClaw GitHub: https://github.com/openclaw/openclaw
- Skills Marketplace: https://openclawskills.io/
- Community: https://discord.gg/openclaw

### Альтернативы (если OpenClaw не подходит):
- **n8n** - визуальная автоматизация (бесплатно, self-hosted)
- **Zapier** - проще, но платно ($20+/месяц)
- **Make** (Integromat) - средний вариант
- **Собственные скрипты** - максимальный контроль

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

1. **Установите OpenClaw** (30 минут)
2. **Создайте 3 базовых skill** (2 часа)
3. **Запустите на неделю** и соберите данные
4. **Оптимизируйте** на основе результатов
5. **Масштабируйте** - добавьте больше автоматизаций

**Готовы начать? Установите OpenClaw и создайте первый skill!**
