"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function SiteSettingsLayout({ children }: Props) {
  const pathname = usePathname();
  const { t } = useI18n();

  // Main tabs seperti OJS: Setup, Appearance, Plugins
  const MAIN_TABS = [
    { id: "setup", label: t('siteSettings.setup'), href: "/admin/site-settings/site-setup" },
    { id: "appearance", label: t('siteSettings.appearance'), href: "/admin/site-settings/appearance" },
    { id: "plugins", label: t('siteSettings.plugins'), href: "/admin/site-settings/plugins" },
  ] as const;
  
  // Determine active main tab
  const activeMainTab = MAIN_TABS.find(tab => pathname?.startsWith(tab.href)) || MAIN_TABS[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar - Light Gray */}
      <div className="bg-gray-200 px-6 py-4" style={{
        backgroundColor: '#e5e5e5',
        padding: '1rem 1.5rem'
      }}>
        <h1 className="text-xl font-semibold text-gray-900" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#111827'
        }}>
          {t('admin.siteSettings')}
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6" style={{
        padding: '2rem 1.5rem'
      }}>
        {/* Main Tabs - OJS 3.3 Style */}
        <nav className="mb-6 border-b border-gray-200" style={{
          marginBottom: '1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div className="flex gap-6" style={{ gap: '1.5rem' }}>
            {MAIN_TABS.map((tab) => {
              const active = pathname?.startsWith(tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`pb-3 px-1 font-semibold transition-colors ${
                    active 
                      ? "border-b-2 border-[#006798] text-[#006798]" 
                      : "text-[#006798] hover:text-[#004d75]"
                  }`}
                  style={{
                    fontSize: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: active ? '2px solid #006798' : 'none',
                    fontWeight: '600'
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}