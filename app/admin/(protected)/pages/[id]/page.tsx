import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { PageForm } from "../../../PageForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await serverClient();
  const [{ data: page }, { data: categories }] = await Promise.all([
    supabase.from("pages").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("name"),
  ]);
  if (!page) notFound();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Edit page</h1>
      <PageForm categories={categories ?? []} page={page} />
    </div>
  );
}
