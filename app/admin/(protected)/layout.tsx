import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl p-6">
      <nav className="mb-8 flex items-center gap-6 border-b pb-4 text-sm">
        <Link href="/admin" className="font-semibold">Admin</Link>
        <Link href="/admin/pages">Pages</Link>
        <Link href="/admin/categories">Categories</Link>
        <form action={signOut} className="ml-auto">
          <button className="underline">Sign out</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
