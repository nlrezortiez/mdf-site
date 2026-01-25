import { authHeaders, httpJson, mustEnv, waitForHttpOk } from "./_shared.mjs";

const DIRECTUS_URL = mustEnv("DIRECTUS_URL").replace(/\/$/, "");
const DIRECTUS_TOKEN = mustEnv("DIRECTUS_TOKEN");

const headers = authHeaders(DIRECTUS_TOKEN);

async function ensureCollection({ collection, meta, fields, schema }) {
  // Check exists
  try {
    await httpJson(`${DIRECTUS_URL}/collections/${collection}`, { headers });
    console.log(`[OK] collection exists: ${collection}`);
    return;
  } catch (e) {
    if (!String(e.message).includes("404")) {
      console.log(`[WARN] check collection ${collection}: ${e.message}`);
    }
  }

  const body = {
    collection,
    meta: meta || {},
    schema: schema || { name: collection, schema: "public" },
    fields: fields || []
  };

  await httpJson(`${DIRECTUS_URL}/collections`, { method: "POST", headers, body });
  console.log(`[CREATE] collection: ${collection}`);
}

function baseFields({ includeArticle=false, includeCategory=false, includeHex=false, includeExcerpt=false, includeBody=false, includeDates=false }) {
  const fields = [
    // Primary key
    {
      field: "id",
      type: "integer",
      meta: { interface: "input", hidden: true, readonly: true },
      schema: { name: "id", table: "", type: "integer", is_primary_key: true, has_auto_increment: true, is_nullable: false }
    },
    {
      field: "slug",
      type: "string",
      meta: { interface: "input", required: true },
      schema: { name: "slug", table: "", type: "varchar", max_length: 255, is_nullable: false, is_unique: true }
    },
    {
      field: "title",
      type: "string",
      meta: { interface: "input", required: true },
      schema: { name: "title", table: "", type: "varchar", max_length: 255, is_nullable: false }
    },
    {
      field: "short_description",
      type: "text",
      meta: { interface: "textarea" },
      schema: { name: "short_description", table: "", type: "text", is_nullable: true }
    },
    {
      field: "description",
      type: "text",
      meta: { interface: "textarea" },
      schema: { name: "description", table: "", type: "text", is_nullable: true }
    },
    {
      field: "is_published",
      type: "boolean",
      meta: { interface: "toggle" },
      schema: { name: "is_published", table: "", type: "boolean", default_value: true, is_nullable: false }
    },
    {
      field: "is_popular",
      type: "boolean",
      meta: { interface: "toggle" },
      schema: { name: "is_popular", table: "", type: "boolean", default_value: false, is_nullable: false }
    }
  ];

  if (includeArticle) {
    fields.push({
      field: "article",
      type: "string",
      meta: { interface: "input" },
      schema: { name: "article", table: "", type: "varchar", max_length: 255, is_nullable: true }
    });
  }
  if (includeCategory) {
    fields.push({
      field: "category",
      type: "string",
      meta: { interface: "input" },
      schema: { name: "category", table: "", type: "varchar", max_length: 255, is_nullable: true }
    });
  }
  if (includeHex) {
    fields.push({
      field: "hex_color",
      type: "string",
      meta: { interface: "input", note: "Напр. #aabbcc" },
      schema: { name: "hex_color", table: "", type: "varchar", max_length: 32, is_nullable: true }
    });
  }
  if (includeExcerpt) {
    fields.push({
      field: "excerpt",
      type: "text",
      meta: { interface: "textarea" },
      schema: { name: "excerpt", table: "", type: "text", is_nullable: true }
    });
  }
  if (includeBody) {
    fields.push({
      field: "body",
      type: "text",
      meta: { interface: "textarea" },
      schema: { name: "body", table: "", type: "text", is_nullable: true }
    });
  }
  if (includeDates) {
    fields.push({
      field: "date_from",
      type: "date",
      meta: { interface: "datetime" },
      schema: { name: "date_from", table: "", type: "date", is_nullable: true }
    });
    fields.push({
      field: "date_to",
      type: "date",
      meta: { interface: "datetime" },
      schema: { name: "date_to", table: "", type: "date", is_nullable: true }
    });
    fields.push({
      field: "published_at",
      type: "dateTime",
      meta: { interface: "datetime" },
      schema: { name: "published_at", table: "", type: "timestamp without time zone", is_nullable: true }
    });
  }

  fields.push({
    field: "warning_text",
    type: "text",
    meta: { interface: "textarea" },
    schema: { name: "warning_text", table: "", type: "text", is_nullable: true }
  });

  return fields;
}

async function main() {
  console.log("Waiting for Directus...");
  await waitForHttpOk(`${DIRECTUS_URL}/server/health`);
  console.log("Directus is up.");

  // Create collections
  const collections = [
    { collection: "product_types_items", meta: { icon: "category", note: "Виды продукции" }, fields: baseFields({}) },
    { collection: "millings", meta: { icon: "straighten", note: "Фрезеровки" }, fields: baseFields({ includeArticle: true }) },
    { collection: "films", meta: { icon: "layers", note: "Плёнка ПВХ" }, fields: baseFields({ includeArticle: true, includeCategory: true }) },
    { collection: "colors", meta: { icon: "palette", note: "Эмали / RAL" }, fields: baseFields({ includeArticle: true, includeCategory: true, includeHex: true }) },
    { collection: "edges", meta: { icon: "select_all", note: "Торцы" }, fields: baseFields({}) },
    { collection: "patinas", meta: { icon: "auto_awesome", note: "Патина" }, fields: baseFields({}) },

    { collection: "special_offers", meta: { icon: "local_offer", note: "Акции" }, fields: baseFields({ includeBody: true, includeDates: true }) },
    { collection: "news", meta: { icon: "feed", note: "Новости" }, fields: baseFields({ includeExcerpt: true, includeBody: true, includeDates: true }) },
    { collection: "solutions", meta: { icon: "task_alt", note: "Готовые решения" }, fields: baseFields({}) },
    { collection: "gallery_items", meta: { icon: "photo_library", note: "Галерея" }, fields: baseFields({}) },

    {
      collection: "site_settings",
      meta: { icon: "settings", note: "Настройки сайта", singleton: true, hidden: false },
      fields: [
        { field: "id", type: "integer", meta: { interface: "input", hidden: true, readonly: true }, schema: { name: "id", table: "", type: "integer", is_primary_key: true, has_auto_increment: true, is_nullable: false } },
        { field: "phone", type: "string", meta: { interface: "input" }, schema: { name: "phone", table: "", type: "varchar", max_length: 64, is_nullable: true } },
        { field: "email", type: "string", meta: { interface: "input" }, schema: { name: "email", table: "", type: "varchar", max_length: 128, is_nullable: true } },
        { field: "address", type: "text", meta: { interface: "textarea" }, schema: { name: "address", table: "", type: "text", is_nullable: true } }
      ]
    }
  ];

  for (const c of collections) {
    // inject table name into schema objects
    if (Array.isArray(c.fields)) {
      for (const f of c.fields) {
        if (f?.schema) f.schema.table = c.collection;
      }
    }
    await ensureCollection(c);
  }

  // Seed singleton defaults
  try {
    await httpJson(`${DIRECTUS_URL}/items/site_settings/singleton`, {
      method: "PATCH",
      headers,
      body: { phone: "+7 (000) 000-00-00", email: "info@example.com", address: "Город, улица, дом" }
    });
    console.log("[OK] seeded site_settings singleton");
  } catch (e) {
    console.log(`[WARN] seed site_settings failed: ${e.message}`);
  }

  console.log("Bootstrap complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
