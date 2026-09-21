// supabase/functions/check-file-size/index.ts
//
// Edge Function: validates file size before issuing a signed upload URL.
//
// Flow:
// 1. Client sends: { filename, size_bytes, mime_type, visibility }
// 2. Function validates size (≤ 50 MB) and MIME type
// 3. Returns a signed upload URL for Supabase Storage
//
// Deploy: supabase functions deploy check-file-size
// Local: supabase functions serve

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'text/markdown', 'application/json'];
const ALLOWED_ARCHIVE_TYPES = ['application/zip', 'application/gzip', 'application/x-tar'];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_ARCHIVE_TYPES];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  filename: string;
  size_bytes: number;
  mime_type: string;
  visibility: 'public' | 'friends' | 'private';
  bucket: 'avatars' | 'user-files';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse body
    const body: RequestBody = await req.json();
    const { filename, size_bytes, mime_type, visibility, bucket } = body;

    // Validate required fields
    if (!filename || !size_bytes || !mime_type || !bucket) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate bucket
    if (bucket !== 'avatars' && bucket !== 'user-files') {
      return new Response(JSON.stringify({ error: 'Invalid bucket' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate MIME type
    if (!ALLOWED_FILE_TYPES.includes(mime_type)) {
      return new Response(JSON.stringify({ error: `MIME type ${mime_type} not allowed` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate size
    const maxSize = bucket === 'avatars' ? MAX_AVATAR_SIZE_BYTES : MAX_FILE_SIZE_BYTES;
    if (size_bytes > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return new Response(JSON.stringify({ error: `File too large (max ${maxMB} MB)` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (size_bytes <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid file size' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate visibility for user-files bucket
    if (bucket === 'user-files' && !['public', 'friends', 'private'].includes(visibility)) {
      return new Response(JSON.stringify({ error: 'Invalid visibility' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate file ID and path
    const fileId = crypto.randomUUID();
    const path = bucket === 'avatars'
      ? `${user.id}/${filename}`
      : `${user.id}/${fileId}/${filename}`;

    // Create signed upload URL (valid for 10 minutes)
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (urlError || !signedUrl) {
      return new Response(JSON.stringify({ error: 'Failed to create upload URL' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create file record in DB
    const { error: dbError } = await supabase.from('files').insert({
      id: fileId,
      owner_id: user.id,
      bucket_path: path,
      filename,
      mime_type,
      size_bytes,
      visibility: bucket === 'avatars' ? 'public' : visibility,
    });

    if (dbError) {
      return new Response(JSON.stringify({ error: 'Failed to create file record' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        file_id: fileId,
        upload_url: signedUrl.signedUrl,
        path,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
