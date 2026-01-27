import { meiliClient } from "@/lib/meili";

function parseKey(key) {
  const s = String(key || "").trim();
  if (!s) return null;

  if (s.includes(":")) {
    const i = s.indexOf(":");
    return {
      raw: s,
      kind: s.slice(0, i),
      slug: s.slice(i + 1),
      candidateId: s.slice(0, i) + "_" + s.slice(i + 1),
    };
  }

  const j = s.indexOf("_");
  if (j > 0)
    return {
      raw: s,
      kind: s.slice(0, j),
      slug: s.slice(j + 1),
      candidateId: s,
    };

  return { raw: s, kind: null, slug: null, candidateId: s };
}

function hrefFor(hit) {
  if (hit.kind === "news") return `/news/${hit.slug}`;
  if (hit.kind === "offer") return `/special-offers/${hit.slug}`;
  if (hit.kind === "solution") return `/solutions/${hit.slug}`;
  if (hit.kind === "gallery") return `/gallery/${hit.slug}`;
  return `/catalog/${hit.section}/${hit.slug}`;
}

export async function POST(req) {
  try {
    const { keys } = await req.json().catch(() => ({ keys: [] }));
    if (!Array.isArray(keys) || keys.length === 0)
      return Response.json({ items: [], normalized_ids: [] });

    const parsed = keys.map(parseKey).filter(Boolean);
    if (!parsed.length) return Response.json({ items: [], normalized_ids: [] });

    const client = meiliClient();
    const index = client.index("catalog");

    const resolved = new Map(); // rawKey -> doc
    const normalized = new Map(); // rawKey -> doc.id

    for (const k of parsed) {
      const tryIds = [k.candidateId, k.raw].filter(Boolean);

      let doc = null;

      for (const id of tryIds) {
        try {
          doc = await index.getDocument(id);
          if (doc) break;
        } catch {
          // ignore 404
        }
      }

      if (!doc && k.kind && k.slug) {
        const res = await index.search(k.slug, { limit: 20 });
        doc =
          (res?.hits || []).find(
            (h) => h.kind === k.kind && h.slug === k.slug,
          ) || null;
      }

      if (doc) {
        resolved.set(k.raw, doc);
        normalized.set(k.raw, doc.id);
      }
    }

    const items = [];
    const normalized_ids = [];

    for (const k of parsed) {
      const doc = resolved.get(k.raw);
      if (!doc) continue;
      items.push({ ...doc, href: hrefFor(doc) });
      normalized_ids.push(normalized.get(k.raw));
    }

    return Response.json({ items, normalized_ids });
  } catch (e) {
    return new Response(String(e?.message || e || "Unknown error"), {
      status: 500,
    });
  }
}
