import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "About us",
    meta_description: "Who we are and how we pick luxury deals: real prices, a clear recommendation, and honest notes on who each pick is not for.",
  },
  "/about",
  "website",
);

export default function About() {
  return (
    <StaticPage title="About us" path="/about">
      <p>
        millionaireoutlet is a buying guide for people who love well-made things but don&apos;t want to pay full price
        for them. We look for luxury watches, bags and accessories at outlet, pre-owned and sale prices from US retailers,
        and we tell you plainly which ones are worth it.
      </p>
      <h2>How we pick</h2>
      <ul>
        <li>We compare the options people actually search for, side by side.</li>
        <li>We give one clear pick for each need and explain why.</li>
        <li>We say who a product is <strong>not</strong> for, not just who it&apos;s for.</li>
        <li>We only show prices we have checked, with the date we checked them.</li>
        <li>We never invent reviews, ratings, discounts or &ldquo;only 2 left&rdquo; urgency.</li>
      </ul>
      <h2>How we make money</h2>
      <p>
        Some links on this site are affiliate links. If you buy through them, we may earn a commission at no extra cost
        to you. Retailers don&apos;t pay us for placement and don&apos;t see our guides before they go live. Read the
        full <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
      </p>
      <h2>Get in touch</h2>
      <p>
        Spotted a wrong price or a better deal? <Link href="/contact">Contact us</Link> and we&apos;ll check it.
      </p>
    </StaticPage>
  );
}
