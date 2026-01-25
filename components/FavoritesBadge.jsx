"use client";

import { useEffect, useState } from "react";

export default function FavoritesBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("favorites_v1");
        const arr = raw ? JSON.parse(raw) : [];
        setCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setCount(0);
      }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  return <span className="badge" aria-label="Количество избранных">{count}</span>;
}
