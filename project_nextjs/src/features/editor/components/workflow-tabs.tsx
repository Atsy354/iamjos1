"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { WorkflowStageView } from "./workflow-stage-view";
import { SubmissionWorkflowView } from "./submission-workflow-view";
import { SubmissionActivityForm } from "./submission-activity-form";
import type { SubmissionDetail, SubmissionStage } from "../types";

type Props = {
  submissionId: string;
  detail: SubmissionDetail;
  currentStage: SubmissionStage;
};

export function WorkflowTabs({ submissionId, detail, currentStage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab: "summary" | "review" | "copyediting" | "production" | "publication" =
    (searchParams?.get("tab") === "publication")
      ? "publication"
      : currentStage === "submission"
      ? "summary"
      : (currentStage as "review" | "copyediting" | "production");
  const [activeTab, setActiveTab] = useState<"summary" | "review" | "copyediting" | "production" | "publication">(initialTab);

  const tabs: { key: "summary" | "review" | "copyediting" | "production" | "publication"; label: string }[] = [
    { key: "summary", label: "Summary" },
    { key: "review", label: "Review" },
    { key: "copyediting", label: "Copyediting" },
    { key: "production", label: "Production" },
    { key: "publication", label: "Publication" },
  ];

  function navigate(tab: typeof tabs[number]["key"]) {
    setActiveTab(tab);
    if (tab === "publication") {
      const params = new URLSearchParams(searchParams ?? undefined);
      params.set("tab", "publication");
      if (!params.get("stage")) params.set("stage", currentStage);
      router.push(`?${params.toString()}`);
      return;
    }
    const stage = tab === "summary" ? "submission" : tab;
    const params = new URLSearchParams(searchParams ?? undefined);
    params.delete("tab");
    params.set("stage", stage);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-[var(--border)] bg-white">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => navigate(tab.key)}
              className={`border-b-2 px-6 py-3 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
        {activeTab === "summary" && <SubmissionWorkflowView detail={detail} />}
        {activeTab === "review" && <WorkflowStageView detail={detail} stage={"review"} />}
        {activeTab === "copyediting" && <WorkflowStageView detail={detail} stage={"copyediting"} />}
        {activeTab === "production" && <WorkflowStageView detail={detail} stage={"production"} />}
        {activeTab === "publication" && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Publication Details</h2>
              <p className="text-sm text-[var(--muted)]">
                Publication tab akan menampilkan metadata, contributors, galleys, dan informasi publikasi lainnya.
              </p>
            </div>
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-sm text-[var(--muted)]">
                Fitur Publication akan diimplementasikan sesuai dengan OJS 3.3 pada tahap selanjutnya.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Activity Log Section - always visible at bottom */}
      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Activity Log</h2>
        <div className="space-y-3">
          {detail.activity.length === 0 && (
            <p className="text-sm text-[var(--muted)]">Belum ada aktivitas tercatat.</p>
          )}
          {detail.activity.map((log) => (
            <div key={log.id} className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--foreground)]">{log.category}</p>
              <p className="text-sm text-[var(--muted)]">{log.message}</p>
              <span className="text-xs text-[var(--muted)]">{formatDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <SubmissionActivityForm submissionId={submissionId} />
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}





