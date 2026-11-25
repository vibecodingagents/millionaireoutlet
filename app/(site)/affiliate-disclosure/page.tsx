import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { buildMetadata } from "@/lib/seo";
import { DISCLOSURE } from "@/lib/site";

export const metadata: Metadata = buildMetadata(
  {
    title: "Affiliate disclosure",
    meta_description: "How millionaireoutlet earns money through affiliate links, and how that does and doesn't affect our recommendations.",
  },
  "/affiliate-disclosure",
  "website",
);

export default function AffiliateDisclosure() {
  return (
    <StaticPage title="Affiliate disclosure" path="/affiliate-disclosure" updated="November 25, 2026">
      <p><strong>{DISCLOSURE}</strong></p>
      <h2>What this means</h2>
      <p>
        millionaireoutlet takes part in affiliate programs run by US retailers and affiliate networks. When you click a
        &ldquo;View deal&rdquo; button or another product link and then buy something, the retailer may pay us a
        commission. The price you pay is the same as if you had gone to the retailer directly.
      </p>
      <p>
        Affiliate links on this site go through addresses that start with <code>/go/</code>. They are marked as
        sponsored for search engines.
      </p>
      <h2>How it affects our picks</h2>
      <ul>
        <li>We choose products first, then look for a place to buy them. Commission rates don&apos;t decide our picks.</li>
        <li>We include products from stores we have no affiliate deal with when they are the better choice.</li>
        <li>Retailers can&apos;t pay to be included or to change what we write.</li>
      </ul>
      <h2>Questions</h2>
      <p>If anything here is unclear, contact us and we&apos;ll explain.</p>
    </StaticPage>
  );
}
