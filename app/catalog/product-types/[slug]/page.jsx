import Link from "next/link";
import Image from "next/image";
import { listItems, readItemBySlug } from "@/lib/directus";
import { maybeAssetUrl } from "@/lib/assets";
import FavHeartButton from "@/components/FavHeartButton";
import ProductTypeCard from "@/components/ProductTypeCard";

export const dynamic = "force-dynamic";

export default async function ProductTypeDetail({ params }) {
  const p = await params;
  const slug = String(p?.slug || "");

  const item = await readItemBySlug("product_types_items", slug, {
    fields: [
      "id",
      "slug",
      "title",
      "category",
      "description",
      "is_popular",
      "preview_image",
      "preview_image.id",
      "tech_image",
      "tech_image.id",
    ],
  });

  if (!item) return <div className="panel">Не найдено.</div>;

  const img = maybeAssetUrl(item.preview_image, { width: 1200, quality: 85 });
  const tech = maybeAssetUrl(item.tech_image, { width: 900, quality: 85 });
  const isNew = Boolean(item?.is_new ?? item?.is_popular);

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
      "is_popular",
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
        <Link href="/catalog/product-types">Виды продукции</Link>
        {item.category ? (
          <>
            <span className="breadcrumbsSep">/</span>
            <span>{item.category}</span>
          </>
        ) : null}
        <span className="breadcrumbsSep">/</span>
        <span>{item.title}</span>
      </div>

      <h1 className="pageTitle">Вид продукции: {item.title}</h1>

      {/* Основной блок (как было), но на всю ширину */}
      <div className="ptDetailMain ptDetailMainWide">
        <div className="ptDetailImgFrame">
          {isNew ? <div className="ptRibbon">Новинка</div> : null}
          <div className="ptFav">
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
              sizes="(max-width: 980px) 100vw, 420px"
              className="ptImg"
              priority
            />
          ) : (
            <div className="ptImgPlaceholder" aria-hidden="true" />
          )}
        </div>

        <div className="ptDetailInfo">
          <div className="ptInfoRow">
            <div className="ptInfoLabel">Наименование:</div>
            <div className="ptInfoValue">{item.title}</div>
          </div>

          {item.category ? (
            <div className="ptInfoRow">
              <div className="ptInfoLabel">Категория:</div>
              <div className="ptInfoValue">{item.category}</div>
            </div>
          ) : null}

          {tech ? (
            <div className="ptTechBlock">
              <div className="ptTechTitle">Технология (в разрезе)</div>
              <div className="ptTechImgWrap">
                <Image
                  src={tech}
                  alt="Технология (в разрезе)"
                  width={900}
                  height={260}
                  className="ptTechImg"
                />
              </div>
            </div>
          ) : null}

          {/* Описание теперь имеет больше места */}
          {item.description ? (
            <div className="ptDesc ptDescWide">{item.description}</div>
          ) : null}
        </div>
      </div>

      {/* Рекомендации теперь ниже */}
      {recs.length ? (
        <div className="ptRecoBlock">
          <div className="ptRecoTitle">Возможно вас также заинтересует</div>
          <div className="ptRecoGrid ptRecoGridWide">
            {recs.map((r) => (
              <ProductTypeCard key={r.id} item={r} compact />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
