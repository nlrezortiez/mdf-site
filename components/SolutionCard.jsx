import Link from "next/link";
import Image from "next/image";
import { maybeAssetUrl } from "@/lib/assets";

export default function SolutionCard({ item }) {
  const href = `/solutions/${item.slug}`;

  const img = maybeAssetUrl(item.cover_image, { width: 1200, quality: 80 });

  return (
    <div className="solutionCard">
      <Link className="solutionImageWrap" href={href} aria-label={item.title || "Открыть"}>
        {img ? (
            <Image
                src={img}
                alt={item.title || ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                className="solutionImage"
            />
            ) : (
            <div className="solutionImagePlaceholder" aria-hidden="true" />
            )}
      </Link>

      <div className="solutionBody">
        <div className="solutionTitle">
          <Link href={href}>{item.title}</Link>
        </div>

        <div className="solutionMeta">
          <div>
            <span className="solutionMetaLabel">Пленка ПВХ:</span>{" "}
            <span>{item.film_pvc || "—"}</span>
          </div>
          <div>
            <span className="solutionMetaLabel">Фрезеровка:</span>{" "}
            <span>{item.milling || "—"}</span>
          </div>
        </div>

        <div className="solutionActions">
          <Link className="buttonOutline" href={href}>
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}
