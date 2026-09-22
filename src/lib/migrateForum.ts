/**
 * Client-side migration script for moving old forum data from localStorage to Supabase.
 *
 * This script runs ONCE on the first login of the original data owner.
 * It reads localStorage data (forum threads, upvotes) and inserts them into
 * the 'forum' service community in Supabase.
 *
 * Flow:
 * 1. Check if migration already completed (localStorage flag)
 * 2. Read old forum data from localStorage
 * 3. Read old upvotes from localStorage
 * 4. Insert posts, comments, likes into Supabase
 * 5. Set migration flag in localStorage
 *
 * Usage:
 *   import { migrateForumFromLocalStorage } from './migrateForum';
 *   await migrateForumFromLocalStorage(supabase, userId);
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Post, PostInsert, PostTag, Comment, CommentInsert, Like } from '../types/database';
import { LS_KEYS } from './constants';

const FORUM_COMMUNITY_ID = 'a0000000-0000-0000-0000-000000000001';

// Category to tag mapping
const CATEGORY_TAG_MAP: Record<string, string> = {
  'Хостинги': 'category-hosts',
  'WireGuard': 'category-wireguard',
  'IKEv2': 'category-ikev2',
  'OpenVPN': 'category-openvpn',
  'Диагностика': 'category-diagnostics'
};

interface OldForumThread {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  content: string;
  tags: string[];
  replies: OldForumReply[];
  upvotes?: number;
}

interface OldForumReply {
  id: string;
  author: string;
  date: string;
  content: string;
}

interface OldUpvotes {
  [key: string]: string[]; // key: "thread-{id}" or "reply-{id}", value: array of user IDs
}

interface MigrationResult {
  success: boolean;
  postsMigrated: number;
  commentsMigrated: number;
  likesMigrated: number;
  error?: string;
}

/**
 * Check if forum migration is needed and possible.
 */
export function isForumMigrationNeeded(): boolean {
  // Migration not needed if flag is set
  if (localStorage.getItem(LS_KEYS.FORUM_MIGRATED)) {
    return false;
  }

  // Migration possible only if old data exists
  const forumData = localStorage.getItem(LS_KEYS.FORUM_DATA);
  return forumData !== null;
}

/**
 * Migrate forum data from localStorage to Supabase.
 *
 * @param supabase - Supabase client instance
 * @param currentUserId - ID of the current user (data owner)
 * @returns Migration result with counts
 */
