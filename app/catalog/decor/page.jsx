import Link from "next/link";
import { listItems } from "@/lib/directus";
import DecorCard from "@/components/DecorCard";

export const dynamic = "force-dynamic";

const DECOR_CATEGORIES = [
  "Балюстрады",
  "Гуськи",
  "Световые планки",
  "Цоколи",
  "Пилястры 2D",
  "Пилястры 3D",
  "Декоративные накладки для карнизов",
  "Карнизы",
  "Подкарнизные планки",
];

function asArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [String(v)];
}

function uniqSorted(arr) {
  const s = new Set(
    arr
      .filter(Boolean)
      .map((x) => String(x).trim())
      .filter(Boolean),
  );
  return Array.from(s).sort((a, b) => a.localeCompare(b, "ru"));
}

export default async function DecorPage({ searchParams }) {
  const sp = await searchParams;

  const cats = asArray(sp?.cat);
  const selectedCats = new Set(cats);

  // категории для сайдбара (только из декор-элементов)
  let allCategories = [];
  try {
    const catsJson = await listItems("product_types_items", {
      limit: 500,
      page: 1,
      sort: "category",
      filter: {
        is_published: { _neq: false },
        category: { _in: DECOR_CATEGORIES },
      },
      fields: ["category"],
    });
    allCategories = uniqSorted((catsJson?.data || []).map((x) => x.category));

    // если Directus вернул пусто (например, ещё нет данных), покажем дефолтный список
    if (allCategories.length === 0) allCategories = [...DECOR_CATEGORIES];
  } catch {
    allCategories = [...DECOR_CATEGORIES];
  }

  const filter = {
    is_published: { _neq: false },
    // по умолчанию — все “декор” категории; если выбрали — фильтруем по выбранным
    category: { _in: cats.length ? cats : DECOR_CATEGORIES },
  };

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
        <span>Декоративные элементы</span>
        {singleCat ? (
          <>
            <span className="breadcrumbsSep">/</span>
            <span>{singleCat}</span>
          </>
        ) : null}
      </div>

      <h1 className="pageTitle">Декоративные элементы</h1>

      <div className="ptLayout">
        <aside className="ptSidebar">
          <form method="GET" className="ptForm">
            <div className="ptBlock">
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
              href="/catalog/decor"
              style={{ marginTop: 10 }}
            >
              Сбросить
            </Link>
          </form>
        </aside>

        <section className="ptGrid">
          {items.map((it) => (
            <DecorCard key={it.id} item={it} />
          ))}

          {items.length === 0 ? (
            <div className="ptEmpty">По выбранным фильтрам ничего не найдено.</div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
