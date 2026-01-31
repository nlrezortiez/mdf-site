import Link from "next/link";
import { listItems } from "@/lib/directus";
import MillingCard from "@/components/MillingCard";

export const dynamic = "force-dynamic";

function asArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [String(v)];
}

function uniqSorted(arr) {
  return Array.from(
    new Set(arr.filter(Boolean).map((x) => String(x).trim())),
  ).sort((a, b) => a.localeCompare(b, "ru"));
}

export default async function MillingsPage({ searchParams }) {
  const sp = await searchParams;

  const onlyNew = String(sp?.only_new || "") === "1";
  const cover = String(sp?.cover || "").trim();
  const cats = asArray(sp?.cat);

  const baseFilter = { is_published: { _neq: false } };
  const filter = { ...baseFilter };

  if (onlyNew) filter.is_popular = { _eq: true };
  if (cover) filter.cover_type = { _eq: cover };
  if (cats.length) filter.category = { _in: cats };

  const json = await listItems("millings", {
    limit: 200,
    page: 1,
    sort: "-id",
    filter,
    fields: [
      "id",
      "slug",
      "title",
      "article",
      "category",
      "cover_type",
      "is_popular",
      "preview_image",
      "preview_image.id",
    ],
  }).catch(() => ({ data: [] }));

  const items = json?.data || [];

  // значения для фильтров берём из данных (чтобы не хардкодить)
  const metaJson = await listItems("millings", {
    limit: 500,
    page: 1,
    sort: "-id",
    filter: baseFilter,
    fields: ["category", "cover_type"],
  }).catch(() => ({ data: [] }));

  const metaItems = metaJson?.data || [];
  const allCategories = uniqSorted(metaItems.map((x) => x?.category));
  const allCovers = uniqSorted(metaItems.map((x) => x?.cover_type));

  return (
    <div>
      <div className="breadcrumbs">
        <Link href="/">Главная</Link>
        <span className="breadcrumbsSep">/</span>
        <span>Каталог</span>
        <span className="breadcrumbsSep">/</span>
        <span>Фрезеровки</span>
      </div>

      <h1 className="pageTitle">Фрезеровки</h1>

      <div className="ptLayout">
        <aside className="ptSidebar">
          <form method="GET" className="ptForm">
            <div className="ptBlock">
              <div className="ptBlockTitle">Новинка</div>
              <label className="ptCheck">
                <input
                  type="checkbox"
                  name="only_new"
                  value="1"
                  defaultChecked={onlyNew}
                />
                <span>Только новинки</span>
              </label>
            </div>

            <div className="ptBlock" style={{ marginTop: 18 }}>
              <div className="ptBlockTitle">Типы покрытия</div>
              <div className="ptChecks">
                {allCovers.map((c) => (
                  <label className="ptCheck" key={c}>
                    <input
                      type="radio"
                      name="cover"
                      value={c}
                      defaultChecked={cover === c}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="ptBlock" style={{ marginTop: 18 }}>
              <div className="ptBlockTitle">Категории</div>
              <div className="ptChecks">
                {allCategories.map((c) => (
                  <label className="ptCheck" key={c}>
                    <input
                      type="checkbox"
                      name="cat"
                      value={c}
                      defaultChecked={cats.includes(c)}
                    />
                    <span>{`Категория "${c}"`}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="ptBtn ptBtnPrimary"
              type="submit"
              style={{ marginTop: 18 }}
            >
              Поиск
            </button>

            <Link
              className="ptBtn ptBtnSecondary"
              href="/catalog/millings"
              style={{ marginTop: 10 }}
            >
              Сбросить
            </Link>
          </form>
        </aside>

        <section className="ptGrid">
          {items.map((it) => (
            <MillingCard key={it.id} item={it} />
          ))}

          {items.length === 0 ? (
            <div className="ptEmpty">
              По выбранным фильтрам ничего не найдено.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
