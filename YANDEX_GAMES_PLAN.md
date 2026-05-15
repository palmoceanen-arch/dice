# Yandex Games — план миграции

Этот документ описывает отдельный билд Street Dice для платформы **Яндекс Игр**.
Изначальный Telegram Mini App продолжает жить параллельно — никакой код Telegram-сборки в этом PR не удаляется и не ломается.

---

## Цели

1. **Отдельный билд** `npm run build:yandex` → `dist-yandex/`, в котором:
   - нет кода и зависимостей Telegram (бот, Stars, Telegram Web App SDK);
   - подключён Yandex Games SDK (`/sdk.js`);
   - авторизация через `ysdk.getPlayer({ signed: true })`;
   - облачные сейвы через `player.setData/getData` + `player.setStats/incrementStats`;
   - монетизация **только за внутриигровые `pips`** — никаких реальных платежей; это снижает риск отказа на модерации Я.Игр (модерация запрещает gambling и реальные ставки).
2. **Соло-режим в первой итерации** (Free Roll). Мультиплеерные режимы (Palmo's Dice, Poker Dice) и собственный WebSocket-бэкенд добавим следующей задачей.

## Что внутри Яндекс-билда

| Фича | Status |
|---|---|
| Free Roll (соло броски кубиков) | Да |
| Заработок pips за броски | Да, копится в облаке Я. |
| Облачный сейв инвентаря и настроек | Да (`player.setData`) |
| Облачная статистика (всего бросков, побед, баланс pips) | Да (`player.setStats`) |
| Магазин кубиков/столов за pips | Да (косметика; без реальных денег) |
| Кастомизация (редактор) | Да, как в Telegram-версии |
| Мультиплеер (Palmo's/Poker Dice/лобби/чат/реакции) | **Нет** — следующая задача |
| Ставки между игроками | **Нет** (риск модерации) |
| Бусты | **Нет в первой итерации** (можно вернуть позже как косметику) |
| Реферальная программа | **Нет** (нет Telegram-инвайтов) |
| Telegram Bot / Stars / openInvoice / webhook | **Нет** — выпиливается из билда |

## Архитектура

### Точки входа
- `index.html` + `src/main.ts` — оригинальный Telegram билд (не трогаем)
- `index.yandex.html` + `src/main.yandex.ts` — новый Яндекс билд

### Платформенный слой
`src/yandex/` содержит весь Я.Игры-специфичный код:
- `platform.ts` — обёртка над `YaGames.init()`, `getPlayer()`, хаптик (`navigator.vibrate`).
- `cloudSave.ts` — дебаунс-сейв и загрузка через `player.setData/setStats`. Локальный кэш в `localStorage` для отзывчивости.
- `SoloUI.ts` — минимальное меню (баланс pips, магазин, настройки, редактор).
- `SoloShop.ts` — магазин косметики за pips (читает каталог из `shared/presets.json`).

### Стабы для общего ядра
`Game.ts` (3490 строк) импортирует мультиплеерные модули. Чтобы не дублировать ядро, в Яндекс-билде через `vite resolve.alias` подменяются три файла на стабы:
- `src/multiplayer/WebSocketClient.ts` → `src/yandex/stubs/WebSocketClient.ts`
- `src/multiplayer/GameSync.ts` → `src/yandex/stubs/GameSync.ts`
- `src/multiplayer/DiceSync.ts` → `src/yandex/stubs/DiceSync.ts`

Стабы реализуют ровно тот API, который читает `Game.ts`. `isMultiplayerActive()` всегда возвращает `false`, поэтому весь сетевой код в `Game.ts` остаётся мёртвой веткой. `wsClient` в стабе перехватывает `send({ type: 'solo_roll_complete' })` и инкрементит pips в облаке.

### Сборка
`vite.config.ts` читает переменную окружения `VITE_PLATFORM`:
- `telegram` (по умолчанию) → текущий конфиг и `dist/`.
- `yandex` → `index.yandex.html` как input, алиасы стабов, `dist-yandex/`.

### npm-скрипты
- `npm run dev` / `npm run build` — Telegram-версия (без изменений).
- `npm run dev:yandex` / `npm run build:yandex` — Яндекс-версия.

## Сейвы — раскладка ключей

`player.setData` (до 200 КБ):
```jsonc
{
  "inventory": {
    "ownedDiceIds": [1, 2, 7, ...],
    "ownedTableIds": [1, 5, ...],
    "equippedDiceId": 1,
    "equippedTableId": 1
  },
  "settings": {
    "graphics": "medium",
    "soundVolume": 1,
    "language": "ru"
  },
  "customPresets": { /* кастомные кубики из редактора */ }
}
```

`player.setStats` (до 10 КБ, числа):
```jsonc
{
  "pips": 1234,
  "totalRolls": 567,
  "highestRoll": 12
}
```

`incrementStats({ pips: +N, totalRolls: +1 })` используется при каждом броске вместо `set` — атомарно, без race condition.

## Что выпилено из бандла

Точка входа `main.yandex.ts` **не импортирует** ничего из:
- `src/multiplayer/` (заменено стабами)
- `src/ui/MultiplayerUI.ts`
- `src/ui/BoostsModal.ts`
- `src/ui/BettingModal.ts`
- `src/ui/ReactionWheel.ts`
- `src/ui/ConnectionIndicator.ts`
- `server/` целиком (это бэкенд, в клиентский бандл и не попадал)

В `index.yandex.html` нет:
- `https://telegram.org/js/telegram-web-app.js`
- закрепления через `disableVerticalSwipes` / `enableClosingConfirmation`

Вместо этого в `<head>`:
- `https://yandex.ru/games/sdk/v2`

## CSP и хостинг

Для production-загрузки в Я.Игры:
1. Архив `dist-yandex/` загружается через консоль разработчика.
2. Если позже подключим свой WebSocket-сервер для мультиплеера, его домен надо будет добавить во вкладке **CSP** в консоли (по умолчанию все внешние хосты заблокированы).
3. Внешние шрифты `fonts.googleapis.com` оставлены — этот хост в whitelist Я.Игр.

## Следующие шаги (multiplayer iteration)

После того как соло-билд пройдёт модерацию:
1. Поднять/настроить WebSocket-сервер (уже есть `server/`, нужно только убрать Telegram-зависимости из auth).
2. В `server/src/services/auth.ts` добавить ветку для проверки Я.Подписи (`player.signature`, base64, HMAC-SHA256 с приватным ключом из консоли).
3. Заменить `wsClient`-стаб на реальный клиент в Яндекс-билде (либо отдельный вариант стаба, который коннектится к серверу).
4. Подать домен сервера в CSP консоли Я.Игр.
5. Реализовать UI лобби под Я.Игры (без Telegram-инвайтов — приглашение по 8-символьному коду).
6. Включить Palmo's Dice и Poker Dice без ставок (победитель получает фиксированное количество pips).

## Чек-лист модерации Я.Игр

- [x] Локализация ru/en (`shared/i18n/` уже поддерживает оба).
- [x] HTTPS-only (Vite build выдаёт статику, хостинг Я.Игр сам ставит HTTPS).
- [x] SDK Я.Игр подключён (`YaGames.init()` в `main.yandex.ts`).
- [x] Нет реальных платежей в первой итерации.
- [x] Нет ставок с реальной/покупной валютой.
- [ ] Размер архива < 100 МБ (проверить после первого `build:yandex`).
- [ ] Иконка/обложка/скриншоты — оформляются в консоли при загрузке.
