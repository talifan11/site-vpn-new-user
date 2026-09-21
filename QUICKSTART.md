# Быстрый старт публикации

## Самый простой способ (5 минут)

### 1. Создайте репозиторий на GitHub

- Зайдите на https://github.com
- Нажмите "+" → "New repository"
- Название: `vps-vpn-guide`
- Public (обязательно!)
- **НЕ ставьте** галочки "Add README", "Add .gitignore"
- Нажмите "Create repository"

### 2. Загрузите проект

Откройте терминал в папке проекта и выполните:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШ_USERNAME/vps-vpn-guide.git
git branch -M main
git push -u origin main
```

**Замените `ВАШ_USERNAME` на ваш логин GitHub!**

### 3. Включите GitHub Pages

- В репозитории: **Settings** → **Pages**
- Source: **GitHub Actions**
- Подождите 2-3 минуты

### 4. Готово!

Ваш сайт: `https://ВАШ_USERNAME.github.io/vps-vpn-guide/`

---

## Если что-то не работает

### Проблема: "Permission denied"

```bash
# Используйте HTTPS вместо SSH
git remote set-url origin https://github.com/ВАШ_USERNAME/vps-vpn-guide.git
git push -u origin main
```

### Проблема: "Updates were rejected"

```bash
# Принудительная отправка
git push -u origin main --force
```

### Проблема: Git не установлен

**Windows:** Скачайте https://git-scm.com/download/win  
**macOS:** `brew install git`  
**Linux:** `sudo apt install git`

---

## Альтернатива: Vercel (еще проще)

1. Зайдите на https://vercel.com
2. Войдите через GitHub
3. "Import Project" → выберите репозиторий
4. Готово! Сайт задеплоится за 30 секунд

---

## Подробные инструкции

- [DEPLOY.md](./DEPLOY.md) — полная инструкция по деплою
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — решение проблем
- [README.md](./README.md) — описание проекта

---

## Команды для обновления сайта

```bash
# После внесения изменений
git add .
git commit -m "Описание изменений"
git push

# GitHub Actions автоматически пересоберет сайт
```

---

## Проверка перед публикацией

```bash
# Убедитесь, что проект собирается
npm run build

# Проверьте локально
npm run preview
```

Если всё работает — публикуйте!
