import { Link } from 'react-router-dom';
import { Server, Shield, Wrench, ArrowRight } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <section className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: 'var(--color-text)' }}>
          VPS и VPN без лишних шагов
        </h1>
        <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Пошаговые инструкции для тех, кому нужен рабочий VPN-сервер, а не теоретическая статья.
          Аренда VPS, настройка WireGuard, IKEv2 или OpenVPN, подключение телефона.
          Каждый гайд проверен на реальных хостингах. Данные о блокировках портов обновляются при изменении политики провайдеров.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-16">
        <Link
          to="/hosts"
          className="block p-6 rounded-lg border transition-colors duration-100 group"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <Server size={24} className="mb-3" style={{ color: 'var(--color-accent)' }} />
          <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Выбор хостинга</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Сравнение 10 хостингов по критериям, важным для VPN: блокировки портов, firewall, поддержка.
          </p>
          <span className="inline-flex items-center gap-1 text-sm mt-3" style={{ color: 'var(--color-accent)' }}>
            Перейти <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          to="/guides"
          className="block p-6 rounded-lg border transition-colors duration-100 group"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <Shield size={24} className="mb-3" style={{ color: 'var(--color-accent)' }} />
          <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Настройка VPN</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            WireGuard, IKEv2, OpenVPN. Команды, конфигурации, QR-коды для телефона.
          </p>
          <span className="inline-flex items-center gap-1 text-sm mt-3" style={{ color: 'var(--color-accent)' }}>
            Перейти <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          to="/diagnostics"
          className="block p-6 rounded-lg border transition-colors duration-100 group"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <Wrench size={24} className="mb-3" style={{ color: 'var(--color-accent)' }} />
          <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Диагностика проблем</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Чек-лист от простого к сложному: firewall, NAT, блокировки хостинга, логи.
          </p>
          <span className="inline-flex items-center gap-1 text-sm mt-3" style={{ color: 'var(--color-accent)' }}>
            Перейти <ArrowRight size={14} />
          </span>
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Актуальные гайды</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/guides/wireguard"
            className="p-5 rounded-lg border transition-colors duration-100"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                WireGuard
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>15-20 мин</span>
            </div>
            <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-text)' }}>WireGuard через wg-easy</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Docker-контейнер, веб-интерфейс, QR-коды для мобильных устройств
            </p>
          </Link>

          <Link
            to="/guides/ikev2"
            className="p-5 rounded-lg border transition-colors duration-100"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                IKEv2
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>30-40 мин</span>
            </div>
            <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-text)' }}>IKEv2 через strongSwan</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              EAP-MSCHAPv2, сертификаты Let's Encrypt, нативная поддержка на всех ОС
            </p>
          </Link>

          <Link
            to="/guides/openvpn"
            className="p-5 rounded-lg border transition-colors duration-100"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                OpenVPN
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>10-15 мин</span>
            </div>
            <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-text)' }}>OpenVPN через TCP 443</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Официальный скрипт, маскировка под HTTPS, максимальная совместимость
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
