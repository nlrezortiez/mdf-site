"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { maybeAssetUrl } from "@/lib/assets";
import GalleryCard from "@/components/GalleryCard";

const RECENT_KEY = "recent:gallery:v1";
const RECENT_LIMIT = 12;

function normalizeFileId(file) {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (typeof file === "object" && typeof file.id === "string") return file.id;
  return null;
}

/**
 * Directus "Files (multiple)" может вернуться разными формами.
 * Обрабатываем наиболее частые:
 * - ["uuid", ...]
 * - [{ id: "uuid" }, ...]
 * - [{ directus_files_id: { id: "uuid" } }, ...]
 * - [{ directus_files_id: "uuid" }, ...]
 */
function normalizeFilesList(images) {
  if (!Array.isArray(images)) return [];
  const ids = [];
  for (const it of images) {
    if (!it) continue;
    if (typeof it === "string") {
      ids.push(it);
      continue;
    }
    if (typeof it === "object") {
      if (typeof it.id === "string") {
        ids.push(it.id);
        continue;
      }
      const d = it.directus_files_id;
      if (typeof d === "string") {
        ids.push(d);
        continue;
      }
      if (d && typeof d === "object" && typeof d.id === "string") {
        ids.push(d.id);
        continue;
      }
    }
  }
  return ids;
}

function pushRecent(slug) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = [slug, ...list.filter((x) => x !== slug)].slice(0, RECENT_LIMIT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [slug];
  }
}

function readRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function GalleryDetailClient({ item }) {
  const previewId = normalizeFileId(item.preview_image);
  const extraIds = normalizeFilesList(item.images);

  const imageIds = useMemo(() => {
    const all = [];
    if (previewId) all.push(previewId);
    for (const id of extraIds) if (id && !all.includes(id)) all.push(id);
    return all;
  }, [previewId, extraIds]);

  const [active, setActive] = useState(imageIds[0] || null);

  // Recently viewed
  const [recentSlugs, setRecentSlugs] = useState([]);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const next = pushRecent(item.slug);
    setRecentSlugs(next);
  }, [item.slug]);

  useEffect(() => {
    const slugs = readRecent().filter((s) => s && s !== item.slug).slice(0, 8);
    if (slugs.length === 0) {
      setRecentItems([]);
      return;
    }

    const qs = new URLSearchParams();
    qs.set("slugs", slugs.join(","));

    fetch(`/api/recent/gallery?${qs.toString()}`)
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((json) => {
        const arr = Array.isArray(json?.data) ? json.data : [];
        // Сохраним порядок как в localStorage
        const map = new Map(arr.map((x) => [x.slug, x]));
        const ordered = slugs.map((s) => map.get(s)).filter(Boolean);
        setRecentItems(ordered);
      })
      .catch(() => setRecentItems([]));
  }, [item.slug, recentSlugs]);

  const activeUrl = active ? maybeAssetUrl(active, { width: 1600, quality: 85 }) : null;

  return (
    <div>
      <div className="galleryDetailGrid">
        <div className="galleryDetailLeft">
          <div className="galleryMainImageWrap">
            {activeUrl ? (
              <Image
                src={activeUrl}
                alt={item.title || ""}
                fill
                sizes="(max-width: 980px) 100vw, 520px"
                className="galleryMainImage"
                priority
              />
            ) : (
              <div className="galleryMainPlaceholder" />
            )}
          </div>

          {imageIds.length > 1 ? (
            <div className="galleryThumbs">
              {imageIds.map((id) => {
                const url = maybeAssetUrl(id, { width: 320, quality: 75 });
                const isActive = id === active;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`galleryThumbBtn ${isActive ? "isActive" : ""}`}
                    onClick={() => setActive(id)}
                    aria-label="Открыть фото"
                  >
                    {url ? (
                      <Image
                        src={url}
                        alt=""
                        fill
                        sizes="80px"
                        className="galleryThumbImg"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="galleryDetailRight">
          <h2 className="galleryDetailRightTitle">Элементы, используемые при изготовлении</h2>

          {/* Минимальная версия (без связей). Если у вас есть текстовые поля — показываем их. */}
          <div className="galleryInfoList">
            <div><span className="galleryInfoLabel">Наименование:</span> {item.title}</div>
            {item.milling ? <div><span className="galleryInfoLabel">Фрезеровка:</span> {item.milling}</div> : null}
            {item.film_pvc ? <div><span className="galleryInfoLabel">Пленка ПВХ:</span> {item.film_pvc}</div> : null}
          </div>

          {/* Если захотите “как на референсе” с двумя карточками материалов справа,
              это делается через связи на коллекции colors/films/millings. */}
          <div style={{ marginTop: 14 }}>
            <Link className="buttonOutline" href="/gallery">Назад к галерее</Link>
          </div>
        </div>
      </div>

      {recentItems.length ? (
        <div className="recentBlock">
          <div className="recentTitle">Вы недавно смотрели</div>
          <div className="recentGrid">
            {recentItems.map((it) => (
              <GalleryCard key={it.id} item={it} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
