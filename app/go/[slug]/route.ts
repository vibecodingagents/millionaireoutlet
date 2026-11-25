import { NextResponse, type NextRequest } from "next/server";
import { publicClient } from "@/lib/supabase/public";

// /go/<slug>: log the click, then 302 to the affiliate destination.
// Bots and link previews are redirected without being counted.
const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|curl|wget|python-requests|headless/i;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return new NextResponse("Not found", { status: 404, headers });
  }

  const supabase = publicClient();
  const isBot = BOT_UA.test(request.headers.get("user-agent") ?? "");
  const referrer = request.headers.get("referer");
  const { data: destination } = isBot
    ? await supabase.rpc("link_destination", { p_slug: slug })
    : await supabase.rpc("track_click", { p_slug: slug, p_referrer: referrer });

  if (typeof destination !== "string" || !/^https?:\/\//i.test(destination)) {
    return NextResponse.redirect(new URL("/", request.url), { status: 302, headers });
  }
  return NextResponse.redirect(destination, { status: 302, headers });
}
