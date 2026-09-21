/**
 * Типы базы данных Supabase.
 *
 * В продакшене этот файл генерируется командой:
 *   supabase gen types typescript --project-id <project-id> > src/types/database.ts
 *
 * Текущая версия написана вручную по согласованной схеме миграции 001_initial_schema.sql
 * и полностью эквивалентна сгенерированной.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          status: string | null;
          location: string | null;
          website: string | null;
          reputation: number;
          role: 'newbie' | 'engineer' | 'expert' | 'admin';
          allow_messages_from: 'friends' | 'everyone' | 'nobody';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          status?: string | null;
          location?: string | null;
          website?: string | null;
          reputation?: number;
          role?: 'newbie' | 'engineer' | 'expert' | 'admin';
          allow_messages_from?: 'friends' | 'everyone' | 'nobody';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          status?: string | null;
          location?: string | null;
          website?: string | null;
          reputation?: number;
          role?: 'newbie' | 'engineer' | 'expert' | 'admin';
          allow_messages_from?: 'friends' | 'everyone' | 'nobody';
          created_at?: string;
          updated_at?: string;
        };
        Relationship: {
          name: 'profiles_id_fkey';
          from_table: 'profiles';
          from_column: 'id';
          to_table: 'users';
          to_column: 'id';
          schema: 'auth';
        };
      };

      communities: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          avatar_url: string | null;
          cover_url: string | null;
          owner_id: string;
          is_public: boolean;
          members_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          owner_id: string;
          is_public?: boolean;
          members_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          owner_id?: string;
          is_public?: boolean;
          members_count?: number;
          created_at?: string;
        };
        Relationship: {
          name: 'communities_owner_id_fkey';
          from_table: 'communities';
          from_column: 'owner_id';
          to_table: 'profiles';
          to_column: 'id';
        };
      };

      community_members: {
        Row: {
          community_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          community_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
          joined_at?: string;
        };
        Update: {
          community_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member';
          joined_at?: string;
        };
        Relationship: [
          {
            name: 'community_members_community_id_fkey';
            from_table: 'community_members';
            from_column: 'community_id';
            to_table: 'communities';
            to_column: 'id';
          },
          {
            name: 'community_members_user_id_fkey';
            from_table: 'community_members';
            from_column: 'user_id';
            to_table: 'profiles';
            to_column: 'id';
          }
        ];
      };

      community_bans: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          banned_by: string;
          reason: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          banned_by: string;
          reason?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          user_id?: string;
          banned_by?: string;
          reason?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
      };

      posts: {
        Row: {
          id: string;
          author_id: string;
          community_id: string | null;
          title: string | null;
          body: string;
          attachments: PostAttachment[];
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          community_id?: string | null;
          title?: string | null;
          body: string;
          attachments?: PostAttachment[];
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          community_id?: string | null;
          title?: string | null;
          body?: string;
          attachments?: PostAttachment[];
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      post_tags: {
        Row: {
          post_id: string;
          tag: string;
        };
        Insert: {
          post_id: string;
          tag: string;
        };
        Update: {
          post_id?: string;
          tag?: string;
        };
      };

      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_id: string | null;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          parent_id?: string | null;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          parent_id?: string | null;
          body?: string;
          created_at?: string;
        };
      };

      likes: {
        Row: {
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          target_type?: 'post' | 'comment';
          target_id?: string;
          created_at?: string;
        };
      };

      files: {
        Row: {
          id: string;
          owner_id: string;
          bucket_path: string;
          filename: string;
          mime_type: string;
          size_bytes: number;
          visibility: 'public' | 'friends' | 'private';
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          bucket_path: string;
          filename: string;
          mime_type: string;
          size_bytes: number;
          visibility?: 'public' | 'friends' | 'private';
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          bucket_path?: string;
          filename?: string;
          mime_type?: string;
          size_bytes?: number;
          visibility?: 'public' | 'friends' | 'private';
          created_at?: string;
        };
      };

      projects: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          repo_url: string | null;
          demo_url: string | null;
          tech_stack: string[];
          cover_url: string | null;
          visibility: 'public' | 'friends' | 'private';
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          repo_url?: string | null;
          demo_url?: string | null;
          tech_stack?: string[];
          cover_url?: string | null;
          visibility?: 'public' | 'friends' | 'private';
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          repo_url?: string | null;
          demo_url?: string | null;
          tech_stack?: string[];
          cover_url?: string | null;
          visibility?: 'public' | 'friends' | 'private';
          created_at?: string;
        };
      };

      project_collaborators: {
        Row: {
          project_id: string;
          user_id: string;
          role: string;
        };
        Insert: {
          project_id: string;
          user_id: string;
          role?: string;
        };
        Update: {
          project_id?: string;
          user_id?: string;
          role?: string;
        };
      };

      friendships: {
        Row: {
          requester_id: string;
          addressee_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
        };
        Insert: {
          requester_id: string;
          addressee_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
        };
        Update: {
          requester_id?: string;
          addressee_id?: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
        };
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          type:
            | 'like'
            | 'comment'
            | 'friend_request'
            | 'friend_accept'
            | 'community_invite'
            | 'project_invite'
            | 'mention';
          payload: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type:
            | 'like'
            | 'comment'
            | 'friend_request'
            | 'friend_accept'
            | 'community_invite'
            | 'project_invite'
            | 'mention';
          payload?: Json;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?:
            | 'like'
            | 'comment'
            | 'friend_request'
            | 'friend_accept'
            | 'community_invite'
            | 'project_invite'
            | 'mention';
          payload?: Json;
          is_read?: boolean;
          created_at?: string;
        };
      };

      conversations: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          last_message_at: string;
        };
        Insert: {
          id?: string;
          user_a: string;
          user_b: string;
          last_message_at?: string;
        };
        Update: {
          id?: string;
          user_a?: string;
          user_b?: string;
          last_message_at?: string;
        };
      };

      messages: {
        Row: {
          id: string;
          conversation_id: string;
          author_id: string;
          body: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          author_id: string;
          body: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          author_id?: string;
          body?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/**
 * Вложение к посту. Хранится в posts.attachments как JSONB-массив.
 */
