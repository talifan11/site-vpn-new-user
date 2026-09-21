# VPS и VPN без лишних шагов

Информационный сайт с пошаговыми инструкциями по аренде VPS и настройке VPN. Проверенные гайды, сравнение хостингов, диагностика проблем.

## Особенности

- **Проверенные инструкции** — все команды протестированы на реальных серверах
- **Сравнение хостингов** — 10 хостингов с информацией о блокировках портов
- **Автоматические скрипты** — готовые bash-скрипты для быстрой установки
- **Диагностика** — интерактивный чек-лист для поиска проблем
- **Форум** — типовые вопросы и ответы из практики
- **Тёмная и светлая тема** — переключатель в шапке
- **Адаптивный дизайн** — работает на всех устройствах

## Структура проекта

```
src/
├── components/
│   ├── Layout.tsx          # Основной layout с Header и Footer
│   └── CodeBlock.tsx       # Компонент для отображения кода
├── pages/
│   ├── Home.tsx            # Главная страница
│   ├── Hosts.tsx           # Сравнение хостингов
│   ├── Guides.tsx          # Список гайдов
│   ├── Diagnostics.tsx     # Диагностика VPN
│   ├── Forum.tsx           # Форум
│   └── About.tsx           # О сайте
├── data/
│   ├── hosts.ts            # Данные о хостингах
│   ├── guides.ts           # Данные гайдов
│   └── forum.ts            # Данные форума
├── App.tsx                 # Главный компонент с роутингом
├── main.tsx                # Точка входа
└── index.css               # Глобальные стили
```

## Установка и запуск

### Требования

- Node.js 18+
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Сайт будет доступен по адресу `http://localhost:5173`

### Сборка для продакшена

```bash
npm run build
```

Результат сборки будет в папке `dist/`

### Предпросмотр продакшен-сборки

```bash
npm run preview
```

## Добавление нового хостинга

1. Откройте файл `src/data/hosts.ts`
2. Добавьте новый объект в массив `hosts`:

```typescript
{
  id: 'new-host',              // Уникальный ID (используется в URL)
  name: 'Название хостинга',
  priceFrom: '199 руб/мес',
  blockedPorts: 'Описание блокировок',
  hasFirewallPanel: true,       // true/false
  canOpenViaSupport: true,      // true/false
  vpnSuitable: 'yes',           // 'yes' | 'no' | 'conditional'
  docsUrl: 'https://docs.example.com',
  siteUrl: 'https://example.com',
  details: {
    description: 'Краткое описание хостинга',
    blockedByDefault: [
      'UDP 51820 (WireGuard)',
      'UDP 500/4500 (IKEv2)'
    ],
    howToOpen: 'Инструкция по открытию портов',
    antiDdos: 'Информация об анти-DDoS защите',
    nuances: [
      'Первый нюанс',
      'Второй нюанс'
    ],
    source: 'https://docs.example.com/firewall'
  }
}
```

3. Сохраните файл и перезапустите dev-сервер

## Добавление нового гайда

1. Откройте файл `src/data/guides.ts`
2. Добавьте новый объект в массив `guides`:

```typescript
{
  id: 'new-guide',
  title: 'Название гайда',
  description: 'Краткое описание',
  protocol: 'WireGuard',
  difficulty: 'Средний',        // 'Лёгкий' | 'Средний' | 'Сложный'
  time: '15-20 минут',
  os: 'Ubuntu 22.04',
  sections: [
    {
      id: 'section-1',
      title: 'Название раздела',
      content: 'Текстовое описание раздела',
      code: [
        {
          lang: 'bash',
          code: 'команда для выполнения',
          note: 'Пояснение к команде'
        }
      ]
    }
  ],
  troubleshooting: [
    {
      problem: 'Описание проблемы',
      solution: 'Решение проблемы'
    }
  ]
}
```

3. Сохраните файл и перезапустите dev-сервер

## Добавление треда на форум

1. Откройте файл `src/data/forum.ts`
2. Добавьте новый объект в массив `threads`:

```typescript
{
  id: '21',  // Уникальный ID
  title: 'Заголовок треда',
  category: 'WireGuard',  // 'Хостинги' | 'WireGuard' | 'IKEv2' | 'OpenVPN' | 'Диагностика'
  author: 'username',
  date: '2024-01-15',
  content: 'Текст вопроса',
  tags: ['wireguard', 'nat'],
  replies: [
    {
      id: 'r28',
      author: 'expert',
      date: '2024-01-15',
      content: 'Текст ответа'
    }
  ]
}
```

3. Сохраните файл и перезапустите dev-сервер

## Технологии

- **React 18** — UI библиотека
- **TypeScript** — типизация
- **Vite** — сборщик
- **Tailwind CSS** — стилизация
- **React Router** — роутинг
- **Lucide React** — иконки

## Деплой

Подробная инструкция по публикации проекта находится в файле [DEPLOY.md](./DEPLOY.md).

### Быстрый старт

#### GitHub Pages (рекомендуется)

```bash
# 1. Создайте репозиторий на GitHub
# 2. Загрузите проект
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/vps-vpn-guide.git
git branch -M main
git push -u origin main

# 3. В Settings → Pages выберите "GitHub Actions"
# 4. Сайт будет доступен через 2-3 минуты
```

#### Vercel (самый простой)

1. Зайдите на https://vercel.com
2. Войдите через GitHub
3. Нажмите "Import Project" → выберите репозиторий
4. Готово! Сайт задеплоится автоматически

#### Netlify

1. Зайдите на https://netlify.com
2. "Add new site" → "Import from Git"
3. Build command: `npm run build`
4. Publish directory: `dist`

## Лицензия

MIT

## Обратная связь

Если нашли ошибку или хотите предложить улучшения — создайте issue или напишите на feedback@vps-vpn.guide
