import { useParams, Link, Navigate } from 'react-router-dom';
import { threads } from '../data/forum';
import { guides } from '../data/guides';
import { MessageSquare, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';

export function TagPage() {
  const { tag } = useParams();

  if (!tag) return <Navigate to="/forum" />;

  // Находим все треды с этим тегом
  const matchingThreads = threads.filter(t => t.tags.includes(tag));
  
  // Находим гайды, где протокол или ключевые слова совпадают с тегом
  const matchingGuides = guides.filter(g => {
    const protocolLower = g.protocol.toLowerCase();
    const titleLower = g.title.toLowerCase();
    const tagLower = tag.toLowerCase();
    return protocolLower.includes(tagLower) || 
           titleLower.includes(tagLower) ||
           tagLower.includes('wireguard') && protocolLower === 'wireguard' ||
           tagLower.includes('ikev2') && protocolLower === 'ikev2' ||
           tagLower.includes('openvpn') && protocolLower === 'openvpn';
  });

  // Все уникальные теги
  const allTags = Array.from(new Set(threads.flatMap(t => t.tags)));
  
  // Связанные теги (встречаются в тех же тредах)
  const relatedTags = Array.from(
    new Set(
      matchingThreads
        .flatMap(t => t.tags)
        .filter(t => t !== tag)
    )
  ).slice(0, 8);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={20} style={{ color: 'var(--color-accent)' }} />
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            Тег
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          #{tag}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {matchingThreads.length} тредов{matchingGuides.length > 0 ? `, ${matchingGuides.length} гайдов` : ''} по теме
        </p>
      </div>

      {/* Guides section */}
      {matchingGuides.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} style={{ color: 'var(--color-text-muted)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Гайды
            </h2>
          </div>
          <div className="space-y-2">
            {matchingGuides.map(guide => (
              <Link
                key={guide.id}
                to={`/guides/${guide.id}`}
                className="block p-4 rounded-lg border card-hover group"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-xs font-mono px-2 py-0.5 rounded badge" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent)' }}>
                    {guide.protocol}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {guide.time}
                  </span>
                </div>
                <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-text)' }}>
                  {guide.title}
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {guide.description}
                </p>
                <span className="inline-flex items-center gap-1 text-xs mt-2 github-link" style={{ color: 'var(--color-accent)' }}>
                  Читать <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Forum threads section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={16} style={{ color: 'var(--color-text-muted)' }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
            Обсуждения на форуме
          </h2>
        </div>

        {matchingThreads.length === 0 ? (
          <div className="text-center py-12 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Нет тредов с тегом #{tag}
            </p>
            <Link to="/forum" className="text-sm" style={{ color: 'var(--color-accent)' }}>
              Перейти ко всем тредам
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {matchingThreads.map((thread, index) => (
              <Link
                key={thread.id}
                to={`/forum/${thread.id}`}
                className="block p-4 rounded-lg border card-hover group"
                style={{ borderColor: 'var(--color-border)', animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
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
        )}
      </section>

      {/* Related tags */}
      {relatedTags.length > 0 && (
        <section className="pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Связанные теги
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map(relatedTag => (
              <Link
                key={relatedTag}
                to={`/tags/${relatedTag}`}
                className="text-xs px-3 py-1.5 rounded-md transition-all hover:scale-105 badge"
                style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-accent)'
                }}
              >
                #{relatedTag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All tags cloud */}
      <section className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Все теги
        </h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map(t => (
            <Link
              key={t}
              to={`/tags/${t}`}
              className="text-xs px-2 py-1 rounded-md transition-all hover:scale-105"
              style={{ 
                backgroundColor: t === tag ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                color: t === tag ? 'white' : 'var(--color-accent)'
              }}
            >
              #{t}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
