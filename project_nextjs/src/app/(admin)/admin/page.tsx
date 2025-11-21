'use client';

import Link from "next/link";
import { AdminActionLink } from "@/components/admin/admin-action-link";
import { useI18n } from "@/contexts/I18nContext";
// import { VersionWarning } from "@/components/admin/version-warning"; // Disabled - akan diaktifkan nanti dengan API real

export default function AdminPage() {
  const { t } = useI18n();

  const SITE_MANAGEMENT_LINKS = [
    {
      label: t('admin.hostedJournals'),
      href: "/admin/site-management/hosted-journals",
    },
    {
      label: t('admin.siteSettings'),
      href: "/admin/site-settings/site-setup",
    },
  ];

  const ADMIN_FUNCTIONS_LINKS = [
    {
      label: t('admin.systemInformation'),
      href: "/admin/system/system-information",
      actionType: "link" as const,
    },
    {
      label: t('admin.expireUserSessions'),
      href: "/admin/system/expire-sessions",
      actionType: "form" as const,
      confirmMessage: t('admin.confirmExpireSessions'),
    },
    {
      label: t('admin.clearDataCaches'),
      href: "/admin/system/clear-data-caches",
      actionType: "form" as const,
    },
    {
      label: t('admin.clearTemplateCache'),
      href: "/admin/system/clear-template-cache",
      actionType: "form" as const,
    },
    {
      label: t('admin.clearScheduledTaskExecutionLogs'),
      href: "/admin/system/clear-scheduled-tasks",
      actionType: "form" as const,
    },
  ];
  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar - Light Gray */}
      <div className="bg-gray-200 px-6 py-4" style={{
        backgroundColor: '#e5e5e5',
        padding: '1rem 1.5rem'
      }}>
        <h1 className="text-xl font-semibold text-gray-900" style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827'
        }}>
          {t('admin.siteAdministration')}
        </h1>
      </div>

      {/* Content Panel - OJS 3.3 Style */}
      <div className="px-6 py-6" style={{
        padding: '2rem 1.5rem'
      }}>
        {/* Version Check Warning - DISABLED (akan diaktifkan nanti dengan API real) */}
        {/* <VersionWarning /> */}
        
        {/* Site Management Section - Larger Font */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.25rem',
          color: '#002C40'
        }}>
          {t('admin.siteManagement')}
        </h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          marginBottom: '3rem'
        }}>
          {SITE_MANAGEMENT_LINKS.map((link) => (
            <li key={link.href} style={{ marginBottom: '0.875rem' }}>
              <Link 
                href={link.href} 
                style={{
                  color: '#006798',
                  textDecoration: 'underline',
                  fontSize: '0.9375rem'
                }}
                className="hover:no-underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Administrative Functions Section - Larger Font */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.25rem',
          color: '#002C40'
        }}>
          {t('admin.administrativeFunctions')}
        </h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {ADMIN_FUNCTIONS_LINKS.map((link) => (
            <li key={link.href} style={{ marginBottom: '0.875rem' }}>
              {link.actionType === "form" ? (
                <AdminActionLink href={link.href} confirmMessage={link.confirmMessage}>
                  {link.label}
                </AdminActionLink>
              ) : (
                <Link 
                  href={link.href} 
                  style={{
                    color: '#006798',
                    textDecoration: 'underline',
                    fontSize: '0.9375rem'
                  }}
                  className="hover:no-underline"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}