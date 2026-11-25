import { daysAgoIso } from "@/lib/site";
import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await serverClient();
  const since = daysAgoIso(30);
  const [pages, published, categories, links, media, clicks30, topLinks] = await Promise.all([
    supabase.from("pages").select("*", { count: "exact", head: true }),
    supabase.from("pages").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("links").select("*", { count: "exact", head: true }),
    supabase.from("media").select("*", { count: "exact", head: true }),
    supabase.from("link_clicks").select("*", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("links").select("slug, label, clicks").order("clicks", { ascending: false }).limit(5),
  ]);
  const stats = [
    ["Published pages", `${published.count ?? 0} / ${pages.count ?? 0}`],
    ["Categories", categories.count ?? 0],
    ["Affiliate links", links.count ?? 0],
    ["Clicks (30 days)", clicks30.count ?? 0],
    ["Images", media.count ?? 0],
  ];
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded border p-4">
            <dt className="text-xs text-neutral-500">{k}</dt>
            <dd className="mt-1 text-2xl font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded bg-black px-3 py-2 text-white" href="/admin/pages/new">New page</Link>
        <Link className="rounded border px-3 py-2" href="/admin/links">Add affiliate link</Link>
        <Link className="rounded border px-3 py-2" href="/admin/media">Upload image</Link>
      </div>
      {!!topLinks.data?.length && (
        <>
          <h2 className="mb-2 mt-10 text-lg font-semibold">Top links (all time)</h2>
          <ul className="divide-y rounded border">
            {topLinks.data.map((l) => (
              <li key={l.slug} className="flex justify-between p-3 text-sm">
                <span>{l.label} <span className="text-neutral-500">/go/{l.slug}</span></span>
                <span className="font-semibold">{l.clicks}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
