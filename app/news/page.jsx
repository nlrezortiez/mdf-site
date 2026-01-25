import Link from "next/link";
import { listItems } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function NewsList() {
  const json = await listItems("news", { limit: 50, page: 1, sort: "-id" }).catch(() => ({ data: [] }));
  const items = json?.data || [];

  return (
    <div>
      <div className="kicker">Новости</div>
      <h1 className="h1">Новости</h1>

      <div className="panel">
        <table className="table">
          <thead><tr><th>Заголовок</th><th style={{width:160}}>Действия</th></tr></thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id}>
                <td><Link href={`/news/${n.slug}`}>{n.title}</Link></td>
                <td><Link className="button" href={`/news/${n.slug}`}>Открыть</Link></td>
              </tr>
            ))}
            {items.length === 0 ? <tr><td colSpan={2} style={{color:"var(--muted)"}}>Пока нет новостей (seed).</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
