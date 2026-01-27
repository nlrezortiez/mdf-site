"use client";

import { useEffect, useMemo, useState } from "react";

function readFavs() {
  try {
    const raw = localStorage.getItem("favorites_v1");
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
    const s = String(x ?? "").trim();
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function writeFavs(arr) {
  localStorage.setItem("favorites_v1", JSON.stringify(uniq(arr)));
  window.dispatchEvent(new Event("storage"));
}

export default function FavHeartButton({ docId, className = "" }) {
  const key = useMemo(() => String(docId || ""), [docId]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!key) {
      setActive(false);
      return;
    }
    const favs = readFavs();
    setActive(favs.includes(key));
  }, [key]);

  function toggle(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!key) return;

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
      className={`heartBtn ${active ? "isActive" : ""} ${className}`}
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
