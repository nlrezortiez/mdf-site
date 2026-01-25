import Link from "next/link";
import Image from "next/image";
import FavButton from "@/components/FavButton";
import { maybeAssetUrl } from "@/lib/assets";

export default function CatalogCard({ sectionSlug, kind, item }) {
  const href = `/catalog/${sectionSlug}/${item.slug}`;
  const img = maybeAssetUrl(item.preview_image, { width: 560, quality: 75 });

  return (
    <div className="card">
      <div className="cardThumb">
        {img ? (
          <Image
            src={img}
            alt={item.title || ""}
            width={560}
            height={360}
            className="cardThumbImg"
          />
        ) : (
          <div className="cardThumbPlaceholder" aria-hidden="true" />
        )}
      </div>
      <h3 style={{ marginTop: 10 }}>
        <Link href={href}>{item.title}</Link>
      </h3>
      {item.short_description ? <p>{item.short_description}</p> : null}
      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="button" href={href}>
          Открыть
        </Link>
        <FavButton kind={kind} slug={item.slug} />
      </div>
    </div>
  );
}
