import type { FaqBlock } from "@/lib/blocks";

// Accordion built on <details>, so it works without JavaScript.
// FAQPage schema is emitted once per page by BlockRenderer.
export function Faq({ block }: { block: FaqBlock }) {
  return (
    <section className="divide-y divide-line rounded-lg border border-line">
      {block.items.map((item, i) => (
        <details key={i} className="group px-5 py-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {item.q}
            <span aria-hidden="true" className="text-gold transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-2 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </section>
  );
}
