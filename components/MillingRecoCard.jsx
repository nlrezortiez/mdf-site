import Link from "next/link";
import Image from "next/image";
import { maybeAssetUrl } from "@/lib/assets";

export default function MillingRecoCard({ item, wide = false }) {
  const href = `/catalog/millings/${item.slug}`;
  const img = maybeAssetUrl(item.preview_image, { width: 720, quality: 85 });

  return (
    <Link href={href} className={`millingRecoCard ${wide ? "isWide" : ""}`}>
      <div className="millingRecoImgBox">
        {img ? (
          <Image src={img} alt={item.title || ""} fill sizes={wide ? "420px" : "200px"} className="millingRecoImg" />
        ) : (
          <div className="millingRecoImgPh" aria-hidden="true" />
        )}
      </div>

      <div className="millingRecoText">
        <div className="millingRecoName">{item.title}</div>
        <div className="millingRecoLine" aria-hidden="true" />

        {item.category ? (
          <div className="millingRecoMeta">
            <span className="millingRecoMetaLabel">Категория:</span>
            <span className="millingRecoMetaValue">{item.category}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
