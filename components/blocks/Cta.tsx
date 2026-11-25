import type { CtaBlock } from "@/lib/blocks";
import { AffiliateLink, buttonClass } from "../AffiliateLink";

export function Cta({ block }: { block: CtaBlock }) {
  return (
    <section className="rounded-lg bg-ink px-6 py-8 text-center text-white">
      <h2 className="font-serif text-2xl">{block.heading}</h2>
      {block.text && <p className="mx-auto mt-2 max-w-xl text-white/80">{block.text}</p>}
      <AffiliateLink
        slug={block.link_slug}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
      >
        {block.label}
      </AffiliateLink>
    </section>
  );
}

export { buttonClass };
