"use client";

import { useEffect, useMemo, useState } from "react";

const LS_KEY = "favorites_v1";

function readFavs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function uniq(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    if (!x) continue;
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
  }
  return out;
}

function writeFavs(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(uniq(arr)));
  window.dispatchEvent(new Event("storage"));
}

export default function FavHeartButton({ docId, kind, slug, className = "" }) {
  // приоритет: docId (реальный id в Meili). fallback: kind_slug
  const key = useMemo(() => {
    if (docId) return String(docId);
    return `${kind}_${slug}`;
  }, [docId, kind, slug]);

  const [active, setActive] = useState(false);

  useEffect(() => {
    const favs = readFavs();
    setActive(favs.includes(key));
  }, [key]);

  function toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    const favs = readFavs();
    const next = favs.includes(key)
      ? favs.filter((x) => x !== key)
      : [...favs, key];
    writeFavs(next);
    setActive(next.includes(key));
  }

  return (
    <button
      type="button"
      className={`favHeart ${active ? "isActive" : ""} ${className}`}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      aria-pressed={active}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 21s-7.2-4.6-9.6-8.7C.6 9.1 2.1 5.8 5.4 5.1c1.7-.4 3.4.3 4.6 1.6 1.2-1.3 2.9-2 4.6-1.6 3.3.7 4.8 4 3 7.2C19.2 16.4 12 21 12 21z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
