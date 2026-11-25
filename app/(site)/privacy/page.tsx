import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { buildMetadata } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildMetadata(
  {
    title: "Privacy policy",
    meta_description: "What data millionaireoutlet collects, why, and the choices you have. We don't sell your personal information.",
  },
  "/privacy",
  "website",
);

// Plain-language starting point. Have it reviewed before launch, especially for CCPA/CPRA.
export default function Privacy() {
  return (
    <StaticPage title="Privacy policy" path="/privacy" updated="November 25, 2026">
      <p>
        This policy explains what information millionaireoutlet (&ldquo;we&rdquo;) collects when you use this website,
        and how we use it. We don&apos;t sell your personal information.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Affiliate link clicks.</strong> When you click a link that starts with <code>/go/</code>, we record
          which link was clicked, when, and the page you came from. We don&apos;t record your name, email or IP address
          with this.
        </li>
        <li>
          <strong>Server logs.</strong> Our hosting provider (Vercel) keeps standard technical logs, such as IP address
          and browser type, to run and secure the site.
        </li>
        <li>
          <strong>Messages you send us.</strong> If you email us, we keep your message and address to reply.
        </li>
      </ul>
      <h2>Cookies</h2>
      <p>
        Our public pages don&apos;t set cookies of their own. When you click through to a retailer, that retailer or its
        affiliate network may set cookies to credit the sale. Their privacy policies apply on their sites.
      </p>
      <h2>Service providers</h2>
      <p>
        We use Vercel to host the site and Supabase to store site content and click records. They process data on our
        behalf.
      </p>
      <h2>Your choices and rights</h2>
      <p>
        Depending on where you live, including California, you may have the right to know, delete or correct personal
        information we hold about you, and to opt out of its sale or sharing (we don&apos;t sell or share it). To make
        a request, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
      <h2>Children</h2>
      <p>This site isn&apos;t aimed at children under 13, and we don&apos;t knowingly collect their information.</p>
      <h2>Changes</h2>
      <p>If we change this policy, we&apos;ll update the date at the top of this page.</p>
    </StaticPage>
  );
}
