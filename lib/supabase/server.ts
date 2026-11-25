import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function serverClient() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Called from a Server Component; the proxy refreshes the session instead.
          }
        },
      },
    },
  );
}

// Redirects to the login page unless the signed-in user has app_metadata.role = 'admin'.
export async function requireAdmin() {
  const supabase = await serverClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user || data.user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }
  return supabase;
}
