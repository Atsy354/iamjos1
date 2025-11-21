"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function AppearanceLayout({ children }: Props) {
  const pathname = usePathname();
  const { t } = useI18n();

  // Sub-tabs untuk Appearance (seperti OJS: Theme, Setup)
  const APPEARANCE_SUBTABS = [
    { id: "theme", label: t('siteSettings.theme'), href: "/admin/site-settings/appearance/theme" },
    { id: "setup", label: t('siteSettings.setup'), href: "/admin/site-settings/appearance/setup" },
  ] as const;
  
  // Determine active sub-tab
  const activeSubTab = APPEARANCE_SUBTABS.find(tab => pathname === tab.href) || APPEARANCE_SUBTABS[0];

  return (
    <div className="space-y-6">
      {/* Sub-tabs Navigation - Side tabs style seperti OJS */}
      <div className="flex gap-8 border-b border-gray-200" style={{
        gap: '2rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '0.75rem'
      }}>
        {APPEARANCE_SUBTABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`font-semibold transition-colors ${
                active 
                  ? "border-b-2 border-[#006798] text-[#006798]" 
                  : "text-[#006798] hover:text-[#004d75]"
              }`}
              style={{
                fontSize: '0.9375rem',
                paddingBottom: '0.5rem',
                borderBottom: active ? '2px solid #006798' : 'none',
                fontWeight: '600'
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}

