import { formatDistanceToNowStrict, format, isThisYear } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MAX_FILE_SIZE_BYTES } from './constants';

/**
 * Объединение Tailwind-классов с фильтрацией falsy-значений.
 * Альтернатива clsx + tailwind-merge, но без дополнительных зависимостей.
 *
 * В отличие от clsx, эта версия НЕ делает deduplication конфликтующих классов —
 * для нашего проекта это не критично, т.к. мы не используем динамические варианты.
 */
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Форматирование даты в относительном виде: "5 мин назад", "2 ч назад", "3 дн назад".
 * Для дат старше 7 дней — абсолютный формат.
 */
export function formatRelative(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 7) {
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: ru });
  }

  if (isThisYear(date)) {
    return format(date, 'd MMMM', { locale: ru });
  }

  return format(date, 'd MMMM yyyy', { locale: ru });
}

/**
 * Форматирование размера файла в человекочитаемый вид.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Проверка, превышает ли размер файла лимит.
 */
export function isFileSizeValid(bytes: number): boolean {
  return bytes > 0 && bytes <= MAX_FILE_SIZE_BYTES;
}

/**
 * Извлечение инициалов из имени для аватара-заглушки.
 * Берёт первые буквы первого и второго слова, либо первую букву.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

/**
 * Детерминированный цвет для аватара-заглушки по строке (username/id).
 * Возвращает CSS color value.
 */
export function getAvatarColor(seed: string): string {
  const palette = [
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#ef4444', // red
    '#6366f1'  // indigo
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

/**
 * Безопасный URL для аватара: если null/undefined — возвращает null,
 * чтобы компонент Avatar показал заглушку.
 */
export function safeAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url;
}

/**
 * Нормализация username к нижнему регистру.
 */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

/**
 * Нормализация slug сообщества.
 */
export function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Усечение строки до указанной длины с добавлением "...".
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

/**
 * Извлечение @username-упоминаний из текста.
 */
export function extractMentions(text: string): string[] {
  const matches = text.match(/@[a-z0-9_]{3,30}/gi);
  if (!matches) return [];
  return Array.from(new Set(matches.map(m => m.slice(1).toLowerCase())));
}

/**
 * Проверка, является ли MIME-тип изображением.
 */
export function isImageMime(mime: string): boolean {
  return mime.startsWith('image/');
}

/**
 * Проверка, является ли MIME-тип PDF.
 */
export function isPdfMime(mime: string): boolean {
  return mime === 'application/pdf';
}

/**
 * Конструктор URL для Supabase Storage (публичный бакет).
 */
export function publicStorageUrl(baseUrl: string, bucket: string, path: string): string {
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Конструктор URL для аватара пользователя.
 */
export function avatarPath(userId: string, filename: string): string {
  return `${userId}/${filename}`;
}

/**
 * Конструктор пути для пользовательского файла.
 */
export function userFilePath(userId: string, fileId: string, filename: string): string {
  return `${userId}/${fileId}/${filename}`;
}

/**
 * Sleep для имитации задержек и debounce.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Безопасный парсинг JSON с fallback.
 */
export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
