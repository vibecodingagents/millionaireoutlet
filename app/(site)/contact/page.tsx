import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { buildMetadata } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildMetadata(
  {
    title: "Contact",
    meta_description: "Contact the millionaireoutlet team about a guide, a price correction, or a partnership.",
  },
  "/contact",
  "website",
);

export default function Contact() {
  return (
    <StaticPage title="Contact" path="/contact">
      <p>We read every message. For the fastest reply, tell us which page you are writing about.</p>
      <p>
        Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
      <h2>Price corrections</h2>
      <p>
        Prices change often. If a price on our site is out of date, send us the page link and what you see now, and
        we&apos;ll update it.
      </p>
      <h2>Retailers and brands</h2>
      <p>
        We&apos;re happy to hear about US affiliate programs. Being in a program never guarantees coverage or a
        positive review.
      </p>
    </StaticPage>
  );
}
