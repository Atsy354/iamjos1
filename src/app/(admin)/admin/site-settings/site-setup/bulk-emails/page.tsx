import { Button } from "@/components/ui/button";
import { updateBulkEmailPermissionsAction } from "../../actions";

export default function SiteSetupBulkEmailsPage() {
  const journals = [
    { id: "jpk", name: "Journal of Public Knowledge", allow: true },
    { id: "jsi", name: "Jurnal Sistem Informasi", allow: false },
    { id: "education", name: "E-Journal Pendidikan", allow: false },
  ];
  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Bulk Emails</h2>
      </header>
      <form action={updateBulkEmailPermissionsAction} className="space-y-6">
        <div className="space-y-3">
          {journals.map((journal) => (
            <label
              key={journal.id}
              className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3"
            >
              <input type="hidden" name="journal_id" value={journal.id} />
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {journal.name}
              </span>
              <input
                type="checkbox"
                name="allow_journal"
                value={journal.id}
                defaultChecked={journal.allow}
                className="h-4 w-4 rounded border border-[var(--border)]"
              />
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}