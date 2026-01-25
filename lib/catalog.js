export const SECTIONS = [
  { section: "product-types", kind: "product_type", collection: "product_types_items", title: "Виды продукции", description: "Каркас, витрины, фасады и т.д." },
  { section: "millings", kind: "milling", collection: "millings", title: "Фрезеровки", description: "Профили и варианты обработки." },
  { section: "films", kind: "film", collection: "films", title: "Плёнка ПВХ", description: "Каталог покрытий и декоров." },
  { section: "colors", kind: "color", collection: "colors", title: "Эмали / RAL", description: "Цвета и оттенки." },
  { section: "edges", kind: "edge", collection: "edges", title: "Торцы", description: "Варианты торцевания фасадов." },
  { section: "patinas", kind: "patina", collection: "patinas", title: "Патина", description: "Эффекты старения и декоративные решения." }
];

export const KIND_LABEL = {
  product_type: "Вид продукции",
  milling: "Фрезеровка",
  film: "Плёнка",
  color: "Цвет",
  edge: "Торец",
  patina: "Патина",
  offer: "Акция",
  news: "Новость",
  solution: "Готовое решение",
  gallery: "Галерея"
};

export function sectionBySlug(section) {
  return SECTIONS.find(s => s.section === section) || null;
}
