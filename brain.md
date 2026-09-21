# DevOps Hub — Полная память проекта

## Что это за проект

**DevOps Hub** — социальная сеть для DevOps-инженеров, системных администраторов и всех, кто работает с Linux и инфраструктурой. Проект начался как информационный сайт про VPS и VPN, а затем трансформировался в полноценную социальную сеть.

---

## История разработки (хронология)

### Этап 1: Информационный сайт (начало)
**Что было сделано:**
- Создан информационный сайт про аренду VPS и настройку VPN
- Дизайн в стиле Stripe Docs / Linear — минималистичный, технический
- Тёмная и светлая темы
- Шрифты: Inter (текст), JetBrains Mono (код)
- Цветовая схема: монохром + один акцентный цвет (синий #3b82f6)

**Структура страниц:**
1. **Главная** — описание, три карточки разделов, ссылки на гайды
2. **Сравнение хостингов** — таблица 10 хостингов с деталями
3. **Гайды** — WireGuard, IKEv2, OpenVPN (пошаговые инструкции)
4. **Диагностика** — интерактивный чек-лист
5. **Форум** — 20 предзаполненных тредов с ответами
6. **О сайте** — описание, дисклеймер, обратная связь

**Технологии:**
- React 18 + TypeScript
- Vite (сборщик)
- Tailwind CSS v4 (стили)
- React Router (HashRouter для SPA)
- Lucide React (иконки)

**Файлы данных:**
- `src/data/hosts.ts` — 10 хостингов с детальной информацией
- `src/data/guides.ts` — 3 гайда (WireGuard, IKEv2, OpenVPN)
- `src/data/forum.ts` — 20 тредов форума с ответами

### Этап 2: Автоматические скрипты и анимации
**Что добавлено:**
- Новый гайд "Автоматическая установка VPN" с bash-скриптами:
  - Скрипт установки WireGuard
  - Скрипт установки OpenVPN
  - Скрипт добавления клиентов
  - Скрипт диагностики
  - Скрипт резервного копирования
- Анимации и переходы:
  - Fade-in для страниц
  - Hover-эффекты для карточек
  - Подчёркивание ссылок в стиле GitHub
  - Прогресс-бар на странице диагностики
  - Sticky header с backdrop-blur

### Этап 3: Кликабельные хэштеги
**Что добавлено:**
- Страница тегов `/tags/:tag` — показывает гайды и треды по тегу
- Все хэштеги кликабельны и ведут на страницу тега
- Блок "Популярные теги" на форуме
- Связанные теги на странице тега
- Облако всех тегов
- Добавлены теги ко всем гайдам

### Этап 4: Подготовка к публикации
**Что создано:**
- `.github/workflows/deploy.yml` — автоматический деплой на GitHub Pages
- `DEPLOY.md` — инструкция по публикации (4 варианта)
- `QUICKSTART.md` — быстрый старт (5 минут)
- `TROUBLESHOOTING.md` — решение проблем
- `.gitignore` — исключение node_modules, dist

### Этап 5: Трансформация в социальную сеть
**Что добавлено:**

#### Система авторизации
- Регистрация через email
- Вход через email/пароль
- Имитация GitHub OAuth
- Демо-аккаунт: demo@devops.local / demo123
- Хранение в localStorage (имитация БД)

**Файлы:**
- `src/contexts/AuthContext.tsx` — управление авторизацией
- `src/pages/Auth.tsx` — страницы Login/Register

#### Личный кабинет
- Профиль с аватаром и статистикой
- Редактирование профиля
- Навыки (теги)
- Статистика активности
- Вкладки: Портфолио, Стена активности, Настройки

**Файлы:**
- `src/pages/Profile.tsx` — личный кабинет

#### Система репутации (QoS)
- Репутация в очках
- Роли: Новичок → Инженер → Эксперт
- Прогресс-бар до следующего уровня
- Начисление за активность

**Файлы:**
- `src/contexts/AuthContext.tsx` — логика репутации

#### Форум с комментариями
- Комментарии к тредам
- Апвойты для тредов и комментариев
- Форма ответа для авторизованных
- Аватары авторов

**Файлы:**
- `src/contexts/ForumContext.tsx` — управление форумом
- `src/pages/Forum.tsx` — форум с комментариями

#### Онбординг
- 5 шагов знакомства с платформой
- Выбор навыков
- Прогресс-бар

**Файлы:**
- `src/pages/Onboarding.tsx` — онбординг

#### Навигация
- Кнопка "Войти" в шапке
- Аватар и имя пользователя
- Ссылка на профиль
- Адаптивное мобильное меню

**Файлы:**
- `src/components/Layout.tsx` — layout с навигацией

### Этап 6: Документация и архитектура
**Что создано:**
- `README.md` — описание проекта
- `ROADMAP.md` — план развития (v1.1 → v3.0)
- `ARCHITECTURE.md` — архитектура, интеграция с GitHub, БД, API
- `IMPLEMENTATION.md` — что было реализовано

---

## Текущая структура проекта

```
src/
├── contexts/
│   ├── AuthContext.tsx      # Авторизация, пользователи, репутация
│   └── ForumContext.tsx     # Форум, комментарии, апвойты
├── components/
│   ├── Layout.tsx           # Основной layout (Header, Footer, навигация)
│   └── CodeBlock.tsx        # Блоки кода с копированием
├── pages/
│   ├── Home.tsx             # Главная страница
│   ├── Auth.tsx             # Login и Register
│   ├── Profile.tsx          # Личный кабинет (портфолио, стена, настройки)
│   ├── Onboarding.tsx       # Онбординг для новичков
│   ├── Forum.tsx            # Форум с комментариями
│   ├── Hosts.tsx            # Сравнение хостингов
│   ├── Guides.tsx           # Список гайдов и детали
│   ├── Diagnostics.tsx      # Диагностика VPN
│   ├── TagPage.tsx          # Страница тега
│   └── About.tsx            # О сайте
├── data/
│   ├── hosts.ts             # Данные о 10 хостингах
│   ├── guides.ts            # Данные 4 гайдов (включая auto-setup)
│   └── forum.ts             # Данные 20 тредов форума
├── App.tsx                  # Главный компонент с роутингом
├── main.tsx                 # Точка входа
└── index.css                # Глобальные стили + анимации
```

---

## Ключевые типы данных

### User (пользователь)
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;              // Инициалы (2 буквы)
  bio: string;
  role: 'newbie' | 'engineer' | 'expert' | 'admin';
  reputation: number;          // QoS очки
  githubUsername?: string;
  joinedAt: string;
  skills: string[];            // Технологии
  location?: string;
  website?: string;
  stats: {
    posts: number;
    comments: number;
    threads: number;
    solutions: number;
  };
}
```

### ForumThread (тред форума)
```typescript
interface ForumThread {
  id: string;
  title: string;
  category: string;            // 'Хостинги' | 'WireGuard' | 'IKEv2' | 'OpenVPN' | 'Диагностика'
  author: string;
  authorAvatar?: string;
  date: string;
  content: string;
  replies: ForumReply[];
  tags: string[];
  upvotes?: number;
}
```

### ForumReply (комментарий)
```typescript
interface ForumReply {
  id: string;
  author: string;
  authorAvatar?: string;
  date: string;
  content: string;
  upvotes?: number;
}
```

### Guide (гайд)
```typescript
interface Guide {
  id: string;
  title: string;
  description: string;
  protocol: string;
  difficulty: string;          // 'Лёгкий' | 'Средний' | 'Сложный'
  time: string;
  os: string;
  tags: string[];
  sections: GuideSection[];
  troubleshooting: { problem: string; solution: string }[];
}
```

### Host (хостинг)
```typescript
interface Host {
  id: string;
  name: string;
  priceFrom: string;
  blockedPorts: string;
  hasFirewallPanel: boolean;
  canOpenViaSupport: boolean;
  vpnSuitable: 'yes' | 'no' | 'conditional';
  docsUrl: string;
  siteUrl: string;
  details: {
    description: string;
    blockedByDefault: string[];
    howToOpen: string;
    antiDdos: string;
    nuances: string[];
    source: string;
  };
}
```

---

## Роуты

```
/                    — Главная страница
/login               — Вход
/register            — Регистрация
/onboarding          — Онбординг для новых пользователей
/profile             — Личный кабинет (портфолио, стена активности, настройки)
/hosts               — Сравнение хостингов
/hosts/:id           — Детали хостинга
/guides              — Список гайдов
/guides/:id          — Детали гайда
/diagnostics         — Диагностика VPN
/forum               — Форум
/forum/:id           — Тред на форуме
/tags/:tag           — Страница тега
/about               — О сайте
```

---

## Система репутации (QoS)

### Роли
- **Новичок (0-199 QoS)** — только начали путь
- **Инженер (200-999 QoS)** — активный участник
- **Эксперт (1000+ QoS)** — признанный специалист

### Начисление репутации
- Написать комментарий: +5 QoS
- Получить апвойт на комментарий: +2 QoS
- Создать тред: +10 QoS
- Ответ принят как решение: +25 QoS

### Логика
```typescript
function calculateRole(reputation: number): User['role'] {
  if (reputation >= 1000) return 'expert';
  if (reputation >= 200) return 'engineer';
  return 'newbie';
}
```

---

## Хранилище данных (localStorage)

### Ключи
- `devops_hub_user` — текущий авторизованный пользователь
- `devops_hub_users_db` — база всех пользователей
- `devops_hub_forum_data` — все треды и комментарии
- `devops_hub_upvotes` — кто за что голосовал
- `theme` — текущая тема (dark/light)

### Демо-данные
Предзаполнен пользователь:
- Email: demo@devops.local
- Пароль: demo123
- Роль: expert
- Репутация: 1250 QoS

---

## Контексты (State Management)

### AuthContext
**Функции:**
- `user` — текущий пользователь
- `isAuthenticated` — авторизован ли
- `login(email, password)` — вход
- `loginWithGithub()` — вход через GitHub (имитация)
- `register(data)` — регистрация
- `logout()` — выход
- `updateUser(updates)` — обновление профиля
- `incrementReputation(amount)` — изменение репутации

### ForumContext
**Функции:**
- `threads` — все треды
- `getThread(id)` — получить тред
- `addReply(threadId, content)` — добавить комментарий
- `addThread(title, content, category, tags)` — создать тред
- `upvoteThread(threadId)` — апвойт треда
- `upvoteReply(threadId, replyId)` — апвойт комментария
- `getUserThreads(username)` — треды пользователя
- `getUserReplies(username)` — комментарии пользователя

---

## Стиль и дизайн

### Цветовая схема
**Светлая тема:**
- Background: #ffffff
- Text: #0f172a
- Border: #e2e8f0
- Accent: #3b82f6

**Тёмная тема:**
- Background: #0a0a0b
- Text: #e4e4e7
- Border: #27272a
- Accent: #3b82f6

### Шрифты
- Текст: Inter
- Код: JetBrains Mono

### Анимации
- Fade-in для страниц (200ms)
- Card hover (lift + shadow, 200ms)
- Button active (scale 0.98, 150ms)
- GitHub link underline (slide, 200ms)
- Theme transition (200ms)

### Компоненты
- `.card-hover` — карточки с hover-эффектом
- `.github-link` — ссылки с подчёркиванием
- `.badge` — бейджи с hover
- `.icon-hover` — иконки с увеличением
- `.fade-in-up` — появление элементов

---

## Что реализовано (чек-лист)

### Ядро
- [x] Авторизация и регистрация
- [x] Личный кабинет
- [x] Система репутации (QoS)
- [x] Форум с комментариями
- [x] Апвойты
- [x] Теги и фильтрация
- [x] Онбординг
- [x] Тёмная/светлая тема
- [x] Адаптивный дизайн

### Контент
- [x] 4 гайда (WireGuard, IKEv2, OpenVPN, Auto-Setup)
- [x] 10 хостингов с деталями
- [x] 20 тредов форума
- [x] Диагностика VPN
- [x] Bash-скрипты для автоматизации

### UX
- [x] Плавные анимации
- [x] Hover-эффекты
- [x] Прогресс-бары
- [x] Мобильное меню
- [x] Копирование кода
- [x] Кликабельные хэштеги

### Документация
- [x] README.md
- [x] ROADMAP.md
- [x] ARCHITECTURE.md
- [x] IMPLEMENTATION.md
- [x] DEPLOY.md
- [x] QUICKSTART.md
- [x] TROUBLESHOOTING.md

---

## Что планируется (Roadmap)

### Версия 1.1 (ближайшие улучшения)
- Реальный backend (Node.js + Express)
- База данных (PostgreSQL)
- Реальный GitHub OAuth
- Markdown-редактор
- Уведомления
- Поиск по форуму

### Версия 1.2 (социальные функции)
- Подписки на пользователей
- Личные сообщения
- Лента активности
- Бейджи достижений
- Статьи от пользователей

### Версия 2.0 (масштабирование)
- Микросервисная архитектура
- Полная GitHub API интеграция
- Автоматическая синхронизация контента
- CI/CD для автодеплоя
- AI-помощник

Подробный план в **ROADMAP.md**.

---

## Интеграция с GitHub

### Текущая реализация
- Имитация GitHub OAuth (создаёт пользователя с GitHub-данными)
- UI для подключения GitHub в настройках
- Подготовка инфраструктуры

### Для полной интеграции необходимо
1. Зарегистрировать OAuth App на GitHub
2. Реализовать backend для обработки callback
3. Интеграция с GitHub API
4. Webhooks для синхронизации
5. GitHub Actions для автодеплоя

Подробная архитектура в **ARCHITECTURE.md**.

---

## Как запустить проект

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен-сборки
npm run preview
```

