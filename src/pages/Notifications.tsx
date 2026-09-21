import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFeed } from '../contexts/FeedContext';
import { Heart, MessageCircle, UserPlus, CheckCircle2, Bell, Clock } from 'lucide-react';

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  if (days < 7) return `${days} дн назад`;
  return date.toLocaleDateString('ru-RU');
}

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: MessageCircle,
  reply: MessageCircle,
  solution: CheckCircle2
};

const colorMap = {
  like: 'var(--color-error)',
  comment: 'var(--color-accent)',
  follow: 'var(--color-success)',
  mention: 'var(--color-warning)',
  reply: 'var(--color-accent)',
  solution: 'var(--color-success)'
};

export function Notifications() {
  const { isAuthenticated } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, getUnreadCount } = useFeed();

  if (!isAuthenticated) return <Navigate to="/login" />;

  const unreadCount = getUnreadCount();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell size={20} style={{ color: 'var(--color-accent)' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            Уведомления
          </h1>
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs px-3 py-1.5 rounded-md transition-all hover:scale-105"
            style={{ color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}
          >
            Прочитать все
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Пока нет уведомлений
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Здесь будут появляться лайки, комментарии и подписки
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => {
            const Icon = iconMap[notification.type];
            return (
              <Link
                key={notification.id}
                to={notification.link}
                onClick={() => markNotificationRead(notification.id)}
                className="block p-4 rounded-lg border transition-all hover:translate-x-1"
                style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: notification.read ? 'transparent' : 'var(--color-bg-secondary)'
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: `${colorMap[notification.type]}20`, color: colorMap[notification.type] }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                      <span className="font-medium">{notification.fromUser}</span>{' '}
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <Clock size={10} />
                      {formatTime(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: 'var(--color-accent)' }} />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
