import Link from "next/link";
import Image from "next/image";
import { maybeAssetUrl } from "@/lib/assets";

export default function GalleryCard({ item }) {
  const href = `/gallery/${item.slug}`;
  const img = maybeAssetUrl(item.preview_image, { width: 1200, quality: 80 });

  return (
    <div className="galleryCard">
      <Link className="galleryImageWrap" href={href} aria-label={item.title || "Открыть"}>
        <div className="galleryImageBar" aria-hidden="true" />
        {img ? (
          <Image
            src={img}
            alt={item.title || ""}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 980px) 33vw, 16vw"
            className="galleryImage"
          />
        ) : (
          <div className="galleryImagePlaceholder" aria-hidden="true" />
        )}
      </Link>

      <div className="galleryTitle">
        <Link href={href}>{item.title}</Link>
      </div>
    </div>
  );
}
