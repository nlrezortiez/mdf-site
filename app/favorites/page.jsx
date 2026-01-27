"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import { KIND_LABEL } from "@/lib/catalog";

function migrateFavoritesKeys(rawArr) {
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

  // уберём дубликаты, сохраняя порядок
  const seen = new Set();
  const uniq = [];
  for (const k of out) {
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(k);
  }

  return { arr: uniq, changed };
}

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      try {
        setError("");

        const raw = localStorage.getItem("favorites_v1");
        const favsRaw = raw ? JSON.parse(raw) : [];

        const { arr: favs, changed } = migrateFavoritesKeys(favsRaw);
        if (changed) {
          localStorage.setItem("favorites_v1", JSON.stringify(favs));
          window.dispatchEvent(new Event("storage"));
        }

        if (!Array.isArray(favs) || favs.length === 0) {
          setItems([]);
          return;
        }

        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys: favs }),
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `HTTP ${res.status}`);
        }
        const json = await res.json();

        // миграция localStorage на реальные id из Meili
        if (Array.isArray(json.normalized_ids) && json.normalized_ids.length) {
          localStorage.setItem(
            "favorites_v1",
            JSON.stringify(json.normalized_ids),
          );
          window.dispatchEvent(new Event("storage"));
        }

        const list = (json.items || []).map((x) => ({
          ...x,
          kindLabel: KIND_LABEL[x.kind] || x.kind,
        }));
        setItems(list);
      } catch (e) {
        setItems([]);
        setError(String(e?.message || e));
      }
    }

    run();
  }, []);

  return (
    <div>
      <div className="kicker">Избранное</div>
      <h1 className="h1">Избранное</h1>

      {error ? <div className="panel">Ошибка: {error}</div> : null}

      <div className="grid">
        {items.map((it) => (
          <ResultCard key={it.id} item={it} />
        ))}

        {items.length === 0 && !error ? (
          <div
            className="panel"
            style={{ gridColumn: "1 / -1", color: "var(--muted)" }}
          >
            Пока пусто. Добавьте элементы в избранное из карточек.
          </div>
        ) : null}
      </div>
    </div>
  );
}
