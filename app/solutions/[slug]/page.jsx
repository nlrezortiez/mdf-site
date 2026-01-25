import Link from "next/link";
import { readItemBySlug } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function SolutionDetail({ params }) {
  const item = await readItemBySlug("solutions", params.slug);
  if (!item) return <div className="panel">Не найдено.</div>;

  return (
    <div>
      <div className="kicker"><Link href="/solutions">Готовые решения</Link> / {item.title}</div>
      <h1 className="h1">{item.title}</h1>
      <div className="panel">
        {item.description ? <div style={{whiteSpace:"pre-wrap"}}>{item.description}</div> : <div style={{color:"var(--muted)"}}>Описание не задано.</div>}
        <div style={{marginTop:14}}><Link className="button" href="/solutions">К списку</Link></div>
      </div>
    </div>
  );
}
