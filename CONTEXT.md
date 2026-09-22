# CONTEXT.md — Входная точка для разработчика

> Этот документ — краткое введение в проект для нового разработчика.  
> Читай его первым. Если что-то непонятно — смотри связанные файлы (указаны в каждом разделе).

---

## 0. Что это за проект

**DevOps Hub** — социальная сеть для DevOps-инженеров, системных администраторов и всех, кто работает с Linux и инфраструктурой.

**Изначально** (2024) — информационный сайт про аренду VPS и настройку VPN.  
**Сейчас** — полноценная соцсеть в духе ВКонтакте/Facebook с профилями, сообществами, лентой, файлами, проектами, личными сообщениями.

**Целевая аудитория:**
- Новички, которые хотят разобраться с Linux и VPN
- Разработчики, которым нужно поднять свой сервер
- Сисадмины, ищущие готовые решения
- DevOps-инженеры, делящиеся опытом

**Ключевая фишка:** проверенные инструкции + живое сообщество + система репутации (QoS).

---

## 1. Краткая история (чтобы понимать контекст)

### Этап 1: Информационный сайт
- React 18 + TypeScript + Vite + Tailwind CSS
- Статический сайт с гайдами по VPS/VPN
- Данные в TypeScript-файлах (`src/data/*.ts`)
- Хранение в localStorage (имитация БД)

**Что осталось:**
- Гайды (`/guides`) — 4 штуки (WireGuard, IKEv2, OpenVPN, Auto-Setup)
- Сравнение хостингов (`/hosts`) — 10 хостингов
- Диагностика VPN (`/diagnostics`) — интерактивный чек-лист
- Старый форум (`/forum`) — 20 тредов (мигрируется в сообщество `forum`)

### Этап 2: Социальная сеть (локальная)
- Добавлена авторизация (email + имитация GitHub OAuth)
- Личный кабинет с профилем
- Система репутации (QoS)
- Форум с комментариями и апвойтами
- Лента новостей с постами, лайками, историями
- Уведомления, подписки

**Всё ещё на localStorage.** Работает, но не масштабируется.

### Этап 3: Переход на Supabase (текущий)
- Инфраструктура готова (Этап 1 из плана трансформации)
- Созданы миграции БД, RLS-политики, Edge Function
- Сервисный слой (`src/api/*`) — в процессе
- UI-компоненты для новых фич — предстоит

**Статус:** Инфраструктура готова, можно применять миграции и переходить к Этапу 2 (авторизация через Supabase).

---

## 2. Текущее состояние проекта

### Что работает (можно тестировать прямо сейчас)

**Старый функционал (localStorage):**
- ✅ Гайды, хостинги, диагностика
- ✅ Старый форум (20 тредов)
- ✅ Авторизация (email/password, демо-аккаунт)
- ✅ Личный кабинет
- ✅ Лента новостей с постами
- ✅ Уведомления
- ✅ Система репутации

**Демо-доступ:**
- Email: `demo@devops.local`
- Пароль: `demo123`
- Роль: эксперт, репутация 1250 QoS

### Что в процессе

**Инфраструктура Supabase (Этап 1 завершён):**
- ✅ Миграции БД готовы (`supabase/migrations/`)
- ✅ RLS-политики написаны
- ✅ Edge Function для проверки файлов
- ✅ Типы БД сгенерированы (`src/types/database.ts`)
- ✅ Сервисный слой начат (`src/api/supabase.ts`)
- ⏳ Применение миграций к реальному проекту Supabase
- ⏳ Настройка Auth провайдеров

**Следующие этапы:**
- ⏳ Этап 2: Авторизация через Supabase + миграция данных
- ⏳ Этап 3: Профиль (`/u/:username`)
- ⏳ Этап 4: Посты и лента (cursor-based пагинация)
- ⏳ Этап 5: Сообщества (`/communities`, `/c/:slug`)
- ⏳ Этап 6: Файлы и проекты
- ⏳ Этап 7: Друзья, уведомления, сообщения
- ⏳ Этап 8: Интеграция старого форума, полировка

---

## 3. Архитектура

### Стек

