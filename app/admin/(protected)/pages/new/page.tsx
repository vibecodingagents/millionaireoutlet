import { serverClient } from "@/lib/supabase/server";
import { loadEditorOptions, PageForm } from "../../../PageForm";

export default async function NewPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await serverClient();
  const [{ data: categories }, options] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    loadEditorOptions(supabase),
  ]);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">New page</h1>
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {categories?.length ? <PageForm categories={categories} {...options} /> : <p>Create a category first.</p>}
    </div>
  );
}
