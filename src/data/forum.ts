export interface ForumReply {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface ForumThread {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  content: string;
  replies: ForumReply[];
  tags: string[];
}

export const categories = ['Хостинги', 'WireGuard', 'IKEv2', 'OpenVPN', 'Диагностика'];

export const threads: ForumThread[] = [
  {
    id: '1',
    title: 'AdminVPS блокирует все порты кроме SSH',
    category: 'Хостинги',
    author: 'dmitry_dev',
    date: '2024-11-15',
    content: 'Арендовал VPS на AdminVPS, пытаюсь настроить WireGuard. Порт 51820 UDP не отвечает. Пробовал открывать через iptables — не помогает. В панели управления нет раздела firewall. Кто сталкивался, как открыть порты?',
    tags: ['adminvps', 'firewall', 'wireguard'],
    replies: [
      {
        id: 'r1',
        author: 'net_admin',
        date: '2024-11-15',
        content: 'AdminVPS блокирует порты на уровне хостинга, а не на самом сервере. Ваши iptables-правила работают внутри VPS, но внешний firewall хостинга их перекрывает. Нужно писать тикет в поддержку с просьбой открыть UDP 51820. Обычно отвечают в течение нескольких часов. Укажите: порт 51820, протокол UDP, назначение — WireGuard VPN.'
      },
      {
        id: 'r2',
        author: 'sysop',
        date: '2024-11-16',
        content: 'Подтверждаю. У AdminVPS нет панели firewall. Все изменения — через тикеты. Совет: при заказе VPS сразу напишите в поддержку, какие порты вам нужны. Так быстрее. Для IKEv2 нужно два порта: UDP 500 и UDP 4500.'
      }
    ]
  },
  {
    id: '2',
    title: 'IKEv2 не поднимается — charon падает при старте',
    category: 'IKEv2',
    author: 'alex_k',
    date: '2024-11-12',
    content: 'Настраиваю strongSwan по гайду. При запуске ipsec start в логах: "no private key found for RSA certificate". Сертификат Let\'s Encrypt получен, файл существует. В чём может быть проблема?',
    tags: ['ikev2', 'strongswan', 'certificates'],
    replies: [
      {
        id: 'r3',
        author: 'vpn_engineer',
        date: '2024-11-12',
        content: 'Проблема в том, что strongSwan ожидает приватный ключ в формате, совместимом с его внутренним API. Let\'s Encrypt выдаёт ключ в формате PKCS#8, а strongSwan иногда не может его прочитать. Попробуйте конвертировать: openssl rsa -in /etc/letsencrypt/live/domain/privkey.pem -out /etc/ipsec.d/private/server.key. Затем укажите путь к новому файлу в ipsec.secrets.'
      },
      {
        id: 'r4',
        author: 'linux_guru',
        date: '2024-11-13',
        content: 'Ещё проверьте права на файл приватного ключа. charon должен иметь доступ на чтение: chmod 640 /etc/letsencrypt/live/*/privkey.pem && chown root:root /etc/letsencrypt/live/*/privkey.pem. Также убедитесь, что в ipsec.conf leftcert указывает на fullchain.pem, а не на cert.pem.'
      }
    ]
  },
  {
    id: '3',
    title: 'WireGuard подключается, но интернета нет',
    category: 'WireGuard',
    author: 'marina_s',
    date: '2024-11-10',
    content: 'WireGuard установлен через wg-easy. Клиент подключается успешно, пинг до сервера идёт, но сайты не открываются. IP-адрес не меняется на серверный. Настройки по умолчанию из docker-compose.',
    tags: ['wireguard', 'nat', 'routing'],
    replies: [
      {
        id: 'r5',
        author: 'docker_pro',
        date: '2024-11-10',
        content: 'Типичная проблема с wg-easy в Docker. Контейнер не может делать NAT для трафика клиентов. Проверьте, что в docker-compose.yml указаны sysctls: net.ipv4.ip_forward=1 и net.ipv4.conf.all.src_valid_mark=1. Также добавьте в конфиг WireGuard (в веб-интерфейсе wg-easy) PostUp и PostDown правила для iptables. В новых версиях wg-easy это делается автоматически.'
      },
      {
        id: 'r6',
        author: 'net_admin',
        date: '2024-11-11',
        content: 'Проверьте из контейнера: docker exec wg-easy sysctl net.ipv4.ip_forward. Должно быть 1. Если 0 — добавьте sysctls в docker-compose.yml и пересоздайте контейнер: docker compose down && docker compose up -d. Также проверьте, что AllowedIPs = 0.0.0.0/0 в клиентском конфиге — это направляет весь трафик через VPN.'
      }
    ]
  },
  {
    id: '4',
    title: 'Как проверить блокировку порта хостером',
    category: 'Диагностика',
    author: 'beginner_42',
    date: '2024-11-08',
    content: 'Настроил OpenVPN на порту 443 TCP. С сервера порт слушается (ss показывает), но снаружи не отвечает. Как понять, блокирует ли это хостинг или проблема в firewall на сервере?',
    tags: ['diagnostics', 'firewall', 'ports'],
    replies: [
      {
        id: 'r7',
        author: 'sysop',
        date: '2024-11-08',
        content: 'Пошаговая диагностика: 1) На сервере: ss -tlnp | grep 443 — порт слушается. 2) На сервере: ufw status — порт не заблокирован локально. 3) С ДРУГОГО сервера (не с вашего компьютера): nc -zv server-ip 443. Если не отвечает — блокирует хостинг. 4) Альтернатива: с другого VPS выполните curl -v telnet://server-ip:443 --connect-timeout 5. Если timeout — хостинг блокирует.'
      },
      {
        id: 'r8',
        author: 'vpn_engineer',
        date: '2024-11-09',
        content: 'Дополню: можно использовать tcpdump на сервере для проверки, доходят ли пакеты: tcpdump -i eth0 port 443 -n. Запустите эту команду и попробуйте подключиться снаружи. Если пакеты видны в tcpdump, но сервис не отвечает — проблема в iptables. Если пакетов нет вообще — хостинг блокирует на уровне сети.'
      }
    ]
  },
  {
    id: '5',
    title: 'Timeweb Cloud — всё работает из коробки',
    category: 'Хостинги',
    author: 'happy_user',
    date: '2024-11-05',
    content: 'Взял VPS на Timeweb Cloud для WireGuard. Все порты открыты по умолчанию, ничего открывать не пришлось. Настроил wg-easy за 15 минут. Может, кому пригодится — рекомендую для VPN этот хостинг, если не хотите возиться с поддержкой.',
    tags: ['timeweb', 'wireguard', 'review'],
    replies: [
      {
        id: 'r9',
        author: 'moderator',
        date: '2024-11-05',
        content: 'Спасибо за отзыв. Подтверждаю: Timeweb Cloud не блокирует порты по умолчанию. Это один из немногих хостингов, где VPN работает сразу после установки. Единственный нюанс — при DDoS-атаке могут временно null-маршрутизировать IP.'
      }
    ]
  },
  {
    id: '6',
    title: 'OpenVPN на TCP 443 — скорость очень низкая',
    category: 'OpenVPN',
    author: 'speed_tester',
    date: '2024-11-03',
    content: 'Настроил OpenVPN на TCP 443 по гайду. Скорость — максимум 5 Мбит/с. На том же сервере WireGuard даёт 100+ Мбит/с. Это нормально для TCP 443 или можно ускорить?',
    tags: ['openvpn', 'performance', 'tcp'],
    replies: [
      {
        id: 'r10',
        author: 'vpn_engineer',
        date: '2024-11-03',
        content: 'Это известная проблема — TCP over TCP (TCP meltdown). OpenVPN по TCP инкапсулирует TCP-трафик в TCP, что вызывает конфликты ретрансмиссий. Решения: 1) Переключитесь на WireGuard (UDP) — он решает эту проблему архитектурно. 2) Если нужен именно OpenVPN, используйте UDP-порт (1194 или любой другой). 3) Добавьте в server.conf: mssfix 1300 и fragment 1300 — это уменьшит MTU и снизит количество фрагментации.'
      },
      {
        id: 'r11',
        author: 'net_admin',
        date: '2024-11-04',
        content: 'TCP 443 имеет смысл только когда UDP полностью заблокирован. Если ваша цель — просто обойти блокировки сайтов, WireGuard на UDP 51820 будет быстрее. Если нужна маскировка под HTTPS — рассмотрите вариант с Shadowsocks или V2Ray, они решают эту задачу эффективнее.'
      }
    ]
  },
  {
    id: '7',
    title: 'Aeza — можно ли использовать для WireGuard',
    category: 'Хостинги',
    author: 'choice_maker',
    date: '2024-10-30',
    content: 'Выбираю хостинг для WireGuard. Смотрю на Aeza — цены привлекательные, есть локация в Нидерландах. Кто использовал для VPN? Есть ли ограничения по портам?',
    tags: ['aeza', 'wireguard', 'choice'],
    replies: [
      {
        id: 'r12',
        author: 'aeza_user',
        date: '2024-10-30',
        content: 'Использую Aeza уже полгода для WireGuard и IKEv2. Порты не блокируются, всё работает сразу. Брал в Нидерландах — пинг из Москвы около 40 мс, скорость стабильная. Единственный минус — поддержка отвечает не мгновенно, но и не сутками. Для VPN рекомендую.'
      }
    ]
  },
  {
    id: '8',
    title: 'IKEv2 на iOS — ошибка "Конфигурация VPN отклонена"',
    category: 'IKEv2',
    author: 'iphone_user',
    date: '2024-10-28',
    content: 'Настраиваю IKEv2 на iPhone. Сервер работает, Android подключается без проблем. На iOS при подключении пишет "Конфигурация VPN отклонена сервером. Проверьте настройки и попробуйте снова". Что не так?',
    tags: ['ikev2', 'ios', 'connection'],
    replies: [
      {
        id: 'r13',
        author: 'vpn_engineer',
        date: '2024-10-28',
        content: 'iOS очень требователен к параметрам IKEv2. Типичные причины: 1) Remote ID в настройках iPhone должен точно совпадать с leftid в ipsec.conf (домен sslip.io). 2) Сертификат должен содержать SAN (Subject Alternative Name) с этим доменом. 3) Проверьте, что rightauth = eap-mschapv2, а не eap-radius или что-то другое. 4) IKEv2 на iOS не поддерживает все алгоритмы — убедитесь, что strongSwan использует IKEv2 (не IKEv1).'
      },
      {
        id: 'r14',
        author: 'apple_admin',
        date: '2024-10-29',
        content: 'Дополню: на iOS обязательно укажите Local ID пустым или совпадающим с Remote ID. Также проверьте, что в ipsec.conf есть ike=aes256-sha256-modp2048 и esp=aes256-sha256. iOS не поддерживает все алгоритмы по умолчанию. И самое частое — Remote ID должен быть доменом, а не IP-адресом.'
      }
    ]
  },
  {
    id: '9',
    title: 'Cloud.ru Security Groups — не могу открыть UDP',
    category: 'Хостинги',
    author: 'cloud_newbie',
    date: '2024-10-25',
    content: 'Взял VPS на Cloud.ru (SberCloud). Пытаюсь настроить WireGuard. В Security Groups создал правило на UDP 51820, но порт всё равно не отвечает. Что я делаю не так?',
    tags: ['cloud-ru', 'security-groups', 'wireguard'],
    replies: [
      {
        id: 'r15',
        author: 'cloud_expert',
        date: '2024-10-25',
        content: 'В Cloud.ru Security Groups привязываются к конкретному серверу, а не к аккаунту. Проверьте, что ваше правило применено к правильной Security Group, и эта группа привязана к вашему инстансу. Также убедитесь, что Direction = Ingress, Protocol = UDP, Port range = 51820-51820, Source = 0.0.0.0/0. После изменения правил может потребоваться 1-2 минуты на применение.'
      }
    ]
  },
  {
    id: '10',
    title: 'WireGuard — как ограничить скорость для клиента',
    category: 'WireGuard',
    author: 'bandwidth_mgr',
    date: '2024-10-22',
    content: 'Использую wg-easy, раздаю VPN друзьям. Некоторые качают торренты и забивают весь канал. Как ограничить скорость для отдельных клиентов?',
    tags: ['wireguard', 'bandwidth', 'wgeasy'],
    replies: [
      {
        id: 'r16',
        author: 'linux_guru',
        date: '2024-10-22',
        content: 'WireGuard сам по себе не поддерживает ограничение скорости. Варианты: 1) Используйте tc (traffic control) на интерфейсе wg0: tc qdisc add dev wg0 root tbf rate 10mbit burst 32kbit latency 400ms. 2) Используйте iptables с модулем hashlimit. 3) Если клиенты получают разные IP из пула, можно настроить tc per-IP через u32 filter. Самый простой вариант — tc на весь интерфейс.'
      }
    ]
  },
  {
    id: '11',
    title: 'FirstVDS — стабильность и VPN',
    category: 'Хостинги',
    author: 'vds_reviewer',
    date: '2024-10-20',
    content: 'Кто пользуется FirstVDS для VPN? Интересует стабильность — были ли отключения, проблемы с сетью. Порты не блокируют, это понятно. А как с аптаймом?',
    tags: ['firstvds', 'stability', 'review'],
    replies: [
      {
        id: 'r17',
        author: 'longtime_user',
        date: '2024-10-20',
        content: 'Пользуюсь FirstVDS два года. Аптайм примерно 99.5% — было пара плановых перезагрузок и один раз сетевые проблемы на 2 часа. Для личного VPN этого достаточно. Сервер на KVM, ресурсы не шарятся с соседями (в отличие от OpenVZ). За свои деньги — нормально.'
      }
    ]
  },
  {
    id: '12',
    title: 'tcpdump показывает пакеты, но VPN не работает',
    category: 'Диагностика',
    author: 'debug_master',
    date: '2024-10-18',
    content: 'Настраиваю IKEv2. tcpdump на сервере показывает входящие UDP 500 пакеты от клиента, но charon не отвечает. В логах strongSwan тишина. Что может быть?',
    tags: ['diagnostics', 'ikev2', 'tcpdump'],
    replies: [
      {
        id: 'r18',
        author: 'vpn_engineer',
        date: '2024-10-18',
        content: 'Если tcpdump видит пакеты, но charon молчит — значит, пакеты не доходят до приложения. Проверьте: 1) iptables -L INPUT -n — нет ли правила DROP перед ACCEPT для UDP 500. 2) Может быть fail2ban блокирует IP клиента: fail2ban-client status strongswan. 3) Проверьте, что charon слушает правильный интерфейс: ipsec statusall. 4) Попробуйте увеличить лог: charondebug = \"ike 2, knl 2, cfg 2, net 2\" в ipsec.conf.'
      }
    ]
  },
  {
    id: '13',
    title: 'Selectel vs Timeweb Cloud для VPN',
    category: 'Хостинги',
    author: 'comparing_host',
    date: '2024-10-15',
    content: 'Выбираю между Selectel и Timeweb Cloud для VPN-сервера. Оба не блокируют порты. В чём реальная разница? Стоит ли переплачивать за Selectel?',
    tags: ['selectel', 'timeweb', 'comparison'],
    replies: [
      {
        id: 'r19',
        author: 'infra_architect',
        date: '2024-10-15',
        content: 'Для личного VPN разницы практически нет. Оба не блокируют порты, оба работают стабильно. Selectel дороже, но предлагает SLA 99.9%, лучшую анти-DDoS и более мощное железо. Если вам нужен VPN для 3-5 устройств — берите Timeweb Cloud, сэкономите. Selectel имеет смысл для корпоративных задач или если важна максимальная надёжность.'
      }
    ]
  },
  {
    id: '14',
    title: 'OpenVPN — как сгенерировать новый сертификат сервера',
    category: 'OpenVPN',
    author: 'cert_renewer',
    date: '2024-10-12',
    content: 'Сертификат сервера OpenVPN истекает через месяц. Как продлить или перегенерировать? Скрипт Nyr использовал easy-rsa.',
    tags: ['openvpn', 'certificates', 'easy-rsa'],
    replies: [
      {
        id: 'r20',
        author: 'security_admin',
        date: '2024-10-12',
        content: 'Для продления через easy-rsa: 1) cd /etc/openvpn/easy-rsa/ 2) source ./vars 3) ./easyrsa renew server 4) ./easyrsa gen-crl 5) Скопируйте новый сертификат: cp pki/issued/server.crt /etc/openvpn/ 6) systemctl restart openvpn@server. Клиенты не нужно перенастраивать — их сертификаты привязаны к CA, а не к серверному сертификату. Но если CA тоже истекает — придётся перегенерировать всё и раздать новые .ovpn файлы.'
      }
    ]
  },
  {
    id: '15',
    title: 'WireGuard — MTU и проблемы с некоторыми сайтами',
    category: 'WireGuard',
    author: 'mtu_debugger',
    date: '2024-10-10',
    content: 'WireGuard работает, но некоторые сайты не грузятся или грузятся частично. Google открывается, а вот некоторые тяжёлые сайты — нет. Подозреваю проблему с MTU.',
    tags: ['wireguard', 'mtu', 'networking'],
    replies: [
      {
        id: 'r21',
        author: 'net_admin',
        date: '2024-10-10',
        content: 'Классическая проблема MTU. WireGuard добавляет заголовок 80 байт к пакету. Если ваш ISP отправляет пакеты с MTU 1500, то через WireGuard эффективный MTU = 1500 - 80 = 1420. Добавьте в конфиг клиента: MTU = 1360 (с запасом). В wg-easy это можно указать в настройках интерфейса. Также на сервере: ip link set wg0 mtu 1360. Проверьте: ping -M do -s 1360 google.com — если не проходит, уменьшайте до 1280.'
      }
    ]
  },
  {
    id: '16',
    title: 'Beget VPS — опыт использования для IKEv2',
    category: 'Хостинги',
    author: 'beget_tester',
    date: '2024-10-08',
    content: 'Кто настраивал IKEv2 на VPS от Beget? Есть ли нюансы? Порты не блокируют?',
    tags: ['beget', 'ikev2', 'experience'],
    replies: [
      {
        id: 'r22',
        author: 'beget_user',
        date: '2024-10-08',
        content: 'Настраивал IKEv2 на Beget — всё работает. Порты UDP 500 и 4500 открыты по умолчанию. Панель управления удобная, есть firewall если нужно закрыть что-то. Поддержка отвечает в течение часа. Единственное — цены выше среднего. Тариф от 250 руб/мес для базового VPS.'
      }
    ]
  },
  {
    id: '17',
    title: 'Как проверить, что трафик реально идёт через VPN',
    category: 'Диагностика',
    author: 'paranoid_user',
    date: '2024-10-05',
    content: 'VPN подключен, но как убедиться, что трафик действительно идёт через сервер, а не напрямую? IP-чекеры показывают IP сервера, но хочу убедиться на 100%.',
    tags: ['diagnostics', 'verification', 'privacy'],
    replies: [
      {
        id: 'r23',
        author: 'security_admin',
        date: '2024-10-05',
        content: 'Комплексная проверка: 1) IP-адрес: 2ip.ru или ifconfig.me — должен показать IP сервера. 2) DNS утечки: dnsleaktest.com — все DNS-запросы должны идти через сервер. 3) WebRTC утечки: browserleaks.com/webrtc — WebRTC не должен показывать реальный IP. 4) На уровне ОС: traceroute to google.com — маршрут должен начинаться с вашего VPN-сервера. 5) На сервере: tcpdump -i eth0 host client-ip — вы должны видеть трафик клиента.'
      }
    ]
  },
  {
    id: '18',
    title: 'IKEv2 — strongSwan + Let\'s Encrypt, sslip.io не резолвится',
    category: 'IKEv2',
    author: 'dns_issue',
    date: '2024-10-03',
    content: 'Пытаюсь получить сертификат Let\'s Encrypt для домена вида X.X.X.X.sslip.io. certbot выдаёт ошибку — домен не резолвится в IP моего сервера. Но вручную dig показывает правильный IP.',
    tags: ['ikev2', 'letsencrypt', 'sslip', 'dns'],
    replies: [
      {
        id: 'r24',
        author: 'vpn_engineer',
        date: '2024-10-03',
        content: 'sslip.io работает, но есть нюанс: Let\'s Encrypt проверяет домен с нескольких серверов, и некоторые из них могут кэшировать DNS. Попробуйте: 1) Убедитесь, что формат правильный: именно IP с точками, затем .sslip.io (например, 185.100.50.25.sslip.io). 2) Проверьте: dig +short 185.100.50.25.sslip.io @8.8.8.8 — должен вернуть IP. 3) Если certbot --standalone не работает, попробуйте --webroot с nginx. 4) Альтернатива: duckdns.org — бесплатный домен с нормальным DNS.'
      }
    ]
  },
  {
    id: '19',
    title: 'VDSina — firewall в панели не работает для UDP',
    category: 'Хостинги',
    author: 'vdsina_user',
    date: '2024-10-01',
    content: 'На VDSina в панели firewall добавил правило разрешить UDP 51820, но WireGuard всё равно не работает. TCP порты открываются нормально, а UDP — нет. Баг или фича?',
    tags: ['vdsina', 'firewall', 'udp'],
    replies: [
      {
        id: 'r25',
        author: 'vdsina_support_fan',
        date: '2024-10-01',
        content: 'На VDSina все порты открыты по умолчанию — firewall в панели нужен только для ЗАКРЫТИЯ портов, а не для открытия. Если WireGuard не работает, проблема не в firewall хостинга. Проверьте: 1) UFW на сервере: ufw allow 51820/udp. 2) Docker проброс портов: docker compose ps — порт 51820/udp должен быть маппингован. 3) Проверьте с другого сервера: nc -zvu ваш-ip 51820.'
      }
    ]
  },
  {
    id: '20',
    title: 'WireGuard vs IKEv2 vs OpenVPN — что выбрать в 2024',
    category: 'Диагностика',
    author: 'protocol_chooser',
    date: '2024-09-28',
    content: 'Нужно настроить VPN для себя и семьи (5 устройств: 2 iPhone, 1 Android, 2 Windows). Какой протокол выбрать? Критерии: скорость, стабильность, простота настройки, обход блокировок.',
    tags: ['comparison', 'wireguard', 'ikev2', 'openvpn'],
    replies: [
      {
        id: 'r26',
        author: 'vpn_engineer',
        date: '2024-09-28',
        content: 'Для вашего случая — WireGuard. Обоснование: 1) Скорость — WireGuard быстрее IKEv2 и OpenVPN за счёт современного криптографического стека. 2) Простота — wg-easy даёт веб-интерфейс с QR-кодами для телефонов. 3) Стабильность — быстрый reconnection при смене сети (важно для мобильных). 4) iPhone и Android — нативная поддержка WireGuard. Единственный минус — UDP может быть заблокирован в некоторых сетях (корпоративные Wi-Fi, аэропорты). Если это критично — настройте IKEv2 как fallback на TCP 443.'
      },
      {
        id: 'r27',
        author: 'net_admin',
        date: '2024-09-29',
        content: 'Дополню: если нужен один протокол — WireGuard. Если нужна максимальная совместимость — IKEv2 (встроен в iOS, macOS, Windows без дополнительных приложений). OpenVPN имеет смысл только если нужно маскировать трафик под HTTPS (TCP 443). Для 5 устройств WireGuard + wg-easy — оптимальный выбор. Настройка займёт 20 минут.'
      }
    ]
  }
];

export function getThread(id: string): ForumThread | undefined {
  return threads.find(t => t.id === id);
}

export function getThreadsByCategory(category: string): ForumThread[] {
  return threads.filter(t => t.category === category);
}
