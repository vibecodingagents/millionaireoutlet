import { mediaUrl } from "@/lib/media";
import { serverClient } from "@/lib/supabase/server";
import { deleteMedia, updateMediaAlt } from "../../actions";
import { MediaUploader } from "../../MediaUploader";

export default async function MediaLibrary({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await serverClient();
  const { data: media } = await supabase.from("media").select("*").order("created_at", { ascending: false });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Media</h1>
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <MediaUploader />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media?.map((m) => {
          const url = mediaUrl(m.path);
          return (
            <li key={m.id} className="space-y-2 rounded border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview */}
              <img src={url} alt={m.alt_text} loading="lazy" className="aspect-video w-full rounded bg-neutral-100 object-contain" />
              <p className="text-xs text-neutral-500">{m.width}&times;{m.height} &middot; <a href={url} target="_blank" className="underline">open</a></p>
              <input readOnly value={url} className="w-full rounded border bg-neutral-50 p-1 font-mono text-xs" aria-label="Image URL" />
              <form action={updateMediaAlt} className="flex gap-2">
                <input type="hidden" name="id" value={m.id} />
                <input name="alt_text" required defaultValue={m.alt_text} className="flex-1 rounded border border-neutral-300 p-1 text-sm" aria-label="Alt text" />
                <button className="rounded border px-2 text-sm">Save</button>
              </form>
              <form action={deleteMedia}>
                <input type="hidden" name="id" value={m.id} />
                <button className="text-sm text-red-600 underline">Delete</button>
              </form>
            </li>
          );
        })}
        {!media?.length && <li className="text-neutral-500">No images yet.</li>}
      </ul>
    </div>
  );
}
