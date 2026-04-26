// Same-origin proxy for the public article feed. Lets the infinite-scroll
// client fetch without dealing with CORS to the backend, and keeps the
// backend URL out of the browser.

import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.OM_API_URL ?? "http://localhost:3030";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = new URLSearchParams();
  const topic = url.searchParams.get("topic");
  const industry = url.searchParams.get("industry");
  const limit = url.searchParams.get("limit");
  const offset = url.searchParams.get("offset");
  if (topic) params.set("topic", topic);
  if (industry) params.set("industry", industry);
  if (limit) params.set("limit", limit);
  if (offset) params.set("offset", offset);

  const qs = params.toString();
  const target = `${API_BASE}/api/v1/articles/public${qs ? `?${qs}` : ""}`;

  try {
    const r = await fetch(target, {
      headers: { Accept: "application/json" },
      // Don't cache load-more responses — the user is paginating.
      cache: "no-store",
    });
    if (!r.ok) {
      return NextResponse.json([], { status: r.status });
    }
    const data = await r.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
