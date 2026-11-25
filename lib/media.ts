import { publicClient } from "@/lib/supabase/public";

export const MEDIA_BUCKET = "media";

export type Media = { id: string; path: string; alt_text: string; width: number; height: number };

export function mediaUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

// Fetches the media rows a page needs in one query.
export async function loadMedia(ids: string[]): Promise<Map<string, Media>> {
  if (!ids.length) return new Map();
  const { data } = await publicClient()
    .from("media")
    .select("id, path, alt_text, width, height")
    .in("id", ids);
  return new Map((data ?? []).map((m) => [m.id, m]));
}

// next/image only optimizes hosts listed in next.config.ts (our Supabase Storage).
export function isOptimizable(src: string | null | undefined): src is string {
  if (!src) return false;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!base && src.startsWith(`${base}/storage/v1/object/public/`);
}
