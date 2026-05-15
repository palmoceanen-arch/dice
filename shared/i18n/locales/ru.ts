// Russian translations

import type { TranslationKeys } from './en';

export const ru: TranslationKeys = {
  // Статусы
  status: {
    connecting: 'Подключение...',
    online: '● Онлайн',
    offline: '● Офлайн',
    inGame: '● В игре',
    lobby: '● Лобби',
    authFailed: '● Ошибка авторизации',
  },

  // Кнопки
  buttons: {
    cancel: 'Отмена',
    leave: 'Выйти',
    accept: 'Принять',
    decline: 'Отклонить',
    invite: 'Пригласить',
    remove: 'Удалить',
    ready: 'Готов',
    start: 'Начать',
    close: 'Закрыть',
    save: 'Сохранить',
    back: 'Назад',
    confirm: 'Подтвердить',
    buy: 'Купить',
    equip: 'Надеть',
    equipped: 'Надето',
    stop: 'Стоп',
    pass: 'Пас',
    take: 'Взять',
    reroll: 'Перебросить',
  },

  // Диалоги
  dialogs: {
    leaveGame: 'Выйти из игры?',
    leaveLobby: 'Выйти из лобби?',
  },

  // Уведомления
  notifications: {
    title: 'Уведомления',
    news: 'Новости',
    noNews: 'Пока нет новостей',
    invitesYouTo: 'приглашает вас в',
    wantsToBeFriend: 'хочет добавить вас в друзья',
    friendRequest: '{nickname} хочет добавить вас в друзья!',
    friendRequestSent: 'Запрос в друзья отправлен!',
    friendRequestAccepted: '{nickname} принял ваш запрос в друзья!',
    invitationReceived: '{nickname} пригласил вас в игру!',
    itemReceived: '🎁 Вы получили: {item}!',
    itemsReceived: '🎁 Вы получили {count} новых предметов!',
    purchaseSuccess: '🎉 Куплено: {item}!',
    purchaseFailed: 'Покупка не удалась',
    purchaseCancelled: 'Покупка отменена',
    paymentProcessing: 'Обработка платежа...',
    paymentFailed: 'Платёж не прошёл',
    paymentNotAvailable: 'Telegram платежи недоступны',
    playerLeft: 'Другой игрок вышел. Возврат в одиночный режим.',
    gameStarted: 'Игра началась!',
    firstShooter: 'Первый бросок: {nickname}',
    reconnected: 'Переподключение к игре!',
    playerDisconnected: '{nickname} отключился. Ожидание переподключения...',
    playerReconnected: '{nickname} переподключился!',
    reconnectFailed: 'Не удалось переподключиться',
  },

  // Вкладки меню
  menu: {
    main: 'Меню',
    friends: 'Друзья',
    invites: 'Приглашения',
    inventory: 'Инвентарь',
    shop: 'Магазин',
    settings: 'Настройки',
  },

  // Вкладки панели уведомлений
  notifPanel: {
    invites: 'Приглашения',
    friends: 'Друзья',
  },

  // Профиль
  profile: {
    title: 'Профиль',
    nickname: 'Никнейм',
    changeName: 'Изменить имя',
    stats: 'Статистика',
    gamesPlayed: 'Игр сыграно',
    wins: 'Побед',
    winRate: 'Процент побед',
  },

  // Друзья
  friends: {
    title: 'Друзья',
    noFriends: 'Пока нет друзей',
    addFriend: 'Добавить друга',
    searchPlaceholder: 'Введите Telegram ID',
    search: 'Поиск',
    online: 'Онлайн',
    offline: 'Офлайн',
    inLobby: 'В лобби',
    inGame: 'В игре',
    friendRequests: 'Запросы в друзья',
    noRequests: 'Нет запросов в друзья',
    removeFriend: 'Удалить друга',
    confirmRemove: 'Удалить {nickname} из друзей?',
    invite: 'Пригласить',
    notify: 'Уведомить',
    invited: 'Приглашён',
    inviteFriends: 'Пригласить друзей',
  },

  // Реферальная система
  referrals: {
    inviteFriend: 'Пригласи за награды',
    yourCode: 'Ваш реферальный код',
    stats: 'Ваша статистика',
    totalReferrals: 'Всего рефералов',
    activeReferrals: 'Активных рефералов',
    totalRewards: 'Всего наград',
    rewards: 'Награды',
    friend: 'друг',
    friends: 'друзей',
    games: 'игр',
    rareDice: 'редкие кости',
    rareTable: 'редкий стол',
    friendPurchase: 'Друг совершил первую покупку',
    sameItem: 'предмет того же типа и редкости',
    copyLink: 'Скопировать ссылку',
    shareTelegram: 'Поделиться в Telegram',
    linkCopied: 'Ссылка скопирована!',
    copyFailed: 'Не удалось скопировать ссылку',
    shareText: 'Присоединяйся ко мне в Street Dice! 🎲',
  },

  // Приглашения
  invitations: {
    title: 'Приглашения',
    noInvitations: 'Нет приглашений',
    from: 'От',
    gameMode: 'Режим игры',
  },

  // Лобби
  lobby: {
    title: 'Лобби',
    waiting: 'Ожидание игроков...',
    selectTable: 'Выберите стол',
    players: 'Игроки',
    inviteFriends: 'Пригласить друзей',
    startGame: 'Начать игру',
    readyToStart: 'Готовы начать',
    votingForTable: 'Голосование за стол',
    host: 'Хост',
    waitingForHost: 'Ожидание хоста...',
    leaveLobby: 'Выйти из лобби',
    createLobby: 'Создать лобби',
    selectGameMode: 'Выберите режим игры',
  },

  // Инвентарь
  inventory: {
    title: 'Инвентарь',
    dice: 'Кости',
    tables: 'Столы',
    effects: 'Эффекты',
    noDice: 'Пока нет костей',
    noTables: 'Пока нет столов',
    noEffects: 'Пока нет эффектов',
  },

  // Магазин
  shop: {
    title: 'Магазин',
    dice: 'Кости',
    tables: 'Столы',
    effects: 'Эффекты',
    stars: 'звёзд',
    owned: 'Куплено',
    loading: 'Загрузка...',
    noDiceAvailable: 'Нет доступных костей',
    noTablesAvailable: 'Нет доступных столов',
    noEffectsAvailable: 'Нет доступных эффектов',
    buyFor: 'Купить за',
    youOwnThis: 'У вас есть этот предмет',
    preview: 'Просмотр',
    previewing: 'Просмотр: {item}',
    close: 'Закрыть',
  },

  // Настройки
  settings: {
    title: 'Настройки',
    language: 'Язык',
    graphics: 'Качество графики',
    graphicsLow: 'Низкое',
    graphicsMedium: 'Среднее',
    graphicsHigh: 'Высокое',
    controls: 'Управление',
    controlsMotion: 'Движение',
    controlsManual: 'Ручное',
    sound: 'Звук',
    soundOn: 'Вкл',
    soundOff: 'Выкл',
    haptics: 'Вибрация',
    hapticsOn: 'Вкл',
    hapticsOff: 'Выкл',
    confirmBeforeThrow: 'Подтверждение броска',
  },

  // Режимы игры
  gameModes: {
    freeRoll: 'Free Roll',
    streetCraps: 'Street Craps',
    mexico: 'Mexico',
    greedyPig: 'Greedy Pig',
    pokerDice: "Palmo's Dice",
    freeRollDesc: 'Тренировочные броски',
    streetCrapsDesc: 'Классические уличные кости',
    mexicoDesc: 'Проигрывает меньший бросок',
    greedyPigDesc: 'Первый до 100 побеждает',
    pokerDiceDesc: 'Покерные комбинации на 5 костях',
    rules: 'Правила',
    
    // Правила игр (поддержка markdown)
    freeRollRules: `# Free Roll

**Тренировочный режим** - бросайте кости без правил и подсчета очков.

Идеально для:
- Тестирования новых скинов костей
- Практики техники броска
- Просто веселья с физикой

Нет победителей, нет проигравших - только чистое удовольствие от бросков!`,

    streetCrapsRules: `# Street Craps — Правила

**Цель:** Выиграть раунд, выбросив нужные комбинации

## Come Out (Первый бросок)
Бросайте 2 кубика:
- **7 или 11** — вы выиграли раунд!
- **2, 3 или 12** — вы проиграли раунд
- **Другое число (4, 5, 6, 8, 9, 10)** — это ваше "Point" число, продолжайте бросать

## Point (Следующие броски)
- Выбросьте ваше **Point** число снова — вы выиграли!
- Выбросьте **7** — вы проиграли
- Другие числа — продолжайте бросать

## Победа
Выиграйте **3 раунда** чтобы победить!`,

    mexicoRules: `# Mexico — Правила

**Цель:** Не набрать 5 штрафных очков и остаться последним в игре

## Раунд
Каждый игрок бросает 2 кубика. Большее число = десятки, меньшее = единицы (6 и 4 = 64).

## Сила комбинаций (от слабой к сильной)
- **Обычные:** 31, 32, 41, 42, 43... до 65
- **Дубли:** 11 < 22 < 33 < 44 < 55 < 66
- **MEXICO (2-1)** — самая сильная комбинация!

## Штрафы
У кого самая слабая комбинация в раунде — получает 1 штрафное очко. При ничье — все с одинаковым результатом получают штраф!

## Выбывание
Набрал 5 штрафных очков — выбываешь из игры.

## Победа
Последний оставшийся игрок побеждает!`,

    greedyPigRules: `# Greedy Pig — Правила

**Цель:** Первым набрать 100 очков

## Ход игрока
Бросайте 2 кубика столько раз, сколько хотите. Сумма каждого броска добавляется к очкам текущего хода.

## Риски
- **Одна 1** — все очки текущего хода сгорают, ход переходит сопернику
- **Две 1 (1-1)** — все очки текущего хода сгорают + ваш общий счёт обнуляется до 0!

## Стоп
В любой момент можете остановиться и добавить очки хода к общему счёту.

## Победа
Первый, кто наберёт 100 или больше очков, побеждает!`,

    pokerDiceRules: `# Palmo's Dice 🎲 — Правила

**Цель:** Первым набрать 200 очков.

## Ход игры
Игроки ходят по очереди раундами. В свой раунд:
1. **Бросаешь 5 кубиков** (D6: от 1 до 6)
2. **Смотришь комбинацию** и решаешь:
   - **Взять очки** — раунд закончен
   - **Перебросить** — выбираешь кубики для переброса

### Если перебрасываешь:
- Бросаешь выбранные кубики
- **Если среди них 2+ единицы → СГОРАНИЕ:** -20 очков (не ниже 0)
- Иначе смотришь на все 5 кубиков и снова решаешь
- **Максимум 3 броска за раунд**

## Комбинации
| Комбинация | Очки | Пример |
|------------|------|--------|
| **Пятёрка** | 100 | [3][3][3][3][3] |
| **Каре** | 70 | [6][6][6][6][2] |
| **Большой стрит** | 60 | [1][2][3][4][5] или [2][3][4][5][6] |
| **Фулл-хаус** | 50 | [4][4][4][2][2] |
| **Стрит (4 подряд)** | 40 | [2][3][4][5][1] |
| **Тройка** | 30 | [5][5][5][1][2] |
| **Две пары** | 20 | [3][3][6][6][1] |
| **Пара** | 10 | [4][4][2][5][6] |
| **Ничего** | 0 | [1][2][4][5][6] |

Первый игрок, набравший 200 или больше очков, побеждает!`,
  },

  // Редкости
  rarities: {
    common: 'Обычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный',
  },

  // Ошибки
  errors: {
    serverError: 'Ошибка сервера',
    connectionLost: 'Соединение потеряно',
    unknownError: 'Неизвестная ошибка',
  },

  // Результаты игр
  gameResults: {
    // Street Craps
    wins: 'выиграл!',
    loses: 'проиграл.',
    
    // Mexico
    getsPenalty: 'получает штраф!',
    eliminated: 'выбыл!',
    
    // Greedy Pig
    turn: 'Ход',
    total: 'Всего',
    pigOut: '🐷 Свинья!',
    lostTurnPoints: 'Потеряно {points} очков хода',
    snakeEyes: '🐍 Змеиные глаза!',
    lostEverything: 'Потеряно {turnPoints} хода + {totalPoints} всего = 0!',
    banked: 'Сохранено {points} очков!',
    score: 'Счёт',
    
    // Palmo's Dice
    bust: '🔥 СГОРАНИЕ!',
  },

  // Реакции
  reactions: {
    selectCategory: 'Выбери',
    back: 'Назад',
    categories: {
      game: 'Игра',
      chat: 'Общение',
      emotions: 'Эмоции',
      actions: 'Действия',
    },
    game: {
      niceRoll: 'Круто!',
      close: 'Почти!',
    },
    chat: {
      goodLuck: 'Удачи!',
      oneMore: 'Еще!',
      brb: 'Отошел!',
    },
  },

  // Бусты
  boosts: {
    title: 'Ускорители',
    activate: 'Активировать',
    active: 'Активен',
    cooldown: 'Перезарядка',
    ready: 'Готов!',
    anotherActive: 'Другой буст активен',
    alreadyActive: 'Другой буст уже активен!',
    chooseParity: 'Выберите множитель для:',
    even: 'ЧЕТНЫЕ',
    odd: 'НЕЧЕТНЫЕ',
    double: {
      name: 'Double Pips',
      desc: 'x2 pips за все броски',
    },
    triple: {
      name: 'Triple Pips',
      desc: 'x3 pips',
    },
    snakeEyes: {
      name: 'Lucky Snakes',
      desc: '+1111 pips за змеиные глаза (1+1)',
    },
    golden: {
      name: 'Golden Hour',
      desc: 'x5 pips за все броски',
    },
  },
  
  // Редактор кубиков
  diceEditor: {
    appearance: 'Внешний вид',
    pips: 'Точки',
    material: 'Материал',
    physics: 'Физика',
    reset: 'Сброс',
    apply: 'Применить',
    baseColor: 'Цвет основы',
    pipColor: 'Цвет точек',
    borderColor: 'Цвет граней',
    bevelRadius: 'Скругление граней',
    pipSize: 'Размер точек',
    pipDepth: 'Глубина точек',
    roughness: 'Шероховатость',
    metalness: 'Металличность',
    clearcoat: 'Лак',
    clearcoatRoughness: 'Шероховатость лака',
    opacity: 'Прозрачность',
  },

  // Ставки
  betting: {
    title: 'Сделайте ставку',
    subtitle: 'Выберите сумму для ставки',
    customAmount: 'Своя сумма',
    pot: 'Банк',
    confirm: 'Подтвердить',
    waiting: 'Ожидание других игроков...',
    playersBets: 'Ставки игроков',
  },
};