### Демо-доступ
- Email: demo@devops.local
- Пароль: demo123

---

## Публикация

### GitHub Pages (рекомендуется)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/vps-vpn-guide.git
git branch -M main
git push -u origin main
```
Затем в Settings → Pages → GitHub Actions

### Vercel (самый простой)
1. Зайти на vercel.com
2. Import Project → выбрать репозиторий
3. Готово

Подробные инструкции в **DEPLOY.md** и **QUICKSTART.md**.

---

## Ключевые файлы для понимания проекта

1. **src/App.tsx** — роутинг и структура приложения
2. **src/contexts/AuthContext.tsx** — авторизация и пользователи
3. **src/contexts/ForumContext.tsx** — форум и комментарии
4. **src/pages/Profile.tsx** — личный кабинет
5. **src/pages/Forum.tsx** — форум с комментариями
6. **src/components/Layout.tsx** — навигация и layout
7. **src/data/forum.ts** — данные форума (20 тредов)
8. **src/data/hosts.ts** — данные хостингов (10 штук)
9. **src/data/guides.ts** — данные гайдов (4 штуки)

---

## Важные моменты

### Стиль кода
- TypeScript с строгой типизацией
- Функциональные компоненты
- Context API для state management
- LocalStorage для персистентности
- Tailwind CSS для стилей
- Lucide React для иконок

### Архитектурные решения
- HashRouter для SPA (работает на статическом хостинге)
- Context API вместо Redux (проще для текущего масштаба)
- LocalStorage вместо БД (имитация, готово к миграции)
- Предзаполненные данные (можно заменить на API)

### UX-решения
- Минималистичный дизайн (Stripe/Linear стиль)
- Плавные анимации (150-300ms)
- Тёмная тема по умолчанию
- Адаптивность для мобильных
- Доступность (focus states, aria-labels)

---

## Контакты и обратная связь

- Email: feedback@devops-hub.ru
- GitHub: (будет добавлен при публикации)

---

## Этап 7: Превращение в полноценную соцсеть (ВК/Facebook стиль)

**Что добавлено:**

### Лента новостей (Feed)
- Посты с лайками, комментариями, репостами
- Истории сообщества (Stories)
- Создание постов с тегами
- Лента показывает посты от подписок + свои + закреплённые
- Предзаполненные демо-посты для демонстрации

**Файлы:**
- `src/contexts/FeedContext.tsx` — управление лентой, постами, подписками
- `src/pages/Feed.tsx` — страница ленты
- `src/pages/Notifications.tsx` — страница уведомлений

### Система уведомлений
- Уведомления о лайках, комментариях, подписках
- Счётчик непрочитанных в шапке
- Отметка прочитанных
- Иконки для разных типов уведомлений

### Подписки (Follow)
- Подписка на пользователей
- Лента показывает посты от подписок
- Счётчики подписчиков/подписок

### Обновлённая навигация
- Кнопка "Лента" в шапке (для авторизованных)
- Кнопка "Уведомления" с бейджем
- Обновлённое мобильное меню
- Кнопки на главной странице перемещены выше

### Роуты
```
/feed              — Лента новостей
/notifications     — Уведомления
```

## Итоги

**DevOps Hub** — это полноценная социальная сеть для DevOps-инженеров в стиле ВКонтакте/Facebook с:
- Лентой новостей с постами, лайками, комментариями
- Системой подписок на пользователей
- Уведомлениями в реальном времени
- Историями сообщества (Stories)
- Системой авторизации и профилей
- Форумом с комментариями и апвойтами
- Системой репутации (QoS)
- Проверенными гайдами по VPS/VPN
- Сравнением хостингов
- Диагностикой VPN
- Онбордингом для новичков
- Подготовкой к интеграции с GitHub

Проект готов к публикации и дальнейшему развитию. Вся документация создана, архитектура продумана, код чистый и типизирован.

---

## Что реализовано (обновлённый чек-лист)

### Социальная сеть (ВК/Facebook стиль)
- [x] Лента новостей с постами
- [x] Лайки на посты и комментарии
- [x] Комментарии к постам
- [x] Репосты
- [x] Истории (Stories)
- [x] Создание постов с тегами
- [x] Подписки на пользователей
- [x] Уведомления (лайки, комментарии, подписки)
- [x] Счётчик непрочитанных уведомлений
- [x] Лента от подписок

### Ядро
- [x] Авторизация и регистрация
- [x] Личный кабинет (портфолио, стена активности, настройки)
- [x] Система репутации (QoS)
- [x] Форум с комментариями
- [x] Апвойты
- [x] Теги и фильтрация
- [x] Кликабельные хэштеги
- [x] Онбординг
- [x] Тёмная/светлая тема
- [x] Адаптивный дизайн

### Контент
- [x] 4 гайда (WireGuard, IKEv2, OpenVPN, Auto-Setup)
- [x] 10 хостингов с деталями
- [x] 20 тредов форума
- [x] 5 демо-постов в ленте
- [x] 3 демо-истории
- [x] Диагностика VPN
- [x] Bash-скрипты для автоматизации

### UX/UI
- [x] Плавные анимации
- [x] Hover-эффекты
- [x] Прогресс-бары
- [x] Мобильное меню
- [x] Копирование кода
- [x] Кнопка "Лента" в шапке
- [x] Кнопка "Уведомления" с бейджем
- [x] Кнопки на главной перемещены выше

---

## Обновлённые роуты

```
/                    — Главная страница (кнопки перемещены выше)
/feed                — Лента новостей (НОВОЕ)
/notifications       — Уведомления (НОВОЕ)
/login               — Вход
/register            — Регистрация
/onboarding          — Онбординг
/profile             — Личный кабинет
/hosts               — Сравнение хостингов
/hosts/:id           — Детали хостинга
/guides              — Гайды
/guides/:id          — Детали гайда
/diagnostics         — Диагностика
/forum               — Форум
/forum/:id           — Тред на форуме
/tags/:tag           — Страница тега
/about               — О сайте
```

---

## Обновлённая структура проекта

```
src/
├── contexts/
│   ├── AuthContext.tsx      # Авторизация, пользователи, репутация
│   ├── ForumContext.tsx     # Форум, комментарии, апвойты
│   └── FeedContext.tsx      # Лента, посты, подписки, уведомления (НОВОЕ)
├── components/
│   ├── Layout.tsx           # Layout с навигацией, уведомлениями (ОБНОВЛЕНО)
│   └── CodeBlock.tsx        # Блоки кода
├── pages/
│   ├── Home.tsx             — Главная (кнопки перемещены выше)
│   ├── Feed.tsx             — Лента новостей (НОВОЕ)
│   ├── Notifications.tsx    — Уведомления (НОВОЕ)
│   ├── Auth.tsx             — Login/Register
│   ├── Profile.tsx          — Личный кабинет
│   ├── Onboarding.tsx       — Онбординг
│   ├── Forum.tsx            — Форум
│   ├── Hosts.tsx            — Хостинги
│   ├── Guides.tsx           — Гайды
│   ├── Diagnostics.tsx      — Диагностика
│   ├── TagPage.tsx          — Теги
│   └── About.tsx            — О сайте
├── data/
│   ├── hosts.ts             — 10 хостингов
│   ├── guides.ts            — 4 гайда
│   └── forum.ts             — 20 тредов
├── App.tsx                  — Роутинг (ОБНОВЛЕНО)
├── main.tsx                 — Точка входа
├── index.css                — Стили
└── brain.md                 — Полная память проекта
```

---

## Новые типы данных

### Post (пост в ленте)
```typescript
interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  image?: string;
  likes: string[];
  comments: PostComment[];
  createdAt: string;
  tags: string[];
  reposts: number;
  isPinned?: boolean;
}
```

### PostComment (комментарий к посту)
```typescript
interface PostComment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: string[];
}
```

### Story (история)
```typescript
interface Story {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  viewedBy: string[];
}
```

### Notification (уведомление)
```typescript
interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'reply' | 'solution';
  fromUser: string;
  fromAvatar: string;
  content: string;
  link: string;
  read: boolean;
  createdAt: string;
}
```

---

## Новые контексты

### FeedContext
**Функции:**
- `posts` — все посты
- `stories` — истории
- `notifications` — уведомления
- `subscriptions` — подписки
- `createPost(content, tags, image?)` — создать пост
- `deletePost(postId)` — удалить пост
- `likePost(postId)` — лайк поста
- `addComment(postId, content)` — добавить комментарий
- `likeComment(postId, commentId)` — лайк комментария
- `createStory(content)` — создать историю
- `followUser(userId)` — подписаться
- `unfollowUser(userId)` — отписаться
- `isFollowing(userId)` — проверка подписки
- `getFollowers(userId)` — получить подписчиков
- `getFollowing(userId)` — получить подписки
- `markNotificationRead(id)` — отметить уведомление прочитанным
- `markAllNotificationsRead()` — отметить все прочитанными
- `getUnreadCount()` — количество непрочитанных
- `getFeedPosts()` — получить ленту (от подписок + свои + закреплённые)

---

## Как тестировать соцсеть

### 1. Регистрация
```
1. Перейдите на /register
2. Заполните форму
3. Пройдите онбординг
4. Попадёте в профиль
```

### 2. Демо-аккаунт
```
Email: demo@devops.local
Пароль: demo123
```

### 3. Лента новостей
```
1. Войдите в аккаунт
2. Перейдите на /feed или нажмите "Лента" в шапке
3. Увидите 5 демо-постов
4. Поставьте лайк
5. Оставьте комментарий
6. Создайте свой пост
```

### 4. Уведомления
```
1. После лайка/комментария появится уведомление
2. Нажмите на колокольчик в шапке
3. Увидите список уведомлений
4. Нажмите на уведомление — оно отметится прочитанным
```

### 5. Истории
```
1. На странице ленты вверху есть блок "Истории сообщества"
2. 3 демо-истории от пользователей
3. Кнопка "+" для создания своей истории
```

---

## Что дальше (обновлённый Roadmap)

### Версия 1.1 (ближайшие улучшения)
- Реальный backend (Node.js + Express)
- База данных (PostgreSQL)
- Реальный GitHub OAuth
- Markdown-редактор для постов
- Загрузка изображений
- Поиск по ленте
- Фильтры ленты (все / от подписок)

### Версия 1.2 (социальные функции)
- Личные сообщения
- Друзья (двусторонние подписки)
- Группы/сообщества
-_EVENTS (мероприятия)
- Прямые трансляции
- Видеозвонки

### Версия 2.0 (масштабирование)
- Микросервисная архитектура
- Полная GitHub API интеграция
- Автоматическая синхронизация контента
- CI/CD для автодеплоя
- AI-помощник
- Мобильное приложение (React Native)

---

**Дата создания памяти:** 2024
**Версия проекта:** 2.0 (полноценная соцсеть)
**Статус:** Готов к публикации
