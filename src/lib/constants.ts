/**
 * Централизованные константы приложения.
 *
 * Все магические числа и строки — здесь. Если нужно изменить лимит,
 * меняем в одном месте.
 */

// ===== Лимиты =====

/** Максимальный размер загружаемого файла в байтах (50 МБ) */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

/** Максимальный размер аватара (2 МБ) */
export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

/** Максимальный размер обложки сообщества (5 МБ) */
export const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024;

/** Максимальное количество файлов в одном посте */
export const MAX_ATTACHMENTS_PER_POST = 10;

/** Максимальная длина bio профиля */
export const MAX_BIO_LENGTH = 500;

/** Максимальная длина статуса */
export const MAX_STATUS_LENGTH = 100;

/** Максимальная длина body поста */
export const MAX_POST_BODY_LENGTH = 10_000;

/** Максимальная длина комментария */
export const MAX_COMMENT_LENGTH = 2_000;

/** Максимальная длина сообщения */
export const MAX_MESSAGE_LENGTH = 4_000;

/** Максимальная длина названия проекта */
export const MAX_PROJECT_NAME_LENGTH = 100;

/** Максимальное количество тегов в посте */
export const MAX_TAGS_PER_POST = 10;

/** Максимальная длина tech_stack в проекте */
export const MAX_TECH_STACK_ITEMS = 20;

/** Размер страницы для пагинации (cursor-based) */
export const DEFAULT_PAGE_SIZE = 20;

/** ===== Supabase Storage ===== */

/** Публичный бакет для аватаров и обложек */
export const AVATARS_BUCKET = 'avatars';

/** Приватный бакет для пользовательских файлов (доступ через signed URLs) */
export const USER_FILES_BUCKET = 'user-files';

/** ===== Служебные сущности ===== */

/** Slug служебного сообщества, куда мигрируется старый форум */
export const FORUM_COMMUNITY_SLUG = 'forum';

/** ===== Валидация ===== */

/** Regex для username: 3-30 символов, латиница, цифры, подчёркивание */
export const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

/** Regex для slug сообщества: 3-50 символов, латиница, цифры, дефис */
export const COMMUNITY_SLUG_REGEX = /^[a-z0-9-]{3,50}$/;

/** ===== MIME-типы ===== */

/** Разрешённые MIME-типы для изображений */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

/** Разрешённые MIME-типы для документов */
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/json'
] as const;

/** Разрешённые MIME-типы для архивов (код) */
export const ALLOWED_ARCHIVE_TYPES = [
  'application/zip',
  'application/gzip',
  'application/x-tar'
] as const;

/** Все разрешённые MIME-типы для загрузки */
export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
  ...ALLOWED_ARCHIVE_TYPES
] as const;

/** ===== LocalStorage (для миграции старых данных) ===== */

export const LS_KEYS = {
  USER: 'devops_hub_user',
  USERS_DB: 'devops_hub_users_db',
  FORUM_DATA: 'devops_hub_forum_data',
  UPVOTES: 'devops_hub_upvotes',
  POSTS: 'devops_hub_posts',
  STORIES: 'devops_hub_stories',
  NOTIFICATIONS: 'devops_hub_notifications',
  SUBSCRIPTIONS: 'devops_hub_subscriptions',
  THEME: 'theme',
  FORUM_MIGRATED: 'devops_hub_forum_migrated'
} as const;