**Frontend:**
- React 18 + TypeScript (strict mode)
- Vite (сборщик)
- Tailwind CSS (стили, без UI-китов)
- React Router (HashRouter для SPA)
- Context API + React Query (state management)
- Zod (валидация форм)
- date-fns (даты)
- Lucide React (иконки)

**Backend (в процессе):**
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Edge Functions (Deno) для бизнес-логики

### Структура проекта

```
site-vpn-new-user/
├── src/
│   ├── api/                    # Сервисный слой (Supabase)
│   │   └── supabase.ts         # Singleton-клиент
│   ├── contexts/               # React Context (старая система)
│   │   ├── AuthContext.tsx     # Авторизация (localStorage)
│   │   ├── ForumContext.tsx    # Форум (localStorage)
│   │   └── FeedContext.tsx     # Лента (localStorage)
│   ├── components/             # UI-компоненты
│   │   ├── Layout.tsx          # Основной layout
│   │   └── CodeBlock.tsx       # Блоки кода
│   ├── pages/                  # Страницы
│   │   ├── Home.tsx            # Главная
│   │   ├── Feed.tsx            # Лента новостей
│   │   ├── Profile.tsx         # Личный кабинет
│   │   ├── Forum.tsx           # Старый форум
│   │   ├── Hosts.tsx           # Сравнение хостингов
│   │   ├── Guides.tsx          # Гайды
│   │   ├── Diagnostics.tsx     # Диагностика
│   │   ├── Auth.tsx            # Login/Register
│   │   └── ...
│   ├── data/                   # Статические данные (старая система)
│   │   ├── hosts.ts            # 10 хостингов
│   │   ├── guides.ts           # 4 гайда
│   │   └── forum.ts            # 20 тредов
│   ├── lib/                    # Утилиты и хелперы
│   │   ├── constants.ts        # Константы (лимиты, regex)
│   │   ├── utils.ts            # Утилиты (cn, formatRelative)
│   │   ├── validators.ts       # Zod-схемы
│   │   └── migrateForum.ts     # Миграция форума из localStorage
│   ├── types/
│   │   └── database.ts         # Типы Supabase БД
│   ├── App.tsx                 # Роутинг
│   ├── main.tsx                # Точка входа
│   └── index.css               # Глобальные стили
├── supabase/
│   ├── migrations/             # SQL-миграции
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_storage.sql
│   │   └── 004_migrate_forum.sql
│   └── functions/              # Edge Functions
│       └── check-file-size/
│           └── index.ts
├── .env.example                # Шаблон переменных окружения
├── SUPABASE_SETUP.md           # Инструкция по настройке Supabase
├── brain.md                    # Полная память проекта (для AI)
└── README.md                   # Описание проекта
```

### Ключевые решения

**1. Две системы данных (переходный период):**
- **Старая:** `src/contexts/*` + `src/data/*` + localStorage
- **Новая:** `src/api/*` + `src/lib/*` + Supabase

**Правило:** новые фичи пишем через `src/api/*`. Старые не трогаем, пока не мигрируем.

**2. Сервисный слой (`src/api/*`):**
- Компоненты НЕ работают с Supabase напрямую
- Все запросы через `src/api/*.ts`
- Хуки (`src/hooks/*`) — обёртки над API с React Query

**3. Типы из Supabase:**
- `src/types/database.ts` — ручная версия (эквивалент `supabase gen types`)
- В продакшне генерируем автоматически: `supabase gen types typescript > src/types/database.ts`

**4. Миграция данных:**
- Старый форум → служебное сообщество `forum` (ID: `a0000000-0000-0000-0000-000000000001`)
- Клиентский скрипт `src/lib/migrateForum.ts` при первом логине владельца данных
- Старые URL `/forum/*` → редирект на `/c/forum/*`

**5. Вложенность комментариев:**
- 2 уровня (как в ВК)
- Ответ на ответ крепится к корневому с `@username`
- Поле `parent_id` в `comments` указывает на корневой комментарий

**6. Бан в сообществах:**
- Отдельная таблица `community_bans` (не смешиваем с ролями)
- При бане: удаляем из `community_members`, добавляем в `community_bans`

**7. Realtime:**
- Подписываемся только на конкретные сущности (не на всю БД)
- Новые посты в ленте, комментарии к открытому посту, лайки, уведомления, сообщения

---

## 4. Как запустить проект

