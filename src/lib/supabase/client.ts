import { createBrowserClient } from '@supabase/ssr';

/**
 * Static export (see next.config.mjs) has no server runtime, so this app can
 * only ever use the browser Supabase client - there is no server.ts or
 * middleware.ts here, unlike the standard Next.js SSR starter, because
 * cookies()-based server clients and middleware require a server to run in.
 */
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY env vars.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
