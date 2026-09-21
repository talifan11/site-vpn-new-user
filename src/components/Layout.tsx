import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, User, LogIn, Bell, Home as HomeIcon, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFeed } from '../contexts/FeedContext';

function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md icon-hover"
      style={{ color: 'var(--color-text-secondary)' }}
      aria-label="Переключить тему"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

const navLinks = [
  { to: '/hosts', label: 'Хостинги' },
  { to: '/guides', label: 'Гайды' },
  { to: '/diagnostics', label: 'Диагностика' },
  { to: '/forum', label: 'Форум' },
  { to: '/about', label: 'О сайте' },
];

function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { getUnreadCount } = useFeed();
  const unreadCount = isAuthenticated ? getUnreadCount() : 0;

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 85%, transparent)' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-sm tracking-tight hover:opacity-80" style={{ color: 'var(--color-text)' }}>
          DevOps Hub
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <Link
              to="/feed"
              className={`text-sm flex items-center gap-1.5 ${location.pathname === '/feed' ? 'active-nav' : ''}`}
              style={{ color: location.pathname === '/feed' ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
            >
              <HomeIcon size={14} />
              Лента
            </Link>
          )}
          {navLinks.map(link => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm ${isActive ? 'active-nav' : ''}`}
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          
          {isAuthenticated && (
            <Link
              to="/notifications"
              className="relative p-2 rounded-md transition-all hover:scale-105"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="Уведомления"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span 
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: 'var(--color-error)', color: 'white', fontSize: '10px' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}
          
          {isAuthenticated && user ? (
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
              >
                {user.avatar}
              </div>
              <span className="text-sm">{user.displayName}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              <LogIn size={14} />
              Войти
            </Link>
          )}

          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden"
            style={{ color: 'var(--color-text)' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t px-4 py-3 flex flex-col gap-3 mobile-menu" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
          {isAuthenticated && (
            <Link
              to="/feed"
              className={`flex items-center gap-2 text-sm py-1 ${location.pathname === '/feed' ? 'active-nav' : ''}`}
              style={{ color: location.pathname === '/feed' ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
              onClick={() => setMobileOpen(false)}
            >
              <HomeIcon size={16} />
              Лента
            </Link>
          )}
          {navLinks.map(link => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm py-1 ${isActive ? 'active-nav' : ''}`}
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="flex items-center gap-2 py-1"
                  style={{ color: 'var(--color-text)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Bell size={16} />
                  Уведомления
                  {unreadCount > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-error)', color: 'white' }}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 py-1"
                  style={{ color: 'var(--color-text)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={16} />
                  Личный кабинет
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 py-1"
                style={{ color: 'var(--color-accent)' }}
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} />
                Войти
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-4">
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <p>DevOps Hub — социальная сеть для инженеров</p>
          <p className="mt-1">Linux, DevOps, инфраструктура. Проверенные инструкции и живое сообщество.</p>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <Link to="/about" className="github-link">О сайте</Link>
          <Link to="/forum" className="github-link">Форум</Link>
          <a href="mailto:feedback@devops-hub.ru" className="github-link">Обратная связь</a>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Header />
      <main className="flex-1" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
