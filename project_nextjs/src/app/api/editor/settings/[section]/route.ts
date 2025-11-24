"use server";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import {
  loadSectionSettings,
  saveSectionSettings,
  loadSetting,
  saveSetting,
} from "@/lib/settings-helpers";
import { ensureDummySettingsSeed } from "@/features/editor/dummy-settings";

type RouteParams = {
  params: Promise<{ section: string }>;
};

/**
 * GET /api/editor/settings/[section]
 * Load settings for a specific section
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { section } = await context.params;
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    // Get journal ID from query params or user roles
    const { searchParams } = new URL(request.url);
    const journalId = searchParams.get("journalId");

    let resolvedJournalId = journalId;
    if (!resolvedJournalId) {
      const journalRole = user.roles.find((r) => r.context_id);
      if (!journalRole?.context_id) {
        return NextResponse.json(
          { ok: false, message: "Journal ID is required" },
          { status: 400 }
        );
      }
      resolvedJournalId = journalRole.context_id;
    }

    // Check permissions - only journal managers, editors, and admins can view settings
    const hasPermission = user.roles.some(
      (role) =>
        role.role_path === "admin" ||
        role.role_path === "manager" ||
        role.role_path === "editor" ||
        (role.context_id === resolvedJournalId &&
          ["manager", "editor", "section_editor"].includes(role.role_path))
    );

    if (!hasPermission) {
      return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
    }

    await ensureDummySettingsSeed(section, resolvedJournalId);
    const settings = await loadSectionSettings(resolvedJournalId, section);
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error("Error loading settings:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Failed to load settings",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/editor/settings/[section]
 * Save settings for a specific section
 */
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const { section } = await context.params;
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { journalId, settings } = body;

    if (!journalId) {
      return NextResponse.json(
        { ok: false, message: "Journal ID is required" },
        { status: 400 }
      );
    }

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { ok: false, message: "Settings data is required" },
        { status: 400 }
      );
    }

    // Check permissions - only journal managers, editors, and admins can save settings
    const hasPermission = user.roles.some(
      (role) =>
        role.role_path === "admin" ||
        role.role_path === "manager" ||
        role.role_path === "editor" ||
        (role.context_id === journalId &&
          ["manager", "editor", "section_editor"].includes(role.role_path))
    );

    if (!hasPermission) {
      return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
    }

    // Transform settings to the format expected by saveSectionSettings
    const settingsToSave: Record<string, { value: any; type?: "string" | "bool" | "int" | "float" | "object" }> = {};
    for (const [key, value] of Object.entries(settings)) {
      // Auto-detect type
      let type: "string" | "bool" | "int" | "float" | "object" = "string";
      if (typeof value === "boolean") {
        type = "bool";
      } else if (typeof value === "number") {
        type = Number.isInteger(value) ? "int" : "float";
      } else if (typeof value === "object" && value !== null) {
        type = "object";
      }
      settingsToSave[key] = { value, type };
    }

    await saveSectionSettings(journalId, section, settingsToSave);

    // Reload settings to return updated values
    const updatedSettings = await loadSectionSettings(journalId, section);
    return NextResponse.json({ ok: true, settings: updatedSettings });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Failed to save settings",
      },
      { status: 500 }
    );
  }
}

