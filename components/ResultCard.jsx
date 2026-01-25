import Link from "next/link";
import FavButton from "@/components/FavButton";

export default function ResultCard({ item }) {
  const href = item.href;
  return (
    <div className="card" style={{gridColumn:"span 6"}}>
      <div className="kicker">{item.kindLabel}</div>
      <h3 style={{marginTop:6}}><Link href={href}>{item.title}</Link></h3>
      {item.subtitle ? <p style={{marginTop:6}}>{item.subtitle}</p> : null}
      <div style={{marginTop:12, display:"flex", gap:10, flexWrap:"wrap"}}>
        <Link className="button" href={href}>Открыть</Link>
        <FavButton kind={item.kind} slug={item.slug} />
      </div>
    </div>
  );
}
