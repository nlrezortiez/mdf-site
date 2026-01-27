"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FavoriteTile from "@/components/FavoriteTile";
import { KIND_LABEL, SECTIONS, sectionBySlug } from "@/lib/catalog";

function pluralRu(n, one, few, many) {
  const x = Math.abs(Number(n) || 0) % 100;
  const y = x % 10;
  if (x > 10 && x < 20) return many;
  if (y > 1 && y < 5) return few;
  if (y === 1) return one;
  return many;
}

function groupTitleForSection(sectionSlug) {
  const sec = sectionBySlug(sectionSlug);
  if (sec) return `Избранные элементы каталога "${sec.title}"`;
  return "Избранное";
}

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      try {
        setError("");
        const raw = localStorage.getItem("favorites_v1");
        const favs = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(favs) || favs.length === 0) {
          setItems([]);
          return;
        }

        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys: favs }),
        });

        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();

        // если API отдал нормализованные ids (миграция), сохраняем их
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
        setError(String(e?.message || e));
      }
    }
    run();
  }, []);

  const totalCount = items.length;

  const groups = useMemo(() => {
    const bySection = new Map();
    for (const it of items) {
      const key = it.section || it.kind || "other";
      if (!bySection.has(key)) bySection.set(key, []);
      bySection.get(key).push(it);
    }

    const sectionOrder = new Map(SECTIONS.map((s, idx) => [s.section, idx]));

    return Array.from(bySection.entries())
      .map(([key, list]) => ({ key, list }))
      .sort((a, b) => {
        const ai = sectionOrder.has(a.key) ? sectionOrder.get(a.key) : 999;
        const bi = sectionOrder.has(b.key) ? sectionOrder.get(b.key) : 999;
        if (ai !== bi) return ai - bi;
        return a.key.localeCompare(b.key);
      });
  }, [items]);

  return (
    <div>
      <nav className="breadcrumbs" aria-label="Навигация">
        <Link href="/">Главная</Link>
        <span className="crumbSep">/</span>
        <span>Избранное</span>
      </nav>

      <h1 className="pageTitle">Избранное</h1>

      <div className="favCountLine">
        {totalCount} {pluralRu(totalCount, "элемент", "элемента", "элементов")}{" "}
        каталога
      </div>

      {error ? <div className="panel">Ошибка: {error}</div> : null}

      {!error && totalCount === 0 ? (
        <div className="panel" style={{ color: "var(--muted)" }}>
          Пока пусто. Добавьте элементы в избранное из карточек.
        </div>
      ) : null}

      {groups.map(({ key, list }) => (
        <section key={key} className="favSection">
          <h2 className="favSectionTitle">{groupTitleForSection(key)}</h2>

          <div className="favGrid">
            {list.map((it) => (
              <FavoriteTile key={it.id} item={it} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
