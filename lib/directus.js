import { DIRECTUS_URL, DIRECTUS_TOKEN } from "@/lib/config";

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

export async function listItems(collection, { limit = 24, page = 1, sort = "-id" } = {}) {
  const offset = (page - 1) * limit;
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    sort
  });
  return dFetch(`/items/${collection}?${qs.toString()}`);
}

export async function readItemBySlug(collection, slug) {
  const qs = new URLSearchParams({
    "filter[slug][_eq]": slug,
    limit: "1"
  });
  const json = await dFetch(`/items/${collection}?${qs.toString()}`);
  const item = (json?.data || [])[0];
  if (!item) return null;
  return item;
}

export async function readSingleton(collection) {
  const json = await dFetch(`/items/${collection}/singleton`);
  return json?.data || null;
}

export async function createItems(collection, items) {
  return dFetch(`/items/${collection}`, { method: "POST", body: items });
}