### Быстрый старт (старая система, localStorage)

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Открыть http://localhost:5173
```

**Демо-аккаунт:**
- Email: `demo@devops.local`
- Пароль: `demo123`

### Полный старт (с Supabase)

См. **`SUPABASE_SETUP.md`** — пошаговая инструкция:
1. Создать проект на Supabase
2. Применить миграции
3. Настроить Auth провайдеры
4. Создать Storage бакеты
5. Задеплоить Edge Function
6. Заполнить `.env`

---

## 5. Как работать с кодом

### Соглашения

**1. Типизация:**
- Strict TypeScript, без `any`
- Все типы из `src/types/database.ts`
- Zod-схемы для валидации форм (`src/lib/validators.ts`)

**2. Стили:**
- Tailwind CSS, без UI-китов
- Тёмная тема по умолчанию
- CSS-переменные для цветов (`var(--color-*)`)
- Анимации: 150-300ms, без параллаксов

**3. Компоненты:**
- Функциональные, с хуками
- Переиспользуемые UI — в `src/components/ui/` (планируется)
- Страницы — в `src/pages/`

**4. API:**
- Все запросы через `src/api/*.ts`
- Хуки (`src/hooks/*`) — обёртки с React Query
- Компоненты не импортируют `supabase` напрямую

**5. Данные:**
- Новые фичи → Supabase через `src/api/*`
- Старые данные → localStorage через `src/contexts/*`
- Миграция — через `src/lib/migrateForum.ts`

### Паттерны

**Создание новой фичи:**
1. Описать типы в `src/types/database.ts` (если новые таблицы)
2. Написать API-методы в `src/api/*.ts`
3. Создать хук в `src/hooks/*.ts` (опционально, для React Query)
4. Написать компонент в `src/pages/*.tsx` или `src/components/*.tsx`
5. Добавить роут в `src/App.tsx`

**Пример:**
```typescript
// src/api/posts.ts
export async function createPost(input: CreatePostInput): Promise<Post> {
  const supabase = getSupabaseClient();
  const {  post, error } = await supabase
    .from('posts')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return post;
}

// src/hooks/usePosts.ts
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    }
  });
}

// src/pages/Feed.tsx
function PostComposer() {
  const { mutate: createPost } = useCreatePost();
  const handleSubmit = (data: CreatePostInput) => {
    createPost(data);
  };
  // ...
}
```

---

## 6. Важные нюансы

### Подводные камни

**1. Supabase generic types:**
- При использовании `.insert()` с ручными типами возникает ошибка `never[]`
- Решение: `as unknown as never` (см. `src/lib/migrateForum.ts`)
- В продакшне — использовать сгенерированные типы из `supabase gen types`

**2. Миграция форума:**
- Старые треды атрибутируются текущему пользователю (владельцу данных)
- Апвойты мигрируются только для текущего пользователя (остальные не имеют аккаунтов)
- Флаг `devops_hub_forum_migrated` в localStorage предотвращает повторную миграцию

**3. RLS-политики:**
- Все таблицы защищены RLS
- Публичные данные: `profiles`, `posts` (в публичных сообществах), `comments`, `likes`
- Приватные: `files` (visibility), `messages`, `notifications`
- Проверка дружбы: через таблицу `friendships` со статусом `accepted`

**4. Storage:**
- Бакет `avatars` — публичный, путь: `{user_id}/{filename}`
- Бакет `user-files` — приватный, путь: `{user_id}/{file_id}/{filename}`
- Доступ к приватным файлам — через signed URLs
- Размер проверяется на клиенте + Edge Function (не в RLS)

**5. Realtime:**
- Включён для: `posts`, `comments`, `likes`, `notifications`, `messages`
- Подписки только на конкретные сущности (не `*`)
- Пример: подписка на новые посты в ленте, а не на все посты в БД

### Известные проблемы

**1. Старая система vs новая:**
- Пока не мигрировали авторизацию, работают обе системы
- После Этапа 2 — удаляем `src/contexts/*` и `src/data/*`

**2. Типы Supabase:**
- Ручная версия `src/types/database.ts` может рассинхронизироваться с БД
- Решение: генерировать автоматически после каждой миграции

**3. Миграция данных:**
- Клиентский скрипт работает только для владельца данных
- Остальные пользователи не получают старые треды (они создаются заново в сообществе `forum`)

### TODO (ближайшие задачи)

**Этап 2 (авторизация):**
- [ ] Написать `src/api/auth.ts` (signIn, signUp, signOut)
- [ ] Переписать `AuthContext` на Supabase Auth
- [ ] Добавить миграцию репутации из localStorage
- [ ] Обновить страницы `/login`, `/register` с Zod-валидацией

**Этап 3 (профиль):**
- [ ] Написать `src/api/profiles.ts`
- [ ] Создать `src/hooks/useProfile.ts`
- [ ] Страница `/u/:username` с табами
- [ ] Страница `/settings` для редактирования
- [ ] Загрузка аватара через Storage

**Этап 4 (лента):**
- [ ] Написать `src/api/posts.ts`, `comments.ts`, `likes.ts`
- [ ] Страница `/feed` с cursor-based пагинацией
- [ ] Компоненты: PostCard, PostComposer, CommentTree, LikeButton
- [ ] Realtime-подписка на новые посты

---

## 7. Ресурсы для изучения

**Внутренняя документация:**
- `README.md` — общее описание проекта
- `SUPABASE_SETUP.md` — настройка Supabase
- `brain.md` — полная память проекта (для AI, но полезно и людям)
- `ROADMAP.md` — план развития (v1.1 → v3.0)
- `ARCHITECTURE.md` — детальная архитектура и интеграция с GitHub

**Внешняя документация:**
- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zod Docs](https://zod.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

**Ключевые файлы для понимания:**
- `src/App.tsx` — роутинг и структура приложения
- `src/contexts/AuthContext.tsx` — старая система авторизации
- `src/api/supabase.ts` — новая система (Supabase клиент)
- `src/lib/migrateForum.ts` — миграция данных
- `supabase/migrations/001_initial_schema.sql` — схема БД

---

## 8. Контакты и обратная связь

**Если что-то непонятно:**
1. Проверь `brain.md` — там полная история и детали
2. Проверь `SUPABASE_SETUP.md` — если проблемы с Supabase
3. Посмотри примеры в `src/lib/migrateForum.ts` — как работать с API
4. Задай вопрос в чате проекта (если есть)

**Демо-аккаунт для тестов:**
- Email: `demo@devops.local`
- Пароль: `demo123`

---

## 9. Чек-лист для нового разработчика

**Первый день:**
- [ ] Прочитать этот документ (`CONTEXT.md`)
- [ ] Прочитать `README.md` и `SUPABASE_SETUP.md`
- [ ] Запустить проект локально (`npm run dev`)
- [ ] Протестировать старый функционал (войти как `demo@devops.local`)
- [ ] Посмотреть структуру проекта, понять где что лежит

**Первая неделя:**
- [ ] Настроить Supabase (см. `SUPABASE_SETUP.md`)
- [ ] Применить миграции к БД
- [ ] Разобраться с RLS-политиками (прочитать `002_rls_policies.sql`)
- [ ] Написать первый API-метод в `src/api/*.ts`
- [ ] Создать первый хук в `src/hooks/*.ts`

**Первый месяц:**
- [ ] Пройти хотя бы один этап из плана (Этап 2-8)
- [ ] Написать тесты для API-методов (опционально)
- [ ] Обновить документацию, если нашёл несоответствия
- [ ] Предложить улучшения в `ROADMAP.md`

---

## 10. Философия проекта

**Принципы:**
1. **Не ломать существующее** — старые фичи работают, пока не мигрируем
2. **Строгая типизация** — без `any`, все типы из Supabase
3. **Сервисный слой** — компоненты не работают с БД напрямую
4. **Минимализм** — без UI-китов, свои компоненты на Tailwind
5. **Документация** — если что-то сделал, опиши в `brain.md` или `CONTEXT.md`

**Чего мы НЕ делаем:**
- Не используем Redux/Zustand (Context + React Query достаточно)
- Не подключаем MUI/Shadcn (свои компоненты)
- Не храним секреты в клиентском коде (только `.env`)
- Не добавляем зависимости без обоснования

---

**Добро пожаловать в проект! Если есть вопросы — создай issue или напиши в чат.**
