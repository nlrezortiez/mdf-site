import Link from "next/link";
import Image from "next/image";
import { sectionBySlug, KIND_LABEL } from "@/lib/catalog";
import { readItemBySlug } from "@/lib/directus";
import { maybeAssetUrl } from "@/lib/assets";
import FavButton from "@/components/FavButton";

export const dynamic = "force-dynamic";

export default async function CatalogItemPage({ params }) {
  const p = await params;

  const sectionSlug = (p?.section || "").toString();
  const slug = (p?.slug || "").toString();

  const section = sectionBySlug(sectionSlug);
  if (!section) {
    return (
      <div className="panel">
        <div className="kicker">Каталог</div>
        <h1 className="h1">Раздел не найден</h1>
        <p style={{ color: "var(--muted)" }}>Неизвестный раздел каталога.</p>
        <div style={{ marginTop: 12 }}>
          <Link className="button" href="/catalog">
            К разделам каталога
          </Link>
        </div>
      </div>
    );
  }

  const json = await readItemBySlug(section.collection, slug, {
    fields: [
      "id",
      "slug",
      "title",
      "short_description",
      "description",
      "article",
      "category",
      "hex_color",
      "warning_text",
      "preview_image",
      "preview_image.id",
      "is_popular"
    ]
  });

  if (!json) {
    return (
      <div className="panel">
        <div className="kicker">{section.title}</div>
        <h1 className="h1">Элемент не найден</h1>
        <div style={{ marginTop: 12 }}>
          <Link className="button" href={`/catalog/${section.section}`}>
            Назад к разделу
          </Link>
        </div>
      </div>
    );
  }

  const img = maybeAssetUrl(json.preview_image, { width: 1200, quality: 80 });
  const kindLabel = KIND_LABEL[section.kind] || section.kind;

  return (
    <div>
      <div className="kicker">
        <Link href="/catalog">Каталог</Link> /{" "}
        <Link href={`/catalog/${section.section}`}>{section.title}</Link> / {kindLabel}
      </div>

      <h1 className="h1">{json.title}</h1>

      <div className="panel" style={{ display: "grid", gap: 14 }}>
        {img ? (
          <div className="hero">
            <Image src={img} alt={json.title || ""} width={1200} height={700} className="heroImg" />
          </div>
        ) : null}

        {json.short_description ? <div style={{ color: "var(--muted)" }}>{json.short_description}</div> : null}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="button" href={`/catalog/${section.section}`}>
            Назад к разделу
          </Link>
          <FavButton kind={section.kind} slug={json.slug} />
        </div>

        <table className="table" aria-label="Свойства">
          <tbody>
            {json.article ? (
              <tr>
                <th style={{ width: 180 }}>Артикул</th>
                <td>{json.article}</td>
              </tr>
            ) : null}
            {json.category ? (
              <tr>
                <th>Категория</th>
                <td>{json.category}</td>
              </tr>
            ) : null}
            {json.hex_color ? (
              <tr>
                <th>Цвет (HEX)</th>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        background: json.hex_color
                      }}
                      aria-hidden="true"
                    />
                    {json.hex_color}
                  </span>
                </td>
              </tr>
            ) : null}
            {json.description ? (
              <tr>
                <th>Описание</th>
                <td style={{ whiteSpace: "pre-wrap" }}>{json.description}</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        {json.warning_text ? (
          <div className="panel">
            <div className="kicker">Важно</div>
            <div style={{ whiteSpace: "pre-wrap", color: "var(--muted)" }}>{json.warning_text}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
