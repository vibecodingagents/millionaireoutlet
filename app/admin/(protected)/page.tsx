import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await serverClient();
  const [{ count: pages }, { count: published }, { count: categories }] = await Promise.all([
    supabase.from("pages").select("*", { count: "exact", head: true }),
    supabase.from("pages").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <p>{pages ?? 0} pages ({published ?? 0} published) in {categories ?? 0} categories.</p>
      <div className="mt-6 flex gap-4">
        <Link className="rounded bg-black px-3 py-2 text-white" href="/admin/pages/new">New page</Link>
        <Link className="rounded border px-3 py-2" href="/admin/categories">Manage categories</Link>
      </div>
    </div>
  );
}
