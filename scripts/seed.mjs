import { authHeaders, httpJson, mustEnv, waitForHttpOk } from "./_shared.mjs";

const DIRECTUS_URL = mustEnv("DIRECTUS_URL").replace(/\/$/, "");
const DIRECTUS_TOKEN = mustEnv("DIRECTUS_TOKEN");
const headers = authHeaders(DIRECTUS_TOKEN);

async function createIfEmpty(collection, items) {
  const list = await httpJson(`${DIRECTUS_URL}/items/${collection}?limit=1`, { headers }).catch(() => null);
  const has = (list?.data || []).length > 0;
  if (has) {
    console.log(`[OK] ${collection} already has items; skip`);
    return;
  }
  await httpJson(`${DIRECTUS_URL}/items/${collection}`, { method: "POST", headers, body: items });
  console.log(`[SEED] inserted ${items.length} items into ${collection}`);
}

async function main() {
  await waitForHttpOk(`${DIRECTUS_URL}/server/health`);

  await createIfEmpty("product_types_items", [
    { slug: "vitrina-dekorativnaya", title: "Витрина декоративная", short_description: "Пример вида продукции", is_published: true, is_popular: true },
    { slug: "fasad-pod-steklo", title: "Фасад под стекло", short_description: "Пример вида продукции", is_published: true, is_popular: false }
  ]);

  await createIfEmpty("millings", [
    { slug: "c1381", title: "C1381", article: "C1381", short_description: "Пример фрезеровки", is_published: true, is_popular: true },
    { slug: "fk-2061", title: "ФК-2061", article: "FK-2061", short_description: "Пример фрезеровки", is_published: true, is_popular: false }
  ]);

  await createIfEmpty("films", [
    { slug: "115r-oreh-kantri", title: "115R Орех Кантри", article: "115R", category: "матовая", warning_text: "Оттенок на экране может отличаться.", is_published: true, is_popular: true },
    { slug: "latte-soft-10st", title: "Latte Soft 10ST", article: "10ST", category: "софт-тач", warning_text: "Оттенок на экране может отличаться.", is_published: true, is_popular: false }
  ]);

  await createIfEmpty("colors", [
    { slug: "ral-4002-krasno-fioletovyj", title: "RAL 4002 Красно-фиолетовый", article: "RAL 4002", category: "фиолетовые тона", hex_color: "#922B3E", warning_text: "Оттенок на экране может отличаться.", is_published: true, is_popular: true },
    { slug: "ral-9016-traffic-white", title: "RAL 9016 Traffic White", article: "RAL 9016", category: "белые тона", hex_color: "#F1F0EA", warning_text: "Оттенок на экране может отличаться.", is_published: true, is_popular: false }
  ]);

  await createIfEmpty("edges", [
    { slug: "torc-standart", title: "Торец стандарт", short_description: "Пример торца", is_published: true, is_popular: true }
  ]);

  await createIfEmpty("patinas", [
    { slug: "patina-zoloto", title: "Патина золото", short_description: "Пример патины", is_published: true, is_popular: true }
  ]);

  await createIfEmpty("special_offers", [
    { slug: "plenka-latte-soft-fk-2061", title: "Плёнка Latte Soft 10ST + фрезеровка FK-2061", body: "Демонстрационная акция для MVP.", date_from: "2026-01-01", date_to: "2026-03-01", is_published: true, is_popular: true }
  ]);

  await createIfEmpty("news", [
    { slug: "mvp-zapushen", title: "Запущен MVP каталога", excerpt: "Короткий анонс.", body: "Полный текст новости для демонстрации.", published_at: "2026-01-24T10:00:00", is_published: true, is_popular: true }
  ]);

  await createIfEmpty("solutions", [
    { slug: "kuhnya-minimalizm", title: "Кухня: минимализм", description: "Пример готового решения для демонстрации.", is_published: true, is_popular: true }
  ]);

  await createIfEmpty("gallery_items", [
    { slug: "primer-1", title: "Пример фасада №1", description: "Демонстрация галереи.", is_published: true, is_popular: true }
  ]);

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
