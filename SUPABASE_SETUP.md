# Настройка Supabase для DevOps Hub

## Шаг 1: Создание проекта

1. Зарегистрируйтесь на https://supabase.com
2. Создайте новый проект
3. Дождитесь инициализации (2-3 минуты)
4. Скопируйте URL и anon key из **Settings → API**

## Шаг 2: Настройка переменных окружения

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Заполните значения:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Шаг 3: Применение миграций

### Вариант A: Через Supabase CLI (рекомендуется)

```bash
# Установите Supabase CLI
npm install -g supabase

# Войдите в аккаунт
supabase login

# Свяжите с проектом
supabase link --project-ref your-project-ref

# Примените все миграции
supabase db push
```

### Вариант B: Через SQL Editor

1. Откройте **SQL Editor** в Supabase Dashboard
2. Создайте новый query
3. Скопируйте содержимое файлов миграции в порядке:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage.sql`
   - `supabase/migrations/004_migrate_forum.sql`
4. Выполните каждый файл отдельно

## Шаг 4: Настройка Auth провайдеров

### Email/Password

1. Откройте **Authentication → Providers**
2. Убедитесь, что **Email** включён
3. Настройте email templates (опционально)

### GitHub OAuth

1. Зарегистрируйте OAuth App на https://github.com/settings/developers
   - **Homepage URL**: `http://localhost:5173` (для dev) или ваш домен
   - **Authorization callback URL**: `https://your-project.supabase.co/auth/v1/callback`
2. Скопируйте **Client ID** и **Client Secret**
3. В Supabase Dashboard откройте **Authentication → Providers → GitHub**
4. Вставьте Client ID и Client Secret
5. Включите провайдер

## Шаг 5: Настройка Storage

1. Откройте **Storage** в Supabase Dashboard
2. Убедитесь, что созданы бакеты:
   - `avatars` (public)
   - `user-files` (private)
3. Настройте лимиты размеров:
   - `avatars`: max 2 MB
   - `user-files`: max 50 MB

## Шаг 6: Деплой Edge Function

```bash
# Деплой функции проверки размера файла
supabase functions deploy check-file-size

# Для локальной разработки
supabase functions serve
```

## Шаг 7: Включение Realtime

1. Откройте **Database → Replication**
2. Включите Realtime для таблиц:
   - `posts`
   - `comments`
   - `likes`
   - `notifications`
   - `messages`

## Шаг 8: Проверка

1. Запустите проект: `npm run dev`
2. Откройте http://localhost:5173
3. Зарегистрируйтесь через Email или GitHub
4. Проверьте, что профиль создался автоматически
5. Проверьте, что служебное сообщество `forum` создано

## Миграция старых данных

При первом логине пользователя, у которого есть старые данные в localStorage, автоматически запустится миграция:
- Старые треды форума → посты в сообщество `forum`
- Старые комментарии → комментарии к постам
- Старые апвойты → лайки (только для текущего пользователя)
- Старая репутация → профиль

Миграция выполняется один раз. Флаг `devops_hub_forum_migrated` в localStorage предотвращает повторный запуск.

## Troubleshooting

### Ошибка "relation does not exist"

Примените миграции (Шаг 3).

### Ошибка "new row violates row-level security policy"

Проверьте RLS политики (миграция 002). Убедитесь, что пользователь авторизован.

### Ошибка "storage bucket not found"

Примените миграцию 003 или создайте бакеты вручную в Storage.

### Edge Function не работает

Убедитесь, что функция задеплоена: `supabase functions list`.

### Realtime не обновляется

Проверьте, что Realtime включён для нужных таблиц (Шаг 7).

## Production checklist

- [ ] Переменные окружения настроены
- [ ] Миграции применены
- [ ] Auth провайдеры настроены
- [ ] Storage бакеты созданы
- [ ] Edge Function задеплоена
- [ ] Realtime включён
- [ ] Custom domain настроен (опционально)
- [ ] Email templates кастомизированы (опционально)
