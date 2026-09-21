import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  lang?: string;
  note?: string;
}

export function CodeBlock({ code, lang, note }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4 rounded-lg border overflow-hidden code-block" style={{ borderColor: 'var(--color-code-border)' }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--color-code-border)', backgroundColor: 'var(--color-bg-tertiary)' }}>
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {lang || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md copy-button"
          style={{ color: copied ? 'var(--color-success)' : 'var(--color-text-muted)' }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed" style={{ backgroundColor: 'var(--color-code-bg)' }}>
        <code className="font-mono" style={{ color: 'var(--color-text-secondary)' }}>
          {code}
        </code>
      </pre>
      {note && (
        <div className="px-4 py-2 border-t text-xs" style={{ borderColor: 'var(--color-code-border)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-secondary)' }}>
          {note}
        </div>
      )}
    </div>
  );
}
