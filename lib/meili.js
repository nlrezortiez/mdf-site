import { MeiliSearch } from "meilisearch";
import { MEILI_URL, MEILI_API_KEY } from "@/lib/config";

export function meiliClient() {
  return new MeiliSearch({
    host: MEILI_URL,
    apiKey: MEILI_API_KEY
  });
}
