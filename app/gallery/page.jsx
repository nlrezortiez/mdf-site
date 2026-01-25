import { listItems } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const json = await listItems("gallery_items", { limit: 100, page: 1, sort: "-id" }).catch(() => ({ data: [] }));
  const items = json?.data || [];

  return (
    <div>
      <div className="kicker">Галерея фасадов</div>
      <h1 className="h1">Галерея</h1>

      <div className="grid">
        {items.map((g) => (
          <div key={g.id} className="card" style={{gridColumn:"span 4"}}>
            <h3>{g.title}</h3>
            {g.description ? <p>{g.description}</p> : <p style={{color:"var(--muted)"}}>—</p>}
          </div>
        ))}
        {items.length === 0 ? (
          <div className="panel" style={{gridColumn:"1 / -1", color:"var(--muted)"}}>
            Пусто. Добавьте элементы в gallery_items (seed).
          </div>
        ) : null}
      </div>
    </div>
  );
}
