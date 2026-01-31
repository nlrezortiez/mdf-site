import Link from "next/link";
import Image from "next/image";
import { maybeAssetUrl } from "@/lib/assets";
import FavHeartButton from "@/components/FavHeartButton";

export default function MillingCard({ item }) {
  const href = `/catalog/millings/${item.slug}`;
  const img = maybeAssetUrl(item.preview_image, { width: 720, quality: 85 });

  return (
    <div className="millingCard">
      <Link className="millingCardLink" href={href}>
        <div className="millingImgFrame">
          <div className="millingFav">
            <FavHeartButton
              docId={`milling_${item.id}`}
              kind="milling"
              slug={item.slug}
            />
          </div>

          <div className="millingRedBar" aria-hidden="true" />

          {img ? (
            <Image
              src={img}
              alt={item.title || ""}
              fill
              sizes="(max-width: 980px) 33vw, 220px"
              className="millingImg"
            />
          ) : (
            <div className="millingImgPlaceholder" aria-hidden="true" />
          )}
        </div>

        <div className="millingTitle">{item.title}</div>

        {item.cover_type ? (
          <div className="millingLine">
            <span className="millingLineLabel">Покрытие:</span>{" "}
            {item.cover_type}
          </div>
        ) : null}

        {item.category ? (
          <div className="millingLine">
            <span className="millingLineLabel">Категория:</span> {item.category}
          </div>
        ) : null}
      </Link>
    </div>
  );
}
