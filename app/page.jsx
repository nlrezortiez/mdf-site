import Link from "next/link";
import { readSingleton } from "@/lib/directus";

export default async function HomePage() {
  const settings = await readSingleton("site_settings").catch(() => null);

  return (
    <div>
      <div className="panel">
        <div className="kicker">Демонстрационный MVP</div>
        <h1 className="h1">Каталог фасадов: поиск, разделы, карточки</h1>
        <p style={{color:"var(--muted)", marginTop:0}}>
          Этот репозиторий поднимает Directus + Postgres + Meilisearch и Next.js сайт.
          В MVP реализованы: каталог по разделам, единый поиск, новости, акции, галерея, готовые решения, контакты и избранное.
        </p>
        <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:12}}>
          <Link className="button" href="/catalog">Открыть каталог</Link>
          <Link className="button" href="/search">Открыть поиск</Link>
        </div>
      </div>

      <div style={{height:18}} />

      <div className="grid">
        <div className="card">
          <h3>Каталог</h3>
          <p>Разделы и карточки, максимально близко к структуре исходного сайта.</p>
          <div style={{marginTop:12}}><Link className="button" href="/catalog">Перейти</Link></div>
        </div>
        <div className="card">
          <h3>Акции</h3>
          <p>Список + детальная страница акции.</p>
          <div style={{marginTop:12}}><Link className="button" href="/special-offers">Перейти</Link></div>
        </div>
        <div className="card">
          <h3>Новости</h3>
          <p>Список + детальная страница новости.</p>
          <div style={{marginTop:12}}><Link className="button" href="/news">Перейти</Link></div>
        </div>
      </div>

      <div style={{height:22}} />

      <div className="panel">
        <h2 className="h2">Контакты (из site_settings)</h2>
        <div className="small">
          <div>Телефон: {settings?.phone || "—"}</div>
          <div>Email: {settings?.email || "—"}</div>
          <div>Адрес: {settings?.address || "—"}</div>
        </div>
      </div>
    </div>
  );
}
