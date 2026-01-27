import Link from "next/link";
import { listItems } from "@/lib/directus";
import ProductTypeCard from "@/components/ProductTypeCard";

export const dynamic = "force-dynamic";

function asArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [String(v)];
}

function uniqSorted(arr) {
  const s = new Set(
    arr
      .filter(Boolean)
      .map((x) => x.trim())
      .filter(Boolean),
  );
  return Array.from(s).sort((a, b) => a.localeCompare(b, "ru"));
}

export default async function ProductTypesPage({ searchParams }) {
  const sp = await searchParams;

  const onlyNew = String(sp?.only_new || "") === "1";
  const cats = asArray(sp?.cat);
  const selectedCats = new Set(cats);

  // 1) Категории для сайдбара (берём из всех items, без фильтра по категории/новинке)
  let allCategories = [];
  try {
    const catsJson = await listItems("product_types_items", {
      limit: 500,
      page: 1,
      sort: "category",
      filter: { is_published: { _neq: false } },
      fields: ["category"],
    });
    allCategories = uniqSorted((catsJson?.data || []).map((x) => x.category));
  } catch {
    allCategories = [];
  }

  // 2) Items списка с фильтрами
  const filter = {
    is_published: { _neq: false },
  };
  if (onlyNew) filter.is_popular = { _eq: true };
  if (cats.length) filter.category = { _in: cats };

  const json = await listItems("product_types_items", {
    limit: 200,
    page: 1,
    sort: "-id",
    filter,
    fields: [
      "id",
      "slug",
      "title",
      "category",
      "is_popular",
      "preview_image",
      "preview_image.id",
    ],
  }).catch(() => ({ data: [] }));

  const items = json?.data || [];

  const singleCat = cats.length === 1 ? cats[0] : null;

  return (
    <div>
      <div className="breadcrumbs">
        <Link href="/">Главная</Link>
        <span className="breadcrumbsSep">/</span>
        <span>Каталог</span>
        <span className="breadcrumbsSep">/</span>
        <span>Виды продукции</span>
        {singleCat ? (
          <>
            <span className="breadcrumbsSep">/</span>
            <span>{singleCat}</span>
          </>
        ) : null}
      </div>

      <h1 className="pageTitle">Виды продукции</h1>

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
              <div className="ptBlockTitle">Категории</div>

              <div className="ptChecks">
                {allCategories.map((c) => (
                  <label key={c} className="ptCheck">
                    <input
                      type="checkbox"
                      name="cat"
                      value={c}
                      defaultChecked={selectedCats.has(c)}
                    />
                    <span>{c}</span>
                  </label>
                ))}

                {allCategories.length === 0 ? (
                  <div className="ptMuted">
                    Категории не найдены (проверьте поле category и доступ).
                  </div>
                ) : null}
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
              href="/catalog/product-types"
              style={{ marginTop: 10 }}
            >
              Сбросить
            </Link>
          </form>
        </aside>

        <section className="ptGrid">
          {items.map((it) => (
            <ProductTypeCard key={it.id} item={it} />
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
