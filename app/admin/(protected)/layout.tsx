import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-5xl p-6">
      <nav className="mb-8 flex flex-wrap items-center gap-6 border-b pb-4 text-sm">
        <Link href="/admin" className="font-semibold">Admin</Link>
        <Link href="/admin/pages">Pages</Link>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/admin/links">Links</Link>
        <Link href="/admin/media">Media</Link>
        <span className="ml-auto flex items-center gap-4">
          <a href="/" target="_blank" className="underline">View site ↗</a>
          <form action={signOut}>
            <button className="underline">Sign out</button>
          </form>
        </span>
      </nav>
      {children}
    </div>
  );
}
