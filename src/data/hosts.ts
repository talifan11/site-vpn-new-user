export interface Host {
  id: string;
  name: string;
  priceFrom: string;
  blockedPorts: string;
  hasFirewallPanel: boolean;
  canOpenViaSupport: boolean;
  vpnSuitable: 'yes' | 'no' | 'conditional';
  docsUrl: string;
  siteUrl: string;
  details: {
    description: string;
    blockedByDefault: string[];
    howToOpen: string;
    antiDdos: string;
    nuances: string[];
    source: string;
  };
}

export const hosts: Host[] = [
  {
    id: 'adminvps',
    name: 'AdminVPS',
    priceFrom: '190 руб/мес',
    blockedPorts: 'Все кроме 22, 80, 443',
    hasFirewallPanel: false,
    canOpenViaSupport: true,
    vpnSuitable: 'conditional',
    docsUrl: 'https://adminvps.ru/documentation/',
    siteUrl: 'https://adminvps.ru',
    details: {
      description: 'Российский хостинг-провайдер с 2007 года. Дата-центры в Москве и Европе. Базовая конфигурация firewall блокирует все порты кроме стандартных веб-портов и SSH.',
      blockedByDefault: ['UDP 51820 (WireGuard)', 'UDP 500/4500 (IKEv2)', 'TCP 1194 (OpenVPN default)', 'TCP 443 (если не заказан как веб-порт)'],
      howToOpen: 'Открытие портов — только через тикет в техподдержку. Указать номер порта, протокол (TCP/UDP) и обоснование. Срок обработки — от 1 до 24 часов. Бесплатно.',
      antiDdos: 'Базовая защита на уровне дата-центра. Продвинутая анти-DDoS — за доплату от 500 руб/мес.',
      nuances: [
        'При заказе VPS сразу уточняйте, какие порты нужно открыть для VPN',
        'Поддержка отвечает в рабочее время (9:00-21:00 МСК)',
        'Нет панели управления firewall — все изменения через тикеты',
        'WireGuard работает после открытия UDP порта через поддержку',
        'IKEv2 требует открытия UDP 500 и UDP 4500'
      ],
      source: 'https://adminvps.ru/documentation/network/firewall/'
    }
  },
  {
    id: 'timeweb-cloud',
    name: 'Timeweb Cloud',
    priceFrom: '189 руб/мес',
    blockedPorts: 'Нет блокировок по умолчанию',
    hasFirewallPanel: true,
    canOpenViaSupport: true,
    vpnSuitable: 'yes',
    docsUrl: 'https://timeweb.com/ru/help/',
    siteUrl: 'https://timeweb.cloud',
    details: {
      description: 'Облачная платформа от Timeweb. Виртуальные серверы на базе KVM. Нет предустановленных блокировок портов — все порты доступны сразу после создания сервера.',
      blockedByDefault: ['Нет блокировок на уровне хостинга'],
      howToOpen: 'Ничего открывать не нужно. Все порты доступны по умолчанию. В панели управления есть встроенный firewall для настройки правил.',
      antiDdos: 'Включена базовая защита. Продвинутая защита доступна на тарифах от 990 руб/мес.',
      nuances: [
        'Все порты открыты по умолчанию — VPN работает сразу',
        'Есть панель firewall в личном кабинете',
        'WireGuard, IKEv2, OpenVPN — работают без дополнительных действий',
        'Можно настроить firewall-правила через панель',
        'API для автоматизации — доступен'
      ],
      source: 'https://timeweb.com/ru/help/articles/firewall-v-oblachnyh-serverah'
    }
  },
  {
    id: 'firstvds',
    name: 'FirstVDS',
    priceFrom: '165 руб/мес',
    blockedPorts: 'Нет блокировок по умолчанию',
    hasFirewallPanel: false,
    canOpenViaSupport: true,
    vpnSuitable: 'yes',
    docsUrl: 'https://firstvds.ru/wiki/',
    siteUrl: 'https://firstvds.ru',
    details: {
      description: 'Один из старейших VPS-хостингов в России. KVM-виртуализация. Порты не блокируются на уровне хостинга — настройка firewall полностью на стороне клиента.',
      blockedByDefault: ['Нет блокировок'],
      howToOpen: 'Все порты доступны. Настройка iptables/ufw — на усмотрение пользователя.',
      antiDdos: 'Нет встроенной анти-DDoS. При атаке сервер могут-null-маршрутизировать.',
      nuances: [
        'Низкие цены на базовых тарифах',
        'Нет панели firewall — только через SSH',
        'VPN-протоколы работают из коробки',
        'Поддержка отвечает быстро, но без глубокой технической экспертизы',
        'При DDoS-атаке могут отключить сервер без предупреждения'
      ],
      source: 'https://firstvds.ru/wiki/'
    }
  },
  {
    id: 'aeza',
    name: 'Aeza',
    priceFrom: '139 руб/мес',
    blockedPorts: 'Нет блокировок по умолчанию',
    hasFirewallPanel: true,
    canOpenViaSupport: true,
    vpnSuitable: 'yes',
    docsUrl: 'https://aeza.net/knowledge-base',
    siteUrl: 'https://aeza.net',
    details: {
      description: 'Хостинг с дата-центрами в России, Европе и Азии. KVM-виртуализация. Нет блокировок портов. Есть панель управления сетью.',
      blockedByDefault: ['Нет блокировок'],
      howToOpen: 'Все порты доступны. В панели управления можно настроить сетевые правила.',
      antiDdos: 'Базовая защита включена. L7-защита — на старших тарифах.',
      nuances: [
        'Выгодные цены, особенно при оплате за длительный срок',
        'Много локаций — Россия (Москва), Нидерланды, Финляндия, США',
        'Все VPN-протоколы работают без ограничений',
        'Панель управления с мониторингом',
        'IPv6 доступен по запросу'
      ],
      source: 'https://aeza.net/knowledge-base'
    }
  },
  {
    id: 'vdsina',
    name: 'VDSina',
    priceFrom: '170 руб/мес',
    blockedPorts: 'Нет блокировок по умолчанию',
    hasFirewallPanel: true,
    canOpenViaSupport: true,
    vpnSuitable: 'yes',
    docsUrl: 'https://www.vdsina.ru/help/',
    siteUrl: 'https://www.vdsina.ru',
    details: {
      description: 'Облачный хостинг с KVM. Все порты открыты по умолчанию. Есть панель firewall в личном кабинете.',
      blockedByDefault: ['Нет блокировок'],
      howToOpen: 'Все порты доступны. Дополнительно можно настроить правила через панель firewall.',
      antiDdos: 'Включена базовая защита от DDoS на уровне сети.',
      nuances: [
        'Удобная панель управления',
        'Firewall в панели — можно закрывать/открывать порты',
        'VPN работает сразу после установки',
        'Есть API для управления',
        'Бэкапы включены в стоимость'
      ],
      source: 'https://www.vdsina.ru/help/kak-polzovatsya-firewallom'
    }
  },
  {
    id: 'hostvds',
    name: 'HostVDS',
    priceFrom: '120 руб/мес',
    blockedPorts: 'Нет блокировок по умолчанию',
    hasFirewallPanel: false,
    canOpenViaSupport: true,
    vpnSuitable: 'yes',
    docsUrl: 'https://hostvds.ru/knowledgebase',
    siteUrl: 'https://hostvds.ru',
    details: {
      description: 'Бюджетный VPS-хостинг. KVM-виртуализация, дата-центры в Москве. Порты не блокируются.',
      blockedByDefault: ['Нет блокировок'],
      howToOpen: 'Все порты доступны по умолчанию.',
      antiDdos: 'Нет.',
      nuances: [
        'Самые низкие цены в подборке',
        'Минимальный набор функций в панели',
        'Нет firewall-панели',
        'VPN работает без ограничений',
        'Поддержка — через тикеты, ответ в течение нескольких часов'
      ],
      source: 'https://hostvds.ru/knowledgebase'
    }
  },
  {
    id: 'beget',
    name: 'Beget',
    priceFrom: '250 руб/мес',
    blockedPorts: 'Нет блокировок по умолчанию',
    hasFirewallPanel: true,
    canOpenViaSupport: true,
    vpnSuitable: 'yes',
    docsUrl: 'https://beget.com/ru/vps',
    siteUrl: 'https://beget.com',
    details: {
      description: 'Известный хостинг-провайдер, предлагающий и виртуальные серверы. KVM-виртуализация. Удобная панель управления.',
      blockedByDefault: ['Нет блокировок'],
      howToOpen: 'Все порты доступны. Настройка firewall — через панель управления.',
      antiDdos: 'Базовая защита включена.',
      nuances: [
        'Удобная и понятная панель управления',
        'Хорошая документация',
        'VPN работает из коробки',
        'Цены выше среднего',
        'Поддержка отвечает быстро'
      ],
      source: 'https://beget.com/ru/vps'
    }
  },
  {
    id: 'reg-ru',
    name: 'Reg.ru',
    priceFrom: '250 руб/мес',
    blockedPorts: 'Нет блокировок по умолчанию',
    hasFirewallPanel: true,
    canOpenViaSupport: true,
    vpnSuitable: 'yes',
    docsUrl: 'https://www.reg.ru/cloud/vps',
    siteUrl: 'https://www.reg.ru',
    details: {
      description: 'Крупный регистратор доменов, предлагающий также VPS. KVM-виртуализация, дата-центры в Москве.',
      blockedByDefault: ['Нет блокировок'],
      howToOpen: 'Все порты доступны. Есть панель firewall.',
      antiDdos: 'Включена защита от DDoS-атак.',
      nuances: [
        'Крупная компания с хорошей репутацией',
        'Удобно, если домены уже зарегистрированы там',
        'VPN работает без ограничений',
        'Цены средние по рынку',
        'Поддержка 24/7'
      ],
      source: 'https://www.reg.ru/cloud/vps'
    }
  },
  {
    id: 'selectel',
    name: 'Selectel',
    priceFrom: '350 руб/мес',
    blockedPorts: 'Нет блокировок по умолчанию',
    hasFirewallPanel: true,
    canOpenViaSupport: true,
    vpnSuitable: 'yes',
    docsUrl: 'https://selectel.ru/services/cloud/servers/',
    siteUrl: 'https://selectel.ru',
    details: {
      description: 'Облачная платформа для бизнеса. Виртуальные серверы на базе KVM. Высокая производительность, SLA.',
      blockedByDefault: ['Нет блокировок'],
      howToOpen: 'Все порты доступны. Настройка через Security Groups в панели.',
      antiDdos: 'Продвинутая защита от DDoS включена.',
      nuances: [
        'Высокое качество инфраструктуры',
        'SLA 99.9%',
        'VPN работает без ограничений',
        'Цены выше среднего — ориентирован на бизнес',
        'Security Groups — гибкая настройка сетевых правил'
      ],
      source: 'https://selectel.ru/services/cloud/servers/'
    }
  },
  {
    id: 'cloud-ru',
    name: 'Cloud.ru (SberCloud)',
    priceFrom: '400 руб/мес',
    blockedPorts: 'Security Groups — по умолчанию закрыто всё',
    hasFirewallPanel: true,
    canOpenViaSupport: true,
    vpnSuitable: 'conditional',
    docsUrl: 'https://cloud.ru/ru/docs/',
    siteUrl: 'https://cloud.ru',
    details: {
      description: 'Облачная платформа от Сбера. Корпоративный уровень инфраструктуры. По умолчанию Security Groups блокируют все входящие соединения кроме SSH.',
      blockedByDefault: ['Все порты кроме 22 (SSH)'],
      howToOpen: 'Через Security Groups в консоли. Добавить правило: разрешить UDP 51820 (WireGuard) или UDP 500+4500 (IKEv2) или TCP 443 (OpenVPN).',
      antiDdos: 'Включена защита уровня L3/L4.',
      nuances: [
        'Нужно вручную открыть порты через Security Groups',
        'Интерфейс сложный для новичка',
        'VPN работает после правильной настройки Security Groups',
        'Ориентирован на корпоративных клиентов',
        'Есть бесплатный пробный период'
      ],
      source: 'https://cloud.ru/ru/docs/vpc/ug/topics/sg_rules.html'
    }
  }
];

export function getHost(id: string): Host | undefined {
  return hosts.find(h => h.id === id);
}
