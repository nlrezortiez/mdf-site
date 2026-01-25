import Link from "next/link";
import { sectionBySlug } from "@/lib/catalog";
import { listItems } from "@/lib/directus";
import CatalogCard from "@/components/CatalogCard";

export const dynamic = "force-dynamic";

export default async function CatalogSectionPage({ params, searchParams }) {
  const p = await params;
  const sp = await searchParams;

  const sectionSlug = (p?.section || "").toString();
  const section = sectionBySlug(sectionSlug);

  if (!section) {
    return (
      <div>
        <div className="kicker">Каталог</div>
        <h1 className="h1">Раздел не найден</h1>
        <div className="panel">
          <Link className="button" href="/catalog">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const page = Math.max(1, parseInt(sp?.page || "1", 10) || 1);
  const limit = 24;

  const json = await listItems(section.collection, {
    limit,
    page,
    sort: "-is_popular,-id",
    filter: { is_published: { _neq: false } },
    fields: [
      "id",
      "slug",
      "title",
      "short_description",
      "preview_image",
      "preview_image.id",
      "is_popular"
    ]
  });

  const items = json?.data || [];
  const total = json?.meta?.total_count;

  const hasNext = typeof total === "number" ? page * limit < total : items.length === limit;
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = hasNext ? page + 1 : null;

  return (
    <div>
      <div className="kicker">Каталог</div>
      <h1 className="h1">{section.title}</h1>

      <div className="panel">
        <div className="small" style={{ color: "var(--muted)" }}>
          {typeof total === "number" ? `Записей: ${total}` : ""}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="button" href="/catalog">
            Все разделы
          </Link>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="grid">
        {items.map((it) => (
          <CatalogCard key={it.id} sectionSlug={section.section} kind={section.kind} item={it} />
        ))}

        {items.length === 0 ? (
          <div className="panel" style={{ gridColumn: "1 / -1", color: "var(--muted)" }}>
            В этом разделе пока нет элементов.
          </div>
        ) : null}
      </div>

      <div style={{ height: 14 }} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {prevPage ? (
          <a className="button" href={`/catalog/${section.section}?page=${prevPage}`}>
            Назад
          </a>
        ) : null}
        {nextPage ? (
          <a className="button" href={`/catalog/${section.section}?page=${nextPage}`}>
            Вперёд
          </a>
        ) : null}
      </div>
    </div>
  );
}
