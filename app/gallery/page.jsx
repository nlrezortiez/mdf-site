import Link from "next/link";
import { listItems } from "@/lib/directus";
import GalleryCard from "@/components/GalleryCard";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const json = await listItems("gallery_items", {
    limit: 200,
    page: 1,
    sort: "-id",
    filter: { is_published: { _neq: false } },
    fields: ["id", "slug", "title", "preview_image", "preview_image.id"]
  }).catch(() => ({ data: [] }));

  const items = json?.data || [];

  return (
    <div>
      <div className="breadcrumbs">
        <Link href="/">Главная</Link>
        <span className="breadcrumbsSep">/</span>
        <span>Галерея фасадов</span>
      </div>

      <h1 className="pageTitle">Галерея фасадов</h1>

      <div className="galleryGrid">
        {items.map((it) => (
          <GalleryCard key={it.id} item={it} />
        ))}

        {items.length === 0 ? (
          <div className="panel" style={{ gridColumn: "1 / -1", color: "var(--muted)" }}>
            Пока нет элементов в галерее.
          </div>
        ) : null}
      </div>
    </div>
  );
}
