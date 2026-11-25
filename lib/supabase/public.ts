import { createClient } from "@supabase/supabase-js";

// Cookie-free client for public, cacheable reads. RLS limits it to published content.
export function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
