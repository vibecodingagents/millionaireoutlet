import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";
import { saveCategory, deleteCategory } from "../../actions";

export default async function Categories({ searchParams }: { searchParams: Promise<{ error?: string; edit?: string }> }) {
  const { error, edit } = await searchParams;
  const supabase = await serverClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const editing = categories?.find((c) => c.id === edit);
  const input = "w-full rounded border border-neutral-300 p-2";
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Categories</h1>
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <ul className="mb-8 divide-y">
        {categories?.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-2">
            <span>{c.name} <span className="text-sm text-gray-500">/{c.slug}</span></span>
            <span className="flex items-center gap-4 text-sm">
              <Link href={`/admin/categories?edit=${c.id}`} className="underline">Edit</Link>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <button className="text-red-600 underline">Delete</button>
              </form>
            </span>
          </li>
        ))}
        {!categories?.length && <li className="py-2 text-gray-500">No categories yet.</li>}
      </ul>
      <h2 className="mb-3 text-lg font-semibold">{editing ? `Edit ${editing.name}` : "Add category"}</h2>
      {/* key resets the uncontrolled fields when switching between add and edit. */}
      <form key={editing?.id ?? "new"} action={saveCategory} className="space-y-3">
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <input name="name" required defaultValue={editing?.name} placeholder="Name (e.g. Watches)" className={input} />
        <input name="slug" required defaultValue={editing?.slug} placeholder="slug (e.g. watches)" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={input} />
        <textarea name="description" rows={5} defaultValue={editing?.description ?? ""} placeholder="Intro shown on the category page (100-200 words). Supports **bold** and [links](/watches/page)." className={input} />
        <input name="meta_title" maxLength={60} defaultValue={editing?.meta_title ?? ""} placeholder="Meta title (max 60)" className={input} />
        <input name="meta_description" maxLength={160} defaultValue={editing?.meta_description ?? ""} placeholder="Meta description (max 160)" className={input} />
        <input name="og_image" defaultValue={editing?.og_image ?? ""} placeholder="OG image URL (optional)" className={input} />
        <div className="flex gap-3">
          <button className="rounded bg-black px-3 py-2 text-white">{editing ? "Save changes" : "Add category"}</button>
          {editing && <Link href="/admin/categories" className="rounded border px-3 py-2">Cancel</Link>}
        </div>
      </form>
    </div>
  );
}
