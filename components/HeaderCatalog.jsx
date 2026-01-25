"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CatalogMegaMenu from "@/components/CatalogMegaMenu";

export default function HeaderCatalog() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Закрывать при клике вне
  useEffect(() => {
    function onDoc(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Esc закрывает
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="headerCatalog"
      ref={rootRef}
      onMouseEnter={() => setOpen(true)}
    >
      <button
        type="button"
        className={`headerCatalogBtn ${open ? "isOpen" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Каталог
      </button>

      <CatalogMegaMenu open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
