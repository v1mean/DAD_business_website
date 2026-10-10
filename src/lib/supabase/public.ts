import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Lightweight, stateless client for public data fetching.
 * Does not read or write cookies, making it safe for static prerendering
 * (generateStaticParams, SSG, ISR) and Partial Prerendering.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
