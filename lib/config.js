// URL used for server-side fetches (Next.js server components, API routes, scripts).
// In Docker Compose this should typically be http://directus:8055.
export const DIRECTUS_INTERNAL_URL =
  process.env.DIRECTUS_INTERNAL_URL ||
  process.env.DIRECTUS_URL ||
  "http://localhost:8055";

// URL used by the browser to load public assets (e.g., images from /assets/...)
// In local dev this is typically http://localhost:8055.
export const DIRECTUS_PUBLIC_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  process.env.DIRECTUS_PUBLIC_URL ||
  "http://localhost:8055";

// Backwards-compatible alias used throughout the original MVP code.
export const DIRECTUS_URL = DIRECTUS_INTERNAL_URL;

export const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "";

export const MEILI_URL = process.env.MEILI_URL || "http://localhost:7700";
export const MEILI_API_KEY = process.env.MEILI_API_KEY || "";
