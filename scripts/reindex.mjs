import { MeiliSearch } from "meilisearch";
import { authHeaders, httpJson, mustEnv, waitForHttpOk } from "./_shared.mjs";

const DIRECTUS_URL = mustEnv("DIRECTUS_URL").replace(/\/$/, "");
const DIRECTUS_TOKEN = mustEnv("DIRECTUS_TOKEN");

const MEILI_URL = mustEnv("MEILI_URL");
const MEILI_API_KEY = mustEnv("MEILI_API_KEY");

const directusHeaders = authHeaders(DIRECTUS_TOKEN);
const client = new MeiliSearch({ host: MEILI_URL, apiKey: MEILI_API_KEY });

const collections = [
  { collection: "product_types_items", kind: "product_type", section: "product-types" },
  { collection: "millings", kind: "milling", section: "millings" },
  { collection: "films", kind: "film", section: "films" },
  { collection: "colors", kind: "color", section: "colors" },
  { collection: "edges", kind: "edge", section: "edges" },
  { collection: "patinas", kind: "patina", section: "patinas" },
  { collection: "special_offers", kind: "offer", section: null },
  { collection: "news", kind: "news", section: null },
  { collection: "solutions", kind: "solution", section: null },
  { collection: "gallery_items", kind: "gallery", section: null }
];

async function listAll(collection) {
  // naive pagination for MVP
  const limit = 200;
  let offset = 0;
  const out = [];
  while (true) {
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const json = await httpJson(`${DIRECTUS_URL}/items/${collection}?${qs.toString()}`, { headers: directusHeaders });
    const data = json?.data || [];
    out.push(...data);
    if (data.length < limit) break;
    offset += limit;
  }
  return out;
}

function toDoc({ kind, section }, item) {
  const id = `${kind}:${item.id}`;
  const subtitleParts = [];
  if (item.article) subtitleParts.push(item.article);
  if (item.category) subtitleParts.push(item.category);
  const subtitle = subtitleParts.join(" • ");

  const searchable = [
    item.title,
    item.slug,
    item.article,
    item.category,
    item.short_description,
    item.description
  ].filter(Boolean).join(" ");

  return {
    id,
    kind,
    section,
    slug: item.slug,
    title: item.title,
    subtitle: subtitle || null,
    searchable_text: searchable,
    is_published: !!item.is_published,
    is_popular: !!item.is_popular
  };
}

async function ensureIndex() {
  const indexName = "catalog";
  try {
    await client.getIndex(indexName);
  } catch {
    await client.createIndex(indexName, { primaryKey: "id" });
  }
  const index = client.index(indexName);

  await index.updateSearchableAttributes(["title", "subtitle", "searchable_text"]);
  await index.updateFilterableAttributes(["kind", "section", "is_published"]);
  await index.updateSortableAttributes(["is_popular"]);
  return index;
}

async function main() {
  await waitForHttpOk(`${DIRECTUS_URL}/server/health`);
  // Meili has /health
  await waitForHttpOk(`${MEILI_URL.replace(/\/$/, "")}/health`);

  const index = await ensureIndex();

  const docs = [];
  for (const c of collections) {
    const items = await listAll(c.collection);
    for (const it of items) {
      // only index published items
      if (it.is_published === false) continue;
      docs.push(toDoc(c, it));
    }
  }

  const task = await index.addDocuments(docs);
  console.log(`[MEILI] addDocuments task:`, task);
  console.log(`[MEILI] indexed docs: ${docs.length}`);
  console.log("Reindex complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
