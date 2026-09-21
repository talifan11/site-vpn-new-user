import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Github, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const { login, loginWithGithub, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/profile" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error || 'Ошибка входа');
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    setError('');
    const result = await loginWithGithub();
    setGithubLoading(false);
    
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error || 'Ошибка входа через GitHub');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Вход в аккаунт
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Присоединяйтесь к сообществу DevOps-инженеров
        </p>
      </div>

      <div className="space-y-4">
        {/* GitHub OAuth */}
        <button
          onClick={handleGithubLogin}
          disabled={githubLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          style={{ 
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text)'
          }}
        >
          {githubLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Github size={20} />
          )}
          <span className="font-medium">
            {githubLoading ? 'Подключение...' : 'Войти через GitHub'}
          </span>
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--color-border)' }} />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
              или через email
            </span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:border-[var(--color-accent)]"
                style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Пароль
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:border-[var(--color-accent)]"
                style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: 'var(--color-error)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Вход...
              </>
            ) : (
              <>
                Войти
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm pt-4" style={{ color: 'var(--color-text-secondary)' }}>
          Нет аккаунта?{' '}
          <Link to="/register" className="github-link" style={{ color: 'var(--color-accent)' }}>
            Зарегистрироваться
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
          <p className="text-xs mb-2 font-medium" style={{ color: 'var(--color-text)' }}>
            Демо-доступ:
          </p>
          <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
            Email: demo@devops.local<br />
            Пароль: demo123
          </p>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/profile" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      navigate('/onboarding');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Регистрация
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Создайте аккаунт и присоединяйтесь к сообществу
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Имя пользователя
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="engineer_42"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:border-[var(--color-accent)]"
              style={{ 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)'
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Отображаемое имя
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
            placeholder="Иван Инженеров"
            className="w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:border-[var(--color-accent)]"
            style={{ 
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)'
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:border-[var(--color-accent)]"
              style={{ 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)'
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Пароль
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              placeholder="Минимум 6 символов"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:border-[var(--color-accent)]"
              style={{ 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)'
              }}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: 'var(--color-error)' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Создание аккаунта...
            </>
          ) : (
            <>
              Создать аккаунт
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm pt-6" style={{ color: 'var(--color-text-secondary)' }}>
        Уже есть аккаунт?{' '}
        <Link to="/login" className="github-link" style={{ color: 'var(--color-accent)' }}>
          Войти
        </Link>
      </div>
    </div>
  );
}
