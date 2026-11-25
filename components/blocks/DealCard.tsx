import Image from "next/image";
import type { DealBlock } from "@/lib/blocks";
import type { Media } from "@/lib/media";
import { mediaUrl } from "@/lib/media";
import { AffiliateLink, buttonClass } from "../AffiliateLink";

// Product pick: merchant image, who it's for, pros/cons, price and "View deal".
// Prices are typed by the editor and shown exactly as entered; never invented.
export function DealCard({ block, media }: { block: DealBlock; media?: Media }) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-white sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="relative flex aspect-square items-center justify-center bg-cream p-6 sm:aspect-auto">
        {media ? (
          <Image
            src={mediaUrl(media.path)}
            alt={media.alt_text}
            width={media.width}
            height={media.height}
            sizes="(min-width: 640px) 300px, 100vw"
            className="h-auto max-h-72 w-auto object-contain"
          />
        ) : (
          <span className="font-serif text-xl text-gold">{block.merchant ?? "Our pick"}</span>
        )}
        {block.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            {block.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div>
          <h3 className="font-serif text-2xl leading-snug">{block.title}</h3>
          {block.merchant && <p className="mt-1 text-sm text-muted">at {block.merchant}</p>}
        </div>
        {block.pitch && <p className="leading-relaxed">{block.pitch}</p>}
        {(!!block.pros?.length || !!block.cons?.length) && (
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            {!!block.pros?.length && (
              <div>
                <h4 className="mb-1 font-semibold text-deal">Pros</h4>
                <ul className="space-y-1">
                  {block.pros.map((p, i) => <li key={i} className="flex gap-2"><span aria-hidden="true" className="text-deal">+</span>{p}</li>)}
                </ul>
              </div>
            )}
            {!!block.cons?.length && (
              <div>
                <h4 className="mb-1 font-semibold text-muted">Cons</h4>
                <ul className="space-y-1">
                  {block.cons.map((c, i) => <li key={i} className="flex gap-2"><span aria-hidden="true" className="text-muted">&minus;</span>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
          {block.price && (
            <p className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{block.price}</span>
              {block.was_price && <s className="text-sm text-muted">{block.was_price}</s>}
            </p>
          )}
          {block.link_slug && (
            <AffiliateLink slug={block.link_slug} className={buttonClass}>View deal</AffiliateLink>
          )}
        </div>
      </div>
    </section>
  );
}
