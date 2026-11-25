import Link from "next/link";
import { Fragment } from "react";
import { AFFILIATE_REL } from "@/lib/site";

// A small, safe subset of Markdown for text blocks:
//   blank line = new paragraph, "- " = bullet list, "1. " = numbered list,
//   **bold**, [label](url). Links to /go/ get rel="sponsored nofollow" automatically.

function renderLink(label: string, href: string, key: number) {
  if (href.startsWith("/go/")) {
    return <a key={key} href={href} rel={AFFILIATE_REL} target="_blank">{label}</a>;
  }
  if (href.startsWith("/")) return <Link key={key} href={href}>{label}</Link>;
  if (/^https?:\/\//i.test(href)) {
    return <a key={key} href={href} rel="noopener noreferrer" target="_blank">{label}</a>;
  }
  return <Fragment key={key}>{label}</Fragment>;
}

function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={k++}>{m[1]}</strong>);
    else out.push(renderLink(m[2], m[3], k++));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text }: { text: string }) {
  const chunks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="prose-site">
      {chunks.map((chunk, i) => {
        const lines = chunk.split("\n").filter((l) => l.trim());
        if (lines.length && lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;
        }
        if (lines.length && lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>)}</ol>;
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>{j > 0 && <br />}{inline(l)}</Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
