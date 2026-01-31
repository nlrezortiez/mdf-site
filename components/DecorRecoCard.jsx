import Link from "next/link";
import Image from "next/image";
import { maybeAssetUrl } from "@/lib/assets";

export default function DecorRecoCard({ item, wide = false }) {
  const href = `/catalog/decor/${item.slug}`;
  const img = maybeAssetUrl(item.preview_image, { width: 720, quality: 85 });

  return (
    <Link href={href} className={`decorRecoCard ${wide ? "isWide" : ""}`}>
      <div className="decorRecoImgBox">
        {img ? (
          <Image
            src={img}
            alt={item.title || ""}
            fill
            sizes={wide ? "420px" : "200px"}
            className="decorRecoImg"
          />
        ) : (
          <div className="decorRecoImgPh" aria-hidden="true" />
        )}

        {/* маленькая “иконка” как в референсе (не функциональная) */}
        <div className="decorRecoImgBadge" aria-hidden="true" />
      </div>

      <div className="decorRecoText">
        <div className="decorRecoName">{item.title}</div>
        <div className="decorRecoLine" aria-hidden="true" />
        {item.category ? (
          <div className="decorRecoCat">
            <span className="decorRecoCatLabel">Категория:</span>
            <span className="decorRecoCatValue">{item.category}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
