"use client";

import Link from "next/link";
import { useState } from "react";
import { BLOCK_LABELS, emptyBlock, type Block, type BlockType } from "@/lib/blocks";

export type LinkOption = { slug: string; label: string };
export type MediaOption = { id: string; url: string; alt_text: string };

const input = "w-full rounded border border-neutral-300 p-2 text-sm";
const small = "rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100 disabled:opacity-40";

// Textarea whose value is a list of lines. Keeps its own text so typing isn't reformatted mid-edit.
function LinesField({ value, onChange, placeholder, rows = 3 }: {
  value: string[]; onChange: (v: string[]) => void; placeholder: string; rows?: number;
}) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <textarea
      className={input}
      rows={rows}
      placeholder={placeholder}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean));
      }}
    />
  );
}

// Table as text: first line is the header row, cells separated by "|".
function TableField({ headers, rows, onChange }: {
  headers: string[]; rows: string[][]; onChange: (h: string[], r: string[][]) => void;
}) {
  const [text, setText] = useState([headers, ...rows].map((r) => r.join(" | ")).join("\n"));
  return (
    <>
      <textarea
        className={`${input} font-mono`}
        rows={6}
        value={text}
        placeholder={"Model | Price | Water resistance\nSeiko 5 Sports | $295 | 100m"}
        onChange={(e) => {
          setText(e.target.value);
          const lines = e.target.value.split("\n").filter((l) => l.trim());
          const cells = lines.map((l) => l.split("|").map((c) => c.trim()));
          onChange(cells[0] ?? [], cells.slice(1));
        }}
      />
      <p className="text-xs text-neutral-500">First line is the header. Separate cells with |. First column is the row label.</p>
    </>
  );
}

function LinkSelect({ value, onChange, links, required }: {
  value?: string; onChange: (v: string) => void; links: LinkOption[]; required?: boolean;
}) {
  return (
    <select className={input} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">{required ? "Choose an affiliate link…" : "No link"}</option>
      {links.map((l) => <option key={l.slug} value={l.slug}>{l.label} (/go/{l.slug})</option>)}
    </select>
  );
}

function MediaSelect({ value, onChange, media }: {
  value?: string; onChange: (v: string) => void; media: MediaOption[];
}) {
  const selected = media.find((m) => m.id === value);
  return (
    <div className="flex items-start gap-3">
      <select className={input} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">No image</option>
        {media.map((m) => <option key={m.id} value={m.id}>{m.alt_text}</option>)}
      </select>
      {selected && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail
        <img src={selected.url} alt={selected.alt_text} className="h-16 w-16 shrink-0 rounded border object-cover" />
      )}
    </div>
  );
}

