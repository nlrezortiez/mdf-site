import Link from "next/link";
import { sectionBySlug } from "@/lib/catalog";
import { listItems } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function CatalogSectionPage({ params, searchParams }) {
  const section = sectionBySlug(params.section);
  if (!section) return <div className="panel">Неизвестный раздел.</div>;

  const page = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const limit = 24;

  const json = await listItems(section.collection, { limit, page, sort: "-id" });
  const items = json?.data || [];
  const total = json?.meta?.filter_count ?? json?.meta?.total_count ?? null;

  const nextPage = items.length === limit ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return (
    <div>
      <div className="kicker">Каталог / {section.title}</div>
      <h1 className="h1">{section.title}</h1>

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th style={{width:160}}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  <Link href={`/catalog/${section.section}/${it.slug}`}>{it.title}</Link>
                </td>
                <td>
                  <Link className="button" href={`/catalog/${section.section}/${it.slug}`}>Открыть</Link>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr><td colSpan={2} style={{color:"var(--muted)"}}>Пока нет данных. Запустите seed.</td></tr>
            ) : null}
          </tbody>
        </table>

        <div style={{display:"flex", gap:10, marginTop:12, flexWrap:"wrap"}}>
          {prevPage ? <Link className="button" href={`/catalog/${section.section}?page=${prevPage}`}>Назад</Link> : null}
          {nextPage ? <Link className="button" href={`/catalog/${section.section}?page=${nextPage}`}>Вперёд</Link> : null}
          {total !== null ? <span className="badge">Всего: {total}</span> : null}
        </div>
      </div>
    </div>
  );
}
