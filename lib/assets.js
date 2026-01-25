function qs(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

function normalizeFileId(file) {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (typeof file === "object" && typeof file.id === "string") return file.id;
  return null;
}

export function assetUrl(file, opts = {}) {
  const fileId = normalizeFileId(file);
  if (!fileId) return null;
  return `/api/assets/${encodeURIComponent(fileId)}${qs(opts)}`;
}

export function maybeAssetUrl(file, opts = {}) {
  return assetUrl(file, opts);
}
