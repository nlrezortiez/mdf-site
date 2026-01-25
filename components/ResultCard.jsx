import Link from "next/link";
import Image from "next/image";
import FavButton from "@/components/FavButton";
import { maybeAssetUrl } from "@/lib/assets";

export default function ResultCard({ item }) {
  const href = item.href;
  const img = maybeAssetUrl(item.preview_image, { width: 560, quality: 75 });

  return (
    <div className="card cardRow" style={{ gridColumn: "span 6" }}>
      <div className="cardThumb">
        {img ? (
          <Image
            src={img}
            alt={item.title || ""}
            width={280}
            height={180}
            className="cardThumbImg"
          />
        ) : (
          <div className="cardThumbPlaceholder" aria-hidden="true" />
        )}
      </div>
      <div className="cardBody">
        <div className="kicker">{item.kindLabel}</div>
        <h3 style={{ marginTop: 6 }}>
          <Link href={href}>{item.title}</Link>
        </h3>
        {item.subtitle ? <p style={{ marginTop: 6 }}>{item.subtitle}</p> : null}
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="button" href={href}>
            Открыть
          </Link>
          <FavButton kind={item.kind} slug={item.slug} />
        </div>
      </div>
    </div>
  );
}
