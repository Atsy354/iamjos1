import { Button } from "@/components/ui/button";
import { getSiteLanguages, updateSiteLanguagesAction } from "../../actions";

export default async function SiteSetupLanguagesPage() {
  const initial = await getSiteLanguages();
  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Languages</h2>
      </header>
      <form action={updateSiteLanguagesAction} className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {[
            { code: "id", label: "Bahasa Indonesia" },
            { code: "en", label: "English" },
            { code: "es", label: "Español (España)" },
            { code: "fr", label: "Français" },
          ].map((locale) => (
            <label
              key={locale.code}
              className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm"
            >
              <input
                type="checkbox"
                name="enabled_locales"
                value={locale.code}
                defaultChecked={initial.enabled_locales.includes(locale.code)}
              />
              {locale.label}
              {initial.default_locale === locale.code && (
                <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-[var(--foreground)]">
                  Default
                </span>
              )}
            </label>
          ))}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="default_locale">Primary Locale</label>
          <select
            id="default_locale"
            name="default_locale"
            defaultValue={initial.default_locale}
            className="h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-[var(--foreground)] shadow-inner focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-muted)]"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
            <option value="es">Español (España)</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" type="button">Install Locale</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}