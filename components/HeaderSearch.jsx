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
    <form className="searchbar" onSubmit={onSubmit}>
      <input
        className="input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск по каталогу…"
        aria-label="Поиск"
      />
      <button className="button" type="submit">Найти</button>
    </form>
  );
}
