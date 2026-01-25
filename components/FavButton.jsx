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

function writeFavs(arr) {
  localStorage.setItem("favorites_v1", JSON.stringify(arr));
  // trigger badge update in same tab
  window.dispatchEvent(new Event("storage"));
}

export default function FavButton({ kind, slug }) {
  const key = useMemo(() => `${kind}:${slug}`, [kind, slug]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const favs = readFavs();
    setActive(favs.includes(key));
  }, [key]);

  function toggle() {
    const favs = readFavs();
    const next = favs.includes(key) ? favs.filter(x => x !== key) : [...favs, key];
    writeFavs(next);
    setActive(next.includes(key));
  }

  return (
    <button className="button" type="button" onClick={toggle} aria-pressed={active}>
      {active ? "Убрать из избранного" : "В избранное"}
    </button>
  );
}
