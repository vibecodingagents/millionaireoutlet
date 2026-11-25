import { AFFILIATE_REL, goHref } from "@/lib/site";

// Every outbound affiliate link goes through /go/<slug> with rel="sponsored nofollow".
// A plain <a> (not next/link) so the redirect is never prefetched or counted twice.
export function AffiliateLink({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={goHref(slug)} rel={AFFILIATE_REL} target="_blank" className={className}>
      {children}
    </a>
  );
}

export const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold";
