import Link from "next/link";
import Image from "next/image";
import { maybeAssetUrl } from "@/lib/assets";
import FavHeartButton from "@/components/FavHeartButton";

export default function DecorCard({ item }) {
  const href = `/catalog/decor/${item.slug}`;
  const img = maybeAssetUrl(item.preview_image, { width: 720, quality: 85 });
  const docId = item?.id != null ? `product_type_${item.id}` : null;

  return (
    <div className="decorCard">
      <Link className="decorCardLink" href={href}>
        <div className="decorImgFrame">
          <div className="decorFav">
            <FavHeartButton docId={docId} kind="product_type" slug={item.slug} />
          </div>

          {img ? (
            <Image
              src={img}
              alt={item.title || ""}
              fill
              sizes="(max-width: 980px) 33vw, 220px"
              className="decorImg"
            />
          ) : (
            <div className="decorImgPlaceholder" aria-hidden="true" />
          )}
        </div>

        <div className="decorTitle">{item.title}</div>

        {item.category ? (
          <div className="decorMeta">
            <div className="decorMetaLabel">Категория:</div>
            <div className="decorMetaValue">{item.category}</div>
          </div>
        ) : null}
      </Link>
    </div>
  );
}
