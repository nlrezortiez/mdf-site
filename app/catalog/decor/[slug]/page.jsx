import Link from "next/link";
import Image from "next/image";
import { readItemBySlug, listItems } from "@/lib/directus";
import { maybeAssetUrl } from "@/lib/assets";
import FavHeartButton from "@/components/FavHeartButton";
import DecorRecoCard from "@/components/DecorRecoCard";

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

export default async function DecorDetail({ params }) {
  const p = await params;
  const slug = String(p?.slug || "");

  const item = await readItemBySlug("product_types_items", slug, {
    fields: [
      "id",
      "slug",
      "title",
      "category",
      "description",
      "warning_text",
      "preview_image",
      "preview_image.id",
      "tech_image",
      "tech_image.id",
    ],
  });

  if (!item || (item.category && !DECOR_CATEGORIES.includes(item.category))) {
    return <div className="panel">Не найдено.</div>;
  }

  const img = maybeAssetUrl(item.preview_image, { width: 1400, quality: 90 });
  const profile = maybeAssetUrl(item.tech_image, { width: 900, quality: 90 });

  const recFilter = {
    is_published: { _neq: false },
    slug: { _neq: slug },
  };
  if (item.category) recFilter.category = { _eq: item.category };

  const recJson = await listItems("product_types_items", {
    limit: 6,
    page: 1,
    sort: "-id",
    filter: recFilter,
    fields: [
      "id",
      "slug",
      "title",
      "category",
      "preview_image",
      "preview_image.id",
    ],
  }).catch(() => ({ data: [] }));

  const recs = recJson?.data || [];

  return (
    <div>
      <div className="breadcrumbs">
        <Link href="/">Главная</Link>
        <span className="breadcrumbsSep">/</span>
        <span>Каталог</span>
        <span className="breadcrumbsSep">/</span>
        <Link href="/catalog/decor">Декоративные элементы</Link>
        {item.category ? (
          <>
            <span className="breadcrumbsSep">/</span>
            <span>Декоративные элементы. Категория {item.category}</span>
          </>
        ) : null}
        <span className="breadcrumbsSep">/</span>
        <span>{item.title}</span>
      </div>

      <h1 className="decorH1">{item.title}</h1>

      <div className="decorDetailLayout">
        {/* LEFT: image */}
        <div className="decorLeft">
          <div className="decorHeroFrame">
            <div className="decorFav">
              <FavHeartButton
                docId={`product_type_${item.id}`}
                kind="product_type"
                slug={item.slug}
              />
            </div>

            {img ? (
              <Image
                src={img}
                alt={item.title || ""}
                fill
                sizes="(max-width: 980px) 100vw, 520px"
                className="decorHeroImg"
                priority
              />
            ) : (
              <div className="decorHeroPlaceholder" aria-hidden="true" />
            )}
          </div>
        </div>

        {/* MIDDLE: info + warning + profile */}
        <div className="decorMid">
          <div className="decorInfoRow">
            <div className="decorInfoLabel">Наименование:</div>
            <div className="decorInfoValue">{item.title}</div>
          </div>

          {item.category ? (
            <div className="decorInfoRow">
              <div className="decorInfoLabel">Категория:</div>
              <div className="decorInfoValue">{item.category}</div>
            </div>
          ) : null}

          {item.warning_text ? (
            <div className="decorWarnBox">
              <div className="decorWarnIcon">⚠</div>
              <div className="decorWarnText">{item.warning_text}</div>
            </div>
          ) : null}

          {profile ? (
            <div className="decorProfileBlock">
              <div className="decorProfileTitle">Профиль фрезеровки</div>
              <div className="decorProfileImgWrap">
                <Image
                  src={profile}
                  alt="Профиль фрезеровки"
                  width={420}
                  height={240}
                  className="decorProfileImg"
                />
              </div>
            </div>
          ) : null}

          {item.description ? (
            <div className="decorDesc">{item.description}</div>
          ) : null}
        </div>

        <div className="decorRight">
          {recs.length ? (
            <>
              <div className="decorRecoTitle">
                Возможно вас также заинтересует
              </div>
              <div className="decorRecoGrid">
                {recs.slice(0, 6).map((r, idx) => (
                  <DecorRecoCard key={r.id} item={r} wide={idx === 0} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
