"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { maybeAssetUrl } from "@/lib/assets";

function normalizeFileId(file) {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (typeof file === "object" && typeof file.id === "string") return file.id;
  return null;
}

/**
 * Directus "Files (multiple)" может вернуться в разных формах.
 * Поддерживаем:
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

export default function MillingSampleClient({ sample, millingTitle }) {
  const previewId = normalizeFileId(sample.preview_image);
  const extraIds = normalizeFilesList(sample.images);

  const imageIds = useMemo(() => {
    const all = [];
    if (previewId) all.push(previewId);
    for (const id of extraIds) if (id && !all.includes(id)) all.push(id);
    return all;
  }, [previewId, extraIds]);

  const [active, setActive] = useState(imageIds[0] || null);
  const activeUrl = active
    ? maybeAssetUrl(active, { width: 1100, quality: 85 })
    : null;

  const thumbs = imageIds.slice(0, 4); // как на референсе: 1 большая + до 3 миниатюр

  return (
    <div className="millingSampleBlock">
      <div className="millingSampleRow">
        <div>
          <div className="millingSampleMainWrap">
            {activeUrl ? (
              <Image
                src={activeUrl}
                alt={
                  sample?.cover_label ? String(sample.cover_label) : "Образец"
                }
                fill
                sizes="(max-width: 1200px) 50vw, 260px"
                className="millingSampleMainImg"
              />
            ) : (
              <div className="millingSamplePlaceholder" />
            )}
          </div>

          {thumbs.length > 1 ? (
            <div className="millingSampleThumbs">
              {thumbs.map((id) => {
                const url = maybeAssetUrl(id, { width: 260, quality: 75 });
                const isActive = id === active;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`millingSampleThumbBtn ${isActive ? "isActive" : ""}`}
                    onClick={() => setActive(id)}
                    aria-label="Открыть фото"
                  >
                    {url ? (
                      <Image
                        src={url}
                        alt=""
                        fill
                        sizes="72px"
                        className="millingSampleThumbImg"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="millingSampleMeta">
          <div className="millingSampleMetaTitle">Характеристики:</div>

          <div className="millingSampleMetaLine">
            <span className="millingSampleMetaLabel">Фрезеровка:</span>{" "}
            <span className="millingAccent">{millingTitle}</span>
          </div>

          {sample?.cover_label ? (
            <div className="millingSampleMetaLine">
              <span className="millingSampleMetaLabel">Покрытие:</span>{" "}
              <span className="millingAccent">
                {String(sample.cover_label)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
