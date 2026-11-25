import { serverClient } from "@/lib/supabase/server";
import { saveCategory, deleteCategory } from "../../actions";

export default async function Categories({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await serverClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const input = "w-full rounded border p-2";
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Categories</h1>
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <ul className="mb-8 divide-y">
        {categories?.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-2">
            <span>{c.name} <span className="text-sm text-gray-500">/{c.slug}</span></span>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <button className="text-sm text-red-600 underline">Delete</button>
            </form>
          </li>
        ))}
        {!categories?.length && <li className="py-2 text-gray-500">No categories yet.</li>}
      </ul>
      <h2 className="mb-3 text-lg font-semibold">Add category</h2>
      <form action={saveCategory} className="space-y-3">
        <input name="name" required placeholder="Name (e.g. Watches)" className={input} />
        <input name="slug" required placeholder="slug (e.g. watches)" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={input} />
        <textarea name="description" placeholder="Intro text shown on the category page" className={input} />
        <input name="meta_title" maxLength={60} placeholder="Meta title (max 60)" className={input} />
        <input name="meta_description" maxLength={160} placeholder="Meta description (max 160)" className={input} />
        <input name="og_image" placeholder="OG image URL" className={input} />
        <button className="rounded bg-black px-3 py-2 text-white">Add category</button>
      </form>
    </div>
  );
}
