import Link from "next/link";
import { readItemBySlug } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function OfferDetail({ params }) {
  const p = await params;
  const item = await readItemBySlug("special_offers", p.slug);

  if (!item) return <div className="panel">Не найдено.</div>;

  return (
    <div>
      <div className="kicker">
        <Link href="/special-offers">Акции</Link> / {item.title}
      </div>
      <h1 className="h1">{item.title}</h1>
      <div className="panel">
        {item.body ? <div style={{ whiteSpace: "pre-wrap" }}>{item.body}</div> : null}
        {item.date_from || item.date_to ? (
          <div style={{ marginTop: 12 }} className="kicker">
            Период: {item.date_from || "—"} — {item.date_to || "—"}
          </div>
        ) : null}
        <div style={{ marginTop: 14 }}>
          <Link className="button" href="/special-offers">
            К списку
          </Link>
        </div>
      </div>
    </div>
  );
}
