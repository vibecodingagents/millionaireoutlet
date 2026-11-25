import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";
import { deletePage } from "../../actions";

export default async function Pages({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await serverClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("id, title, slug, status, updated_at, categories(name, slug)")
    .order("updated_at", { ascending: false });
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Link href="/admin/pages/new" className="rounded bg-black px-3 py-2 text-white">New page</Link>
      </div>
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <ul className="divide-y">
        {pages?.map((p) => {
          const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
          return (
            <li key={p.id} className="flex items-center justify-between gap-4 py-2">
              <Link href={`/admin/pages/${p.id}`} className="hover:underline">
                {p.title} <span className="text-sm text-gray-500">/{cat?.slug}/{p.slug}</span>
              </Link>
              <span className="flex shrink-0 items-center gap-4 text-sm">
                <span className={p.status === "published" ? "text-green-700" : "text-gray-500"}>{p.status}</span>
                {p.status === "published" && <a href={`/${cat?.slug}/${p.slug}`} target="_blank" className="underline">View</a>}
                <form action={deletePage}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-red-600 underline">Delete</button>
                </form>
              </span>
            </li>
          );
        })}
        {!pages?.length && <li className="py-2 text-gray-500">No pages yet.</li>}
      </ul>
    </div>
  );
}
