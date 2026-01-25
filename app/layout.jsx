import "./globals.css";
import Link from "next/link";
import HeaderSearch from "@/components/HeaderSearch";
import FavoritesBadge from "@/components/FavoritesBadge";
import HeaderCatalog from "@/components/HeaderCatalog";

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "DF-MDF MVP"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <header className="header">
          <div className="headerInner">
            <div className="headerLeft">
              <Link className="brand" href="/">
                <span className="brandWord">DEFFO</span>
              </Link>
            </div>

            <nav className="headerNav" aria-label="Навигация">
              <HeaderCatalog />
              <Link href="/solutions">Готовые решения</Link>
              <Link href="/gallery">Галерея фасадов</Link>
              <Link href="/special-offers">Акции</Link>
              <Link href="/news">Новости</Link>
              <Link href="/contacts">Контакты</Link>
              <Link href="/favorites">Избранное <FavoritesBadge /></Link>
            </nav>

            <div className="headerRight">
              <HeaderSearch />
            </div>
          </div>
          <div className="headerLine" />
        </header>

        <main className="container">{children}</main>

        <footer className="footer">
          <div className="footerInner">
            <div className="small">DF-MDF MVP</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
