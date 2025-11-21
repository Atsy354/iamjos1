'use client';

import { useI18n } from "@/contexts/I18nContext";

export function SystemInformationHeader() {
  const { t } = useI18n();
  
  return (
    <div className="bg-gray-200 px-6 py-4" style={{
      backgroundColor: '#e5e5e5',
      padding: '1rem 1.5rem'
    }}>
      <h1 className="text-xl font-semibold text-gray-900" style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#111827'
      }}>
        {t('systemInfo.title')}
      </h1>
    </div>
  );
}

