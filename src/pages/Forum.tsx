import { Link, useParams, Navigate } from 'react-router-dom';
import { threads, categories, getThread, getThreadsByCategory } from '../data/forum';
import { MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Forum() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredThreads = activeCategory
    ? getThreadsByCategory(activeCategory)
    : threads;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in-up">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Форум</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        Типичные вопросы и ответы по настройке VPN и выбору хостинга.
      </p>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className="text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105"
          style={{
            borderColor: !activeCategory ? 'var(--color-accent)' : 'var(--color-border)',
            backgroundColor: !activeCategory ? 'var(--color-bg-tertiary)' : 'transparent',
            color: !activeCategory ? 'var(--color-accent)' : 'var(--color-text-secondary)'
          }}
        >
          Все категории
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105"
            style={{
              borderColor: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-border)',
              backgroundColor: activeCategory === cat ? 'var(--color-bg-tertiary)' : 'transparent',
              color: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-text-secondary)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Popular Tags */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Популярные теги
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(threads.flatMap(t => t.tags))).slice(0, 12).map(tag => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="text-xs px-2 py-1 rounded-md transition-all hover:scale-105 badge"
              style={{ 
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-accent)'
              }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Threads */}
      <div className="space-y-2">
        {filteredThreads.map((thread, index) => (
          <Link
            key={thread.id}
            to={`/forum/${thread.id}`}
            className="block p-4 rounded-lg border card-hover group"
            style={{ borderColor: 'var(--color-border)', animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium mb-2 truncate" style={{ color: 'var(--color-text)' }}>
                  {thread.title}
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded badge" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                    {thread.category}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {thread.author}
                  </span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                    <Clock size={10} /> {thread.date}
                  </span>
                  <div className="flex gap-1.5 ml-auto flex-wrap justify-end">
                    {thread.tags.map(tag => (
                      <Link
                        key={tag}
                        to={`/tags/${tag}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-0.5 rounded transition-all hover:scale-105 badge"
                        style={{ 
                          backgroundColor: 'var(--color-bg-tertiary)',
                          color: 'var(--color-accent)'
                        }}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <MessageSquare size={14} />
                  {thread.replies.length}
                </div>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ForumThreadPage() {
  const { id } = useParams();
  const thread = getThread(id || '');

  if (!thread) return <Navigate to="/forum" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in-up">
      <Link to="/forum" className="text-sm mb-6 inline-flex items-center gap-1 github-link" style={{ color: 'var(--color-text-muted)' }}>
        Назад к форуму
      </Link>

      {/* Thread */}
      <article className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded badge" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
            {thread.category}
          </span>
          {thread.tags.map(tag => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="text-xs px-2 py-0.5 rounded badge transition-all hover:scale-105"
              style={{ 
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-accent)'
              }}
            >
              #{tag}
            </Link>
          ))}
        </div>
        <h1 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>{thread.title}</h1>
        <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <span>{thread.author}</span>
          <span>{thread.date}</span>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{thread.content}</p>
        </div>
      </article>

      {/* Replies */}
      <section>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Ответы ({thread.replies.length})
        </h2>
        <div className="space-y-4">
          {thread.replies.map((reply, index) => (
            <div 
              key={reply.id} 
              className="p-4 rounded-lg border transition-all hover:translate-x-1" 
              style={{ borderColor: 'var(--color-border)', animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3 mb-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span className="font-medium" style={{ color: 'var(--color-text)' }}>{reply.author}</span>
                <span>{reply.date}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
