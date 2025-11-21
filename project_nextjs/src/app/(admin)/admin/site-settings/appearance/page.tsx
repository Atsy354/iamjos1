import { redirect } from "next/navigation";

// Redirect to theme tab by default (like OJS)
export default function AppearanceIndexPage() {
  redirect("/admin/site-settings/appearance/theme");
}

