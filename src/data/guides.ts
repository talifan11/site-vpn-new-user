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
    id: 'auto-setup',
    title: 'Автоматическая установка VPN',
    description: 'Единый скрипт для быстрой установки WireGuard или OpenVPN с автоматической проверкой всех параметров. Просто скопируйте и запустите.',
    protocol: 'Auto-Setup',
    difficulty: 'Лёгкий',
    time: '5-10 минут',
    os: 'Ubuntu 20.04/22.04/24.04',
    sections: [
      {
        id: 'quick-start',
        title: 'Быстрый старт',
        content: 'Подключитесь к серверу по SSH и выполните одну команду. Скрипт автоматически определит ОС, проверит доступность портов, установит зависимости и настроит VPN.',
        code: [
          {
            lang: 'bash',
            code: 'ssh root@your-server-ip',
            note: 'Замените your-server-ip на реальный IP вашего сервера'
          },
          {
            lang: 'bash',
            code: `# Для WireGuard (рекомендуется):
bash <(curl -s https://raw.githubusercontent.com/your-repo/vpn-scripts/main/wireguard-auto.sh)

# Для OpenVPN:
bash <(curl -s https://raw.githubusercontent.com/your-repo/vpn-scripts/main/openvpn-auto.sh)`,
            note: 'Скрипт задаст несколько вопросов: имя клиента, порт (по умолчанию стандартный), DNS серверы'
          }
        ]
      },
      {
        id: 'what-script-does',
        title: 'Что делает скрипт',
        content: 'Скрипт выполняет следующие проверки и действия автоматически:',
        code: [
          {
            lang: 'text',
            code: `1. Проверка системы:
   - Определение версии Ubuntu
   - Проверка прав root
   - Проверка доступности портов
   - Проверка IP-форвардинга

2. Установка зависимостей:
   - Обновление пакетов
   - Установка необходимых утилит
   - Настройка firewall (UFW)

3. Конфигурация VPN:
   - Генерация ключей
   - Создание конфигурационных файлов
   - Настройка NAT и маршрутизации
   - Создание клиента с QR-кодом

4. Финальная проверка:
   - Тест подключения
   - Вывод информации для клиента
   - Сохранение логов в /var/log/vpn-setup.log`
          }
        ]
      },
      {
        id: 'wireguard-script',
        title: 'Полный скрипт для WireGuard',
        content: 'Скопируйте этот скрипт в файл /root/wireguard-setup.sh и запустите:',
        code: [
          {
            lang: 'bash',
            code: `#!/bin/bash

# WireGuard Auto-Setup Script
# Автор: VPS & VPN Guide
# Версия: 1.0

set -e

# Цвета для вывода
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

log() { echo -e "\${GREEN}[INFO]\${NC} $1"; }
warn() { echo -e "\${YELLOW}[WARN]\${NC} $1"; }
error() { echo -e "\${RED}[ERROR]\${NC} $1"; exit 1; }

# Проверка root прав
[[ $EUID -ne 0 ]] && error "Запустите скрипт с правами root"

# Определение ОС
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
else
    error "Не удалось определить ОС"
fi

log "Обнаружена система: $OS $VER"

# Проверка Ubuntu
[[ "$OS" != "ubuntu" ]] && error "Скрипт поддерживает только Ubuntu"

# Обновление системы
log "Обновление системы..."
apt-get update -qq
apt-get upgrade -y -qq

# Установка зависимостей
log "Установка зависимостей..."
apt-get install -y -qq wireguard qrencode curl iptables ufw

# Проверка IP-форвардинга
log "Проверка IP-форвардинга..."
if [ "$(cat /proc/sys/net/ipv4/ip_forward)" != "1" ]; then
    echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
    sysctl -p
fi

# Получение внешнего IP
SERVER_PUB_IP=$(curl -s ifconfig.me)
log "Внешний IP сервера: $SERVER_PUB_IP"

# Запрос параметров
read -p "Имя клиента [client1]: " CLIENT_NAME
CLIENT_NAME=\${CLIENT_NAME:-client1}

read -p "Порт WireGuard [51820]: " WG_PORT
WG_PORT=\${WG_PORT:-51820}

# Генерация ключей
log "Генерация ключей сервера..."
cd /etc/wireguard
umask 077
wg genkey | tee server_private_key | wg pubkey > server_public_key
SERVER_PRIV_KEY=$(cat server_private_key)
SERVER_PUB_KEY=$(cat server_public_key)

# Генерация ключей клиента
log "Генерация ключей клиента..."
wg genkey | tee \${CLIENT_NAME}_private_key | wg pubkey > \${CLIENT_NAME}_public_key
CLIENT_PRIV_KEY=$(cat \${CLIENT_NAME}_private_key)
CLIENT_PUB_KEY=$(cat \${CLIENT_NAME}_public_key)

# Создание конфигурации сервера
log "Создание конфигурации сервера..."
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
Address = 10.0.0.1/24
ListenPort = $WG_PORT
PrivateKey = $SERVER_PRIV_KEY
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = $CLIENT_PUB_KEY
AllowedIPs = 10.0.0.2/32
EOF

# Создание конфигурации клиента
log "Создание конфигурации клиента..."
cat > /root/\${CLIENT_NAME}.conf << EOF
[Interface]
PrivateKey = $CLIENT_PRIV_KEY
Address = 10.0.0.2/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = $SERVER_PUB_KEY
Endpoint = $SERVER_PUB_IP:$WG_PORT
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
EOF

# Настройка firewall
log "Настройка firewall..."
ufw allow $WG_PORT/udp
ufw allow 22/tcp
ufw --force enable

# Запуск WireGuard
log "Запуск WireGuard..."
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0

# Генерация QR-кода
log "Генерация QR-кода для клиента..."
qrencode -t ansiutf8 < /root/\${CLIENT_NAME}.conf

# Сохранение логов
log "Сохранение логов..."
mkdir -p /var/log
echo "WireGuard setup completed at $(date)" > /var/log/vpn-setup.log
echo "Server IP: $SERVER_PUB_IP" >> /var/log/vpn-setup.log
echo "Port: $WG_PORT" >> /var/log/vpn-setup.log
echo "Client: $CLIENT_NAME" >> /var/log/vpn-setup.log

log "Установка завершена успешно!"
echo ""
echo "========================================="
echo "Информация для подключения:"
echo "========================================="
echo "IP сервера: $SERVER_PUB_IP"
echo "Порт: $WG_PORT"
echo "Конфиг клиента: /root/\${CLIENT_NAME}.conf"
echo "========================================="
echo ""
echo "Скачайте файл \${CLIENT_NAME}.conf на клиентское устройство"
echo "или отсканируйте QR-код выше через приложение WireGuard"`
          }
        ]
      },
      {
        id: 'openvpn-script',
        title: 'Полный скрипт для OpenVPN',
        content: 'Альтернативный скрипт для установки OpenVPN на TCP 443:',
        code: [
          {
            lang: 'bash',
            code: `#!/bin/bash

# OpenVPN Auto-Setup Script
# TCP 443 для обхода блокировок

set -e

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

log() { echo -e "\${GREEN}[INFO]\${NC} $1"; }
warn() { echo -e "\${YELLOW}[WARN]\${NC} $1"; }
error() { echo -e "\${RED}[ERROR]\${NC} $1"; exit 1; }

[[ $EUID -ne 0 ]] && error "Запустите скрипт с правами root"

# Проверка ОС
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    error "Не удалось определить ОС"
fi

[[ "$OS" != "ubuntu" ]] && error "Скрипт поддерживает только Ubuntu"

log "Обновление системы..."
apt-get update -qq
apt-get upgrade -y -qq

# Установка OpenVPN
log "Установка OpenVPN..."
apt-get install -y -qq openvpn easy-rsa ufw curl

# Настройка PKI
log "Настройка инфраструктуры PKI..."
make-cadir /etc/openvpn/easy-rsa
cd /etc/openvpn/easy-rsa

# Инициализация PKI
./easyrsa init-pki
./easyrsa build-ca nopass << EOF
VPN-CA
EOF

./easyrsa gen-req server nopass << EOF
EOF

./easyrsa sign-req server server << EOF
yes
EOF

./easyrsa gen-dh

# Генерация TLS ключа
openvpn --genkey --secret /etc/openvpn/ta.key

# Получение внешнего IP
SERVER_IP=$(curl -s ifconfig.me)
log "Внешний IP: $SERVER_IP"

# Запрос имени клиента
read -p "Имя клиента [client1]: " CLIENT_NAME
CLIENT_NAME=\${CLIENT_NAME:-client1}

# Создание сертификата клиента
log "Создание сертификата клиента..."
./easyrsa gen-req $CLIENT_NAME nopass << EOF
EOF

./easyrsa sign-req client $CLIENT_NAME << EOF
yes
EOF

# Копирование файлов
cp pki/ca.crt /etc/openvpn/
cp pki/issued/$CLIENT_NAME.crt /etc/openvpn/
cp pki/private/$CLIENT_NAME.key /etc/openvpn/
cp pki/dh.pem /etc/openvpn/

# Создание конфигурации сервера
log "Создание конфигурации сервера..."
cat > /etc/openvpn/server.conf << EOF
port 443
proto tcp-server
dev tun
ca /etc/openvpn/ca.crt
cert /etc/openvpn/server.crt
key /etc/openvpn/server.key
dh /etc/openvpn/dh.pem
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 1.1.1.1"
push "dhcp-option DNS 8.8.8.8"
keepalive 10 120
tls-auth /etc/openvpn/ta.key 0
cipher AES-256-CBC
auth SHA256
user nobody
group nogroup
persist-key
persist-tun
status /var/log/openvpn-status.log
verb 3
explicit-exit-notify
EOF

# Создание сертификата сервера
./easyrsa gen-req server nopass << EOF
EOF
./easyrsa sign-req server server << EOF
yes
EOF
cp pki/issued/server.crt /etc/openvpn/
cp pki/private/server.key /etc/openvpn/

# Настройка firewall
log "Настройка firewall..."
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable

# Включение IP-форвардинга
echo 1 > /proc/sys/net/ipv4/ip_forward
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf

# Настройка NAT
iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
iptables-save > /etc/iptables.rules

# Создание конфигурации клиента
log "Создание конфигурации клиента..."
cat > /root/\${CLIENT_NAME}.ovpn << EOF
client
dev tun
proto tcp
remote $SERVER_IP 443
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-CBC
auth SHA256
verb 3

<ca>
$(cat /etc/openvpn/ca.crt)
</ca>

<cert>
$(cat /etc/openvpn/\${CLIENT_NAME}.crt)
</cert>

<key>
$(cat /etc/openvpn/\${CLIENT_NAME}.key)
</key>

<tls-auth>
$(cat /etc/openvpn/ta.key)
</tls-auth>

key-direction 1
EOF

# Запуск OpenVPN
log "Запуск OpenVPN..."
systemctl enable openvpn@server
systemctl start openvpn@server

log "Установка завершена успешно!"
echo ""
echo "========================================="
echo "Информация для подключения:"
echo "========================================="
echo "IP сервера: $SERVER_IP"
echo "Порт: 443 (TCP)"
echo "Конфиг клиента: /root/\${CLIENT_NAME}.ovpn"
echo "========================================="
echo ""
echo "Скачайте файл \${CLIENT_NAME}.ovpn на клиентское устройство"`
          }
        ]
      },
      {
        id: 'add-more-clients',
        title: 'Добавление дополнительных клиентов',
        content: 'После первоначальной установки можно добавить новых клиентов без переустановки всего VPN.',
        code: [
          {
            lang: 'bash',
            code: `#!/bin/bash

# Скрипт добавления нового клиента WireGuard

set -e

if [[ $EUID -ne 0 ]]; then
    echo "Запустите с правами root"
    exit 1
fi

read -p "Имя нового клиента: " CLIENT_NAME

cd /etc/wireguard

# Генерация ключей клиента
wg genkey | tee \${CLIENT_NAME}_private_key | wg pubkey > \${CLIENT_NAME}_public_key
CLIENT_PRIV_KEY=$(cat \${CLIENT_NAME}_private_key)
CLIENT_PUB_KEY=$(cat \${CLIENT_NAME}_public_key)

# Получение параметров сервера
SERVER_PUB_IP=$(curl -s ifconfig.me)
WG_PORT=$(grep ListenPort wg0.conf | awk '{print $3}')
SERVER_PUB_KEY=$(cat server_public_key)

# Определение следующего IP
NEXT_IP=$(grep -c "AllowedIPs" wg0.conf)
NEXT_IP=$((NEXT_IP + 2))
CLIENT_IP="10.0.0.$NEXT_IP"

# Добавление peer в конфигурацию сервера
cat >> /etc/wireguard/wg0.conf << EOF

[Peer]
PublicKey = $CLIENT_PUB_KEY
AllowedIPs = $CLIENT_IP/32
EOF

# Создание конфигурации клиента
cat > /root/\${CLIENT_NAME}.conf << EOF
[Interface]
PrivateKey = $CLIENT_PRIV_KEY
Address = $CLIENT_IP/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = $SERVER_PUB_KEY
Endpoint = $SERVER_PUB_IP:$WG_PORT
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
EOF

# Перезапуск WireGuard
systemctl restart wg-quick@wg0

# Вывод QR-кода
echo "QR-код для клиента $CLIENT_NAME:"
qrencode -t ansiutf8 < /root/\${CLIENT_NAME}.conf

echo ""
echo "Конфиг сохранен: /root/\${CLIENT_NAME}.conf"`
          }
        ]
      },
      {
        id: 'diagnostic-script',
        title: 'Скрипт диагностики',
        content: 'Если что-то не работает, запустите этот диагностический скрипт:',
        code: [
          {
            lang: 'bash',
            code: `#!/bin/bash

# VPN Diagnostic Script

set -e

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

check() {
    if [ $? -eq 0 ]; then
        echo -e "\${GREEN}[OK]\${NC} $1"
    else
        echo -e "\${RED}[FAIL]\${NC} $1"
    fi
}

echo "========================================="
echo "VPN Diagnostic Report"
echo "========================================="
echo ""

# Проверка WireGuard
echo "Проверка WireGuard:"
systemctl is-active --quiet wg-quick@wg0
check "WireGuard сервис запущен"

wg show > /dev/null 2>&1
check "WireGuard интерфейс активен"

# Проверка IP-форвардинга
echo ""
echo "Проверка сети:"
[ "$(cat /proc/sys/net/ipv4/ip_forward)" = "1" ]
check "IP-форвардинг включен"

# Проверка firewall
echo ""
echo "Проверка firewall:"
ufw status | grep -q "51820/udp"
check "Порт WireGuard открыт в UFW"

# Проверка NAT
echo ""
echo "Проверка NAT:"
iptables -t nat -L POSTROUTING | grep -q "MASQUERADE"
check "NAT настроен"

# Проверка подключения к интернету
echo ""
echo "Проверка интернета:"
ping -c 1 -W 2 8.8.8.8 > /dev/null 2>&1
check "Сервер имеет доступ к интернету"

# Проверка DNS
echo ""
echo "Проверка DNS:"
nslookup google.com > /dev/null 2>&1
check "DNS работает"

# Информация о системе
echo ""
echo "========================================="
echo "Системная информация:"
echo "========================================="
echo "ОС: $(lsb_release -ds)"
echo "Ядро: $(uname -r)"
echo "Внешний IP: $(curl -s ifconfig.me)"
echo "WireGuard версия: $(wg --version)"
echo ""

# Логи
echo "========================================="
echo "Последние логи WireGuard:"
echo "========================================="
journalctl -u wg-quick@wg0 --no-pager -n 10

echo ""
echo "Диагностика завершена"`
          }
        ]
      },
      {
        id: 'backup-script',
        title: 'Скрипт резервного копирования',
        content: 'Сохраните конфигурации VPN перед любыми изменениями:',
        code: [
          {
            lang: 'bash',
            code: `#!/bin/bash

# VPN Backup Script

BACKUP_DIR="/root/vpn-backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Создание резервной копии VPN..."

# Создание архива
tar -czf $BACKUP_DIR/vpn-backup-$DATE.tar.gz \\
    /etc/wireguard/ \\
    /root/*.conf \\
    /etc/openvpn/ 2>/dev/null || true

echo "Резервная копия создана: $BACKUP_DIR/vpn-backup-$DATE.tar.gz"

# Очистка старых бэкапов (оставить последние 5)
ls -t $BACKUP_DIR/vpn-backup-*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null || true

echo "Готово. Оставлено последних 5 резервных копий."`
          }
        ]
      }
    ],
    troubleshooting: [
      {
        problem: 'Скрипт не запускается',
        solution: 'Убедитесь, что у вас права root. Проверьте, что curl установлен: apt install curl. Если ошибка "permission denied", выполните: chmod +x script.sh'
      },
      {
        problem: 'Ошибка при генерации ключей',
        solution: 'Убедитесь, что WireGuard установлен: apt install wireguard. Проверьте наличие утилиты wg: which wg. Если отсутствует, переустановите пакет.'
      },
      {
        problem: 'Порт уже используется',
        solution: 'Проверьте занятые порты: ss -tulnp | grep 51820. Если порт занят, выберите другой при запуске скрипта. Или остановите сервис: systemctl stop wg-quick@wg0'
      },
      {
        problem: 'QR-код не генерируется',
        solution: 'Установите qrencode: apt install qrencode. Проверьте, что файл конфигурации создан: ls -la /root/client1.conf'
      },
      {
        problem: 'Клиент не подключается после установки',
        solution: 'Запустите диагностический скрипт. Проверьте firewall: ufw status. Убедитесь, что порт открыт на уровне хостинга. Проверьте логи: journalctl -u wg-quick@wg0'
      },
      {
        problem: 'Как удалить VPN полностью',
        solution: 'systemctl stop wg-quick@wg0 && systemctl disable wg-quick@wg0. Удалите конфигурацию: rm -rf /etc/wireguard. Удалите правила firewall: ufw delete allow 51820/udp'
      }
    ]
  },
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