function Fields({ block, set, links, media }: {
  block: Block; set: (b: Block) => void; links: LinkOption[]; media: MediaOption[];
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="flex gap-2">
          <select className="rounded border border-neutral-300 p-2 text-sm" value={block.level} onChange={(e) => set({ ...block, level: e.target.value === "3" ? 3 : 2 })}>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
          <input className={input} value={block.text} placeholder="Heading text" onChange={(e) => set({ ...block, text: e.target.value })} />
        </div>
      );
    case "text":
      return (
        <>
          <textarea className={input} rows={6} value={block.text} placeholder="Paragraphs. Blank line = new paragraph." onChange={(e) => set({ ...block, text: e.target.value })} />
          <p className="text-xs text-neutral-500">
            **bold**, [link text](/watches/other-page), lines starting with &ldquo;- &rdquo; become a list. Affiliate links: [text](/go/link-slug).
          </p>
        </>
      );
    case "image":
      return (
        <>
          <MediaSelect value={block.media_id} media={media} onChange={(v) => set({ ...block, media_id: v })} />
          <input className={input} value={block.caption ?? ""} placeholder="Caption (optional)" onChange={(e) => set({ ...block, caption: e.target.value })} />
        </>
      );
    case "deal":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={`${input} sm:col-span-2`} value={block.title} placeholder="Product name" onChange={(e) => set({ ...block, title: e.target.value })} />
          <input className={input} value={block.badge ?? ""} placeholder="Badge (e.g. Best overall)" onChange={(e) => set({ ...block, badge: e.target.value })} />
          <input className={input} value={block.merchant ?? ""} placeholder="Retailer (e.g. Amazon)" onChange={(e) => set({ ...block, merchant: e.target.value })} />
          <input className={input} value={block.price ?? ""} placeholder="Price you checked (e.g. $295)" onChange={(e) => set({ ...block, price: e.target.value })} />
          <input className={input} value={block.was_price ?? ""} placeholder="Was price (only if real)" onChange={(e) => set({ ...block, was_price: e.target.value })} />
          <textarea className={`${input} sm:col-span-2`} rows={3} value={block.pitch ?? ""} placeholder="Who it's for and why" onChange={(e) => set({ ...block, pitch: e.target.value })} />
          <LinesField value={block.pros ?? []} placeholder="Pros, one per line" onChange={(pros) => set({ ...block, pros })} />
          <LinesField value={block.cons ?? []} placeholder="Cons, one per line" onChange={(cons) => set({ ...block, cons })} />
          <div className="sm:col-span-2"><MediaSelect value={block.media_id} media={media} onChange={(v) => set({ ...block, media_id: v })} /></div>
          <div className="sm:col-span-2"><LinkSelect value={block.link_slug} links={links} onChange={(v) => set({ ...block, link_slug: v })} /></div>
          <p className="text-xs text-neutral-500 sm:col-span-2">Use the merchant&apos;s product photo, never an AI image.</p>
        </div>
      );
    case "button":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={input} value={block.label} placeholder="Button text" onChange={(e) => set({ ...block, label: e.target.value })} />
          <LinkSelect required value={block.link_slug} links={links} onChange={(v) => set({ ...block, link_slug: v })} />
        </div>
      );
    case "cta":
      return (
        <div className="grid gap-2">
          <input className={input} value={block.heading} placeholder="Heading" onChange={(e) => set({ ...block, heading: e.target.value })} />
          <input className={input} value={block.text ?? ""} placeholder="Short supporting line (optional)" onChange={(e) => set({ ...block, text: e.target.value })} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={input} value={block.label} placeholder="Button text" onChange={(e) => set({ ...block, label: e.target.value })} />
            <LinkSelect required value={block.link_slug} links={links} onChange={(v) => set({ ...block, link_slug: v })} />
          </div>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <div key={i} className="space-y-1 rounded border border-dashed border-neutral-300 p-2">
              <input className={input} value={item.q} placeholder="Question" onChange={(e) => set({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)) })} />
              <textarea className={input} rows={2} value={item.a} placeholder="Answer" onChange={(e) => set({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)) })} />
              <button type="button" className={small} onClick={() => set({ ...block, items: block.items.filter((_, j) => j !== i) })}>Remove question</button>
            </div>
          ))}
          <button type="button" className={small} onClick={() => set({ ...block, items: [...block.items, { q: "", a: "" }] })}>+ Add question</button>
        </div>
      );
    case "table":
      return <TableField headers={block.headers} rows={block.rows} onChange={(headers, rows) => set({ ...block, headers, rows })} />;
  }
}

export function BlockEditor({ initial, links, media }: { initial: Block[]; links: LinkOption[]; media: MediaOption[] }) {
  // Each block gets a stable key so local field state survives reordering.
  const [items, setItems] = useState(() => initial.map((block, i) => ({ key: i, block })));
  const [nextKey, setNextKey] = useState(initial.length);

  const update = (key: number, block: Block) => setItems((xs) => xs.map((x) => (x.key === key ? { ...x, block } : x)));
  const move = (i: number, d: -1 | 1) =>
    setItems((xs) => {
      const copy = [...xs];
      [copy[i], copy[i + d]] = [copy[i + d], copy[i]];
      return copy;
    });
  const add = (type: BlockType) => {
    setItems((xs) => [...xs, { key: nextKey, block: emptyBlock(type) }]);
    setNextKey((k) => k + 1);
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name="blocks" value={JSON.stringify(items.map((x) => x.block))} />
      {items.map(({ key, block }, i) => (
        <div key={key} className="space-y-2 rounded border border-neutral-300 bg-neutral-50 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600">{BLOCK_LABELS[block.type]}</span>
            <span className="ml-auto flex gap-1">
              <button type="button" className={small} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
              <button type="button" className={small} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
              <button type="button" className={`${small} text-red-600`} onClick={() => setItems((xs) => xs.filter((x) => x.key !== key))}>Delete</button>
            </span>
          </div>
          <Fields block={block} set={(b) => update(key, b)} links={links} media={media} />
        </div>
      ))}
      {!items.length && <p className="text-sm text-neutral-500">No content yet. Add a block below.</p>}
      <div className="flex flex-wrap gap-2 border-t pt-3">
        {(Object.keys(BLOCK_LABELS) as BlockType[]).map((t) => (
          <button key={t} type="button" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:bg-neutral-100" onClick={() => add(t)}>
            + {BLOCK_LABELS[t]}
          </button>
        ))}
      </div>
      {(!links.length || !media.length) && (
        <p className="text-xs text-neutral-500">
          Tip: add affiliate links under <Link className="underline" href="/admin/links" target="_blank">Links</Link> and images under{" "}
          <Link className="underline" href="/admin/media" target="_blank">Media</Link> to pick them here.
        </p>
      )}
    </div>
  );
}
