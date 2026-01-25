"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <form className="headerSearch" onSubmit={onSubmit}>
      <span className="headerSearchIcon" aria-hidden="true">⌕</span>
      <input
        className="headerSearchInput"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder=""
        aria-label="Поиск"
      />
      <button className="headerSearchSubmit" type="submit" aria-label="Найти" />
    </form>
  );
}
