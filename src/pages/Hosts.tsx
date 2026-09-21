import { Link, useParams, Navigate } from 'react-router-dom';
import { hosts, getHost } from '../data/hosts';
import { Check, X, AlertTriangle, ExternalLink, ArrowRight } from 'lucide-react';

function SuitabilityBadge({ value }: { value: string }) {
  if (value === 'yes') return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full badge" style={{ backgroundColor: 'rgba(22,163,74,0.1)', color: 'var(--color-success)' }}>
      <Check size={12} /> Да
    </span>
  );
  if (value === 'no') return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full badge" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: 'var(--color-error)' }}>
      <X size={12} /> Нет
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full badge" style={{ backgroundColor: 'rgba(217,119,6,0.1)', color: 'var(--color-warning)' }}>
      <AlertTriangle size={12} /> Условно
    </span>
  );
}

export function Hosts() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 fade-in-up">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Сравнение хостингов</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
        Данные актуальны на момент последнего обновления. Всегда проверяйте в официальной документации хостинга.
      </p>

      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
        <table>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <th>Хостинг</th>
              <th>Цена от</th>
              <th>Блокируемые порты</th>
              <th>Панель firewall</th>
              <th>Открытие через поддержку</th>
              <th>Подходит для VPN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {hosts.map(host => (
              <tr key={host.id}>
                <td>
                  <Link to={`/hosts/${host.id}`} className="font-medium github-link" style={{ color: 'var(--color-text)' }}>
                    {host.name}
                  </Link>
                </td>
                <td className="font-mono text-xs">{host.priceFrom}</td>
                <td className="text-xs">{host.blockedPorts}</td>
                <td>{host.hasFirewallPanel ? <Check size={16} style={{ color: 'var(--color-success)' }} /> : <X size={16} style={{ color: 'var(--color-text-muted)' }} />}</td>
                <td>{host.canOpenViaSupport ? <Check size={16} style={{ color: 'var(--color-success)' }} /> : <X size={16} style={{ color: 'var(--color-text-muted)' }} />}</td>
                <td><SuitabilityBadge value={host.vpnSuitable} /></td>
                <td>
                  <Link to={`/hosts/${host.id}`} className="inline-flex items-center gap-1 text-xs github-link group" style={{ color: 'var(--color-accent)' }}>
                    Подробнее <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function HostDetail() {
  const { id } = useParams();
  const host = getHost(id || '');

  if (!host) return <Navigate to="/hosts" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in-up">
      <Link to="/hosts" className="text-sm mb-6 inline-flex items-center gap-1 github-link" style={{ color: 'var(--color-text-muted)' }}>
        Назад к списку хостингов
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>{host.name}</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>от {host.priceFrom}</p>
        </div>
        <div className="flex gap-3">
          <SuitabilityBadge value={host.vpnSuitable} />
          <a
            href={host.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border transition-all hover:scale-105"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            Сайт <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="prose">
        <p>{host.details.description}</p>

        <h2>Порты, заблокированные по умолчанию</h2>
        <ul>
          {host.details.blockedByDefault.map((port, i) => (
            <li key={i}>{port}</li>
          ))}
        </ul>

        <h2>Как открыть порты</h2>
        <p>{host.details.howToOpen}</p>

        <h2>Анти-DDoS</h2>
        <p>{host.details.antiDdos}</p>

        <h2>Нюансы</h2>
        <ul>
          {host.details.nuances.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>

        <h2>Источник информации</h2>
        <p>
          <a href={host.details.source} target="_blank" rel="noopener noreferrer" className="text-sm github-link">
            {host.details.source}
          </a>
        </p>
      </div>
    </div>
  );
}
