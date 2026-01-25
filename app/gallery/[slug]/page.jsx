import Link from "next/link";
import { readItemBySlug } from "@/lib/directus";
import GalleryDetailClient from "@/components/GalleryDetailClient";

export const dynamic = "force-dynamic";

export default async function GalleryDetail({ params }) {
  const p = await params;
  const slug = (p?.slug || "").toString();

  const item = await readItemBySlug("gallery_items", slug, {
    fields: [
      "id",
      "slug",
      "title",
      "description",
      "preview_image",
      "preview_image.id",

      "images",
      "images.id",
      "images.directus_files_id",
      "images.directus_files_id.id",

      "milling",
      "film_pvc"
    ]
  });

  if (!item) return <div className="panel">Не найдено.</div>;

  return (
    <div>
      <div className="breadcrumbs">
        <Link href="/">Главная</Link>
        <span className="breadcrumbsSep">/</span>
        <Link href="/gallery">Галерея фасадов</Link>
        <span className="breadcrumbsSep">/</span>
        <span>{item.title}</span>
      </div>

      <h1 className="pageTitle">{item.title}</h1>

      <GalleryDetailClient item={item} />
    </div>
  );
}
