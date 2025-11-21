import { notFound } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { JournalSettingsWizard } from "@/features/journals/components/journal-settings-wizard";
import { WizardHeader } from "./wizard-header";

type Props = {
  params: Promise<{ journalId: string }>;
};

export default async function JournalSettingsWizardPage({ params }: Props) {
  const { journalId } = await params;
  
  // Validate UUID format (8-4-4-4-12 hex characters)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!journalId || !uuidRegex.test(journalId)) {
    notFound();
  }

  // Load journal data
  const supabase = getSupabaseAdminClient();
  const { data: journal, error } = await supabase
    .from("journals")
    .select("*")
    .eq("id", journalId)
    .single();

  if (error) {
    console.error('Error loading journal:', error);
    notFound();
  }

  if (!journal) {
    console.warn('Journal not found:', journalId);
    notFound();
  }

  // Load journal settings
  const { data: settings } = await supabase
    .from("journal_settings")
    .select("*")
    .eq("journal_id", journalId);

  const journalData = {
    id: journal.id,
    name: (journal as any).title ?? (journal as any).name ?? (journal as any).journal_title ?? "",
    path: (journal as any).path ?? (journal as any).slug ?? (journal as any).journal_path ?? "",
    description: (journal as any).description ?? (journal as any).desc ?? "",
    settings: settings || [],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar - Light Gray */}
      <WizardHeader journalName={journalData.name} />

      {/* Content */}
      <div className="px-6 py-6" style={{
        padding: '2rem 1.5rem'
      }}>
        <JournalSettingsWizard journalId={journalId} initialData={journalData} />
      </div>
    </div>
  );
}

