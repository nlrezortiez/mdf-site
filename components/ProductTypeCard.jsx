import Link from "next/link";
import Image from "next/image";
import { maybeAssetUrl } from "@/lib/assets";
import FavHeartButton from "@/components/FavHeartButton";

export default function ProductTypeCard({ item, compact = false }) {
  const href = `/catalog/product-types/${item.slug}`;
  const img = maybeAssetUrl(item.preview_image, { width: 720, quality: 80 });
  const isNew = Boolean(item?.is_new ?? item?.is_popular);

  const docId = item?.id != null ? `product_type_${item.id}` : null;

  return (
    <div className={`ptCard ${compact ? "ptCardCompact" : ""}`}>
      <Link className="ptCardLink" href={href}>
        <div className="ptImgFrame">
          {isNew ? <div className="ptRibbon">Новинка</div> : null}
          <div className="ptFav">
            <FavHeartButton
              docId={docId}
              kind="product_type"
              slug={item.slug}
            />
          </div>

          {img ? (
            <Image
              src={img}
              alt={item.title || ""}
              fill
              sizes={
                compact
                  ? "(max-width: 980px) 45vw, 220px"
                  : "(max-width: 980px) 33vw, 220px"
              }
              className="ptImg"
            />
          ) : (
            <div className="ptImgPlaceholder" aria-hidden="true" />
          )}
        </div>

        <div className="ptTitle">{item.title}</div>
        {item.category ? (
          <div className="ptMeta">Категория: {item.category}</div>
        ) : null}
      </Link>
    </div>
  );
}
