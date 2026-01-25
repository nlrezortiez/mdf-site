import Link from "next/link";
import FavButton from "@/components/FavButton";
import { sectionBySlug, KIND_LABEL } from "@/lib/catalog";
import { readItemBySlug } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function CatalogItemPage({ params }) {
  const section = sectionBySlug(params.section);
  if (!section) return <div className="panel">Неизвестный раздел.</div>;

  const item = await readItemBySlug(section.collection, params.slug);
  if (!item) return <div className="panel">Не найдено.</div>;

  return (
    <div>
      <div className="kicker">
        <Link href="/catalog">Каталог</Link> /{" "}
        <Link href={`/catalog/${section.section}`}>{section.title}</Link> / {item.title}
      </div>

      <h1 className="h1">{item.title}</h1>

      <div className="panel">
        <div className="kicker">{KIND_LABEL[section.kind] || section.kind}</div>
        {item.short_description ? <p style={{color:"var(--muted)"}}>{item.short_description}</p> : null}

        <div style={{marginTop:12, display:"grid", gap:10}}>
          {item.article ? <div><span className="kicker">Артикул:</span> {item.article}</div> : null}
          {item.category ? <div><span className="kicker">Категория:</span> {item.category}</div> : null}
          {item.hex_color ? (
            <div style={{display:"flex", gap:10, alignItems:"center"}}>
              <span className="kicker">Цвет:</span>
              <span className="badge">{item.hex_color}</span>
              <span style={{width:22, height:22, borderRadius:6, border:"1px solid var(--border)", background:item.hex_color}} />
            </div>
          ) : null}
          {item.warning_text ? <div className="kicker">Примечание: {item.warning_text}</div> : null}
        </div>

        {item.description ? (
          <div style={{marginTop:14}}>
            <div className="kicker">Описание</div>
            <div style={{whiteSpace:"pre-wrap", marginTop:6}}>{item.description}</div>
          </div>
        ) : null}

        <div style={{marginTop:14, display:"flex", gap:10, flexWrap:"wrap"}}>
          <FavButton kind={section.kind} slug={item.slug} />
          <Link className="button" href={`/catalog/${section.section}`}>К списку</Link>
        </div>
      </div>
    </div>
  );
}
