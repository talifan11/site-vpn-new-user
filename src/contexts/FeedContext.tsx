import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  image?: string;
  likes: string[]; // ID пользователей
  comments: PostComment[];
  createdAt: string;
  tags: string[];
  reposts: number;
  isPinned?: boolean;
}

export interface PostComment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Story {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  viewedBy: string[];
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'reply' | 'solution';
  fromUser: string;
  fromAvatar: string;
  content: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface Subscription {
  followerId: string;
  followingId: string;
}

interface FeedContextType {
  posts: Post[];
  stories: Story[];
  notifications: Notification[];
  subscriptions: Subscription[];
  createPost: (content: string, tags: string[], image?: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  createStory: (content: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  getFollowers: (userId: string) => string[];
  getFollowing: (userId: string) => string[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: () => number;
  getFeedPosts: () => Post[];
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

const POSTS_KEY = 'devops_hub_posts';
const STORIES_KEY = 'devops_hub_stories';
const NOTIFICATIONS_KEY = 'devops_hub_notifications';
const SUBSCRIPTIONS_KEY = 'devops_hub_subscriptions';

// Предзаполненные посты для демонстрации
const demoPosts: Post[] = [
  {
    id: 'p1',
    author: 'demo_user',
    authorAvatar: 'DE',
    authorRole: 'expert',
    content: 'Только что настроил WireGuard на Timeweb Cloud за 10 минут. Все порты открыты по умолчанию, никаких танцев с бубном. Рекомендую этот хостинг для VPN-серверов.\n\nКому нужны пошаговые инструкции — загляните в раздел гайдов.',
    likes: ['user-2', 'user-3', 'user-4'],
    comments: [
      {
        id: 'c1',
        author: 'linux_fan',
        authorAvatar: 'LF',
        content: 'А какой тариф взял? Мне для 5 клиентов нужно.',
        createdAt: '2024-01-15T12:30:00',
        likes: ['user-2']
      },
      {
        id: 'c2',
        author: 'demo_user',
        authorAvatar: 'DE',
        content: 'Базовый за 189 руб/мес. Для 5 клиентов более чем достаточно.',
        createdAt: '2024-01-15T12:45:00',
        likes: ['linux_fan']
      }
    ],
    createdAt: '2024-01-15T12:00:00',
    tags: ['wireguard', 'timeweb', 'vpn'],
    reposts: 3,
    isPinned: true
  },
  {
    id: 'p2',
    author: 'sysadmin_pro',
    authorAvatar: 'SP',
    authorRole: 'engineer',
    content: 'Подборка полезных команд для диагностики сети на Linux:\n\n1. ss -tulnp — посмотреть открытые порты\n2. ip route show — таблица маршрутизации\n3. dig +short example.com — DNS-запрос\n4. mtr example.com — трассировка с статистикой\n5. tcpdump -i eth0 port 443 — снифинг трафика\n\nСохраняйте себе, пригодится.',
    likes: ['user-1', 'user-3', 'user-5', 'user-6', 'user-7', 'user-8'],
    comments: [
      {
        id: 'c3',
        author: 'newbie_dev',
        authorAvatar: 'ND',
        content: 'Спасибо! А как посмотреть, какой процесс слушает порт?',
        createdAt: '2024-01-14T15:00:00',
        likes: []
      },
      {
        id: 'c4',
        author: 'sysadmin_pro',
        authorAvatar: 'SP',
        content: 'lsof -i :port или netstat -tulnp | grep port',
        createdAt: '2024-01-14T15:30:00',
        likes: ['newbie_dev', 'user-3']
      }
    ],
    createdAt: '2024-01-14T14:00:00',
    tags: ['linux', 'networking', 'diagnostics'],
    reposts: 12
  },
  {
    id: 'p3',
    author: 'cloud_architect',
    authorAvatar: 'CA',
    authorRole: 'expert',
    content: 'Сравнение стоимости VPS для VPN в 2024 году:\n\n• Aeza — от 139 руб/мес (Нидерланды)\n• FirstVDS — от 165 руб/мес\n• Timeweb Cloud — от 189 руб/мес\n• AdminVPS — от 190 руб/мес\n• VDSina — от 170 руб/мес\n\nВажно: цена — не единственный критерий. Смотрите на блокировки портов и качество поддержки. Подробности в разделе "Хостинги".',
    likes: ['user-1', 'user-2', 'user-4', 'user-5'],
    comments: [],
    createdAt: '2024-01-13T10:00:00',
    tags: ['хостинги', 'vps', 'сравнение'],
    reposts: 8
  },
  {
    id: 'p4',
    author: 'security_expert',
    authorAvatar: 'SE',
    authorRole: 'expert',
    content: 'Важно: если вы используете VPN для обхода блокировок, обязательно проверяйте DNS-утечки.\n\nСайты для проверки:\n• dnsleaktest.com\n• ipleak.net\n• browserleaks.com/webrtc\n\nЕсли видите свой реальный IP — значит, что-то настроено неправильно. Чаще всего проблема в том, что DNS-запросы идут мимо туннеля.',
    likes: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7'],
    comments: [
      {
        id: 'c5',
        author: 'paranoid_user',
        authorAvatar: 'PU',
        content: 'А как проверить утечки на iOS? На Android использую приложение, а на iPhone не нашёл.',
        createdAt: '2024-01-12T18:00:00',
        likes: ['user-3']
      }
    ],
    createdAt: '2024-01-12T16:00:00',
    tags: ['security', 'dns', 'privacy'],
    reposts: 15
  },
  {
    id: 'p5',
    author: 'kubernetes_guru',
    authorAvatar: 'KG',
    authorRole: 'engineer',
    content: 'Кто-нибудь запускал WireGuard в Kubernetes? Хочу сделать VPN-шлюз для всего кластера.\n\nЕсть идеи по архитектуре? Думаете использовать wg-easy как Deployment с hostNetwork: true.',
    likes: ['user-2', 'user-5'],
    comments: [
      {
        id: 'c6',
        author: 'demo_user',
        authorAvatar: 'DE',
        content: 'Делал такое. hostNetwork обязателен, иначе NAT не будет работать. Ещё нужен privileged: true для контейнера.',
        createdAt: '2024-01-11T11:00:00',
        likes: ['kubernetes_guru']
      }
    ],
    createdAt: '2024-01-11T10:00:00',
    tags: ['kubernetes', 'wireguard', 'docker'],
    reposts: 2
  }
];

const demoStories: Story[] = [
  {
    id: 's1',
    author: 'demo_user',
    authorAvatar: 'DE',
    content: 'Настроил IKEv2 за 30 минут. Let\'s Encrypt + sslip.io — работает идеально на всех устройствах.',
    createdAt: '2024-01-15T09:00:00',
    viewedBy: []
  },
  {
    id: 's2',
    author: 'sysadmin_pro',
    authorAvatar: 'SP',
    content: 'Новый гайд по OpenVPN на TCP 443. Обходит любые блокировки.',
    createdAt: '2024-01-14T14:00:00',
    viewedBy: []
  },
  {
    id: 's3',
    author: 'cloud_architect',
    authorAvatar: 'CA',
    content: 'Сравнение 10 хостингов для VPN обновлено. Добавил данные по Cloud.ru.',
    createdAt: '2024-01-13T11:00:00',
    viewedBy: []
  }
];

export function FeedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(POSTS_KEY);
    return saved ? JSON.parse(saved) : demoPosts;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem(STORIES_KEY);
    return saved ? JSON.parse(saved) : demoStories;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(SUBSCRIPTIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem(POSTS_KEY, JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem(STORIES_KEY, JSON.stringify(stories)); }, [stories]);
  useEffect(() => { localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions)); }, [subscriptions]);

  const createPost = (content: string, tags: string[], image?: string) => {
    if (!user) return;
    const newPost: Post = {
      id: 'p-' + Date.now(),
      author: user.username,
      authorAvatar: user.avatar,
      authorRole: user.role,
      content,
      image,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      tags,
      reposts: 0
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const likePost = (postId: string) => {
    if (!user) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const hasLiked = p.likes.includes(user.id);
      const newLikes = hasLiked 
        ? p.likes.filter(id => id !== user.id)
        : [...p.likes, user.id];
      
      // Уведомление автору поста
      if (!hasLiked && p.author !== user.username) {
        addNotification({
          type: 'like',
          fromUser: user.username,
          fromAvatar: user.avatar,
          content: `оценил ваш пост`,
          link: `/feed`
        });
      }
      
      return { ...p, likes: newLikes };
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!user) return;
    const newComment: PostComment = {
      id: 'c-' + Date.now(),
      author: user.username,
      authorAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
      likes: []
    };
    
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      
      // Уведомление автору поста
      if (p.author !== user.username) {
        addNotification({
          type: 'comment',
          fromUser: user.username,
          fromAvatar: user.avatar,
          content: `прокомментировал ваш пост`,
          link: `/feed`
        });
      }
      
      return { ...p, comments: [...p.comments, newComment] };
    }));
  };

