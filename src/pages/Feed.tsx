import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFeed, Post } from '../contexts/FeedContext';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, 
  Send, Image as ImageIcon, Tag, X, Bookmark,
  Clock, Pin
} from 'lucide-react';

const roleColors: Record<string, string> = {
  newbie: 'var(--color-text-muted)',
  engineer: 'var(--color-accent)',
  expert: 'var(--color-success)',
  admin: 'var(--color-warning)'
};

const roleLabels: Record<string, string> = {
  newbie: 'Новичок',
  engineer: 'Инженер',
  expert: 'Эксперт',
  admin: 'Админ'
};

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

function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const { likePost, addComment, likeComment } = useFeed();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const isLiked = post.likes.includes(user.id);
  const isOwn = post.author === user.username;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <article className="p-5 rounded-xl border card-hover" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            {post.authorAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link 
                to={`/user/${post.author}`}
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-text)' }}
              >
                {post.author}
              </Link>
              <span 
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ 
                  backgroundColor: `${roleColors[post.authorRole]}20`,
                  color: roleColors[post.authorRole]
                }}
              >
                {roleLabels[post.authorRole]}
              </span>
              {post.isPinned && (
                <Pin size={12} style={{ color: 'var(--color-accent)' }} />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <Clock size={10} />
              {formatTime(post.createdAt)}
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-md transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <MoreHorizontal size={16} />
          </button>
          {showMenu && (
            <div 
              className="absolute right-0 top-8 z-10 py-1 rounded-lg border shadow-lg min-w-[150px]"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
            >
              <button 
                className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                onClick={() => setShowMenu(false)}
              >
                <Bookmark size={12} className="inline mr-2" />
                Сохранить
              </button>
              {isOwn && (
                <button 
                  className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                  style={{ color: 'var(--color-error)' }}
                  onClick={() => {
                    // deletePost(post.id);
                    setShowMenu(false);
                  }}
                >
                  <X size={12} className="inline mr-2" />
                  Удалить
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
          {post.content}
        </p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map(tag => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="text-xs px-2 py-0.5 rounded badge transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent)' }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => likePost(post.id)}
          className="flex items-center gap-1.5 text-xs transition-all hover:scale-105"
          style={{ color: isLiked ? 'var(--color-error)' : 'var(--color-text-muted)' }}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          {post.likes.length > 0 && post.likes.length}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs transition-all hover:scale-105"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <MessageCircle size={16} />
          {post.comments.length > 0 && post.comments.length}
        </button>
        <button
          className="flex items-center gap-1.5 text-xs transition-all hover:scale-105"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Share2 size={16} />
          {post.reposts > 0 && post.reposts}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
          {post.comments.map(comment => {
            const isCommentLiked = user && comment.likes.includes(user.id);
            return (
              <div key={comment.id} className="flex gap-2">
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent)' }}
                >
                  {comment.authorAvatar}
                </div>
                <div className="flex-1">
                  <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                        {comment.author}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {comment.content}
                    </p>
                  </div>
                  <button
                    onClick={() => likeComment(post.id, comment.id)}
                    className="flex items-center gap-1 mt-1 text-xs transition-all hover:scale-105"
                    style={{ color: isCommentLiked ? 'var(--color-error)' : 'var(--color-text-muted)' }}
                  >
                    <Heart size={10} fill={isCommentLiked ? 'currentColor' : 'none'} />
                    {comment.likes.length > 0 && comment.likes.length}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Comment form */}
          <form onSubmit={handleComment} className="flex gap-2 mt-2">
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Написать комментарий..."
                className="flex-1 px-3 py-1.5 rounded-lg border text-xs transition-colors focus:outline-none focus:border-[var(--color-accent)]"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105 disabled:opacity-30"
                style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
              >
                <Send size={12} />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}

function CreatePost() {
  const { user } = useAuth();
  const { createPost } = useFeed();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [showForm, setShowForm] = useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    createPost(content, tagList);
    setContent('');
    setTags('');
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            {user.avatar}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 text-left px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}
          >
            Что нового, {user.displayName.split(' ')[0]}?
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ color: 'var(--color-accent)' }}
          >
            <ImageIcon size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          {user.avatar}
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Поделитесь опытом, задайте вопрос..."
          rows={4}
          className="flex-1 px-3 py-2 rounded-lg border text-sm resize-none focus:outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
          autoFocus
        />
      </div>
      <div className="ml-13 mb-3">
        <div className="flex items-center gap-2">
          <Tag size={14} style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Теги через запятую: linux, vpn, wireguard"
            className="flex-1 px-3 py-1.5 rounded-md border text-xs focus:outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => { setShowForm(false); setContent(''); setTags(''); }}
          className="px-4 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
          style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 disabled:opacity-30"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          Опубликовать
        </button>
      </div>
    </form>
  );
}

export function Feed() {
  const { user, isAuthenticated } = useAuth();
  const { posts, getFeedPosts } = useFeed();

  if (!isAuthenticated) return <Navigate to="/login" />;

  const feedPosts = getFeedPosts();
  const allPosts = feedPosts.length > 0 ? feedPosts : posts;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 fade-in-up">
      {/* Stories */}
      <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
          Истории сообщества
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button className="shrink-0 flex flex-col items-center gap-1">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-dashed transition-all hover:scale-105"
              style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
            >
              +
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Ваша</span>
          </button>
          {['DE', 'SP', 'CA', 'SE', 'KG'].map((avatar, i) => (
            <button key={i} className="shrink-0 flex flex-col items-center gap-1">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--color-accent)', 
                  color: 'white',
                  borderColor: 'var(--color-accent)'
                }}
              >
                {avatar}
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {['demo', 'sysadmin', 'cloud', 'security', 'k8s'][i]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create post */}
      <div className="mb-6">
        <CreatePost />
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
