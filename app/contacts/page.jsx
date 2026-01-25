import { readSingleton } from "@/lib/directus";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const settings = await readSingleton("site_settings").catch(() => null);

  return (
    <div>
      <div className="kicker">Контакты</div>
      <h1 className="h1">Контакты</h1>

      <div className="panel">
        <div className="small">
          <div><span className="kicker">Телефон:</span> {settings?.phone || "—"}</div>
          <div><span className="kicker">Email:</span> {settings?.email || "—"}</div>
          <div><span className="kicker">Адрес:</span> {settings?.address || "—"}</div>
        </div>
        <div style={{marginTop:14, color:"var(--muted)"}} className="small">
          Форма заявки в MVP не отправляет письма. Рекомендация: добавить отдельную коллекцию “requests” и сохранять заявки в Directus.
        </div>
      </div>
    </div>
  );
}
