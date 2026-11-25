"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { browserClient } from "@/lib/supabase/browser";
import { createMedia } from "./actions";

const MAX_WIDTH = 1600;

// Resizes to at most 1600px wide and re-encodes as WebP in the browser (no server dependency).
async function toWebp(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  if (!blob || blob.type !== "image/webp") throw new Error("This browser can't create WebP images. Try Chrome, Edge or Firefox.");
  return { blob, width, height };
}

const slugify = (name: string) =>
  name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "image";

export function MediaUploader() {
  const form = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const file = data.get("file") as File | null;
    const alt = String(data.get("alt_text") ?? "").trim();
    if (!file || !file.size) return setError("Choose an image.");
    if (!alt) return setError("Alt text is required.");
    setBusy(true);
    try {
      const { blob, width, height } = await toWebp(file);
      const path = `${new Date().toISOString().slice(0, 7)}/${slugify(file.name)}-${crypto.randomUUID().slice(0, 8)}.webp`;
      const { error: upErr } = await browserClient().storage.from("media").upload(path, blob, { contentType: "image/webp" });
      if (upErr) throw new Error(upErr.message);
      const { error: dbErr } = await createMedia({ path, alt_text: alt, width, height });
      if (dbErr) throw new Error(dbErr);
      form.current?.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={form} onSubmit={onSubmit} className="space-y-3 rounded border p-4">
      <input name="file" type="file" accept="image/*" required className="block text-sm" />
      <input name="alt_text" required placeholder="Alt text: describe the image (e.g. Seiko 5 Sports dive watch with black dial)" className="w-full rounded border border-neutral-300 p-2" />
      <p className="text-xs text-neutral-500">
        Converted to WebP, max {MAX_WIDTH}px wide. Product cards: use the merchant&apos;s photo. AI images are for banners only.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="rounded bg-black px-3 py-2 text-white disabled:opacity-50">
        {busy ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
