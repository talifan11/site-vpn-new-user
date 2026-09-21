# Инструкция по публикации проекта

## Вариант 1: GitHub Pages (рекомендуется)

### Шаг 1: Создайте репозиторий на GitHub

1. Зайдите на https://github.com
2. Нажмите "New repository" (или "+" → "New repository")
3. Заполните:
   - **Repository name**: `vps-vpn-guide` (или любое другое имя)
   - **Description**: "VPS и VPN без лишних шагов"
   - **Public** (обязательно публичный для бесплатного GitHub Pages)
   - **НЕ ставьте** галочки "Add a README file", "Add .gitignore", "Choose a license"
4. Нажмите "Create repository"

### Шаг 2: Загрузите проект в репозиторий

Откройте терминал в папке проекта и выполните:

```bash
# Инициализация git
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: VPS & VPN guide"

# Добавление удаленного репозитория (замените USERNAME на ваш логин GitHub)
git remote add origin https://github.com/USERNAME/vps-vpn-guide.git

# Отправка на GitHub
git branch -M main
git push -u origin main
```

### Шаг 3: Настройте GitHub Pages

1. Зайдите в ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе "Build and deployment":
   - **Source**: выберите "GitHub Actions"
4. GitHub автоматически запустит workflow из файла `.github/workflows/deploy.yml`
5. Подождите 2-3 минуты, пока деплой завершится
6. Ваш сайт будет доступен по адресу: `https://USERNAME.github.io/vps-vpn-guide/`

### Шаг 4: Проверьте деплой

1. Зайдите в раздел **Actions** вашего репозитория
2. Убедитесь, что workflow завершился успешно (зеленая галочка)
3. Откройте ссылку `https://USERNAME.github.io/vps-vpn-guide/`

---

## Вариант 2: Vercel (самый простой)

### Шаг 1: Зарегистрируйтесь на Vercel

1. Зайдите на https://vercel.com
2. Нажмите "Sign Up"
3. Войдите через GitHub

### Шаг 2: Импортируйте проект

1. Нажмите "Add New..." → "Project"
2. Найдите ваш репозиторий `vps-vpn-guide`
3. Нажмите "Import"
4. Vercel автоматически определит настройки (Vite)
5. Нажмите "Deploy"

### Шаг 3: Готово!

Через 30-60 секунд ваш сайт будет доступен по адресу вида:
`https://vps-vpn-guide.vercel.app`

Можно настроить кастомный домен в настройках проекта.

---

## Вариант 3: Netlify

### Шаг 1: Зарегистрируйтесь на Netlify

1. Зайдите на https://netlify.com
2. Войдите через GitHub

### Шаг 2: Создайте новый сайт

1. Нажмите "Add new site" → "Import an existing project"
2. Выберите GitHub
3. Найдите репозиторий `vps-vpn-guide`
4. Настройте:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Нажмите "Deploy site"

### Шаг 3: Готово!

Сайт будет доступен по адресу вида:
`https://random-name-123.netlify.app`

---

## Вариант 4: Собственный VPS

Если у вас есть VPS с Nginx:

### Шаг 1: Соберите проект локально

```bash
npm run build
```

### Шаг 2: Загрузите файлы на сервер

```bash
# Замените user и server-ip на ваши данные
scp -r dist/* user@server-ip:/var/www/html/
```

### Шаг 3: Настройте Nginx

Создайте файл `/etc/nginx/sites-available/vps-vpn-guide`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статики
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Активируйте сайт:

```bash
sudo ln -s /etc/nginx/sites-available/vps-vpn-guide /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Решение проблем

### Проблема: "Permission denied (publickey)"

```bash
# Проверьте SSH-ключи
ssh -T git@github.com

# Если не работает, добавьте ключ:
ssh-add ~/.ssh/id_rsa
```

### Проблема: "Updates were rejected because the remote contains work"

```bash
# Принудительная отправка (осторожно!)
git push -u origin main --force
```

### Проблема: GitHub Pages показывает 404

1. Убедитесь, что репозиторий публичный
2. Проверьте, что workflow завершился успешно (вкладка Actions)
3. Подождите 5-10 минут (GitHub Pages кэширует)

### Проблема: Стили не загружаются на GitHub Pages

Добавьте в `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/vps-vpn-guide/', // Замените на имя вашего репозитория
})
```

Затем пересоберите и отправьте изменения:

```bash
npm run build
git add .
git commit -m "Fix base path for GitHub Pages"
git push
```

---

## Кастомный домен

### Для GitHub Pages:

1. В Settings → Pages укажите ваш домен
2. Добавьте CNAME запись у регистратора домена:
   ```
   your-domain.com CNAME USERNAME.github.io
   ```
3. Включите HTTPS в настройках Pages

### Для Vercel/Netlify:

1. В настройках проекта добавьте домен
2. Следуйте инструкциям по настройке DNS
3. SSL-сертификат выдается автоматически

---

## Обновление сайта

После внесения изменений:

```bash
# Добавьте изменения
git add .

# Создайте коммит
git commit -m "Описание изменений"

# Отправьте на GitHub
git push
```

GitHub Actions автоматически пересоберет и задеплоит сайт.

---

## Полезные команды

```bash
# Локальная разработка
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен-сборки
npm run preview

# Проверка статуса git
git status

# Просмотр истории коммитов
git log --oneline

# Отмена последнего коммита (если еще не отправлен)
git reset HEAD~1
```

---

## Рекомендации

1. **GitHub Pages** — лучший выбор для статических сайтов, бесплатно, надежно
2. **Vercel** — если нужен быстрый деплой и кастомный домен
3. **Netlify** — альтернатива Vercel с похожим функционалом
4. **Собственный VPS** — если нужен полный контроль и кастомная конфигурация

Для вашего проекта рекомендую **GitHub Pages** или **Vercel** — оба варианта бесплатные и простые в настройке.
