"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseBlocks } from "@/lib/blocks";
import { MEDIA_BUCKET } from "@/lib/media";
import { requireAdmin, serverClient } from "@/lib/supabase/server";

const text = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? "").trim();
  return v === "" ? null : v;
};

const fail = (path: string, message: string): never => redirect(`${path}?error=${encodeURIComponent(message)}`);

// Any content change refreshes every public page (header/footer list categories, cards list pages).
const refreshSite = () => revalidatePath("/", "layout");

export async function signOut() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* Categories */

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
  if (error) fail("/admin/categories", error.message);
  refreshSite();
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", String(formData.get("id")));
  if (error) fail("/admin/categories", error.message.includes("foreign key") ? "Move or delete this category's pages first." : error.message);
  refreshSite();
  redirect("/admin/categories");
}

/* Pages */

export async function savePage(formData: FormData) {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const back = id ? `/admin/pages/${id}` : "/admin/pages/new";
  const status = text(formData, "status") === "published" ? "published" : "draft";

  let blocks: unknown = [];
  try {
    blocks = parseBlocks(JSON.parse(String(formData.get("blocks") ?? "[]")));
  } catch {
    fail(back, "Could not read the page blocks.");
  }

  let schema_json: unknown = null;
  const rawSchema = text(formData, "schema_json");
  if (rawSchema) {
    try {
      schema_json = JSON.parse(rawSchema);
    } catch {
      fail(back, "Schema JSON is not valid JSON.");
    }
  }

  // Keep the original publish date; set it only the first time a page goes live.
  let published_at: string | null | undefined;
  if (status === "published") {
    const existing = id
      ? (await supabase.from("pages").select("published_at").eq("id", id).maybeSingle()).data
      : null;
    published_at = existing?.published_at ?? new Date().toISOString();
  }

  const row = {
    category_id: text(formData, "category_id")!,
    slug: text(formData, "slug")!,
    title: text(formData, "title")!,
    status,
    blocks,
    meta_title: text(formData, "meta_title"),
    meta_description: text(formData, "meta_description"),
    canonical_url: text(formData, "canonical_url"),
    og_image: text(formData, "og_image"),
    noindex: formData.get("noindex") === "on",
    schema_json,
    ...(published_at ? { published_at } : {}),
  };
  const { data, error } = id
    ? await supabase.from("pages").update(row).eq("id", id).select("id").single()
    : await supabase.from("pages").insert(row).select("id").single();
  if (error) fail(back, error.code === "23505" ? "That slug is already used in this category." : error.message);
  refreshSite();
  redirect(`/admin/pages/${data!.id}?saved=1`);
}

export async function deletePage(formData: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("pages").delete().eq("id", String(formData.get("id")));
  if (error) fail("/admin/pages", error.message);
  refreshSite();
  redirect("/admin/pages");
}

/* Links */

export async function saveLink(formData: FormData) {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const destination_url = text(formData, "destination_url") ?? "";
  if (!/^https?:\/\//i.test(destination_url)) fail("/admin/links", "Destination must start with https://");
  const row = { slug: text(formData, "slug")!, label: text(formData, "label")!, destination_url };
  const { error } = id
    ? await supabase.from("links").update(row).eq("id", id)
    : await supabase.from("links").insert(row);
  if (error) fail("/admin/links", error.code === "23505" ? "That link slug already exists." : error.message);
  redirect("/admin/links");
}

export async function deleteLink(formData: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("links").delete().eq("id", String(formData.get("id")));
  if (error) fail("/admin/links", error.message);
  redirect("/admin/links");
}

/* Media (the file itself is uploaded from the browser, already converted to WebP) */

export async function createMedia(input: { path: string; alt_text: string; width: number; height: number }) {
  const supabase = await requireAdmin();
  const alt_text = input.alt_text.trim();
  if (!alt_text) return { error: "Alt text is required." };
  const { error } = await supabase.from("media").insert({ ...input, alt_text });
  if (error) {
    await supabase.storage.from(MEDIA_BUCKET).remove([input.path]);
    return { error: error.message };
  }
  revalidatePath("/admin/media");
  return { error: null };
}

export async function updateMediaAlt(formData: FormData) {
  const supabase = await requireAdmin();
  const alt_text = text(formData, "alt_text");
  if (!alt_text) fail("/admin/media", "Alt text is required.");
  const { error } = await supabase.from("media").update({ alt_text }).eq("id", String(formData.get("id")));
  if (error) fail("/admin/media", error.message);
  refreshSite();
  redirect("/admin/media");
}

export async function deleteMedia(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const { data: row } = await supabase.from("media").select("path").eq("id", id).maybeSingle();
  if (!row) fail("/admin/media", "Image not found.");
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) fail("/admin/media", error.message);
  await supabase.storage.from(MEDIA_BUCKET).remove([row!.path]);
  refreshSite();
  redirect("/admin/media");
}
