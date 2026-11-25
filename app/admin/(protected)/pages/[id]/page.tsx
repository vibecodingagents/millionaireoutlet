import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { loadEditorOptions, PageForm } from "../../../PageForm";

export default async function EditPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const supabase = await serverClient();
  const [{ data: page }, { data: categories }, options] = await Promise.all([
    supabase.from("pages").select("*, categories(slug)").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("name"),
    loadEditorOptions(supabase),
  ]);
  if (!page) notFound();
  const cat = Array.isArray(page.categories) ? page.categories[0] : page.categories;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit page</h1>
        {page.status === "published" && cat && (
          <a href={`/${cat.slug}/${page.slug}`} target="_blank" className="text-sm underline">View live ↗</a>
        )}
      </div>
      {saved && <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">Saved.</p>}
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <PageForm categories={categories ?? []} page={page} {...options} />
    </div>
  );
}
