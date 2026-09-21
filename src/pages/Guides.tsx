import { Link, useParams, Navigate } from 'react-router-dom';
import { guides, getGuide } from '../data/guides';
import { CodeBlock } from '../components/CodeBlock';
import { Clock, BarChart3, Monitor, ChevronLeft, ChevronRight, AlertCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Guides() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 fade-in-up">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Гайды по настройке VPN</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
        Пошаговые инструкции. Все команды проверены на Ubuntu 22.04.
      </p>

      <div className="grid gap-4">
        {guides.map((guide, index) => (
          <Link
            key={guide.id}
            to={`/guides/${guide.id}`}
            className="block p-6 rounded-lg border card-hover group"
            style={{ borderColor: 'var(--color-border)', animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded badge" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent)' }}>
                {guide.protocol}
              </span>
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <BarChart3 size={12} /> {guide.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <Clock size={12} /> {guide.time}
              </span>
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <Monitor size={12} /> {guide.os}
              </span>
            </div>
            <h2 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{guide.title}</h2>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>{guide.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {guide.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.hash = `/tags/${tag}`;
                  }}
                  className="text-xs px-2 py-0.5 rounded cursor-pointer transition-all hover:scale-105 badge"
                  style={{ 
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-accent)'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-sm github-link group" style={{ color: 'var(--color-accent)' }}>
              Читать гайд <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GuideDetail() {
  const { id } = useParams();
  const guide = getGuide(id || '');
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSection(0);
  }, [id]);

  if (!guide) return <Navigate to="/guides" />;

  const currentIndex = guides.findIndex(g => g.id === guide.id);
  const prevGuide = currentIndex > 0 ? guides[currentIndex - 1] : null;
  const nextGuide = currentIndex < guides.length - 1 ? guides[currentIndex + 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 fade-in-up">
      <Link to="/guides" className="text-sm mb-6 inline-flex items-center gap-1 github-link" style={{ color: 'var(--color-text-muted)' }}>
        Все гайды
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Table of Contents */}
        <aside className="lg:w-56 shrink-0">
          <nav className="sticky top-20">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Содержание
            </p>
            <ul className="space-y-1">
              {guide.sections.map((section, i) => (
                <li key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(i);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="text-sm text-left w-full py-1.5 px-3 rounded-md transition-all hover:translate-x-1"
                    style={{
                      color: activeSection === i ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      backgroundColor: activeSection === i ? 'var(--color-bg-tertiary)' : 'transparent'
                    }}
                  >
                    {i + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded badge" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent)' }}>
                {guide.protocol}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{guide.time}</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{guide.os}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>{guide.title}</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{guide.description}</p>
          </div>

          <div className="space-y-12">
            {guide.sections.map((section, i) => (
              <section key={section.id} id={section.id} className="tab-content">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <span className="text-xs font-mono w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                    {i + 1}
                  </span>
                  {section.title}
                </h2>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>{section.content}</p>
                {section.code?.map((block, j) => (
                  <CodeBlock key={j} code={block.code} lang={block.lang} note={block.note} />
                ))}
              </section>
            ))}
          </div>

          {/* Troubleshooting */}
          <section className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <AlertCircle size={20} style={{ color: 'var(--color-warning)' }} />
              Если не работает
            </h2>
            <div className="space-y-4">
              {guide.troubleshooting.map((item, i) => (
                <div key={i} className="p-4 rounded-lg border transition-all hover:translate-x-1" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>{item.problem}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.solution}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {prevGuide ? (
              <Link to={`/guides/${prevGuide.id}`} className="flex items-center gap-2 text-sm github-link group" style={{ color: 'var(--color-text-secondary)' }}>
                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> {prevGuide.title}
              </Link>
            ) : <div />}
            {nextGuide ? (
              <Link to={`/guides/${nextGuide.id}`} className="flex items-center gap-2 text-sm github-link group" style={{ color: 'var(--color-text-secondary)' }}>
                {nextGuide.title} <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
