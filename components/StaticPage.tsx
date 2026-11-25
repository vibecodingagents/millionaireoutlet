import { Breadcrumbs } from "./Breadcrumbs";

// Shared template for About, Contact, Privacy and the affiliate disclosure.
export function StaticPage({ title, path, updated, children }: {
  title: string;
  path: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: title, href: path }]} />
      <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
      {updated && <p className="mt-3 text-sm text-muted">Last updated {updated}</p>}
      <div className="prose-site mt-8 space-y-4 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl">{children}</div>
    </div>
  );
}
