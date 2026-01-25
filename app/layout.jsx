import "./globals.css";
import Link from "next/link";
import HeaderSearch from "@/components/HeaderSearch";
import FavoritesBadge from "@/components/FavoritesBadge";

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "DF-MDF MVP",
  description: "MVP каталога (поиск + разделы) на Next.js + Directus + Meilisearch"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <header className="header">
          <div className="headerInner">
            <div style={{display:"flex", gap:12, alignItems:"center", justifyContent:"space-between", width:"100%"}}>
              <div style={{display:"flex", gap:14, alignItems:"center", flexWrap:"wrap"}}>
                <Link className="brand" href="/">DF-MDF MVP</Link>
                <nav className="nav" aria-label="Навигация">
                  <Link href="/catalog">Каталог</Link>
                  <Link href="/solutions">Готовые решения</Link>
                  <Link href="/gallery">Галерея</Link>
                  <Link href="/special-offers">Акции</Link>
                  <Link href="/news">Новости</Link>
                  <Link href="/contacts">Контакты</Link>
                  <Link href="/favorites">Избранное <FavoritesBadge /></Link>
                </nav>
              </div>
              <HeaderSearch />
            </div>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="footer">
          <div className="footerInner">
            <div className="small">
              <div style={{fontWeight:600, color:"var(--text)"}}>Разделы каталога</div>
              <div style={{marginTop:8, display:"flex", gap:12, flexWrap:"wrap"}}>
                <Link href="/catalog/product-types">Виды продукции</Link>
                <Link href="/catalog/millings">Фрезеровки</Link>
                <Link href="/catalog/films">Плёнка ПВХ</Link>
                <Link href="/catalog/colors">Эмали / RAL</Link>
                <Link href="/catalog/edges">Торцы</Link>
                <Link href="/catalog/patinas">Патина</Link>
              </div>
            </div>
            <div className="small">
              <div style={{fontWeight:600, color:"var(--text)"}}>Сайт</div>
              <div style={{marginTop:8, display:"flex", gap:12, flexWrap:"wrap"}}>
                <Link href="/news">Новости</Link>
                <Link href="/special-offers">Акции</Link>
                <Link href="/solutions">Готовые решения</Link>
                <Link href="/gallery">Галерея</Link>
                <Link href="/contacts">Контакты</Link>
              </div>
            </div>
            <div className="small">
              <div style={{fontWeight:600, color:"var(--text)"}}>MVP</div>
              <div style={{marginTop:8}}>
                <div>Поиск: Meilisearch</div>
                <div>Контент: Directus</div>
                <div>Фавориты: localStorage</div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
