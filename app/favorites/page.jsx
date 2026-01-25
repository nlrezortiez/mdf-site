"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import { KIND_LABEL } from "@/lib/catalog";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      try {
        const raw = localStorage.getItem("favorites_v1");
        const favs = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(favs) || favs.length === 0) {
          setItems([]);
          return;
        }
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ keys: favs })
        });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        const list = (json.items || []).map((x) => ({
          ...x,
          kindLabel: KIND_LABEL[x.kind] || x.kind
        }));
        setItems(list);
      } catch (e) {
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
        {items.map((it) => <ResultCard key={it.id} item={it} />)}
        {items.length === 0 && !error ? (
          <div className="panel" style={{gridColumn:"1 / -1", color:"var(--muted)"}}>
            Пока пусто. Добавьте элементы в избранное из карточек.
          </div>
        ) : null}
      </div>
    </div>
  );
}
