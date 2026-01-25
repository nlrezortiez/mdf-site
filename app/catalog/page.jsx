import Link from "next/link";
import { SECTIONS } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default function CatalogLanding() {
  return (
    <div>
      <div className="kicker">Разделы каталога</div>
      <h1 className="h1">Каталог</h1>

      <div className="grid">
        {SECTIONS.map((s) => (
          <div key={s.section} className="card">
            <h3><Link href={`/catalog/${s.section}`}>{s.title}</Link></h3>
            <p>{s.description}</p>
            <div style={{marginTop:12}}>
              <Link className="button" href={`/catalog/${s.section}`}>Открыть</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
