import { DIRECTUS_INTERNAL_URL, DIRECTUS_TOKEN } from "@/lib/config";

export async function GET(req, { params }) {
  const p = await params;
  const id = p?.id;

  if (!id) return new Response("Missing id", { status: 400 });

  const upstream = new URL(
    `${DIRECTUS_INTERNAL_URL.replace(/\/$/, "")}/assets/${encodeURIComponent(id)}`
  );

  // Пробрасываем query (width, height, quality, fit и т.п.)
  const { searchParams } = new URL(req.url);
  for (const [k, v] of searchParams.entries()) upstream.searchParams.set(k, v);

  const res = await fetch(upstream.toString(), {
    headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return new Response(text || "Upstream error", { status: res.status });
  }

  const headers = new Headers(res.headers);
  headers.set("Cache-Control", "no-store");

  return new Response(res.body, { status: 200, headers });
}
