import { Link } from 'react-router-dom';
import { Server, Shield, Wrench, ArrowRight, Zap } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <section className="max-w-2xl fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--color-text)' }}>
          DevOps Hub
        </h1>
        <div className="flex gap-3 flex-wrap mb-6">
          <Link
            to="/feed"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            Открыть ленту
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            Личный кабинет
          </Link>
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            Гайды
          </Link>
        </div>
        <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Социальная сеть для инженеров, работающих с Linux, DevOps и инфраструктурой.
        </p>
        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Здесь вы найдёте проверенные инструкции по настройке VPS и VPN, сможете задать вопрос на форуме и получить ответ от опытных инженеров. 
          Делитесь опытом, помогайте другим, зарабатывайте репутацию.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-16">
        <Link
          to="/hosts"
          className="block p-6 rounded-lg border card-hover group"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <Server size={24} className="mb-3 transition-transform group-hover:scale-110" style={{ color: 'var(--color-accent)' }} />
          <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Выбор хостинга</h2>
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            Сравнение 10 хостингов по критериям, важным для VPN: блокировки портов, firewall, поддержка.
          </p>
          <span className="inline-flex items-center gap-1 text-sm github-link" style={{ color: 'var(--color-accent)' }}>
            Перейти <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          to="/guides"
          className="block p-6 rounded-lg border card-hover group"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <Shield size={24} className="mb-3 transition-transform group-hover:scale-110" style={{ color: 'var(--color-accent)' }} />
          <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Настройка VPN</h2>
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            WireGuard, IKEv2, OpenVPN. Команды, конфигурации, QR-коды для телефона.
          </p>
          <span className="inline-flex items-center gap-1 text-sm github-link" style={{ color: 'var(--color-accent)' }}>
            Перейти <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          to="/diagnostics"
          className="block p-6 rounded-lg border card-hover group"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <Wrench size={24} className="mb-3 transition-transform group-hover:scale-110" style={{ color: 'var(--color-accent)' }} />
          <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Диагностика проблем</h2>
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            Чек-лист от простого к сложному: firewall, NAT, блокировки хостинга, логи.
          </p>
          <span className="inline-flex items-center gap-1 text-sm github-link" style={{ color: 'var(--color-accent)' }}>
            Перейти <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      <section className="fade-in-up">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={20} style={{ color: 'var(--color-accent)' }} />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Актуальные гайды</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/guides/auto-setup"
            className="p-5 rounded-lg border card-hover group"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded badge" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-success)' }}>
                NEW
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>5-10 мин</span>
            </div>
            <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-text)' }}>Автоматическая установка VPN</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Единый скрипт с проверкой всех параметров. Просто скопируйте и запустите
            </p>
            <span className="inline-flex items-center gap-1 text-xs mt-2 github-link" style={{ color: 'var(--color-accent)' }}>
              Подробнее <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/guides/wireguard"
            className="p-5 rounded-lg border card-hover group"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded badge" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                WireGuard
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>15-20 мин</span>
            </div>
            <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-text)' }}>WireGuard через wg-easy</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Docker-контейнер, веб-интерфейс, QR-коды для мобильных устройств
            </p>
            <span className="inline-flex items-center gap-1 text-xs mt-2 github-link" style={{ color: 'var(--color-accent)' }}>
              Подробнее <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/guides/ikev2"
            className="p-5 rounded-lg border card-hover group"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded badge" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                IKEv2
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>30-40 мин</span>
            </div>
            <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-text)' }}>IKEv2 через strongSwan</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              EAP-MSCHAPv2, сертификаты Let's Encrypt, нативная поддержка на всех ОС
            </p>
            <span className="inline-flex items-center gap-1 text-xs mt-2 github-link" style={{ color: 'var(--color-accent)' }}>
              Подробнее <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
