import { MeiliSearch } from "meilisearch";
import { authHeaders, httpJson, mustEnv, waitForHttpOk } from "./_shared.mjs";

const DIRECTUS_URL = mustEnv("DIRECTUS_URL").replace(/\/$/, "");
const DIRECTUS_TOKEN = mustEnv("DIRECTUS_TOKEN");

const MEILI_URL = mustEnv("MEILI_URL").replace(/\/$/, "");
const MEILI_API_KEY = mustEnv("MEILI_API_KEY");

const directusHeaders = authHeaders(DIRECTUS_TOKEN);
const client = new MeiliSearch({ host: MEILI_URL, apiKey: MEILI_API_KEY });

function normalizeFileId(file) {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (typeof file === "object" && typeof file.id === "string") return file.id;
  return null;
}

const BASE_FIELDS = [
  "id",
  "slug",
  "title",
  "short_description",
  "description",
  "warning_text",
  "is_published",
  "is_popular",
  "preview_image",
  "preview_image.id",
];

const COLLECTIONS = [
  {
    collection: "product_types_items",
    kind: "product_type",
    section: "product-types",
    fields: [...BASE_FIELDS],
  },
  {
    collection: "millings",
    kind: "milling",
    section: "millings",
    fields: [...BASE_FIELDS, "article"],
  },
  {
    collection: "films",
    kind: "film",
    section: "films",
    fields: [...BASE_FIELDS, "article", "category"],
  },
  {
    collection: "colors",
    kind: "color",
    section: "colors",
    fields: [...BASE_FIELDS, "article", "category", "hex_color"],
  },
  {
    collection: "edges",
    kind: "edge",
    section: "edges",
    fields: [...BASE_FIELDS],
  },
  {
    collection: "patinas",
    kind: "patina",
    section: "patinas",
    fields: [...BASE_FIELDS],
  },
  {
    collection: "special_offers",
    kind: "offer",
    section: null,
    fields: [...BASE_FIELDS, "body", "date_from", "date_to", "published_at"],
  },
  {
    collection: "news",
    kind: "news",
    section: null,
    fields: [
      ...BASE_FIELDS,
      "body",
      "excerpt",
      "date_from",
      "date_to",
      "published_at",
    ],
  },
  {
    collection: "solutions",
    kind: "solution",
    section: null,
    fields: [...BASE_FIELDS],
  },
  {
    collection: "gallery_items",
    kind: "gallery",
    section: null,
    fields: [...BASE_FIELDS],
  },
];

async function listAll(collection, fields) {
  const limit = 200;
  let offset = 0;
  const out = [];

  while (true) {
    const qs = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    for (const f of fields) qs.append("fields[]", f);

    const json = await httpJson(
      `${DIRECTUS_URL}/items/${collection}?${qs.toString()}`,
      {
        headers: directusHeaders,
      },
    );

    const data = json?.data || [];
    out.push(...data);

    if (data.length < limit) break;
    offset += limit;
  }

  return out;
}

function makeDocId(kind, slug) {
  // Meilisearch id: only [a-zA-Z0-9_-]
  // slug обычно уже safe, kind тоже; разделитель "_"
  return `${kind}_${slug}`;
}

function toDoc(meta, item) {
  const { kind, section } = meta;

  if (!item?.slug || !item?.title) return null;

  const id = makeDocId(kind, item.slug);

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
    item.description,
    item.warning_text,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id,
    kind,
    section,
    slug: item.slug,
    title: item.title,
    subtitle: subtitle || null,
    preview_image: normalizeFileId(item.preview_image),
    searchable_text: searchable,
    is_published: item.is_published !== false,
    is_popular: !!item.is_popular,
  };
}

async function waitTask(task) {
  if (!task?.taskUid) return;
  await client.waitForTask(task.taskUid);
}

async function ensureIndex() {
  const indexName = "catalog";

  try {
    await client.getIndex(indexName);
  } catch {
    await client.createIndex(indexName, { primaryKey: "id" });
  }

  const index = client.index(indexName);

  await waitTask(
    await index.updateSearchableAttributes([
      "title",
      "subtitle",
      "searchable_text",
    ]),
  );

  // ВАЖНО: добавили "id" — иначе /api/favorites с filter "id IN [...]" падает
  await waitTask(
    await index.updateFilterableAttributes([
      "id",
      "kind",
      "section",
      "is_published",
    ]),
  );

  await waitTask(await index.updateSortableAttributes(["is_popular"]));

  return index;
}

async function main() {
  await waitForHttpOk(`${DIRECTUS_URL}/server/health`);
  await waitForHttpOk(`${MEILI_URL}/health`);

  const index = await ensureIndex();

  const docs = [];

  for (const c of COLLECTIONS) {
    const items = await listAll(c.collection, c.fields);

    for (const it of items) {
      if (it.is_published === false) continue;
      const doc = toDoc(c, it);
      if (doc) docs.push(doc);
    }
  }

  const task = await index.addDocuments(docs);
  console.log("[MEILI] addDocuments task:", task);

  await waitTask(task);

  const done = await client.getTask(task.taskUid);
  console.log("[MEILI] task status:", done?.status);
  if (done?.status === "failed") {
    console.error("[MEILI] task error:", done?.error);
    process.exit(1);
  }

  console.log(`[MEILI] indexed docs: ${docs.length}`);
  console.log("Reindex complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
