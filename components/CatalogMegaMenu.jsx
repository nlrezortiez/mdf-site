"use client";

import Link from "next/link";
import Image from "next/image";

const ITEMS = [
  {
    href: "/catalog/product-types",
    title: "Виды продукции",
    img: "/menu/product-types.png",
  },
  {
    href: "/catalog/decor",
    title: "Декоративные элементы",
    img: "/menu/decor.png",
  },
  { href: "/catalog/millings", title: "Фрезеровки", img: "/menu/millings.png" },
  { href: "/catalog/films", title: "Типы покрытия", img: "/menu/films.png" },
  { href: "/catalog/edges", title: "Торцы фасадов", img: "/menu/edges.png" },
  { href: "/catalog/patinas", title: "Патина", img: "/menu/patinas.png" },
];

export default function CatalogMegaMenu({
  open,
  onClose,
  onPanelEnter,
  onPanelLeave,
}) {
  return (
    <div className={`megaRoot ${open ? "isOpen" : ""}`} aria-hidden={!open}>
      {/* Клик вне панели закрывает меню. Важно: без onMouseEnter. */}
      <button
        type="button"
        className="megaBackdrop"
        aria-label="Закрыть меню каталога"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        className="megaPanel"
        role="menu"
        aria-label="Каталог"
        onMouseEnter={onPanelEnter}
        onMouseLeave={onPanelLeave}
      >
        <div className="megaInner">
          {ITEMS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="megaItem"
              role="menuitem"
              onClick={onClose}
            >
              <div className="megaImgWrap" aria-hidden="true">
                <Image
                  src={it.img}
                  alt=""
                  fill
                  className="megaImg"
                  sizes="160px"
                />
              </div>
              <div className="megaTitle">{it.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
