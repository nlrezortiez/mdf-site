import Link from "next/link";
import { listItems } from "@/lib/directus";
import SolutionCard from "@/components/SolutionCard";

export const dynamic = "force-dynamic";

export default async function SolutionsList() {
  const json = await listItems("solutions", {
    limit: 60,
    page: 1,
    sort: "-id",
    filter: { is_published: { _neq: false } },
    fields: [
      "id",
      "slug",
      "title",
      "film_pvc",
      "milling",
      "cover_image",
      "cover_image.id"
    ]
  }).catch(() => ({ data: [] }));

  const items = json?.data || [];

  return (
    <div>
      <div className="breadcrumbs">
        <Link href="/">Главная</Link>
        <span className="breadcrumbsSep">/</span>
        <span>Готовые решения</span>
      </div>

      <h1 className="pageTitle">Готовые решения</h1>

      <div className="solutionsGrid">
        {items.map((s) => (
          <SolutionCard key={s.id} item={s} />
        ))}

        {items.length === 0 ? (
          <div className="panel" style={{ gridColumn: "1 / -1", color: "var(--muted)" }}>
            Пока нет решений.
          </div>
        ) : null}
      </div>
    </div>
  );
}
