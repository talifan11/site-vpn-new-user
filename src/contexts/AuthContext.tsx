import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  role: 'newbie' | 'engineer' | 'expert' | 'admin';
  reputation: number;
  githubUsername?: string;
  joinedAt: string;
  skills: string[];
  location?: string;
  website?: string;
  stats: {
    posts: number;
    comments: number;
    threads: number;
    solutions: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGithub: () => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  incrementReputation: (amount: number) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'devops_hub_user';
const USERS_DB_KEY = 'devops_hub_users_db';

// Имитация базы данных пользователей
function getUsersDB(): Record<string, { user: User; password: string }> {
  const raw = localStorage.getItem(USERS_DB_KEY);
  if (!raw) {
    // Предзаполненные демо-пользователи
    const demoUsers: Record<string, { user: User; password: string }> = {
      'demo@devops.local': {
        user: {
          id: 'demo-1',
          username: 'demo_user',
          email: 'demo@devops.local',
          displayName: 'Demo Engineer',
          avatar: 'DE',
          bio: 'DevOps инженер с 5-летним опытом. Kubernetes, Docker, CI/CD.',
          role: 'expert',
          reputation: 1250,
          joinedAt: '2023-03-15',
          skills: ['kubernetes', 'docker', 'linux', 'terraform', 'ansible'],
          location: 'Москва',
          stats: { posts: 45, comments: 234, threads: 12, solutions: 28 }
        },
        password: 'demo123'
      }
    };
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(demoUsers));
    return demoUsers;
  }
  return JSON.parse(raw);
}

function saveUserToDB(user: User, password: string) {
  const db = getUsersDB();
  db[user.email] = { user, password };
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
}

function generateAvatar(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

function calculateRole(reputation: number): User['role'] {
  if (reputation >= 1000) return 'expert';
  if (reputation >= 200) return 'engineer';
  if (reputation >= 0) return 'newbie';
  return 'newbie';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 400)); // Имитация запроса
    
    const db = getUsersDB();
    const record = db[email];
    
    if (!record) {
      return { success: false, error: 'Пользователь не найден' };
    }
    
    if (record.password !== password) {
      return { success: false, error: 'Неверный пароль' };
    }
    
    setUser(record.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record.user));
    return { success: true };
  };

  const loginWithGithub = async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 800)); // Имитация OAuth
    
    // Имитация GitHub OAuth — создаём пользователя на основе GitHub-данных
    const githubUser: User = {
      id: 'github-' + Date.now(),
      username: 'github_engineer',
      email: 'engineer@github.com',
      displayName: 'GitHub Engineer',
      avatar: 'GE',
      bio: 'Инженер, подключившийся через GitHub. DevOps, Linux, автоматизация.',
      role: 'engineer',
      reputation: 500,
      githubUsername: 'github_engineer',
      joinedAt: new Date().toISOString().split('T')[0],
      skills: ['linux', 'git', 'bash', 'docker'],
      stats: { posts: 0, comments: 0, threads: 0, solutions: 0 }
    };
    
    saveUserToDB(githubUser, 'github-oauth');
    setUser(githubUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(githubUser));
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 400));
    
    const db = getUsersDB();
    
    if (db[data.email]) {
      return { success: false, error: 'Email уже зарегистрирован' };
    }
    
    if (Object.values(db).some(r => r.user.username === data.username)) {
      return { success: false, error: 'Имя пользователя занято' };
    }
    
    const newUser: User = {
      id: 'user-' + Date.now(),
      username: data.username,
      email: data.email,
      displayName: data.displayName || data.username,
      avatar: generateAvatar(data.displayName || data.username),
      bio: '',
      role: 'newbie',
      reputation: 0,
      joinedAt: new Date().toISOString().split('T')[0],
      skills: [],
      stats: { posts: 0, comments: 0, threads: 0, solutions: 0 }
    };
    
    saveUserToDB(newUser, data.password);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    updated.role = calculateRole(updated.reputation);
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    const db = getUsersDB();
    if (db[user.email]) {
      db[user.email].user = updated;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    }
  };

  const incrementReputation = (amount: number) => {
    if (!user) return;
    const newRep = Math.max(0, user.reputation + amount);
    updateUser({ reputation: newRep });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginWithGithub,
      register,
      logout,
      updateUser,
      incrementReputation
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
