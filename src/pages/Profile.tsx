import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth, User } from '../contexts/AuthContext';
import { useForum } from '../contexts/ForumContext';
import { 
  Settings, MessageSquare, FileText, Award, 
  Calendar, MapPin, LinkIcon, Github, Edit2, 
  Save, X, LogOut, TrendingUp, CheckCircle2,
  Heart, Bookmark, Share2, MoreHorizontal,
  User as UserIcon, Briefcase, GraduationCap
} from 'lucide-react';

const roleLabels: Record<User['role'], string> = {
  newbie: 'Новичок',
  engineer: 'Инженер',
  expert: 'Эксперт',
  admin: 'Администратор'
};

const roleColors: Record<User['role'], string> = {
  newbie: 'var(--color-text-muted)',
  engineer: 'var(--color-accent)',
  expert: 'var(--color-success)',
  admin: 'var(--color-warning)'
};

function ReputationBadge({ reputation, role }: { reputation: number; role: User['role'] }) {
  const nextThreshold = role === 'newbie' ? 200 : role === 'engineer' ? 1000 : null;
  const currentThreshold = role === 'engineer' ? 200 : role === 'expert' ? 1000 : 0;
  const progress = nextThreshold 
    ? ((reputation - currentThreshold) / (nextThreshold - currentThreshold)) * 100 
    : 100;

  return (
    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award size={16} style={{ color: roleColors[role] }} />
          <span className="text-sm font-medium" style={{ color: roleColors[role] }}>
            {roleLabels[role]}
          </span>
        </div>
        <span className="text-sm font-mono" style={{ color: 'var(--color-text)' }}>
          {reputation} QoS
        </span>
      </div>
      {nextThreshold && (
        <>
          <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
            <div 
              className="h-full rounded-full transition-all" 
              style={{ width: `${Math.min(100, progress)}%`, backgroundColor: roleColors[role] }}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            До следующего уровня: {nextThreshold - reputation} QoS
          </p>
        </>
      )}
    </div>
  );
}

