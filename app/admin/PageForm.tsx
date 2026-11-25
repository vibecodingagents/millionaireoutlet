import { savePage } from "./actions";

type Cat = { id: string; name: string };
type Page = {
  id: string; category_id: string; slug: string; title: string; status: string;
  blocks: { type: string; text?: string }[]; meta_title: string | null; meta_description: string | null;
  canonical_url: string | null; og_image: string | null; noindex: boolean; schema_json: unknown;
};

export function PageForm({ categories, page }: { categories: Cat[]; page?: Page }) {
  const input = "w-full rounded border p-2";
  const body = page?.blocks?.map((b) => b.text ?? "").join("\n\n") ?? "";
  return (
    <form action={savePage} className="space-y-3">
      {page && <input type="hidden" name="id" value={page.id} />}
      <select name="category_id" required defaultValue={page?.category_id ?? ""} className={input}>
        <option value="" disabled>Choose category</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input name="title" required defaultValue={page?.title} placeholder="Title (H1)" className={input} />
      <input name="slug" required defaultValue={page?.slug} placeholder="slug (e.g. best-dive-watches-under-300)" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={input} />
      <textarea name="body" rows={12} defaultValue={body} placeholder="Page content" className={input} />
      <h2 className="pt-2 font-semibold">SEO</h2>
      <input name="meta_title" maxLength={60} defaultValue={page?.meta_title ?? ""} placeholder="Meta title (max 60)" className={input} />
      <input name="meta_description" maxLength={160} defaultValue={page?.meta_description ?? ""} placeholder="Meta description (max 160)" className={input} />
      <input name="canonical_url" defaultValue={page?.canonical_url ?? ""} placeholder="Canonical URL (optional)" className={input} />
      <input name="og_image" defaultValue={page?.og_image ?? ""} placeholder="OG image URL (1200x630)" className={input} />
      <textarea name="schema_json" rows={4} defaultValue={page?.schema_json ? JSON.stringify(page.schema_json, null, 2) : ""} placeholder="Extra JSON-LD schema (optional)" className={`${input} font-mono text-sm`} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="noindex" defaultChecked={page?.noindex} /> noindex (hide from search engines)</label>
      <select name="status" defaultValue={page?.status ?? "draft"} className={input}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <button className="rounded bg-black px-3 py-2 text-white">Save</button>
    </form>
  );
}
