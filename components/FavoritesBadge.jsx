"use client";

import { useEffect, useState } from "react";

function migrate(rawArr) {
  if (!Array.isArray(rawArr)) return { arr: [], changed: false };

  let changed = false;
  const out = rawArr
    .map((k) => {
      const s = String(k || "");
      if (!s) return "";
      if (s.includes(":")) {
        changed = true;
        const i = s.indexOf(":");
        return s.slice(0, i) + "_" + s.slice(i + 1);
      }
      return s;
    })
    .filter(Boolean);

  const seen = new Set();
  const uniq = [];
  for (const k of out) {
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(k);
  }

  return { arr: uniq, changed };
}

export default function FavoritesBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("favorites_v1");
        const arr0 = raw ? JSON.parse(raw) : [];
        const { arr, changed } = migrate(arr0);
        if (changed) {
          localStorage.setItem("favorites_v1", JSON.stringify(arr));
        }
        setCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setCount(0);
      }
    };

    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  return (
    <span className="badge" aria-label="Количество избранных">
      {count}
    </span>
  );
}
