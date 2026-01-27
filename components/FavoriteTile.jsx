import Link from "next/link";
import Image from "next/image";
import FavHeartButton from "@/components/FavHeartButton";
import { maybeAssetUrl } from "@/lib/assets";

export default function FavoriteTile({ item }) {
  const href =
    item.href ||
    (item.section ? `/catalog/${item.section}/${item.slug}` : "/favorites");
  const img = maybeAssetUrl(item.preview_image, { width: 560, quality: 80 });

  return (
    <div className="favTile">
      <Link href={href} className="favTileLink">
        <div className="favTileThumb">
          {img ? (
            <Image
              src={img}
              alt={item.title || ""}
              fill
              sizes="(max-width: 980px) 45vw, 220px"
              className="favTileImg"
            />
          ) : (
            <div className="favTilePlaceholder" aria-hidden="true" />
          )}

          <div className="favTileHeart">
            <FavHeartButton docId={item.id} />
          </div>

          <div className="favTileStripe" aria-hidden="true" />
        </div>

        <div className="favTileTitle">{item.title}</div>
        {item.category ? (
          <div className="favTileMeta">Категория: {item.category}</div>
        ) : null}
      </Link>
    </div>
  );
}
