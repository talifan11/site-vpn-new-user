-- Migration: 003_storage
-- Description: Create storage buckets and policies
-- Dependencies: 001_initial_schema.sql, 002_rls_policies.sql

-- ============================================================================
-- Create buckets
-- ============================================================================

-- Public bucket for avatars and community covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE);

-- Private bucket for user files (access via signed URLs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-files', 'user-files', FALSE);

-- ============================================================================
-- Storage policies for avatars bucket (public)
-- ============================================================================

-- Anyone can read avatars
CREATE POLICY "avatars_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Users can upload their own avatar (path: {user_id}/{filename})
CREATE POLICY "avatars_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Users can update their own avatar
CREATE POLICY "avatars_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Users can delete their own avatar
CREATE POLICY "avatars_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- ============================================================================
-- Storage policies for user-files bucket (private)
-- ============================================================================

-- No public read access (all access via signed URLs)
-- Files are organized as: {user_id}/{file_id}/{filename}

-- Users can upload their own files
CREATE POLICY "user_files_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-files'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Users can read their own files (others need signed URLs)
CREATE POLICY "user_files_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-files'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Users can update their own files
CREATE POLICY "user_files_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-files'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Users can delete their own files
CREATE POLICY "user_files_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-files'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- ============================================================================
-- File size limits (enforced via Storage configuration)
-- ============================================================================

-- Note: Supabase Storage doesn't support file size limits in policies.
-- Size validation is done:
-- 1. On client side (src/lib/validators.ts)
-- 2. In Edge Function (supabase/functions/check-file-size/index.ts)
--
-- To set bucket-level limits, use Supabase Dashboard:
-- - avatars: max 2 MB
-- - user-files: max 50 MB
