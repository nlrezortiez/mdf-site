"use client";

import { useEffect, useRef, useState } from "react";
import CatalogMegaMenu from "@/components/CatalogMegaMenu";

export default function HeaderCatalog() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const closeT = useRef(null);

  function cancelClose() {
    if (closeT.current) clearTimeout(closeT.current);
    closeT.current = null;
  }

  function scheduleClose() {
    cancelClose();
    closeT.current = setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    function onDoc(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="headerCatalog" ref={rootRef}>
      <button
        type="button"
        className={`headerCatalogBtn ${open ? "isOpen" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onMouseEnter={() => {
          cancelClose();
          setOpen(true);
        }}
        onMouseLeave={() => {
          scheduleClose();
        }}
        onClick={() => setOpen((v) => !v)}
      >
        Каталог{" "}
        <span className="headerCatalogCaret" aria-hidden="true">
          ▾
        </span>
      </button>

      <CatalogMegaMenu
        open={open}
        onClose={() => setOpen(false)}
        onPanelEnter={() => {
          cancelClose();
          setOpen(true);
        }}
        onPanelLeave={() => {
          scheduleClose();
        }}
      />
    </div>
  );
}
