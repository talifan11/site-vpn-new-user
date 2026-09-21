export interface GuideSection {
  id: string;
  title: string;
  content: string;
  code?: { lang: string; code: string; note?: string }[];
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  protocol: string;
  difficulty: string;
  time: string;
  os: string;
  sections: GuideSection[];
  troubleshooting: { problem: string; solution: string }[];
}

export const guides: Guide[] = [
  {
    id: 'wireguard',
    title: 'WireGuard через wg-easy',
    description: 'Установка WireGuard с веб-интерфейсом для управления клиентами. Генерация QR-кодов для мобильных устройств.',
    protocol: 'WireGuard',
    difficulty: 'Средний',
    time: '15-20 минут',
    os: 'Ubuntu 22.04',
    sections: [
      {
        id: 'prerequisites',
        title: 'Подготовка сервера',
        content: 'Подключаемся к серверу по SSH. Обновляем пакеты и проверяем, что ядро поддерживает WireGuard (в Ubuntu 22.04 поддержка встроена).',
        code: [
          { lang: 'bash', code: 'ssh root@your-server-ip', note: 'Замените your-server-ip на реальный IP-адрес сервера' },
          { lang: 'bash', code: 'apt update && apt upgrade -y' },
          { lang: 'bash', code: 'uname -r', note: 'Версия ядра должна быть 5.6 или выше' }
        ]
      },
      {
        id: 'check-port',
        title: 'Проверка порта',
        content: 'WireGuard по умолчанию использует UDP 51820. Убедитесь, что порт не заблокирован хостингом. Если хостинг блокирует порты — откройте UDP 51820 через поддержку или панель firewall.',
        code: [
          { lang: 'bash', code: '# С локальной машины проверяем доступность порта:\nnc -zvu your-server-ip 51820', note: 'Если порт закрыт — обратитесь к документации хостинга' }
        ]
      },
      {
        id: 'install-docker',
        title: 'Установка Docker',
        content: 'wg-easy работает в контейнере Docker. Устанавливаем Docker и Docker Compose.',
        code: [
          { lang: 'bash', code: 'curl -fsSL https://get.docker.com | sh' },
          { lang: 'bash', code: 'docker --version', note: 'Проверяем установку' }
        ]
      },
      {
        id: 'configure-wgeasy',
        title: 'Настройка wg-easy',
        content: 'Создаём директорию для конфигурации и docker-compose.yml. WG_HOST — внешний IP сервера. PASSWORD_HASH — хеш пароля для веб-интерфейса.',
        code: [
          { lang: 'bash', code: 'mkdir -p /opt/wg-easy && cd /opt/wg-easy' },
          {
            lang: 'yaml',
            code: `cat > docker-compose.yml << 'EOF'
services:
  wg-easy:
    image: ghcr.io/wg-easy/wg-easy
    container_name: wg-easy
    environment:
      - LANG=ru
      - WG_HOST=your-server-ip
      - PASSWORD_HASH=$2a$12$Xo2exampleHashReplaceWithReal
      - PORT=51821
      - WG_PORT=51820
    volumes:
      - ./config:/etc/wireguard
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1
    restart: unless-stopped
EOF`,
            note: 'Замените your-server-ip на реальный IP. Для генерации хеша пароля: docker run --rm ghcr.io/wg-easy/wg-easy wgpw your-password'
          }
        ]
      },
      {
        id: 'start',
        title: 'Запуск',
        content: 'Запускаем контейнер и проверяем статус.',
        code: [
          { lang: 'bash', code: 'docker compose up -d' },
          { lang: 'bash', code: 'docker compose logs -f', note: 'Смотрим логи. Нажмите Ctrl+C для выхода' },
          { lang: 'bash', code: 'docker compose ps', note: 'Контейнер должен быть в статусе Up' }
        ]
      },
      {
        id: 'firewall',
        title: 'Настройка firewall (UFW)',
        content: 'Если на сервере активен UFW, открываем нужные порты.',
        code: [
          { lang: 'bash', code: 'ufw allow 51820/udp\nufw allow 51821/tcp\nufw allow 22/tcp\nufw enable' },
          { lang: 'bash', code: 'ufw status', note: 'Проверяем правила' }
        ]
      },
      {
        id: 'connect',
        title: 'Подключение клиента',
        content: 'Открываем веб-интерфейс wg-easy в браузере. Создаём клиента, скачиваем конфигурацию или сканируем QR-код.',
        code: [
          { lang: 'text', code: 'http://your-server-ip:51821', note: 'Веб-интерфейс wg-easy. Введите пароль, заданный при настройке.' },
          { lang: 'text', code: 'Нажмите "New" для создания клиента. Откроется QR-код и ссылка на скачивание .conf файла.' }
        ]
      },
      {
        id: 'mobile',
        title: 'Подключение телефона',
        content: 'Устанавливаем приложение WireGuard. Сканируем QR-код из веб-интерфейса. Подключаемся.',
        code: [
          { lang: 'text', code: 'iOS: App Store -> WireGuard\nAndroid: Google Play -> WireGuard\n\n1. Откройте приложение WireGuard\n2. Нажмите "+" -> "Создать из QR-кода"\n3. Отсканируйте QR-код из веб-интерфейса wg-easy\n4. Нажмите "Подключить"' }
        ]
      }
    ],
    troubleshooting: [
      {
        problem: 'Клиент подключается, но интернета нет',
        solution: 'Проверьте IP-форвардинг: sysctl net.ipv4.ip_forward (должно быть 1). Проверьте NAT: iptables -t nat -L POSTROUTING — должна быть маскарадная запись для wg0. Перезапустите контейнер: docker compose restart.'
      },
      {
        problem: 'Порт 51820 недоступен',
        solution: 'Проверьте firewall хостинга. Если хостинг блокирует UDP-порты — обратитесь в поддержку. Проверьте локальный firewall: ufw status. Убедитесь, что контейнер запущен: docker compose ps.'
      },
      {
        problem: 'Веб-интерфейс не открывается',
        solution: 'Порт 51821 должен быть открыт. Проверьте: ufw allow 51821/tcp. Убедитесь, что контейнер запущен. Проверьте логи: docker compose logs wg-easy.'
      },
      {
        problem: 'QR-код не сканируется',
        solution: 'Скачайте .conf файл вручную и импортируйте в приложение WireGuard через "Импорт из файла". Убедитесь, что WG_HOST в конфиге содержит правильный IP.'
      },
      {
        problem: 'Подключение нестабильное, обрывается',
        solution: 'Добавьте PersistentKeepalive в конфиг клиента: PersistentKeepalive = 25. В wg-easy это настраивается автоматически. Проверьте MTU: если подключение через мобильную сеть, попробуйте mtu = 1360.'
      }
    ]
  },
  {
    id: 'ikev2',
    title: 'IKEv2 через strongSwan',
    description: 'Установка IKEv2 с EAP-MSCHAPv2 аутентификацией. Сертификаты Let\'s Encrypt через sslip.io. Нативная поддержка на iOS, Android, Windows, macOS.',
    protocol: 'IKEv2',
    difficulty: 'Сложный',
    time: '30-40 минут',
    os: 'Ubuntu 22.04',
    sections: [
      {
        id: 'prerequisites',
        title: 'Подготовка',
        content: 'IKEv2 использует UDP 500 и UDP 4500. Оба порта должны быть открыты. Для сертификатов нужен домен — используем sslip.io (бесплатный wildcard-сервис), который мапит IP в домен.',
        code: [
          { lang: 'bash', code: 'ssh root@your-server-ip' },
          { lang: 'bash', code: 'apt update && apt upgrade -y' },
          {
            lang: 'bash',
            code: '# Проверяем порты с другого сервера:\nnc -zvu your-server-ip 500\nnc -zvu your-server-ip 4500',
            note: 'Оба порта должны отвечать. Если нет — откройте через хостинг.'
          }
        ]
      },
      {
        id: 'install-strongswan',
        title: 'Установка strongSwan',
        content: 'Устанавливаем strongSwan и необходимые плагины для EAP-аутентификации.',
        code: [
          { lang: 'bash', code: 'apt install strongswan strongswan-pki libstrongswan-extra-plugins libcharon-extra-plugins -y' }
        ]
      },
      {
        id: 'domain-sslip',
        title: 'Домен через sslip.io',
        content: 'sslip.io автоматически резолвит любой поддомен вида X.X.X.X.sslip.io в IP X.X.X.X. Это позволяет получить валидный сертификат Let\'s Encrypt без покупки домена.',
        code: [
          { lang: 'bash', code: '# Ваш домен будет:\n# your-server-ip.sslip.io\n# Например, для IP 185.100.50.25:\n# 185.100.50.25.sslip.io\n\n# Проверяем резолв:\ndig +short your-server-ip.sslip.io', note: 'Должен вернуть ваш IP-адрес' }
        ]
      },
      {
        id: 'certificates',
        title: 'Получение сертификатов Let\'s Encrypt',
        content: 'Для IKEv2 нужен сертификат. Устанавливаем certbot и получаем сертификат. IKEv2 использует сертификат в формате PEM.',
        code: [
          { lang: 'bash', code: 'apt install certbot -y' },
          {
            lang: 'bash',
            code: 'certbot certonly --standalone -d your-server-ip.sslip.io',
            note: 'Замените your-server-ip на реальный IP. Сертификат будет в /etc/letsencrypt/live/'
          },
          { lang: 'bash', code: 'ls /etc/letsencrypt/live/your-server-ip.sslip.io/' }
        ]
      },
      {
        id: 'ipsec-conf',
        title: 'Конфигурация ipsec.conf',
        content: 'Основной конфигурационный файл strongSwan. Настраиваем IKEv2 с EAP-MSCHAPv2.',
        code: [
          {
            lang: 'text',
            code: `cat > /etc/ipsec.conf << 'EOF'
config setup
    charondebug = "ike 1, knl 1, cfg 0"
    uniqueids = no

conn ikev2-vpn
    auto = add
    compress = no
    type = tunnel
    keyexchange = ikev2
    fragmentation = yes
    dpdaction = restart
    dpddelay = 35s
    rekey = no
    left = %any
    leftid = your-server-ip.sslip.io
    leftcert = /etc/letsencrypt/live/your-server-ip.sslip.io/fullchain.pem
    leftsendcert = always
    leftsubnet = 0.0.0.0/0
    right = %any
    rightid = %any
    rightauth = eap-mschapv2
    rightsourceip = 10.10.10.0/24
    rightdns = 1.1.1.1,1.0.0.1
    rightsendcert = never
    eap_identity = %any
EOF`,
            note: 'Замените your-server-ip.sslip.io на ваш реальный домен sslip.io'
          }
        ]
      },
      {
        id: 'ipsec-secrets',
        title: 'Конфигурация ipsec.secrets',
        content: 'Файл с секретами. Указываем путь к приватному ключу и добавляем пользователей.',
        code: [
          {
            lang: 'text',
            code: `cat > /etc/ipsec.secrets << 'EOF'
: RSA /etc/letsencrypt/live/your-server-ip.sslip.io/privkey.pem
username1 : EAP "password1"
username2 : EAP "password2"
EOF`,
            note: 'Замените username и password на свои. Можно добавить сколько угодно пользователей.'
          },
          { lang: 'bash', code: 'chmod 600 /etc/ipsec.secrets' }
        ]
      },
      {
        id: 'kernel-params',
        title: 'Параметры ядра',
        content: 'Включаем IP-форвардинг и настраиваем NAT для VPN-трафика.',
        code: [
          { lang: 'bash', code: 'echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf\necho "net.ipv4.conf.all.accept_redirects = 0" >> /etc/sysctl.conf\necho "net.ipv4.conf.all.send_redirects = 0" >> /etc/sysctl.conf\nsysctl -p' },
          {
            lang: 'bash',
            code: `# Настраиваем NAT — узнаём имя интерфейса:\nip route show default\n# Обычно это eth0 или ens3\n\n# Добавляем правило NAT:\niptables -t nat -A POSTROUTING -s 10.10.10.0/24 -o eth0 -m policy --dir out --pol ipsec -j ACCEPT\niptables -t nat -A POSTROUTING -s 10.10.10.0/24 -o eth0 -j MASQUERADE`,
            note: 'Замените eth0 на ваш реальный сетевой интерфейс'
          },
          { lang: 'bash', code: 'apt install iptables-persistent -y\nnetfilter-persistent save', note: 'Сохраняем правила iptables между перезагрузками' }
        ]
      },
      {
        id: 'start-charon',
        title: 'Запуск strongSwan',
        content: 'Запускаем демон charon и проверяем статус.',
        code: [
          { lang: 'bash', code: 'ipsec restart' },
          { lang: 'bash', code: 'ipsec statusall', note: 'Должна показать conn ikev2-vpn в статусе ROUTED' },
          { lang: 'bash', code: 'journalctl -u strongswan -f', note: 'Логи в реальном времени. Ctrl+C для выхода' }
        ]
      },
      {
        id: 'connect-clients',
        title: 'Подключение клиентов',
        content: 'Настраиваем VPN-подключение на разных платформах.',
        code: [
          {
            lang: 'text',
            code: `iOS / macOS:
  Настройки -> VPN -> Добавить конфигурацию VPN
  Тип: IKEv2
  Описание: MyVPN
  Сервер: your-server-ip.sslip.io
  Remote ID: your-server-ip.sslip.io
  Local ID: (оставить пустым)
  Аутентификация: Имя пользователя
  Имя пользователя: username1
  Пароль: password1

Windows 10/11:
  Параметры -> Сеть и Интернет -> VPN -> Добавить
  Поставщик VPN: Windows (встроенный)
  Имя соединения: MyVPN
  Имя сервера: your-server-ip.sslip.io
  Тип VPN: IKEv2
  Тип входа: EAP (имя пользователя и пароль)
  Имя пользователя: username1
  Пароль: password1

Android:
  Настройки -> Сеть -> VPN -> Добавить
  Имя: MyVPN
  Тип: IKEv2/IPSec MSCHAPv2
  Сервер: your-server-ip.sslip.io
  Имя пользователя: username1
  Пароль: password1`
          }
        ]
      }
    ],
    troubleshooting: [
      {
        problem: 'charon не запускается, ошибка в логах',
        solution: 'Проверьте синтаксис ipsec.conf: ipsec checkconfig. Убедитесь, что пути к сертификатам корректны. Проверьте права на ipsec.secrets (600). Логи: journalctl -u strongswan --no-pager -n 50.'
      },
      {
        problem: 'Клиент подключается, ошибка AUTHENTICATION_FAILED',
        solution: 'Проверьте ipsec.secrets — имя пользователя и пароль должны совпадать с тем, что вводит клиент. Убедитесь, что rightauth = eap-mschapv2. Перезапустите: ipsec restart.'
      },
      {
        problem: 'Подключение устанавливается, но трафик не идёт',
        solution: 'Проверьте IP-форвардинг: cat /proc/sys/net/ipv4/ip_forward (должно быть 1). Проверьте iptables NAT: iptables -t nat -L POSTROUTING -v. Убедитесь, что интерфейс в правиле MASQUERADE совпадает с реальным.'
      },
      {
        problem: 'Сертификат не принимается клиентом',
        solution: 'Убедитесь, что leftid в ipsec.conf совпадает с доменом sslip.io. Сервер (Remote ID) в настройках клиента должен совпадать с leftid. Проверьте: openssl x509 -in /etc/letsencrypt/live/*/fullchain.pem -text | grep Subject.'
      },
      {
        problem: 'Ошибка NO_PROPOSAL_CHOSEN',
        solution: 'Клиент и сервер не могут договориться о шифрах. Обновите strongSwan: apt install strongswan. На iOS убедитесь, что тип VPN — IKEv2, не IPSec. Проверьте логи: journalctl -u strongswan.'
      },
      {
        problem: 'Сертификат Let\'s Encrypt истёк',
        solution: 'Обновите: certbot renew. Перезапустите strongSwan: ipsec restart. Настройте автообновление: certbot renew --dry-run.'
      }
    ]
  },
  {
    id: 'openvpn',
    title: 'OpenVPN через TCP 443',
    description: 'Установка OpenVPN через официальный скрипт. Настройка на TCP 443 для обхода блокировок. Максимальная совместимость с корпоративными сетями.',
    protocol: 'OpenVPN',
    difficulty: 'Лёгкий',
    time: '10-15 минут',
    os: 'Ubuntu 22.04',
    sections: [
      {
        id: 'why-tcp-443',
        title: 'Почему TCP 443',
        content: 'OpenVPN по умолчанию работает на UDP 1194. Этот порт часто блокируется. TCP 443 — порт HTTPS, его блокируют крайне редко. Трафик OpenVPN на TCP 443 выглядит как обычный HTTPS для пассивного наблюдателя.',
        code: [
          { lang: 'text', code: 'UDP 1194 — стандартный порт OpenVPN. Быстрый, но часто блокируется.\nTCP 443 — порт HTTPS. Медленнее, но проходит через большинство файрволов.' }
        ]
      },
      {
        id: 'install',
        title: 'Установка через скрипт',
        content: 'Используем официальный скрипт Nyr/openvpn-install. Он автоматически настроит OpenVPN, сгенерирует ключи и создаст первого клиента.',
        code: [
          { lang: 'bash', code: 'ssh root@your-server-ip' },
          { lang: 'bash', code: 'apt update && apt upgrade -y' },
          { lang: 'bash', code: 'curl -O https://raw.githubusercontent.com/Nyr/openvpn-install/master/openvpn-install.sh' },
          { lang: 'bash', code: 'chmod +x openvpn-install.sh' },
          {
            lang: 'bash',
            code: './openvpn-install.sh',
            note: 'Скрипт задаст вопросы: порт (укажите 443), протокол (укажите tcp), DNS (рекомендуется 1.1.1.1), имя первого клиента.'
          }
        ]
      },
      {
        id: 'verify',
        title: 'Проверка установки',
        content: 'Убеждаемся, что OpenVPN слушает TCP 443 и файл клиента создан.',
        code: [
          { lang: 'bash', code: 'ss -tlnp | grep 443', note: 'Должно показать openvpn на порту 443' },
          { lang: 'bash', code: 'ls -la /root/*.ovpn', note: 'Файл клиента с именем, указанным при установке' },
          { lang: 'bash', code: 'systemctl status openvpn@server', note: 'Сервис должен быть active (running)' }
        ]
      },
      {
        id: 'firewall',
        title: 'Настройка firewall',
        content: 'Открываем порт 443 в UFW и проверяем NAT.',
        code: [
          { lang: 'bash', code: 'ufw allow 443/tcp\nufw allow 22/tcp\nufw status' },
          { lang: 'bash', code: 'iptables -t nat -L POSTROUTING -v', note: 'Скрипт автоматически настроил MASQUERADE' }
        ]
      },
      {
        id: 'download-config',
        title: 'Получение клиентского файла',
        content: 'Скачиваем .ovpn файл на клиентское устройство. Используйте scp или любой другой метод передачи файла.',
        code: [
          { lang: 'bash', code: '# С локальной машины:\nscp root@your-server-ip:/root/client-name.ovpn ./', note: 'Замените client-name на имя, указанное при установке' },
          { lang: 'text', code: 'Альтернатива — выведите содержимое файла и скопируйте:\ncat /root/client-name.ovpn\n\nСкопируйте весь вывод и сохраните как файл client.ovpn на клиенте.' }
        ]
      },
      {
        id: 'add-clients',
        title: 'Добавление новых клиентов',
        content: 'Для каждого нового клиента запускаем скрипт и выбираем "Add a new user".',
        code: [
          { lang: 'bash', code: './openvpn-install.sh', note: 'Выберите "1) Add a new user" и введите имя клиента' },
          { lang: 'bash', code: 'ls /root/*.ovpn', note: 'Новый .ovpn файл появится в /root/' }
        ]
      },
      {
        id: 'connect-mobile',
        title: 'Подключение на телефоне',
        content: 'Устанавливаем OpenVPN Connect и импортируем конфигурационный файл.',
        code: [
          {
            lang: 'text',
            code: `iOS:
  1. App Store -> OpenVPN Connect
  2. Откройте приложение
  3. Перейдите в Files -> найдите .ovpn файл
  4. "Поделиться" -> OpenVPN Connect -> Import
  5. Подключитесь

Android:
  1. Google Play -> OpenVPN Connect
  2. Откройте приложение
  3. Import -> File -> выберите .ovpn файл
  4. Import -> Connect

Windows:
  1. Скачайте OpenVPN: https://openvpn.net/community-downloads/
  2. Скопируйте .ovpn файл в C:\\Program Files\\OpenVPN\\config\\
  3. Запустите OpenVPN GUI от имени администратора
  4. Правый клик на иконке в трее -> Connect`
          }
        ]
      }
    ],
    troubleshooting: [
      {
        problem: 'OpenVPN не слушает порт 443',
        solution: 'Проверьте, что при установке скрипта выбрали протокол TCP и порт 443. Проверьте конфиг: cat /etc/openvpn/server.conf | grep -E "port|proto". Перезапустите: systemctl restart openvpn@server.'
      },
      {
        problem: 'Клиент подключается, но интернета нет',
        solution: 'Проверьте IP-форвардинг: sysctl net.ipv4.ip_forward. Проверьте NAT: iptables -t nat -L POSTROUTING. Убедитесь, что в client.ovpn есть строка redirect-gateway def1.'
      },
      {
        problem: 'Ошибка TLS handshake failed',
        solution: 'Проверьте, что клиент подключается к правильному порту и протоколу. В .ovpn файле должно быть: proto tcp и remote your-server-ip 443. Проверьте firewall: ufw status.'
      },
      {
        problem: 'Подключение очень медленное',
        solution: 'TCP поверх TCP — известная проблема (TCP meltdown). Если возможно, переключитесь на WireGuard. Альтернатива: используйте UDP-порт, если он не заблокирован. Настройте MSS clamping: mssfix 1300 в server.conf.'
      },
      {
        problem: 'Как удалить клиента',
        solution: 'Запустите скрипт: ./openvpn-install.sh. Выберите "2) Revoke an existing user". Или вручную: удалите .ovpn файл из /root/ и отзовите сертификат через easy-rsa.'
      }
    ]
  }
];

export function getGuide(id: string): Guide | undefined {
  return guides.find(g => g.id === id);
}
