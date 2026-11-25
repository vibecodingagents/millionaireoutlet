import Link from "next/link";
import { DISCLOSURE } from "@/lib/site";

// FTC affiliate disclosure. Shown near the top of any page with affiliate links.
export function Disclosure() {
  return (
    <p className="rounded-md border border-line bg-cream px-4 py-3 text-sm text-muted">
      {DISCLOSURE}{" "}
      <Link href="/affiliate-disclosure" className="underline hover:text-ink">Learn more</Link>
    </p>
  );
}
