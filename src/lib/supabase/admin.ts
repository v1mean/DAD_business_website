// Privileged Server-Only Supabase Client
// Uses SUPABASE_SERVICE_ROLE_KEY. Never expose to client bundles.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey === "your-service-role-key-here") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations but is not configured."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
