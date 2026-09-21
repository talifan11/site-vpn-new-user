import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Singleton-клиент Supabase.
 *
 * Используется ТОЛЬКО внутри сервисного слоя (src/api/*).
 * Компоненты и хуки не должны импортировать этот модуль напрямую —
 * они работают через хуки из src/hooks/*, которые вызывают api/*.
 *
 * Переменные окружения:
 *   VITE_SUPABASE_URL     — URL проекта (из Settings → API)
 *   VITE_SUPABASE_ANON_KEY — публичный anon key (из Settings → API)
 *
 * При отсутствии переменных клиент создаётся с пустыми значениями —
 * это позволяет проекту собираться без .env, но любые запросы упадут
 * с понятной ошибкой. Для локальной разработки скопируйте .env.example в .env.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

let clientInstance: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (clientInstance) return clientInstance;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // В dev-режиме предупреждаем, но не падаем — чтобы билд проходил.
    // В runtime любой запрос вернёт ошибку авторизации.
    if (import.meta.env.DEV) {
      console.warn(
        '[supabase] VITE_SUPABASE_URL или VITE_SUPABASE_ANON_KEY не заданы. ' +
          'Скопируйте .env.example в .env и заполните значения из Supabase Dashboard.'
      );
    }
  }

  clientInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-client-info': 'devops-hub/2.0'
      }
    }
  });

  return clientInstance;
}

/**
 * Проверка, настроен ли Supabase (есть ли URL и ключ).
 * Используется в UI, чтобы показать заглушку "настройте Supabase" вместо падения.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * Сброс singleton-клиента. Используется только в тестах.
 */
export function _resetSupabaseClientForTests(): void {
  clientInstance = null;
}
