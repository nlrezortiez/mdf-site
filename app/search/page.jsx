import { meiliClient } from "@/lib/meili";
import { KIND_LABEL } from "@/lib/catalog";
import ResultCard from "@/components/ResultCard";

export const dynamic = "force-dynamic";

function buildHref(kind, section, slug) {
  if (["offer"].includes(kind)) return `/special-offers/${slug}`;
  if (["news"].includes(kind)) return `/news/${slug}`;
  if (["solution"].includes(kind)) return `/solutions/${slug}`;
  if (["gallery"].includes(kind)) return `/gallery`;
  return `/catalog/${section}/${slug}`;
}

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;

  const q = (sp?.q || "").toString();
  const page = Math.max(1, parseInt(sp?.page || "1", 10) || 1);
  const limit = 24;
  const offset = (page - 1) * limit;

  const client = meiliClient();
  const index = client.index("catalog");

  let res = null;
  try {
    res = await index.search(q, { limit, offset });
  } catch (e) {
    return (
      <div className="panel">
        <div className="kicker">Ошибка поиска</div>
        <div style={{ whiteSpace: "pre-wrap", color: "var(--muted)" }}>{String(e?.message || e)}</div>
        <div style={{ marginTop: 12 }}>
          Проверьте, что Meilisearch запущен и индекс создан (docker compose run --rm tools scripts/reindex.mjs).
        </div>
      </div>
    );
  }

  const hits = res?.hits || [];
  const total = res?.estimatedTotalHits ?? res?.nbHits ?? 0;

  const normalized = hits.map((h) => {
    const kindLabel = KIND_LABEL[h.kind] || h.kind;
    const href = buildHref(h.kind, h.section, h.slug);
    return { ...h, kindLabel, href };
  });

  const nextPage = offset + hits.length < total ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return (
    <div>
      <div className="kicker">Поиск</div>
      <h1 className="h1">{q ? `Результаты по запросу: “${q}”` : "Поиск по каталогу и сайту"}</h1>

      <div className="panel">
        <div className="small" style={{ color: "var(--muted)" }}>
          Найдено: {total}
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="grid">
        {normalized.map((item) => (
          <ResultCard key={item.id} item={item} />
        ))}
        {normalized.length === 0 ? (
          <div className="panel" style={{ gridColumn: "1 / -1", color: "var(--muted)" }}>
            Ничего не найдено.
          </div>
        ) : null}
      </div>

      <div style={{ height: 14 }} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {prevPage ? (
          <a className="button" href={`/search?q=${encodeURIComponent(q)}&page=${prevPage}`}>
            Назад
          </a>
        ) : null}
        {nextPage ? (
          <a className="button" href={`/search?q=${encodeURIComponent(q)}&page=${nextPage}`}>
            Вперёд
          </a>
        ) : null}
      </div>
    </div>
  );
}
