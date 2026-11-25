// Page content is stored as an array of blocks in pages.blocks (jsonb).
// parseBlocks() is the single gate: anything saved or rendered passes through it.

export type HeadingBlock = { type: "heading"; level: 2 | 3; text: string };
export type TextBlock = { type: "text"; text: string };
export type ImageBlock = { type: "image"; media_id: string; caption?: string };
export type DealBlock = {
  type: "deal";
  title: string;
  media_id?: string;
  merchant?: string;
  price?: string;
  was_price?: string;
  badge?: string;
  pitch?: string;
  pros?: string[];
  cons?: string[];
  link_slug?: string;
};
export type ButtonBlock = { type: "button"; label: string; link_slug: string };
export type FaqBlock = { type: "faq"; items: { q: string; a: string }[] };
export type CtaBlock = { type: "cta"; heading: string; text?: string; label: string; link_slug: string };
export type TableBlock = { type: "table"; headers: string[]; rows: string[][] };

export type Block =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | DealBlock
  | ButtonBlock
  | FaqBlock
  | CtaBlock
  | TableBlock;

export type BlockType = Block["type"];

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  text: "Text",
  image: "Image",
  deal: "Deal card",
  button: "Link button",
  faq: "FAQ",
  cta: "Call to action",
  table: "Comparison table",
};

export function emptyBlock(type: BlockType): Block {
  switch (type) {
    case "heading": return { type, level: 2, text: "" };
    case "text": return { type, text: "" };
    case "image": return { type, media_id: "" };
    case "deal": return { type, title: "", pros: [], cons: [] };
    case "button": return { type, label: "View deal", link_slug: "" };
    case "faq": return { type, items: [{ q: "", a: "" }] };
    case "cta": return { type, heading: "", label: "View deal", link_slug: "" };
    case "table": return { type, headers: ["", ""], rows: [["", ""]] };
  }
}

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const opt = (v: unknown, max = 5000) => str(v, max) || undefined;
const strList = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x, 300)).filter(Boolean) : []);
const slug = (v: unknown) => {
  const s = str(v, 100);
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) ? s : "";
};

// Drops unknown fields and empty blocks. Never throws.
export function parseBlocks(input: unknown): Block[] {
  if (!Array.isArray(input)) return [];
  const out: Block[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const b = raw as Record<string, unknown>;
    switch (b.type) {
      case "heading": {
        const text = str(b.text, 200);
        if (text) out.push({ type: "heading", level: b.level === 3 ? 3 : 2, text });
        break;
      }
      case "text": {
        const text = str(b.text, 20000);
        if (text) out.push({ type: "text", text });
        break;
      }
      case "image": {
        const media_id = str(b.media_id, 64);
        if (media_id) out.push({ type: "image", media_id, caption: opt(b.caption, 300) });
        break;
      }
      case "deal": {
        const title = str(b.title, 200);
        if (title)
          out.push({
            type: "deal",
            title,
            media_id: opt(b.media_id, 64),
            merchant: opt(b.merchant, 100),
            price: opt(b.price, 30),
            was_price: opt(b.was_price, 30),
            badge: opt(b.badge, 40),
            pitch: opt(b.pitch, 1000),
            pros: strList(b.pros),
            cons: strList(b.cons),
            link_slug: slug(b.link_slug) || undefined,
          });
        break;
      }
      case "button": {
        const label = str(b.label, 80);
        const link_slug = slug(b.link_slug);
        if (label && link_slug) out.push({ type: "button", label, link_slug });
        break;
      }
      case "faq": {
        const items = Array.isArray(b.items)
          ? b.items
              .map((i) => ({ q: str((i as { q?: unknown })?.q, 300), a: str((i as { a?: unknown })?.a, 3000) }))
              .filter((i) => i.q && i.a)
          : [];
        if (items.length) out.push({ type: "faq", items });
        break;
      }
      case "cta": {
        const heading = str(b.heading, 200);
        const label = str(b.label, 80);
        const link_slug = slug(b.link_slug);
        if (heading && label && link_slug)
          out.push({ type: "cta", heading, text: opt(b.text, 500), label, link_slug });
        break;
      }
      case "table": {
        const headers = Array.isArray(b.headers) ? b.headers.map((h) => str(h, 100)) : [];
        const rows = Array.isArray(b.rows)
          ? b.rows
              .filter(Array.isArray)
              .map((r) => headers.map((_, i) => str((r as unknown[])[i], 300)))
              .filter((r) => r.some(Boolean))
          : [];
        if (headers.some(Boolean) && rows.length) out.push({ type: "table", headers, rows });
        break;
      }
    }
  }
  return out;
}

export function mediaIds(blocks: Block[]): string[] {
  const ids = new Set<string>();
  for (const b of blocks) {
    if (b.type === "image") ids.add(b.media_id);
    if (b.type === "deal" && b.media_id) ids.add(b.media_id);
  }
  return [...ids];
}

// True if the page links to /go/ anywhere, so the FTC disclosure must show.
export function hasAffiliateLinks(blocks: Block[]): boolean {
  return blocks.some(
    (b) =>
      (b.type === "deal" && !!b.link_slug) ||
      b.type === "button" ||
      b.type === "cta" ||
      (b.type === "text" && b.text.includes("/go/")),
  );
}

// Plain text of the page, used for search snippets and future AI helpers.
export function plainText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      if (b.type === "heading" || b.type === "text") return b.text;
      if (b.type === "deal") return [b.title, b.pitch].filter(Boolean).join(". ");
      if (b.type === "faq") return b.items.map((i) => `${i.q} ${i.a}`).join(" ");
      return "";
    })
    .join("\n")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "");
}