  const likeComment = (postId: string, commentId: string) => {
    if (!user) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: p.comments.map(c => {
          if (c.id !== commentId) return c;
          const hasLiked = c.likes.includes(user.id);
          return {
            ...c,
            likes: hasLiked 
              ? c.likes.filter(id => id !== user.id)
              : [...c.likes, user.id]
          };
        })
      };
    }));
  };

  const createStory = (content: string) => {
    if (!user) return;
    const newStory: Story = {
      id: 's-' + Date.now(),
      author: user.username,
      authorAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
      viewedBy: []
    };
    setStories(prev => [newStory, ...prev]);
  };

  const followUser = (userId: string) => {
    if (!user) return;
    setSubscriptions(prev => {
      const exists = prev.some(s => s.followerId === user.id && s.followingId === userId);
      if (exists) return prev;
      
      addNotification({
        type: 'follow',
        fromUser: user.username,
        fromAvatar: user.avatar,
        content: `подписался на вас`,
        link: `/profile`
      });
      
      return [...prev, { followerId: user.id, followingId: userId }];
    });
  };

  const unfollowUser = (userId: string) => {
    if (!user) return;
    setSubscriptions(prev => prev.filter(s => !(s.followerId === user.id && s.followingId === userId)));
  };

  const isFollowing = (userId: string) => {
    if (!user) return false;
    return subscriptions.some(s => s.followerId === user.id && s.followingId === userId);
  };

  const getFollowers = (userId: string) => 
    subscriptions.filter(s => s.followingId === userId).map(s => s.followerId);

  const getFollowing = (userId: string) => 
    subscriptions.filter(s => s.followerId === userId).map(s => s.followingId);

  const addNotification = (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...data,
      id: 'n-' + Date.now(),
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  const getFeedPosts = () => {
    if (!user) return posts;
    const following = getFollowing(user.id);
    // Показываем посты от подписок + свои посты + закреплённые
    return posts.filter(p => 
      p.isPinned || 
      p.author === user.username || 
      following.includes(p.author)
    );
  };

  return (
    <FeedContext.Provider value={{
      posts,
      stories,
      notifications,
      subscriptions,
      createPost,
      deletePost,
      likePost,
      addComment,
      likeComment,
      createStory,
      followUser,
      unfollowUser,
      isFollowing,
      getFollowers,
      getFollowing,
      markNotificationRead,
      markAllNotificationsRead,
      getUnreadCount,
      getFeedPosts
    }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error('useFeed must be used within FeedProvider');
  return ctx;
}