export function Profile() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { getUserThreads, getUserReplies } = useForum();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'activity' | 'settings'>('portfolio');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });

  if (!isAuthenticated || !user) return <Navigate to="/login" />;

  const userThreads = getUserThreads(user.username);
  const userReplies = getUserReplies(user.username);

  const handleSave = () => {
    updateUser(editData);
    setEditing(false);
  };

  const tabs = [
    { id: 'portfolio', label: 'Портфолио', icon: Briefcase },
    { id: 'activity', label: 'Стена активности', icon: MessageSquare },
    { id: 'settings', label: 'Настройки', icon: Settings }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in-up">
      {/* Header */}
      <div className="p-6 rounded-xl border mb-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-start gap-4">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {user.displayName}
              </h1>
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${roleColors[user.role]}20`, color: roleColors[user.role] }}
              >
                {roleLabels[user.role]}
              </span>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              @{user.username}
            </p>
            {user.bio && (
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                {user.bio}
              </p>
            )}
            <div className="flex items-center gap-4 flex-wrap text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> С {user.joinedAt}
              </span>
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {user.location}
                </span>
              )}
              {user.githubUsername && (
                <span className="flex items-center gap-1">
                  <Github size={12} /> {user.githubUsername}
                </span>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 github-link">
                  <LinkIcon size={12} /> Сайт
                </a>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all hover:scale-105"
            style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
          >
            <LogOut size={14} />
            Выйти
          </button>
        </div>

        {/* Skills */}
        {user.skills.length > 0 && (
          <div className="mt-4 pt-4 border-t flex flex-wrap gap-1.5" style={{ borderColor: 'var(--color-border)' }}>
            {user.skills.map(skill => (
              <span 
                key={skill}
                className="text-xs px-2 py-0.5 rounded badge"
                style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={14} style={{ color: 'var(--color-accent)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Треды</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{user.stats.threads}</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={14} style={{ color: 'var(--color-accent)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Комментарии</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{user.stats.comments}</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Решения</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{user.stats.solutions}</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} style={{ color: 'var(--color-accent)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>QoS</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{user.reputation}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors relative"
              style={{ 
                color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? 500 : 400
              }}
            >
              <Icon size={14} />
              {tab.label}
              {activeTab === tab.id && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <ReputationBadge reputation={user.reputation} role={user.role} />
          
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Обо мне
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {user.bio || 'Расскажите о себе в настройках профиля'}
            </p>
          </div>

          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Как заработать репутацию
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <li className="flex justify-between">
                <span>Написать комментарий</span>
                <span className="font-mono" style={{ color: 'var(--color-success)' }}>+5 QoS</span>
              </li>
              <li className="flex justify-between">
                <span>Получить апвойт на комментарий</span>
                <span className="font-mono" style={{ color: 'var(--color-success)' }}>+2 QoS</span>
              </li>
              <li className="flex justify-between">
                <span>Создать тред</span>
                <span className="font-mono" style={{ color: 'var(--color-success)' }}>+10 QoS</span>
              </li>
              <li className="flex justify-between">
                <span>Ответ принят как решение</span>
                <span className="font-mono" style={{ color: 'var(--color-success)' }}>+25 QoS</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Мои навыки
            </h3>
            {user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span 
                    key={skill}
                    className="text-sm px-3 py-1 rounded-md badge"
                    style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Добавьте навыки в настройках профиля
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          {userThreads.length === 0 && userReplies.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Пока нет активности
              </p>
              <Link 
                to="/forum" 
                className="text-sm github-link"
                style={{ color: 'var(--color-accent)' }}
              >
                Перейти на форум и начать общаться
              </Link>
            </div>
          ) : (
            <>
              {userThreads.map(thread => (
                <Link
                  key={thread.id}
                  to={`/forum/${thread.id}`}
                  className="block p-4 rounded-lg border card-hover"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} style={{ color: 'var(--color-accent)' }} />
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Создал тред · {thread.date}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    {thread.title}
                  </p>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {thread.content}
                  </p>
                </Link>
              ))}
              {userReplies.map(({ thread, reply }) => (
                <Link
                  key={reply.id}
                  to={`/forum/${thread.id}`}
                  className="block p-4 rounded-lg border card-hover"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} style={{ color: 'var(--color-accent)' }} />
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Ответил в треде · {reply.date}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                    {thread.title}
                  </p>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {reply.content}
                  </p>
                </Link>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                Профиль
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all hover:scale-105"
                  style={{ color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}
                >
                  <Edit2 size={12} />
                  Редактировать
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all hover:scale-105"
                    style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                  >
                    <X size={12} />
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
                  >
                    <Save size={12} />
                    Сохранить
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Отображаемое имя
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.displayName}
                    onChange={e => setEditData({ ...editData, displayName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>{user.displayName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  О себе
                </label>
                {editing ? (
                  <textarea
                    value={editData.bio}
                    onChange={e => setEditData({ ...editData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border text-sm resize-none"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                    placeholder="Расскажите о себе..."
                  />
                ) : (
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    {user.bio || 'Не указано'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Местоположение
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.location}
                    onChange={e => setEditData({ ...editData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                    placeholder="Москва, Россия"
                  />
                ) : (
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    {user.location || 'Не указано'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Веб-сайт
                </label>
                {editing ? (
                  <input
                    type="url"
                    value={editData.website}
                    onChange={e => setEditData({ ...editData, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                    placeholder="https://..."
                  />
                ) : (
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    {user.website || 'Не указано'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Email
                </label>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {user.email} (не изменяется)
                </p>
              </div>

              {user.githubUsername && (
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    GitHub
                  </label>
                  <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
                    <Github size={14} />
                    {user.githubUsername}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Синхронизация с GitHub
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Подключите GitHub для автоматической синхронизации профиля, репозиториев и активности.
            </p>
            {user.githubUsername ? (
              <div className="flex items-center gap-2 p-3 rounded-md" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  Подключено: {user.githubUsername}
                </span>
              </div>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
              >
                <Github size={16} />
                Подключить GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
