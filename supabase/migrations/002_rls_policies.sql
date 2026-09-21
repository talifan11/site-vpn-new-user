-- Migration: 002_rls_policies
-- Description: Row Level Security policies for all tables
-- Dependencies: 001_initial_schema.sql

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES
-- ============================================================================

-- Everyone can read profiles
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (TRUE);

-- Users can insert only their own profile
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- COMMUNITIES
-- ============================================================================

-- Public communities: everyone can read. Private: only members.
CREATE POLICY "communities_select" ON public.communities
  FOR SELECT USING (
    is_public = TRUE
    OR EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = id
        AND m.user_id = auth.uid()
    )
  );

-- Only authenticated users can create communities
CREATE POLICY "communities_insert" ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Only owner/admin can update
CREATE POLICY "communities_update" ON public.communities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- COMMUNITY MEMBERS
-- ============================================================================

-- Members can see their own membership; owner/admin can see all
CREATE POLICY "community_members_select" ON public.community_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = community_id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin')
    )
    OR (SELECT is_public FROM public.communities WHERE id = community_id)
  );

-- Users can join by inserting themselves
CREATE POLICY "community_members_insert" ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can leave; owner/admin can remove others
CREATE POLICY "community_members_update" ON public.community_members
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = community_id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "community_members_delete" ON public.community_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = community_id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- COMMUNITY BANS
-- ============================================================================

-- Only owner/admin can see bans
CREATE POLICY "community_bans_select" ON public.community_bans
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = community_id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin')
    )
  );

-- Only owner/admin can ban
CREATE POLICY "community_bans_insert" ON public.community_bans
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = community_id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "community_bans_delete" ON public.community_bans
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = community_id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- POSTS
-- ============================================================================

-- Personal posts: visible to everyone (simplified; can be refined later)
-- Community posts: visible if community is public or user is member
CREATE POLICY "posts_select" ON public.posts
  FOR SELECT USING (
    community_id IS NULL
    OR EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND is_public)
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.community_members m
      WHERE m.community_id = posts.community_id
        AND m.user_id = auth.uid()
    )
  );

-- Users can create posts as themselves
CREATE POLICY "posts_insert" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "posts_update" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Users can delete their own posts; community owner/admin can delete any post in their community
CREATE POLICY "posts_delete" ON public.posts
  FOR DELETE USING (
    auth.uid() = author_id
    OR (
      community_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.community_members m
        WHERE m.community_id = posts.community_id
          AND m.user_id = auth.uid()
          AND m.role IN ('owner', 'admin')
      )
    )
  );

-- ============================================================================
-- POST TAGS
-- ============================================================================

-- Everyone can read tags
CREATE POLICY "post_tags_select" ON public.post_tags
  FOR SELECT USING (TRUE);

-- Tags are managed via posts (cascade delete), but allow direct insert for post authors
CREATE POLICY "post_tags_insert" ON public.post_tags
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND author_id = auth.uid())
  );

CREATE POLICY "post_tags_delete" ON public.post_tags
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND author_id = auth.uid())
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

-- Everyone can read comments
CREATE POLICY "comments_select" ON public.comments
  FOR SELECT USING (TRUE);

-- Users can create comments
CREATE POLICY "comments_insert" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can delete their own comments
CREATE POLICY "comments_delete" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================================================
-- LIKES
-- ============================================================================

CREATE POLICY "likes_select" ON public.likes
  FOR SELECT USING (TRUE);

CREATE POLICY "likes_insert" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_delete" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- FILES
-- ============================================================================

-- Public files: everyone. Friends: only friends. Private: only owner.
CREATE POLICY "files_select" ON public.files
  FOR SELECT USING (
    visibility = 'public'
    OR owner_id = auth.uid()
    OR (
      visibility = 'friends'
      AND EXISTS (
        SELECT 1 FROM public.friendships
        WHERE status = 'accepted'
          AND (
            (requester_id = owner_id AND addressee_id = auth.uid())
            OR (requester_id = auth.uid() AND addressee_id = owner_id)
          )
      )
    )
  );

CREATE POLICY "files_insert" ON public.files
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "files_delete" ON public.files
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================================
-- PROJECTS
-- ============================================================================

CREATE POLICY "projects_select" ON public.projects
  FOR SELECT USING (
    visibility = 'public'
    OR owner_id = auth.uid()
    OR (
      visibility = 'friends'
      AND EXISTS (
        SELECT 1 FROM public.friendships
        WHERE status = 'accepted'
          AND (
            (requester_id = owner_id AND addressee_id = auth.uid())
            OR (requester_id = auth.uid() AND addressee_id = owner_id)
          )
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.project_collaborators
      WHERE project_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "projects_insert" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "projects_update" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "projects_delete" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================================
-- PROJECT COLLABORATORS
-- ============================================================================

CREATE POLICY "project_collaborators_select" ON public.project_collaborators
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "project_collaborators_insert" ON public.project_collaborators
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "project_collaborators_delete" ON public.project_collaborators
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()
    )
  );

-- ============================================================================
-- FRIENDSHIPS
-- ============================================================================

-- Only participants can see friendship records
CREATE POLICY "friendships_select" ON public.friendships
  FOR SELECT USING (
    auth.uid() IN (requester_id, addressee_id)
  );

-- Users can send friend requests
CREATE POLICY "friendships_insert" ON public.friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Only addressee can accept/reject
CREATE POLICY "friendships_update" ON public.friendships
  FOR UPDATE USING (auth.uid() = addressee_id);

-- Either party can delete
CREATE POLICY "friendships_delete" ON public.friendships
  FOR DELETE USING (auth.uid() IN (requester_id, addressee_id));

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Only the recipient can see their notifications
CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_update" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- CONVERSATIONS
-- ============================================================================

-- Only participants can see conversations
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT USING (auth.uid() IN (user_a, user_b));

CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() IN (user_a, user_b));

CREATE POLICY "conversations_update" ON public.conversations
  FOR UPDATE USING (auth.uid() IN (user_a, user_b));

-- ============================================================================
-- MESSAGES
-- ============================================================================

-- Only conversation participants can see messages
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND auth.uid() IN (c.user_a, c.user_b)
    )
  );

CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND auth.uid() IN (c.user_a, c.user_b)
    )
  );

CREATE POLICY "messages_update" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND auth.uid() IN (c.user_a, c.user_b)
    )
  );
