"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, serverClient } from "@/lib/supabase/server";

const text = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? "").trim();
  return v === "" ? null : v;
};

export async function signOut() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const row = {
    name: text(formData, "name")!,
    slug: text(formData, "slug")!,
    description: text(formData, "description"),
    meta_title: text(formData, "meta_title"),
    meta_description: text(formData, "meta_description"),
    og_image: text(formData, "og_image"),
  };
  const { error } = id
    ? await supabase.from("categories").update(row).eq("id", id)
    : await supabase.from("categories").insert(row);
  if (error) redirect(`/admin/categories?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", String(formData.get("id")));
  if (error) redirect(`/admin/categories?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function savePage(formData: FormData) {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status") === "published" ? "published" : "draft";
  const body = String(formData.get("body") ?? "").trim();
  let schema_json: unknown = null;
  const rawSchema = text(formData, "schema_json");
  if (rawSchema) {
    try {
      schema_json = JSON.parse(rawSchema);
    } catch {
      redirect(`/admin/pages?error=${encodeURIComponent("Schema JSON is not valid JSON")}`);
    }
  }
  const row = {
    category_id: text(formData, "category_id")!,
    slug: text(formData, "slug")!,
    title: text(formData, "title")!,
    status,
    blocks: body ? [{ type: "text", text: body }] : [],
    meta_title: text(formData, "meta_title"),
    meta_description: text(formData, "meta_description"),
    canonical_url: text(formData, "canonical_url"),
    og_image: text(formData, "og_image"),
    noindex: formData.get("noindex") === "on",
    schema_json,
    ...(status === "published" ? { published_at: new Date().toISOString() } : {}),
  };
  const { error } = id
    ? await supabase.from("pages").update(row).eq("id", id)
    : await supabase.from("pages").insert(row);
  if (error) redirect(`/admin/pages?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin/pages");
}

export async function deletePage(formData: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("pages").delete().eq("id", String(formData.get("id")));
  if (error) redirect(`/admin/pages?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin/pages");
}
