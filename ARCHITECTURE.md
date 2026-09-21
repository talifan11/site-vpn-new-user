# Архитектура и интеграция с GitHub

## Текущая архитектура

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
├─────────────────────────────────────────────────────┤
│  AuthContext    │  ForumContext    │  UI Components  │
├─────────────────────────────────────────────────────┤
│              LocalStorage (имитация БД)              │
└─────────────────────────────────────────────────────┘
```

### Компоненты

1. **AuthContext** — управление авторизацией
   - Хранение пользователя в localStorage
   - Имитация GitHub OAuth
   - Управление сессией

2. **ForumContext** — управление форумом
   - Треды, комментарии, апвойты
   - Сохранение в localStorage
   - Статистика пользователей

3. **LocalStorage** — временное хранилище
   - Пользователи
   - Треды и комментарии
   - Настройки

---

## Целевая архитектура (с реальным backend)

```
┌──────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   Auth   │  │  Forum   │  │ Profile  │  │  Guides  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │  API Gateway  │
                    │   (Nginx)     │
                    └───────────────┘
                            ↓
        ┌───────────────────────────────────┐
        │      Backend (Node.js/Express)    │
        ├───────────────────────────────────┤
        │  Auth API  │  Forum API  │  ...  │
        └───────────────────────────────────┘
                            ↓
    ┌───────────┬───────────┼───────────┬───────────┐
    ↓           ↓           ↓           ↓           ↓
┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌────────┐
│Postgres│ │ Redis  │ │Elastic   │ │  S3    │ │ GitHub │
│  SQL   │ │        │ │ Search   │ │        │ │  API   │
└────────┘ └────────┘ └──────────┘ └────────┘ └────────┘
```

---

## Интеграция с GitHub

### 1. GitHub OAuth (авторизация)

**Flow:**
```
1. Пользователь нажимает "Войти через GitHub"
2. Redirect на GitHub OAuth page
3. Пользователь авторизуется на GitHub
4. GitHub redirect обратно с code
5. Backend обменивает code на access_token
6. Backend получает данные пользователя через GitHub API
7. Создаёт/обновляет пользователя в БД
8. Возвращает JWT токен клиенту
```

**Реализация:**

```typescript
// Frontend: инициирует OAuth
const loginWithGithub = () => {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user:email`;
};

// Backend: обрабатывает callback
app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  
  // Обмениваем code на token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    })
  });
  
  const { access_token } = await tokenResponse.json();
  
  // Получаем данные пользователя
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${access_token}` }
  });
  
  const githubUser = await userResponse.json();
  
  // Создаём/обновляем пользователя в БД
  const user = await upsertUser({
    githubId: githubUser.id,
    username: githubUser.login,
    email: githubUser.email,
    displayName: githubUser.name,
    avatar: githubUser.avatar_url,
    bio: githubUser.bio,
    location: githubUser.location,
    website: githubUser.blog
  });
  
  // Генерируем JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  
  res.redirect(`/login/success?token=${token}`);
});
```

### 2. Синхронизация данных из GitHub

**Что можно синхронизировать:**

```typescript
interface GitHubSync {
  // Профиль
  profile: {
    avatar: string;
    bio: string;
    location: string;
    company: string;
    website: string;
  };
  
  // Репозитории
  repositories: {
    name: string;
    description: string;
    language: string;
    stars: number;
    isPrivate: boolean;
    lastUpdated: string;
  }[];
  
  // Активность
  activity: {
    commits: number;
    pullRequests: number;
    issues: number;
    contributions: number;
  };
  
  // Навыки (из языков репозиториев)
  skills: string[];
}
```

**Автоматическая синхронизация:**

```typescript
// Cron job: синхронизация каждые 24 часа
cron.schedule('0 0 * * *', async () => {
  const users = await getAllUsersWithGithub();
  
  for (const user of users) {
    const githubData = await fetchGitHubData(user.githubToken);
    await updateUserFromGithub(user.id, githubData);
  }
});
```

### 3. Синхронизация контента из репозиториев

**Идея:** Пользователь может подключить репозиторий с документацией, и она автоматически публикуется на сайте.

**Flow:**
```
1. Пользователь подключает репозиторий в настройках
2. Настраивает webhook на push события
3. При push в main ветку:
   - GitHub отправляет webhook на backend
   - Backend скачивает обновлённые markdown файлы
   - Парсит frontmatter (metadata)
   - Создаёт/обновляет статьи на сайте
   - Индексирует для поиска
```

**Webhook handler:**

```typescript
app.post('/webhooks/github', async (req, res) => {
  const { action, repository, commits } = req.body;
  
  if (action === 'push') {
    const owner = repository.owner.login;
    const repo = repository.name;
    
    // Скачиваем markdown файлы
    const files = await fetchMarkdownFiles(owner, repo);
    
    // Парсим и сохраняем
    for (const file of files) {
      const { frontmatter, content } = parseMarkdown(file);
      
      await upsertArticle({
        author: owner,
        title: frontmatter.title,
        tags: frontmatter.tags,
        content: content,
        source: `https://github.com/${owner}/${repo}/${file.path}`
      });
    }
  }
  
  res.sendStatus(200);
});
```

### 4. Автоматический деплой через GitHub Actions

**Workflow для автодеплоя:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.SSH_KEY }}
          source: "dist/*"
          target: "/var/www/devops-hub"
      
      - name: Restart PM2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/devops-hub
            pm2 restart devops-hub
```

