'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/lib/auth-client";
import { useI18n } from "@/contexts/I18nContext";
import { useState, useEffect } from "react";

function SiteSetupSettingsPage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState({
    site_name: "Open Journal Systems",
    min_password_length: 6
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6" style={{padding: '1.5rem 0'}}>
      <header className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4" style={{
        padding: '1rem 1.5rem',
        backgroundColor: '#f9fafb'
      }}>
        <h2 className="text-base font-semibold text-gray-900" style={{
          fontSize: '1rem',
          fontWeight: '600'
        }}>{t('siteSettings.settings')}</h2>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6" style={{
        gap: '1.5rem'
      }}>
        <div className="space-y-2">
          <Label htmlFor="site_name" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.siteName')} <span className="text-red-600">*</span></Label>
          <Input 
            id="site_name" 
            name="site_name" 
            value={settings.site_name}
            onChange={(e) => setSettings({...settings, site_name: e.target.value})}
            className="max-w-xl" 
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min_password_length" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.minimumPasswordLength')} <span className="text-red-600">*</span></Label>
          <Input 
            id="min_password_length" 
            name="min_password_length" 
            type="number" 
            min={6} 
            value={settings.min_password_length}
            onChange={(e) => setSettings({...settings, min_password_length: parseInt(e.target.value)})}
            className="max-w-xs" 
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">{t('common.save')}</Button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(SiteSetupSettingsPage, 'admin');