import Link from "next/link";
import { listItems } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function SolutionsList() {
  const json = await listItems("solutions", { limit: 50, page: 1, sort: "-id" }).catch(() => ({ data: [] }));
  const items = json?.data || [];

  return (
    <div>
      <div className="kicker">Готовые решения</div>
      <h1 className="h1">Готовые решения</h1>

      <div className="grid">
        {items.map((s) => (
          <div key={s.id} className="card" style={{gridColumn:"span 6"}}>
            <h3><Link href={`/solutions/${s.slug}`}>{s.title}</Link></h3>
            {s.description ? <p>{s.description}</p> : <p style={{color:"var(--muted)"}}>Описание не задано.</p>}
            <div style={{marginTop:12}}><Link className="button" href={`/solutions/${s.slug}`}>Открыть</Link></div>
          </div>
        ))}
        {items.length === 0 ? (
          <div className="panel" style={{gridColumn:"1 / -1", color:"var(--muted)"}}>Пока нет решений (seed).</div>
        ) : null}
      </div>
    </div>
  );
}