---

## База данных (схема)

```sql
-- Пользователи
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  display_name VARCHAR(100),
  avatar VARCHAR(500),
  bio TEXT,
  role VARCHAR(20) DEFAULT 'newbie',
  reputation INTEGER DEFAULT 0,
  github_id INTEGER UNIQUE,
  github_username VARCHAR(100),
  location VARCHAR(100),
  website VARCHAR(500),
  skills TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Треды форума
CREATE TABLE threads (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  author_id UUID REFERENCES users(id),
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Комментарии
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  thread_id UUID REFERENCES threads(id),
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Апвойты
CREATE TABLE upvotes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  target_type VARCHAR(20), -- 'thread' or 'comment'
  target_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- Подписки
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  follower_id UUID REFERENCES users(id),
  following_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Уведомления
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  content TEXT,
  link VARCHAR(500),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_threads_category ON threads(category);
CREATE INDEX idx_threads_tags ON threads USING GIN(tags);
CREATE INDEX idx_comments_thread ON comments(thread_id);
CREATE INDEX idx_upvotes_target ON upvotes(target_type, target_id);
```

---

## API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/github
GET    /api/auth/github/callback
GET    /api/auth/me
```

### Users
```
GET    /api/users/:id
PATCH  /api/users/:id
GET    /api/users/:id/threads
GET    /api/users/:id/comments
GET    /api/users/:id/followers
GET    /api/users/:id/following
POST   /api/users/:id/follow
DELETE /api/users/:id/follow
```

### Forum
```
GET    /api/threads
POST   /api/threads
GET    /api/threads/:id
PATCH  /api/threads/:id
DELETE /api/threads/:id
POST   /api/threads/:id/upvote
GET    /api/threads/:id/comments
POST   /api/threads/:id/comments
PATCH  /api/comments/:id
DELETE /api/comments/:id
POST   /api/comments/:id/upvote
```

### Search
```
GET    /api/search?q=query&type=threads|users|tags
```

### Tags
```
GET    /api/tags
GET    /api/tags/:tag/threads
```

---

## QoS (Quality of Service) — Метрики

### Пользовательские метрики

```typescript
interface UserMetrics {
  // Репутация
  reputation: number;
  reputationHistory: { date: string; amount: number; reason: string }[];
  
  // Активность
  activity: {
    threadsCreated: number;
    commentsMade: number;
    upvotesGiven: number;
    upvotesReceived: number;
    lastActive: string;
  };
  
  // Качество контента
  contentQuality: {
    averageUpvotesPerThread: number;
    averageUpvotesPerComment: number;
    solutionRate: number; // процент ответов, принятых как решение
  };
  
  // Экспертность по тегам
  expertise: {
    [tag: string]: {
      level: 'beginner' | 'intermediate' | 'expert';
      score: number;
      contributions: number;
    };
  };
}
```

### Системные метрики

```typescript
interface SystemMetrics {
  // Производительность
  performance: {
    uptime: number; // процент доступности
    avgResponseTime: number; // ms
    errorRate: number; // процент ошибок
    throughput: number; // запросов в секунду
  };
  
  // Контент
  content: {
    totalThreads: number;
    totalComments: number;
    newThreadsPerDay: number;
    activeUsersPerDay: number;
  };
  
  // Сообщество
  community: {
    totalUsers: number;
    activeUsers: number; // за последние 30 дней
    retentionRate: number; // процент вернувшихся пользователей
    avgReputation: number;
  };
}
```

---

## Безопасность

### Аутентификация
- JWT токены с коротким сроком жизни (15 минут)
- Refresh tokens для продления сессии
- HttpOnly cookies для refresh tokens
- Rate limiting на auth endpoints

### Авторизация
- Role-based access control (RBAC)
- Проверка прав на каждый запрос
- Защита от IDOR (Insecure Direct Object References)

### Защита данных
- Хеширование паролей (bcrypt)
- Валидация и санитизация ввода
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)
- CSRF tokens для state-changing operations

### GitHub интеграция
- OAuth scopes минимизированы
- Токены хранятся зашифрованными
- Webhook signatures проверяются
- Rate limiting на GitHub API calls

---

## Мониторинг и логирование

```typescript
// Структурированные логи
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  message: string;
  context?: {
    userId?: string;
    requestId?: string;
    duration?: number;
    error?: Error;
  };
}

// Метрики для Prometheus
interface Metrics {
  http_requests_total: Counter;
  http_request_duration_seconds: Histogram;
  active_users: Gauge;
  forum_threads_total: Counter;
  forum_comments_total: Counter;
}
```

---

## Масштабирование

### Горизонтальное масштабирование
- Stateless backend (можно запускать несколько инстансов)
- Load balancer (Nginx/HAProxy)
- Database replication (read replicas)
- Redis cluster для кэша

### Вертикальное масштабирование
- Увеличение ресурсов VPS/сервера
- Оптимизация запросов к БД
- Кэширование часто запрашиваемых данных
- CDN для статики

### Оптимизация
- Database query optimization
- Indexes на часто запрашиваемые поля
- Pagination для больших списков
- Lazy loading для изображений
- Code splitting для frontend

---

**DevOps Hub** — масштабируемая платформа для инженеров, готовая к росту.
