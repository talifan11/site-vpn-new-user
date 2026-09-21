import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';

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
      className="p-2 rounded-md transition-colors duration-100"
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

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-sm tracking-tight" style={{ color: 'var(--color-text)' }}>
          VPS/VPN
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm transition-colors duration-100"
              style={{ color: location.pathname.startsWith(link.to) ? 'var(--color-text)' : 'var(--color-text-secondary)' }}
            >
              {link.label}
            </Link>
          ))}
          <ThemeSwitcher />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: 'var(--color-text)' }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t px-4 py-3 flex flex-col gap-3" style={{ borderColor: 'var(--color-border)' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm py-1"
              style={{ color: location.pathname.startsWith(link.to) ? 'var(--color-text)' : 'var(--color-text-secondary)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
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
          <p>VPS и VPN без лишних шагов</p>
          <p className="mt-1">Информационный ресурс для инженеров и системных администраторов</p>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <Link to="/about">О сайте</Link>
          <Link to="/forum">Форум</Link>
          <a href="mailto:feedback@vps-vpn.guide">Обратная связь</a>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
