import { DIRECTUS_URL, DIRECTUS_TOKEN } from "@/lib/config";

function buildQuery({ limit, offset, sort, filter, fields, meta }) {
  const qs = new URLSearchParams();

  if (typeof limit === "number") qs.set("limit", String(limit));
  if (typeof offset === "number") qs.set("offset", String(offset));
  if (sort) qs.set("sort", sort);
  if (meta) qs.set("meta", meta);

  if (Array.isArray(fields) && fields.length) {
    for (const f of fields) qs.append("fields[]", f);
  }

  if (filter && typeof filter === "object") {
    appendFilter(qs, "filter", filter);
  }

  return qs;
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function appendFilter(qs, prefix, obj) {
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;

    const nextPrefix = `${prefix}[${key}]`;

    if (Array.isArray(val)) {
      // 1) массив объектов: это _and/_or — обязаны быть индексированы
      const allObjects = val.every((x) => isPlainObject(x));
      if (allObjects) {
        val.forEach((entry, idx) => {
          appendFilter(qs, `${nextPrefix}[${idx}]`, entry);
        });
        continue;
      }

      // 2) массив примитивов: это обычно _in/_nin — лучше всего работает как "a,b,c"
      const joined = val
        .map((x) => String(x))
        .map((x) => x.trim())
        .filter(Boolean)
        .join(",");
      qs.set(nextPrefix, joined);
      continue;
    }

    if (isPlainObject(val)) {
      appendFilter(qs, nextPrefix, val);
      continue;
    }

    qs.set(nextPrefix, String(val));
  }
}

async function dFetch(path, { method = "GET", body, headers } = {}) {
  const url = `${DIRECTUS_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Directus ${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function listItems(
  collection,
  {
    limit = 24,
    page = 1,
    sort = "-id",
    filter,
    fields,
    meta = "total_count",
  } = {},
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
      is_published: { _neq: false },
    },
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
