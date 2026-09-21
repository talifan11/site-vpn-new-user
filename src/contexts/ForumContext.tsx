import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { threads as initialThreads, ForumThread, ForumReply } from '../data/forum';
import { useAuth } from './AuthContext';

interface ForumContextType {
  threads: ForumThread[];
  getThread: (id: string) => ForumThread | undefined;
  addReply: (threadId: string, content: string) => void;
  addThread: (title: string, content: string, category: string, tags: string[]) => void;
  upvoteThread: (threadId: string) => void;
  upvoteReply: (threadId: string, replyId: string) => void;
  getUserThreads: (username: string) => ForumThread[];
  getUserReplies: (username: string) => { thread: ForumThread; reply: ForumReply }[];
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

const FORUM_STORAGE_KEY = 'devops_hub_forum_data';
const UPVOTES_KEY = 'devops_hub_upvotes';

export function ForumProvider({ children }: { children: ReactNode }) {
  const { user, incrementReputation } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>(() => {
    const saved = localStorage.getItem(FORUM_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialThreads;
      }
    }
    return initialThreads;
  });

  const [upvotes, setUpvotes] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem(UPVOTES_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem(UPVOTES_KEY, JSON.stringify(upvotes));
  }, [upvotes]);

  const getThread = (id: string) => threads.find(t => t.id === id);

  const addReply = (threadId: string, content: string) => {
    if (!user) return;
    
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      const newReply: ForumReply = {
        id: 'r-' + Date.now(),
        author: user.username,
        authorAvatar: user.avatar,
        date: new Date().toISOString().split('T')[0],
        content,
        upvotes: 0
      };
      return { ...t, replies: [...t.replies, newReply] };
    }));

    // Обновляем статистику пользователя
    const savedUser = localStorage.getItem('devops_hub_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      userData.stats.comments += 1;
      userData.reputation += 5;
      localStorage.setItem('devops_hub_user', JSON.stringify(userData));
    }
  };

  const addThread = (title: string, content: string, category: string, tags: string[]) => {
    if (!user) return;
    
    const newThread: ForumThread = {
      id: String(Date.now()),
      title,
      category,
      author: user.username,
      authorAvatar: user.avatar,
      date: new Date().toISOString().split('T')[0],
      content,
      tags,
      replies: [],
      upvotes: 0
    };
    
    setThreads(prev => [newThread, ...prev]);
  };

  const upvoteThread = (threadId: string) => {
    if (!user) return;
    
    const key = `thread-${threadId}`;
    const voters = upvotes[key] || [];
    
    if (voters.includes(user.id)) {
      // Убираем голос
      setUpvotes(prev => ({ ...prev, [key]: voters.filter(v => v !== user.id) }));
      setThreads(prev => prev.map(t => 
        t.id === threadId ? { ...t, upvotes: Math.max(0, (t.upvotes || 0) - 1) } : t
      ));
    } else {
      // Добавляем голос
      setUpvotes(prev => ({ ...prev, [key]: [...voters, user.id] }));
      setThreads(prev => prev.map(t => 
        t.id === threadId ? { ...t, upvotes: (t.upvotes || 0) + 1 } : t
      ));
    }
  };

  const upvoteReply = (threadId: string, replyId: string) => {
    if (!user) return;
    
    const key = `reply-${replyId}`;
    const voters = upvotes[key] || [];
    
    if (voters.includes(user.id)) {
      setUpvotes(prev => ({ ...prev, [key]: voters.filter(v => v !== user.id) }));
      setThreads(prev => prev.map(t => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          replies: t.replies.map(r => 
            r.id === replyId ? { ...r, upvotes: Math.max(0, (r.upvotes || 0) - 1) } : r
          )
        };
      }));
    } else {
      setUpvotes(prev => ({ ...prev, [key]: [...voters, user.id] }));
      setThreads(prev => prev.map(t => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          replies: t.replies.map(r => 
            r.id === replyId ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r
          )
        };
      }));
    }
  };

  const getUserThreads = (username: string) => 
    threads.filter(t => t.author === username);

  const getUserReplies = (username: string) => {
    const result: { thread: ForumThread; reply: ForumReply }[] = [];
    threads.forEach(t => {
      t.replies.forEach(r => {
        if (r.author === username) {
          result.push({ thread: t, reply: r });
        }
      });
    });
    return result;
  };

  return (
    <ForumContext.Provider value={{
      threads,
      getThread,
      addReply,
      addThread,
      upvoteThread,
      upvoteReply,
      getUserThreads,
      getUserReplies
    }}>
      {children}
    </ForumContext.Provider>
  );
}

export function useForum() {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error('useForum must be used within ForumProvider');
  return ctx;
}
