import Link from "next/link";
import Image from "next/image";
import { readItemBySlug } from "@/lib/directus";
import { maybeAssetUrl } from "@/lib/assets";

export const dynamic = "force-dynamic";

export default async function SolutionDetail({ params }) {
  const p = await params;
  const slug = (p?.slug || "").toString();

  const item = await readItemBySlug("solutions", slug, {
    fields: [
      "id",
      "slug",
      "title",
      "description",
      "film_pvc",
      "milling",
      "cover_image",
      "cover_image.id"
    ]
  });

  if (!item) return <div className="panel">Не найдено.</div>;

  const img = maybeAssetUrl(item.cover_image, { width: 1600, quality: 85 });

  return (
    <div>
      <div className="breadcrumbs">
        <Link href="/">Главная</Link>
        <span className="breadcrumbsSep">/</span>
        <Link href="/solutions">Готовые решения</Link>
        <span className="breadcrumbsSep">/</span>
        <span>{item.title}</span>
      </div>

      <h1 className="pageTitle">{item.title}</h1>

      <div className="panel" style={{ padding: 16 }}>
        {img ? (
          <div className="hero">
            <Image src={img} alt={item.title || ""} width={1600} height={900} className="heroImg" />
          </div>
        ) : null}

        <div style={{ height: 14 }} />

        <div className="solutionMeta" style={{ marginTop: 0 }}>
          <div>
            <span className="solutionMetaLabel">Пленка ПВХ:</span>{" "}
            <span>{item.film_pvc || "—"}</span>
          </div>
          <div>
            <span className="solutionMetaLabel">Фрезеровка:</span>{" "}
            <span>{item.milling || "—"}</span>
          </div>
        </div>

        <div style={{ height: 14 }} />

        {item.description ? (
          <div style={{ whiteSpace: "pre-wrap" }}>{item.description}</div>
        ) : (
          <div style={{ color: "var(--muted)" }}>Описание не задано.</div>
        )}

        <div style={{ marginTop: 16 }}>
          <Link className="buttonOutline" href="/solutions">
            Назад
          </Link>
        </div>
      </div>
    </div>
  );
}
