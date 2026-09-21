import { z } from 'zod';
import {
  USERNAME_REGEX,
  COMMUNITY_SLUG_REGEX,
  MAX_BIO_LENGTH,
  MAX_STATUS_LENGTH,
  MAX_POST_BODY_LENGTH,
  MAX_COMMENT_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_PROJECT_NAME_LENGTH,
  MAX_TAGS_PER_POST,
  MAX_TECH_STACK_ITEMS,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_FILE_TYPES
} from './constants';

// ===== Профиль =====

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(30, 'Максимум 30 символов')
    .regex(USERNAME_REGEX, 'Только латиница, цифры и подчёркивание'),
  display_name: z.string().min(1, 'Обязательное поле').max(100, 'Максимум 100 символов'),
  bio: z.string().max(MAX_BIO_LENGTH, `Максимум ${MAX_BIO_LENGTH} символов`).optional(),
  status: z.string().max(MAX_STATUS_LENGTH, `Максимум ${MAX_STATUS_LENGTH} символов`).optional(),
  location: z.string().max(100, 'Максимум 100 символов').optional(),
  website: z
    .string()
    .url('Некорректный URL')
    .max(200, 'Максимум 200 символов')
    .optional()
    .or(z.literal('')),
  allow_messages_from: z.enum(['friends', 'everyone', 'nobody'])
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ===== Регистрация =====

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов').max(100),
  username: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(30, 'Максимум 30 символов')
    .regex(USERNAME_REGEX, 'Только латиница, цифры и подчёркивание'),
  display_name: z.string().min(1, 'Обязательное поле').max(100, 'Максимум 100 символов')
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ===== Логин =====

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль')
});

export type LoginInput = z.infer<typeof loginSchema>;

// ===== Пост =====

export const createPostSchema = z.object({
  title: z.string().max(200, 'Максимум 200 символов').optional().or(z.literal('')),
  body: z
    .string()
    .min(1, 'Пост не может быть пустым')
    .max(MAX_POST_BODY_LENGTH, `Максимум ${MAX_POST_BODY_LENGTH} символов`),
  community_id: z.string().uuid().optional(),
  tags: z
    .array(z.string().max(30))
    .max(MAX_TAGS_PER_POST, `Максимум ${MAX_TAGS_PER_POST} тегов`)
    .optional()
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

// ===== Комментарий =====

export const createCommentSchema = z.object({
  post_id: z.string().uuid(),
  parent_id: z.string().uuid().optional(),
  body: z
    .string()
    .min(1, 'Комментарий не может быть пустым')
    .max(MAX_COMMENT_LENGTH, `Максимум ${MAX_COMMENT_LENGTH} символов`),
  mention_usernames: z.array(z.string()).optional()
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// ===== Сообщество =====

export const createCommunitySchema = z.object({
  slug: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(50, 'Максимум 50 символов')
    .regex(COMMUNITY_SLUG_REGEX, 'Только латиница, цифры и дефис'),
  name: z.string().min(1, 'Обязательное поле').max(100, 'Максимум 100 символов'),
  description: z.string().max(1000, 'Максимум 1000 символов').optional(),
  is_public: z.boolean()
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;

// ===== Файл =====

/**
 * Валидация файла на клиенте (до загрузки).
 * Размер и MIME проверяются здесь; на сервере — через Edge Function.
 */
export function validateFile(file: File): { ok: true } | { ok: false; error: string } {
  if (file.size === 0) {
    return { ok: false, error: 'Файл пустой' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: `Файл слишком большой (максимум 50 МБ)` };
  }
  const mime = file.type;
  if (!mime) {
    return { ok: false, error: 'Не удалось определить тип файла' };
  }
  const allowed = ALLOWED_FILE_TYPES as readonly string[];
  if (!allowed.includes(mime)) {
    return { ok: false, error: `Тип ${mime} не поддерживается` };
  }
  return { ok: true };
}

/**
 * Валидация аватара (строже: только изображения, до 2 МБ).
 */
export function validateAvatar(file: File): { ok: true } | { ok: false; error: string } {
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Аватар должен быть изображением' };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, error: 'Аватар слишком большой (максимум 2 МБ)' };
  }
  return { ok: true };
}

// ===== Проект =====

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Обязательное поле').max(MAX_PROJECT_NAME_LENGTH, `Максимум ${MAX_PROJECT_NAME_LENGTH} символов`),
  description: z.string().max(5000, 'Максимум 5000 символов').optional(),
  repo_url: z.string().url('Некорректный URL').max(500).optional().or(z.literal('')),
  demo_url: z.string().url('Некорректный URL').max(500).optional().or(z.literal('')),
  tech_stack: z
    .array(z.string().max(30))
    .max(MAX_TECH_STACK_ITEMS, `Максимум ${MAX_TECH_STACK_ITEMS} технологий`),
  visibility: z.enum(['public', 'friends', 'private']),
  collaborator_usernames: z.array(z.string()).optional()
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// ===== Сообщение =====

export const sendMessageSchema = z.object({
  conversation_id: z.string().uuid(),
  body: z
    .string()
    .min(1, 'Сообщение не может быть пустым')
    .max(MAX_MESSAGE_LENGTH, `Максимум ${MAX_MESSAGE_LENGTH} символов`)
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// ===== Дружба =====

export const friendshipActionSchema = z.object({
  target_username: z.string().regex(USERNAME_REGEX, 'Некорректный username')
});

export type FriendshipActionInput = z.infer<typeof friendshipActionSchema>;
