import { daysAgoIso } from "@/lib/site";
import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";
import { deleteLink, saveLink } from "../../actions";

export default async function Links({ searchParams }: { searchParams: Promise<{ error?: string; edit?: string }> }) {
  const { error, edit } = await searchParams;
  const supabase = await serverClient();
  const since = daysAgoIso(30);
  const [{ data: links }, { data: recent }] = await Promise.all([
    supabase.from("links").select("*").order("label"),
    supabase.from("link_clicks").select("link_id").gte("created_at", since).limit(50000),
  ]);
  const last30 = new Map<string, number>();
  for (const c of recent ?? []) last30.set(c.link_id, (last30.get(c.link_id) ?? 0) + 1);
  const editing = links?.find((l) => l.id === edit);
  const input = "w-full rounded border border-neutral-300 p-2";
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Affiliate links</h1>
      <p className="mb-6 text-sm text-neutral-600">
        Each link is served at <code>/go/slug</code> with <code>rel=&quot;sponsored nofollow&quot;</code>. Change a
        destination here and every page using it updates.
      </p>
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-neutral-500">
            <tr><th className="py-2">Label</th><th>Path</th><th className="text-right">30 days</th><th className="text-right">All time</th><th /></tr>
          </thead>
          <tbody className="divide-y">
            {links?.map((l) => (
              <tr key={l.id}>
                <td className="py-2">
                  {l.label}
                  <div className="max-w-xs truncate text-xs text-neutral-500" title={l.destination_url}>{l.destination_url}</div>
                </td>
                <td><code>/go/{l.slug}</code></td>
                <td className="text-right">{last30.get(l.id) ?? 0}</td>
                <td className="text-right font-semibold">{l.clicks}</td>
                <td className="pl-4 text-right">
                  <span className="flex justify-end gap-3">
                    <Link href={`/admin/links?edit=${l.id}`} className="underline">Edit</Link>
                    <form action={deleteLink}>
                      <input type="hidden" name="id" value={l.id} />
                      <button className="text-red-600 underline">Delete</button>
                    </form>
                  </span>
                </td>
              </tr>
            ))}
            {!links?.length && <tr><td colSpan={5} className="py-2 text-gray-500">No links yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <h2 className="mb-3 text-lg font-semibold">{editing ? `Edit ${editing.label}` : "Add link"}</h2>
      <form key={editing?.id ?? "new"} action={saveLink} className="space-y-3">
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <input name="label" required defaultValue={editing?.label} placeholder="Label (e.g. Seiko SRPD at Amazon)" className={input} />
        <input name="slug" required defaultValue={editing?.slug} placeholder="slug (e.g. seiko-srpd-amazon)" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={input} />
        <input name="destination_url" type="url" required defaultValue={editing?.destination_url} placeholder="https://www.amazon.com/dp/...?tag=yourtag-20" className={input} />
        <p className="text-xs text-neutral-500">Use US affiliate programs only. Include your tracking ID in the destination.</p>
        <div className="flex gap-3">
          <button className="rounded bg-black px-3 py-2 text-white">{editing ? "Save changes" : "Add link"}</button>
          {editing && <Link href="/admin/links" className="rounded border px-3 py-2">Cancel</Link>}
        </div>
      </form>
    </div>
  );
}
