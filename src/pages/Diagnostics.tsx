import { useState } from 'react';
import { Check, Circle, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';

interface CheckItem {
  id: string;
  title: string;
  description: string;
  commands?: string[];
}

interface CheckSection {
  title: string;
  description: string;
  items: CheckItem[];
}

const checklist: CheckSection[] = [
  {
    title: 'Базовая проверка',
    description: 'Простые вещи, которые нужно проверить в первую очередь',
    items: [
      {
        id: 'ping',
        title: 'Сервер отвечает на ping',
        description: 'С локальной машины выполните ping your-server-ip. Если не отвечает — сервер выключен или заблокирован ICMP.',
        commands: ['ping -c 4 your-server-ip']
      },
      {
        id: 'ssh',
        title: 'SSH-доступ работает',
        description: 'Подключение по SSH проходит. Если нет — проверьте, что сервер запущен и порт 22 открыт.',
        commands: ['ssh root@your-server-ip']
      },
      {
        id: 'service-running',
        title: 'VPN-сервис запущен',
        description: 'Проверьте, что процесс VPN-сервера активен.',
        commands: [
          '# Для WireGuard (wg-easy):\ndocker compose -f /opt/wg-easy/docker-compose.yml ps',
          '# Для IKEv2 (strongSwan):\nsystemctl status strongswan',
          '# Для OpenVPN:\nsystemctl status openvpn@server'
        ]
      }
    ]
  },
  {
    title: 'IP-форвардинг и NAT',
    description: 'Проверка настроек ядра и маршрутизации',
    items: [
      {
        id: 'ip-forward',
        title: 'IP-форвардинг включен',
        description: 'Значение должно быть 1. Если 0 — трафик от VPN-клиентов не маршрутизируется наружу.',
        commands: [
          'sysctl net.ipv4.ip_forward',
          '# Если 0, включите:\necho "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf\nsysctl -p'
        ]
      },
      {
        id: 'nat-rules',
        title: 'Правила NAT (MASQUERADE) настроены',
        description: 'Таблица nat должна содержать правило MASQUERADE для VPN-подсети.',
        commands: [
          'iptables -t nat -L POSTROUTING -v -n',
          '# Должна быть запись вида:\n# Chain POSTROUTING (policy ACCEPT)\n# pkts bytes target prot opt source destination\n# X    X     MASQUERADE all -- 10.10.10.0/24 0.0.0.0/0'
        ]
      },
      {
        id: 'vpn-interface',
        title: 'VPN-интерфейс создан',
        description: 'Интерфейс wg0 (WireGuard) или ipsec0 (strongSwan) должен существовать.',
        commands: [
          'ip addr show',
          '# Для WireGuard:\nwg show',
          '# Для strongSwan:\nipsec status'
        ]
      }
    ]
  },
  {
    title: 'Firewall на сервере',
    description: 'Проверка локальных правил iptables и UFW',
    items: [
      {
        id: 'ufw-status',
        title: 'UFW не блокирует VPN-порт',
        description: 'Порт VPN-протокола должен быть разрешён в UFW.',
        commands: [
          'ufw status verbose',
          '# Если порт заблокирован:\nufw allow 51820/udp   # WireGuard\nufw allow 500/udp     # IKEv2\nufw allow 4500/udp    # IKEv2 NAT-T\nufw allow 443/tcp     # OpenVPN'
        ]
      },
      {
        id: 'iptables-input',
        title: 'iptables INPUT не блокирует',
        description: 'Проверьте, что нет правил DROP для VPN-портов.',
        commands: [
          'iptables -L INPUT -n -v',
          '# Если есть DROP-правила для нужных портов:\niptables -D INPUT -p udp --dport 51820 -j DROP'
        ]
      }
    ]
  },
  {
    title: 'Firewall хостинга',
    description: 'Проверка внешних блокировок на уровне хостинг-провайдера',
    items: [
      {
        id: 'external-check',
        title: 'Порт доступен снаружи',
        description: 'Проверяйте с ДРУГОГО сервера (не с вашего компьютера). Ваш провайдер тоже может блокировать.',
        commands: [
          '# С другого VPS:\nnc -zvu your-server-ip 51820   # WireGuard\nnc -zvu your-server-ip 500      # IKEv2\nnc -zvt your-server-ip 443      # OpenVPN',
          '# Альтернатива через curl:\ncurl -v telnet://your-server-ip:51820 --connect-timeout 5'
        ]
      },
      {
        id: 'tcpdump-server',
        title: 'tcpdump на сервере видит пакеты',
        description: 'Если пакеты видны в tcpdump, но сервис не отвечает — проблема в iptables. Если пакетов нет — хостинг блокирует.',
        commands: [
          '# Запустите на сервере:\ntcpdump -i eth0 udp port 51820 -n',
          '# С клиента попробуйте подключиться. Если пакеты видны в выводе tcpdump — порт доходит до сервера.'
        ]
      },
      {
        id: 'hosting-docs',
        title: 'Документация хостинга проверена',
        description: 'Откройте документацию вашего хостинга и проверьте список заблокированных портов. Если нужный порт в списке — обратитесь в поддержку.'
      }
    ]
  },
  {
    title: 'Логи сервисов',
    description: 'Анализ логов VPN-сервера',
    items: [
      {
        id: 'wireguard-logs',
        title: 'Логи WireGuard',
        description: 'Проверьте вывод wg show и логи контейнера.',
        commands: [
          'wg show',
          'docker compose -f /opt/wg-easy/docker-compose.yml logs --tail=50'
        ]
      },
      {
        id: 'strongswan-logs',
        title: 'Логи strongSwan',
        description: 'Журнал charon содержит информацию о попытках подключения и ошибках.',
        commands: [
          'journalctl -u strongswan --no-pager -n 50',
          '# Для детального логирования добавьте в ipsec.conf:\n# charondebug = "ike 2, knl 2, cfg 2, net 2"'
        ]
      },
      {
        id: 'openvpn-logs',
        title: 'Логи OpenVPN',
        description: 'Логи содержат информацию о подключениях и ошибках аутентификации.',
        commands: [
          'journalctl -u openvpn@server --no-pager -n 50',
          '# Или:\ncat /var/log/openvpn.log'
        ]
      }
    ]
  }
];

const blockingSigns = [
  {
    sign: 'SSH работает, все остальные порты закрыты',
    action: 'Хостинг блокирует порты на уровне сети. Обратитесь в поддержку с запросом на открытие нужных портов. Укажите протокол (TCP/UDP) и номер порта.'
  },
  {
    sign: 'tcpdump на сервере не видит входящих пакетов',
    action: 'Пакеты не доходят до сервера. Это означает блокировку на уровне хостинга или промежуточной сети. Проверьте документацию хостинга.'
  },
  {
    sign: 'nc с другого VPS показывает timeout (не connection refused)',
    action: 'Timeout — признак блокировки на уровне сети. Connection refused — порт открыт, но сервис не слушает. Разные проблемы.'
  },
  {
    sign: 'Порты были открыты, потом перестали работать',
    action: 'Некоторые хостинги могут менять политику без уведомления. Проверьте документацию на дату последнего обновления. Напишите в поддержку.'
  },
  {
    sign: 'Поддержка утверждает, что порты открыты, но они не работают',
    action: 'Попросите скриншот правил firewall. Уточните, на каком уровне открыты порты (виртуальный switch, физический firewall). Попросите проверить с их стороны через tcpdump.'
  }
];

function ChecklistItem({ item, checked, onToggle }: { item: CheckItem; checked: boolean; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left transition-colors duration-100"
        style={{ backgroundColor: expanded ? 'var(--color-bg-secondary)' : 'transparent' }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="shrink-0"
        >
          {checked
            ? <Check size={18} style={{ color: 'var(--color-success)' }} />
            : <Circle size={18} style={{ color: 'var(--color-text-muted)' }} />
          }
        </button>
        <span className="text-sm font-medium flex-1" style={{ color: checked ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
          {item.title}
        </span>
        {expanded ? <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pl-11">
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>{item.description}</p>
          {item.commands?.map((cmd, i) => (
            <pre key={i} className="p-3 rounded text-xs font-mono overflow-x-auto mb-2" style={{ backgroundColor: 'var(--color-code-bg)', color: 'var(--color-text-secondary)' }}>
              {cmd}
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}

export function Diagnostics() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalItems = checklist.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Диагностика VPN</h1>
      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
        Чек-лист для поиска причин, по которым VPN не подключается. Двигайтесь от простого к сложному.
      </p>
      <p className="text-xs mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Прогресс: {checked.size} / {totalItems}
      </p>

      <div className="space-y-8">
        {checklist.map((section, si) => (
          <section key={si}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                {si + 1}. {section.title}
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{section.description}</p>
            </div>
            <div className="space-y-2">
              {section.items.map(item => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  checked={checked.has(item.id)}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
          Признаки блокировки хостингом
        </h2>
        <div className="space-y-4">
          {blockingSigns.map((item, i) => (
            <div key={i} className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>{item.sign}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.action}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
