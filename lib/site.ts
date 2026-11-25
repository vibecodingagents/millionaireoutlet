// Site-wide constants. Change copy here and every page picks it up.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@millionaireoutlet.com";

export const DISCLOSURE =
  "We may earn a commission if you buy through links on this page, at no extra cost to you. This doesn't affect our picks.";

export const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/privacy", label: "Privacy" },
];

export const AFFILIATE_REL = "sponsored nofollow";
export const goHref = (slug: string) => `/go/${slug}`;

// ISO timestamp N days ago (used for click stats windows).
export const daysAgoIso = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();
