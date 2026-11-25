import type { SupabaseClient } from "@supabase/supabase-js";
import { parseBlocks } from "@/lib/blocks";
import { mediaUrl } from "@/lib/media";
import { savePage } from "./actions";
import { BlockEditor, type LinkOption, type MediaOption } from "./BlockEditor";

type Cat = { id: string; name: string };
type Page = {
  id: string; category_id: string; slug: string; title: string; status: string;
  blocks: unknown; meta_title: string | null; meta_description: string | null;
  canonical_url: string | null; og_image: string | null; noindex: boolean; schema_json: unknown;
};

// Links and images the block editor can pick from.
export async function loadEditorOptions(supabase: SupabaseClient) {
  const [{ data: links }, { data: media }] = await Promise.all([
    supabase.from("links").select("slug, label").order("label"),
    supabase.from("media").select("id, path, alt_text").order("created_at", { ascending: false }),
  ]);
  return {
    links: (links ?? []) as LinkOption[],
    media: (media ?? []).map((m) => ({ id: m.id, url: mediaUrl(m.path), alt_text: m.alt_text })) as MediaOption[],
  };
}

export function PageForm({ categories, page, links, media }: {
  categories: Cat[]; page?: Page; links: LinkOption[]; media: MediaOption[];
}) {
  const input = "w-full rounded border border-neutral-300 p-2";
  const label = "block text-sm font-medium text-neutral-700";
  return (
    <form action={savePage} className="space-y-4">
      {page && <input type="hidden" name="id" value={page.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Category
          <select name="category_id" required defaultValue={page?.category_id ?? ""} className={`${input} mt-1`}>
            <option value="" disabled>Choose category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className={label}>Status
          <select name="status" defaultValue={page?.status ?? "draft"} className={`${input} mt-1`}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>
      <label className={label}>Title (H1)
        <input name="title" required defaultValue={page?.title} placeholder="Best Dive Watches Under $300" className={`${input} mt-1`} />
      </label>
      <label className={label}>Slug
        <input name="slug" required defaultValue={page?.slug} placeholder="best-dive-watches-under-300" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={`${input} mt-1`} />
      </label>

      <h2 className="pt-4 text-lg font-semibold">Content</h2>
      <BlockEditor initial={parseBlocks(page?.blocks)} links={links} media={media} />

      <h2 className="pt-4 text-lg font-semibold">SEO</h2>
      <label className={label}>Meta title (max 60)
        <input name="meta_title" maxLength={60} defaultValue={page?.meta_title ?? ""} placeholder="Best Dive Watches Under $300 (2026) | millionaireoutlet" className={`${input} mt-1`} />
      </label>
      <label className={label}>Meta description (max 160)
        <textarea name="meta_description" maxLength={160} rows={2} defaultValue={page?.meta_description ?? ""} className={`${input} mt-1`} />
      </label>
      <label className={label}>OG image (1200x630). Pick from the media library or paste a URL. Leave empty for the default.
        <input name="og_image" list="media-urls" defaultValue={page?.og_image ?? ""} className={`${input} mt-1`} />
        <datalist id="media-urls">
          {media.map((m) => <option key={m.id} value={m.url}>{m.alt_text}</option>)}
        </datalist>
      </label>
      <label className={label}>Canonical URL (leave empty to use this page&apos;s own URL)
        <input name="canonical_url" type="url" defaultValue={page?.canonical_url ?? ""} className={`${input} mt-1`} />
      </label>
      <label className={label}>Extra JSON-LD schema (optional; Article, Breadcrumb and FAQ are added automatically)
        <textarea name="schema_json" rows={4} defaultValue={page?.schema_json ? JSON.stringify(page.schema_json, null, 2) : ""} className={`${input} mt-1 font-mono text-sm`} />
      </label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="noindex" defaultChecked={page?.noindex} /> noindex (hide from search engines)</label>
      <div className="sticky bottom-0 border-t bg-white py-3">
        <button className="rounded bg-black px-4 py-2 text-white">Save</button>
      </div>
    </form>
  );
}
