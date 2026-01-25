import Link from "next/link";
import { readItemBySlug } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function NewsDetail({ params }) {
  const p = await params;
  const item = await readItemBySlug("news", p.slug);

  if (!item) return <div className="panel">Не найдено.</div>;

  return (
    <div>
      <div className="kicker">
        <Link href="/news">Новости</Link> / {item.title}
      </div>
      <h1 className="h1">{item.title}</h1>
      <div className="panel">
        {item.excerpt ? <p style={{ color: "var(--muted)" }}>{item.excerpt}</p> : null}
        {item.body ? <div style={{ whiteSpace: "pre-wrap" }}>{item.body}</div> : null}
        <div style={{ marginTop: 14 }}>
          <Link className="button" href="/news">
            К списку
          </Link>
        </div>
      </div>
    </div>
  );
}
