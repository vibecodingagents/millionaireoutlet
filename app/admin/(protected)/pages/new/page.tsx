import { serverClient } from "@/lib/supabase/server";
import { PageForm } from "../../../PageForm";

export default async function NewPage() {
  const supabase = await serverClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">New page</h1>
      {categories?.length ? <PageForm categories={categories} /> : <p>Create a category first.</p>}
    </div>
  );
}
