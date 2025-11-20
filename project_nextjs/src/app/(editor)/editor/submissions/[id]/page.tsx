import { notFound } from "next/navigation";

import { getSubmissionDetail } from "@/features/editor/data";
import { WorkflowHeader } from "@/features/editor/components/workflow-header";
import { WorkflowProgressBar } from "@/features/editor/components/workflow-progress-bar";
import { WorkflowTabs } from "@/features/editor/components/workflow-tabs";
import type { SubmissionStage } from "@/features/editor/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

const VALID_STAGES: SubmissionStage[] = ["submission", "review", "copyediting", "production"];

export default async function SubmissionDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolved = await searchParams;
  const stageParam = resolved.stage as SubmissionStage | undefined;
  const stage: SubmissionStage =
    stageParam && VALID_STAGES.includes(stageParam) ? stageParam : "submission";

  // Use dummy data for demonstration
  const detail = {
    summary: {
      id: id,
      title: "Pemanfaatan Machine Learning untuk Prediksi Cuaca di Daerah Tropis",
      journalId: "1",
      journalTitle: "Jurnal Teknologi Informasi",
      stage: "review" as const,
      current_stage: "review" as const,
      status: "in_review" as const,
      isArchived: false,
      submittedAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-20T10:30:00Z",
      author_name: "Dr. Andi Wijaya, M.Kom",
      assignees: [],
    },
    metadata: {
      authors: [
        {
          givenName: "Andi",
          familyName: "Wijaya",
          affiliation: "Universitas Indonesia",
          email: "andi.wijaya@ui.ac.id",
        }
      ],
      abstract: "Penelitian ini bertujuan untuk mengembangkan sistem prediksi cuaca menggunakan algoritma machine learning untuk daerah tropis di Indonesia."
    },
    versions: [],
    participants: [],
    files: [],
    activity: [],
    reviewRounds: [],
  };

  if (!detail) {
    notFound();
  }

  // Extract author name from metadata
  const authorName =
    (detail.metadata as { authors?: Array<{ givenName?: string; familyName?: string }> })?.authors?.[0]
      ? `${(detail.metadata as { authors?: Array<{ givenName?: string; familyName?: string }> })?.authors?.[0]?.givenName ?? ""} ${(detail.metadata as { authors?: Array<{ givenName?: string; familyName?: string }> })?.authors?.[0]?.familyName ?? ""}`.trim() || "—"
      : "—";

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--surface-muted)]">
      <WorkflowHeader submission={detail.summary} authorName={authorName} />
      <WorkflowProgressBar submissionId={id} currentStage={stage} />
      <div className="flex-1 overflow-y-auto p-6">
        <WorkflowTabs submissionId={id} detail={detail} currentStage={stage} />
      </div>
    </div>
  );
}

