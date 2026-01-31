import Link from "next/link";
import Image from "next/image";
import { listItems, readItemBySlug } from "@/lib/directus";
import { maybeAssetUrl } from "@/lib/assets";
import FavHeartButton from "@/components/FavHeartButton";
import MillingSampleClient from "@/components/MillingSampleClient";

export const dynamic = "force-dynamic";

function parseThicknesses(v) {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map((x) => parseInt(String(x), 10))
      .filter((n) => Number.isFinite(n));
  }
  if (typeof v === "string") {
    // "16,19,22" или "16 19 22"
    return v
      .split(/[\s,;]+/g)
      .map((x) => parseInt(x, 10))
      .filter((n) => Number.isFinite(n));
  }
  return [];
}

export default async function MillingDetailPage({ params }) {
  const p = await params;
  const slug = String(p?.slug || "");

  const item = await readItemBySlug("millings", slug, {
    fields: [
      "id",
      "slug",
      "title",
      "category",
      "cover_type",
      "description",
      "warning_text",
      "mdf_thicknesses",
      "preview_image",
      "preview_image.id",
      "tech_image",
      "tech_image.id",
    ],
  });

  if (!item) return <div className="panel">Не найдено.</div>;

  const heroUrl = maybeAssetUrl(item.preview_image, {
    width: 720,
    height: 900,
    fit: "cover",
    quality: 85,
  });

  const profileUrl = maybeAssetUrl(item.tech_image, {
    width: 900,
    quality: 85,
  });

  const thicknesses = parseThicknesses(item.mdf_thicknesses) || [16, 19, 22];

  const millingIdNum = Number(item.id);
  const millingEq = Number.isFinite(millingIdNum)
    ? millingIdNum
    : String(item.id);

  const examplesJson = await listItems("milling_examples", {
    limit: 50,
    page: 1,
    sort: "id",
    filter: {
      milling: { _eq: millingEq },
    },
    fields: [
      "id",
      "cover_label",
      "preview_image",
      "preview_image.id",
      "images",
      "images.directus_files_id",
      "images.directus_files_id.id",
    ],
    meta: null,
  }).catch((e) => {
    console.error("[milling_examples] list failed:", e?.message || e);
    return { data: [] };
  });

  const examples = examplesJson?.data || [];

  const h1 = item.category
    ? `Фрезеровка ${item.title} (${item.category})`
    : `Фрезеровка ${item.title}`;

  return (
    <div>
      <div className="breadcrumbs">
        <Link href="/">Главная</Link>
        <span className="breadcrumbsSep">/</span>
        <span>Каталог</span>
        <span className="breadcrumbsSep">/</span>
        <Link href="/catalog/millings">Фрезеровки</Link>
        {item.category ? (
          <>
            <span className="breadcrumbsSep">/</span>
            <span>Категория "{item.category}"</span>
          </>
        ) : null}
        <span className="breadcrumbsSep">/</span>
        <span>{item.title}</span>
      </div>

      <h1 className="pageTitle">{h1}</h1>

      <div className="millingDetailGrid">
        {/* LEFT */}
        <div>
          <div className="millingHeroFrame">
            <div className="millingFav">
              <FavHeartButton docId={`milling_${item.id}`} />
            </div>

            {heroUrl ? (
              <Image
                src={heroUrl}
                alt={item.title || ""}
                fill
                sizes="(max-width: 1200px) 100vw, 320px"
                className="millingHeroImg"
                priority
              />
            ) : (
              <div className="millingHeroPlaceholder" />
            )}
          </div>
        </div>

        {/* MIDDLE */}
        <div className="millingMid">
          <div className="millingInfo">
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

            {item.cover_type ? (
              <div className="ptInfoRow">
                <div className="ptInfoLabel">Покрытие:</div>
                <div className="ptInfoValue">{item.cover_type}</div>
              </div>
            ) : null}

            {item.warning_text ? (
              <div className="millingWarnBox">{item.warning_text}</div>
            ) : null}

            {profileUrl ? (
              <div className="millingProfileBlock">
                <div className="millingProfileTitle">Профиль фрезеровки</div>
                <div className="millingProfileWrap">
                  <Image
                    src={profileUrl}
                    alt="Профиль фрезеровки"
                    width={320}
                    height={140}
                    className="millingProfileImg"
                  />
                </div>
              </div>
            ) : null}

            {thicknesses.length ? (
              <div className="millingThicknessBlock">
                <div className="millingThicknessTitle">
                  Допустимые толщины МДФ:
                </div>
                <div className="millingThicknessChips">
                  {thicknesses.map((t) => (
                    <span key={t} className="millingChip">
                      МДФ {t}мм
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {item.description ? (
              <div className="millingDesc">{item.description}</div>
            ) : null}
          </div>
        </div>

        {/* RIGHT */}
        <div className="millingRight">
          <div className="millingSamplesTitle">Образцы исполнения</div>

          {examples.length ? (
            <div className="millingSamplesList">
              {examples.map((ex) => (
                <MillingSampleClient
                  key={ex.id}
                  sample={ex}
                  millingTitle={item.title}
                />
              ))}
            </div>
          ) : (
            <div className="panel" style={{ color: "var(--muted)" }}>
              Пока нет образцов исполнения. Добавьте записи в коллекцию{" "}
              <b>milling_examples</b>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
