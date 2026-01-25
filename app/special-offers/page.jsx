import Link from "next/link";
import { listItems } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function OffersList() {
  const json = await listItems("special_offers", { limit: 50, page: 1, sort: "-id" }).catch(() => ({ data: [] }));
  const items = json?.data || [];

  return (
    <div>
      <div className="kicker">Акции</div>
      <h1 className="h1">Акции</h1>

      <div className="panel">
        <table className="table">
          <thead><tr><th>Название</th><th style={{width:160}}>Действия</th></tr></thead>
          <tbody>
            {items.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/special-offers/${o.slug}`}>{o.title}</Link></td>
                <td><Link className="button" href={`/special-offers/${o.slug}`}>Открыть</Link></td>
              </tr>
            ))}
            {items.length === 0 ? <tr><td colSpan={2} style={{color:"var(--muted)"}}>Пока нет акций (seed).</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
