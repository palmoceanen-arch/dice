# i18n System

Профессиональная система интернационализации для проекта.

## Структура

```
shared/i18n/
├── index.ts           # Основная логика i18n
├── types.ts           # TypeScript типы
├── locales/
│   ├── en.ts         # Английские переводы
│   └── ru.ts         # Русские переводы
└── README.md         # Эта документация
```

## Использование

### Инициализация

В `src/main.ts`:

```typescript
import { initI18n } from '../shared/i18n';

// Инициализировать при старте приложения
initI18n();
```

### Базовый перевод

```typescript
import { t } from '../shared/i18n';

// Простой перевод
const text = t('status.online'); // "● Online" или "● Онлайн"

// С параметрами
const notification = t('notifications.friendRequest', { 
  nickname: 'John' 
}); // "John wants to be your friend!" или "John хочет добавить вас в друзья!"
```

### Переключение языка

```typescript
import { setLanguage, getCurrentLanguage } from '../shared/i18n';

// Получить текущий язык
const lang = getCurrentLanguage(); // 'en' | 'ru'

// Установить язык
setLanguage('ru');
```

### Подписка на изменения языка

```typescript
import { onLanguageChange } from '../shared/i18n';

// Подписаться на изменения
const unsubscribe = onLanguageChange((newLang) => {
  console.log('Language changed to:', newLang);
  // Обновить UI
});

// Отписаться когда компонент уничтожается
unsubscribe();
```

## Добавление новых переводов

### 1. Добавить ключ в английский файл

`shared/i18n/locales/en.ts`:

```typescript
export const en = {
  // ... существующие переводы
  
  newSection: {
    title: 'New Section',
    description: 'This is a new section',
    action: 'Click here',
  },
} as const;
```

### 2. Добавить перевод в русский файл

`shared/i18n/locales/ru.ts`:

```typescript
export const ru: TranslationKeys = {
  // ... существующие переводы
  
  newSection: {
    title: 'Новая секция',
    description: 'Это новая секция',
    action: 'Нажмите здесь',
  },
};
```

### 3. Использовать в коде

```typescript
import { t } from '../shared/i18n';

const title = t('newSection.title');
const description = t('newSection.description');
```

## Параметры в переводах

Используйте `{paramName}` для вставки динамических значений:

```typescript
// В файле переводов
{
  welcome: 'Welcome, {name}!',
  itemCount: 'You have {count} items',
}

// В коде
t('welcome', { name: 'Alice' }); // "Welcome, Alice!"
t('itemCount', { count: 5 }); // "You have 5 items"
```

## Автоопределение языка

Система автоматически определяет язык в следующем порядке:

1. Сохраненный язык из `localStorage`
2. Язык пользователя Telegram (`window.Telegram.WebApp.initDataUnsafe.user.language_code`)
3. Английский по умолчанию

## TypeScript поддержка

Система полностью типизирована. TypeScript будет предупреждать о:

- Несуществующих ключах переводов
- Отсутствующих параметрах
- Несоответствии структуры между языками

## Добавление нового языка

### 1. Обновить тип Language

`shared/i18n/types.ts`:

```typescript
export type Language = 'en' | 'ru' | 'es'; // Добавить 'es'
```

### 2. Создать файл переводов

`shared/i18n/locales/es.ts`:

```typescript
import type { TranslationKeys } from './en';

export const es: TranslationKeys = {
  // ... все переводы на испанский
};
```

### 3. Импортировать в index.ts

`shared/i18n/index.ts`:

```typescript
import { es } from './locales/es';

const translations = {
  en,
  ru,
  es, // Добавить
};
```

### 4. Обновить логику определения языка

В функции `initI18n()` добавить проверку для нового языка.

## Best Practices

1. **Группируйте переводы логически** - используйте вложенные объекты для организации
2. **Используйте понятные ключи** - `profile.nickname` лучше чем `pn`
3. **Избегайте дублирования** - если текст повторяется, вынесите в общую секцию
4. **Тестируйте оба языка** - проверяйте что UI корректно отображается на всех языках
5. **Документируйте параметры** - добавляйте комментарии для сложных переводов с параметрами

## Примеры использования в проекте

### В UI компонентах

```typescript
// MultiplayerUI.ts
this.statusEl.textContent = t('status.online');
this.showNotification(t('notifications.gameStarted'));
```

### В HTML шаблонах

```typescript
content.innerHTML = `
  <div class="title">${t('profile.title')}</div>
  <button>${t('buttons.save')}</button>
`;
```

### С динамическими данными

```typescript
this.showNotification(
  t('notifications.friendRequest', { 
    nickname: user.nickname 
  })
);
```