export async function migrateForumFromLocalStorage(
  supabase: SupabaseClient<Database>,
  currentUserId: string
): Promise<MigrationResult> {
  // Check if already migrated
  if (localStorage.getItem(LS_KEYS.FORUM_MIGRATED)) {
    return { success: true, postsMigrated: 0, commentsMigrated: 0, likesMigrated: 0 };
  }

  try {
    // Read old data
    const forumDataRaw = localStorage.getItem(LS_KEYS.FORUM_DATA);
    const upvotesRaw = localStorage.getItem(LS_KEYS.UPVOTES);

    if (!forumDataRaw) {
      return { success: true, postsMigrated: 0, commentsMigrated: 0, likesMigrated: 0 };
    }

    const threads: OldForumThread[] = JSON.parse(forumDataRaw);
    const upvotes: OldUpvotes = upvotesRaw ? JSON.parse(upvotesRaw) : {};

    let postsMigrated = 0;
    let commentsMigrated = 0;
    let likesMigrated = 0;

    // Migrate each thread
    for (const thread of threads) {
      // Create post
      const postData: PostInsert = {
        author_id: currentUserId,
        community_id: FORUM_COMMUNITY_ID,
        title: thread.title,
        body: thread.content,
        created_at: new Date(thread.date).toISOString()
      };
      
      const { data: post, error: postError } = await (supabase
        .from('posts')
        .insert(postData as unknown as never)
        .select()
        .single() as unknown as Promise<{ data: Post | null; error: unknown }>);

      if (postError || !post) {
        console.error(`Failed to migrate thread ${thread.id}:`, postError);
        continue;
      }

      postsMigrated++;

      // Add tags (category + original tags)
      const allTags = [...thread.tags];
      const categoryTag = CATEGORY_TAG_MAP[thread.category];
      if (categoryTag && !allTags.includes(categoryTag)) {
        allTags.push(categoryTag);
      }

      if (allTags.length > 0) {
        const tagRows: PostTag[] = allTags.map(tag => ({ post_id: post.id, tag }));
        await supabase.from('post_tags').insert(tagRows as unknown as never);
      }

      // Migrate comments (replies)
      for (const reply of thread.replies) {
        const commentData: CommentInsert = {
          post_id: post.id,
          author_id: currentUserId,
          body: reply.content,
          created_at: new Date(reply.date).toISOString()
        };
        
        const { error: commentError } = await supabase
          .from('comments')
          .insert(commentData as unknown as never);

        if (!commentError) {
          commentsMigrated++;
        }
      }

      // Migrate likes (upvotes)
      const threadUpvoteKey = `thread-${thread.id}`;
      const threadVoters = upvotes[threadUpvoteKey] || [];

      // For old data, we only have voter IDs, not actual user IDs in Supabase.
      // We'll create likes for the current user if they upvoted.
      // Other voters are ignored (they don't have Supabase accounts yet).
      if (threadVoters.includes(currentUserId)) {
        const likeData: Omit<Like, 'created_at'> = {
          user_id: currentUserId,
          target_type: 'post',
          target_id: post.id
        };
        
        const { error: likeError } = await supabase
          .from('likes')
          .insert(likeData as unknown as never);

        if (!likeError) {
          likesMigrated++;
        }
      }

      // Migrate reply upvotes (simplified: only current user's upvotes)
      for (const reply of thread.replies) {
        const replyUpvoteKey = `reply-${reply.id}`;
        const replyVoters = upvotes[replyUpvoteKey] || [];

        if (replyVoters.includes(currentUserId)) {
          // We need the comment ID, but we didn't store it. Skip for now.
          // In a production migration, we'd fetch the comment ID after insert.
        }
      }
    }

    // Mark migration as complete
    localStorage.setItem(LS_KEYS.FORUM_MIGRATED, 'true');

    return {
      success: true,
      postsMigrated,
      commentsMigrated,
      likesMigrated
    };
  } catch (err) {
    return {
      success: false,
      postsMigrated: 0,
      commentsMigrated: 0,
      likesMigrated: 0,
      error: (err as Error).message
    };
  }
}

/**
 * Migrate user reputation from localStorage to Supabase profile.
 *
 * @param supabase - Supabase client instance
 * @param currentUserId - ID of the current user
 */
export async function migrateReputationFromLocalStorage(
  supabase: SupabaseClient<Database>,
  currentUserId: string
): Promise<void> {
  const userRaw = localStorage.getItem(LS_KEYS.USER);
  if (!userRaw) return;

  try {
    const userData = JSON.parse(userRaw);
    const reputation = userData.reputation || 0;

    if (reputation > 0) {
      await supabase
        .from('profiles')
        .update({ reputation } as unknown as never)
        .eq('id', currentUserId);
    }
  } catch (err) {
    console.error('Failed to migrate reputation:', err);
  }
}

/**
 * Run all migrations (forum + reputation).
 *
 * @param supabase - Supabase client instance
 * @param currentUserId - ID of the current user
 */
export async function runAllMigrations(
  supabase: SupabaseClient<Database>,
  currentUserId: string
): Promise<{ forum: MigrationResult; reputation: void }> {
  const forum = await migrateForumFromLocalStorage(supabase, currentUserId);
  const reputation = await migrateReputationFromLocalStorage(supabase, currentUserId);
  return { forum, reputation };
}