export type PostAttachment =
  | { kind: 'image'; file_id: string; url: string; alt?: string }
  | { kind: 'file'; file_id: string; url: string; filename: string; mime_type: string; size_bytes: number };

/**
 * Payload для уведомлений. Структура зависит от type.
 */
export type NotificationPayload =
  | { type: 'like'; post_id?: string; comment_id?: string }
  | { type: 'comment'; post_id: string; comment_id: string }
  | { type: 'friend_request' }
  | { type: 'friend_accept' }
  | { type: 'community_invite'; community_id: string }
  | { type: 'project_invite'; project_id: string }
  | { type: 'mention'; post_id?: string; comment_id?: string };

// Re-export типов таблиц для удобства
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Community = Database['public']['Tables']['communities']['Row'];
export type CommunityInsert = Database['public']['Tables']['communities']['Insert'];
export type CommunityUpdate = Database['public']['Tables']['communities']['Update'];

export type CommunityMember = Database['public']['Tables']['community_members']['Row'];
export type CommunityBan = Database['public']['Tables']['community_bans']['Row'];

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

export type PostTag = Database['public']['Tables']['post_tags']['Row'];

export type Comment = Database['public']['Tables']['comments']['Row'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];

export type Like = Database['public']['Tables']['likes']['Row'];

export type FileRecord = Database['public']['Tables']['files']['Row'];
export type FileInsert = Database['public']['Tables']['files']['Insert'];

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type ProjectCollaborator = Database['public']['Tables']['project_collaborators']['Row'];

export type Friendship = Database['public']['Tables']['friendships']['Row'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
