-- Migration: 004_migrate_forum
-- Description: Create the service community 'forum' where old forum threads will be migrated
-- Dependencies: 001_initial_schema.sql, 002_rls_policies.sql
--
-- Note: Actual data migration from localStorage is done by a client-side script
-- (src/lib/migrateForum.ts) on the first login of the original data owner.
-- This migration only creates the target community structure.

-- ============================================================================
-- Create the service 'forum' community
-- ============================================================================

-- We use a fixed UUID so the client migration script can reference it reliably.
-- The owner is set to '00000000-0000-0000-0000-000000000000' as a placeholder;
-- the client script will reassign ownership to the actual admin on first run.

DO $$
DECLARE
  forum_id UUID := 'a0000000-0000-0000-0000-000000000001';
  system_user_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Create a system profile if it doesn't exist (for initial ownership)
  -- This profile is never used for login; it's just a FK placeholder.
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = system_user_id) THEN
    -- We can't insert into profiles directly because of the FK to auth.users.
    -- Instead, we'll set owner_id to the first admin user found, or skip if none.
    -- The client migration script will fix this.
    RAISE NOTICE 'System user placeholder — client migration will set real owner';
  END IF;

  -- Insert the forum community
  -- If owner doesn't exist yet, we insert with a temp owner and fix later.
  -- For a clean install, the first registered user becomes the owner via client script.
  INSERT INTO public.communities (id, slug, name, description, owner_id, is_public, members_count)
  VALUES (
    forum_id,
    'forum',
    'Форум',
    'Служебное сообщество, содержащее мигрированные треды из старого форума. Категории представлены тегами.',
    COALESCE(
      (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1),
      (SELECT id FROM public.profiles LIMIT 1),
      system_user_id
    ),
    TRUE,
    0
  )
  ON CONFLICT (id) DO NOTHING;

  -- Add a note: if no profiles exist yet, the community will have a dangling owner_id.
  -- The client migration script handles this by updating owner_id on first run.
END $$;

-- ============================================================================
-- Category mapping
-- ============================================================================
-- Old forum categories map to post tags:
--   'Хостинги'    → tag: 'category-hosts'
--   'WireGuard'   → tag: 'category-wireguard'
--   'IKEv2'       → tag: 'category-ikev2'
--   'OpenVPN'     → tag: 'category-openvpn'
--   'Диагностика' → tag: 'category-diagnostics'
--
-- The client migration script adds these tags during post creation.

-- ============================================================================
-- Index for fast forum browsing
-- ============================================================================

-- Index for fetching forum posts by creation date
CREATE INDEX IF NOT EXISTS idx_posts_forum_created
  ON public.posts (created_at DESC)
  WHERE community_id = 'a0000000-0000-0000-0000-000000000001';
