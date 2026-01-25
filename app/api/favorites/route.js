import { meiliClient } from "@/lib/meili";

export async function POST(req) {
  const { keys } = await req.json().catch(() => ({ keys: [] }));
  if (!Array.isArray(keys) || keys.length === 0) {
    return Response.json({ items: [] });
  }

  const client = meiliClient();
  const index = client.index("catalog");

  // Fetch by primary id list via filter.
  // We store 'id' as e.g. 'film:12'. We'll query in chunks.
  const ids = keys.map((k) => String(k));

  const chunkSize = 40;
  const all = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    // Filter syntax: id IN ["a","b"]
    const filter = `id IN [${chunk.map(x => JSON.stringify(x)).join(", ")}]`;
    const res = await index.search("", { filter, limit: chunk.length });
    all.push(...(res?.hits || []));
  }

  // Preserve original order
  const map = new Map(all.map((x) => [x.id, x]));
  const ordered = ids.map((id) => map.get(id)).filter(Boolean).map((x) => ({
    ...x,
    href: x.kind === "news" ? `/news/${x.slug}`
      : x.kind === "offer" ? `/special-offers/${x.slug}`
      : x.kind === "solution" ? `/solutions/${x.slug}`
      : `/catalog/${x.section}/${x.slug}`
  }));

  return Response.json({ items: ordered });
}
