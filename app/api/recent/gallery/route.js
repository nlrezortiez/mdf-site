import { DIRECTUS_INTERNAL_URL, DIRECTUS_TOKEN } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = new URL(req.url);
  const slugsRaw = (url.searchParams.get("slugs") || "").trim();
  const slugs = slugsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);

  if (slugs.length === 0) {
    return Response.json({ data: [] });
  }

  const qs = new URLSearchParams();
  qs.set("limit", String(slugs.length));

  // filter[slug][_in]=a,b,c
  qs.set("filter[slug][_in]", slugs.join(","));

  // fields
  qs.append("fields[]", "id");
  qs.append("fields[]", "slug");
  qs.append("fields[]", "title");
  qs.append("fields[]", "preview_image");
  qs.append("fields[]", "preview_image.id");

  const endpoint = `${DIRECTUS_INTERNAL_URL.replace(/\/$/, "")}/items/gallery_items?${qs.toString()}`;

  const res = await fetch(endpoint, {
    headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return new Response(text || "Upstream error", { status: res.status });
  }

  const json = await res.json();
  return Response.json({ data: json?.data || [] });
}
