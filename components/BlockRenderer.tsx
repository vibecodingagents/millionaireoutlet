import Image from "next/image";
import type { Block } from "@/lib/blocks";
import { mediaUrl, type Media } from "@/lib/media";
import { AffiliateLink, buttonClass } from "./AffiliateLink";
import { JsonLd } from "./JsonLd";
import { RichText } from "./RichText";
import { ComparisonTable } from "./blocks/ComparisonTable";
import { Cta } from "./blocks/Cta";
import { DealCard } from "./blocks/DealCard";
import { Faq } from "./blocks/Faq";

// Renders a page's blocks. Change a block component once and every page updates.
export function BlockRenderer({ blocks, media }: { blocks: Block[]; media: Map<string, Media> }) {
  const faqItems = blocks.flatMap((b) => (b.type === "faq" ? b.items : []));
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return b.level === 2 ? (
              <h2 key={i} className="pt-4 font-serif text-3xl leading-tight">{b.text}</h2>
            ) : (
              <h3 key={i} className="font-serif text-xl leading-snug">{b.text}</h3>
            );
          case "text":
            return <RichText key={i} text={b.text} />;
          case "image": {
            const m = media.get(b.media_id);
            if (!m) return null;
            return (
              <figure key={i}>
                <Image
                  src={mediaUrl(m.path)}
                  alt={m.alt_text}
                  width={m.width}
                  height={m.height}
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="h-auto w-full rounded-lg"
                />
                {b.caption && <figcaption className="mt-2 text-center text-sm text-muted">{b.caption}</figcaption>}
              </figure>
            );
          }
          case "deal":
            return <DealCard key={i} block={b} media={b.media_id ? media.get(b.media_id) : undefined} />;
          case "button":
            return (
              <p key={i}>
                <AffiliateLink slug={b.link_slug} className={buttonClass}>{b.label}</AffiliateLink>
              </p>
            );
          case "faq":
            return <Faq key={i} block={b} />;
          case "cta":
            return <Cta key={i} block={b} />;
          case "table":
            return <ComparisonTable key={i} block={b} />;
        }
      })}
      {faqItems.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
    </div>
  );
}
