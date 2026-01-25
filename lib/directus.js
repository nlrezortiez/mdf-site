import { DIRECTUS_URL, DIRECTUS_TOKEN } from "@/lib/config";

function buildQuery({ limit, offset, sort, filter, fields, meta }) {
  const qs = new URLSearchParams();

  if (typeof limit === "number") qs.set("limit", String(limit));
  if (typeof offset === "number") qs.set("offset", String(offset));
  if (sort) qs.set("sort", sort);

  if (meta) qs.set("meta", meta);

  // Directus supports fields[] syntax.
  if (Array.isArray(fields) && fields.length) {
    for (const f of fields) qs.append("fields[]", f);
  }

  // filter object -> filter[field][_op]=...
  // Example: { is_published: { _eq: true }, slug: { _eq: "x" } }
  if (filter && typeof filter === "object") {
    appendFilter(qs, "filter", filter);
  }

  return qs;
}

function appendFilter(qs, prefix, obj) {
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    const nextPrefix = `${prefix}[${key}]`;

    if (val && typeof val === "object" && !Array.isArray(val)) {
      appendFilter(qs, nextPrefix, val);
      continue;
    }

    // Scalars and arrays
    qs.set(nextPrefix, Array.isArray(val) ? JSON.stringify(val) : String(val));
  }
}

async function dFetch(path, { method = "GET", body, headers } = {}) {
  const url = `${DIRECTUS_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Directus ${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function listItems(
  collection,
  { limit = 24, page = 1, sort = "-id", filter, fields, meta = "total_count" } = {}
) {
  const offset = (page - 1) * limit;
  const qs = buildQuery({ limit, offset, sort, filter, fields, meta });
  return dFetch(`/items/${collection}?${qs.toString()}`);
}

export async function readItemBySlug(collection, slug, { fields } = {}) {
  const qs = buildQuery({
    limit: 1,
    offset: 0,
    sort: "-id",
    fields,
    filter: {
      slug: { _eq: slug },
      is_published: { _neq: false }
    }
  });
  const json = await dFetch(`/items/${collection}?${qs.toString()}`);
  const item = (json?.data || [])[0];
  return item || null;
}

export async function readSingleton(collection, { fields } = {}) {
  const qs = buildQuery({ fields });
  const url = qs.toString()
    ? `/items/${collection}/singleton?${qs.toString()}`
    : `/items/${collection}/singleton`;
  const json = await dFetch(url);
  return json?.data || null;
}

export async function createItems(collection, items) {
  return dFetch(`/items/${collection}`, { method: "POST", body: items });
}
