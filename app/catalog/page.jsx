import { redirect } from "next/navigation";

export default function CatalogRoot() {
  redirect("/catalog/product-types");
}
