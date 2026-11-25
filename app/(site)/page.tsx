import Link from "next/link";
import { publicClient } from "@/lib/supabase/public";

export const revalidate = 60;

export default async function Home() {
  const { data: categories } = await publicClient().from("categories").select("name, slug, description").order("name");
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 text-4xl font-semibold">Luxury for less</h1>
      <p className="mb-8 text-neutral-600">Curated deals and honest buying guides.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories?.map((c) => (
          <Link key={c.slug} href={`/${c.slug}`} className="rounded border p-4 hover:bg-neutral-50">
            <h2 className="font-semibold">{c.name}</h2>
            {c.description && <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{c.description}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}
