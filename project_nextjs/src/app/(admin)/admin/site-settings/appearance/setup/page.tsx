'use client';

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { withAuth } from "@/lib/auth-client";
import { useSupabase } from "@/providers/supabase-provider";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";

// Dummy data untuk testing
const DUMMY_SIDEBAR_OPTIONS = [
  { value: 'user', label: 'User Block' },
  { value: 'language', label: 'Language Toggle Block' },
  { value: 'navigation', label: 'Navigation Block' },
  { value: 'announcements', label: 'Announcements Block' },
];

function AppearanceSetupPage() {
  const { t } = useI18n();
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    page_header_title_image: null as File | null,
    page_footer: '',
    sidebar: [] as string[],
    stylesheet: null as File | null,
  });

  useEffect(() => {
    // Load appearance settings (dummy for now)
    const loadSettings = async () => {
      // In production, load from database
      // For now, use dummy data
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, save to database
      // await supabase.from('site_settings').upsert({ ... });
      
      toast.success(t('siteSettings.appearanceSaved'));
    } catch (error) {
      toast.error(t('siteSettings.appearanceSaveError'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarToggle = (value: string) => {
    setSettings({
      ...settings,
      sidebar: settings.sidebar.includes(value)
        ? settings.sidebar.filter(v => v !== value)
        : [...settings.sidebar, value]
    });
  };

  return (
    <div className="space-y-6" style={{ padding: '1.5rem 0' }}>
      <header className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4" style={{
        padding: '1rem 1.5rem',
        backgroundColor: '#f9fafb'
      }}>
        <h2 className="text-base font-semibold text-gray-900" style={{
          fontSize: '1rem',
          fontWeight: '600'
        }}>{t('siteSettings.setup')}</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <div className="space-y-3">
          <Label htmlFor="page_header_title_image" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.logo')}</Label>
          <Input
            id="page_header_title_image"
            type="file"
            accept="image/*"
            onChange={(e) => setSettings({ 
              ...settings, 
              page_header_title_image: e.target.files?.[0] || null 
            })}
            className="max-w-md"
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
          />
          <p className="text-sm text-gray-600" style={{ fontSize: '0.875rem' }}>
            Upload a logo image to display in the page header
          </p>
          {settings.page_header_title_image && (
            <div className="mt-2">
              <img 
                src={URL.createObjectURL(settings.page_header_title_image)} 
                alt="Preview" 
                className="h-20 object-contain"
                style={{ height: '5rem' }}
              />
            </div>
          )}
        </div>

        {/* Page Footer */}
        <div className="space-y-3">
          <Label htmlFor="page_footer" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.pageFooter')}</Label>
          <Textarea
            id="page_footer"
            value={settings.page_footer}
            onChange={(e) => setSettings({ ...settings, page_footer: e.target.value })}
            rows={6}
            className="max-w-2xl"
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
            placeholder="Enter footer content (HTML allowed)"
          />
          <p className="text-sm text-gray-600" style={{ fontSize: '0.875rem' }}>
            Content to display in the page footer. HTML is allowed.
          </p>
        </div>

        {/* Sidebar Blocks */}
        <div className="space-y-3">
          <Label style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.sidebarBlocks')}</Label>
          <p className="text-sm text-gray-600 mb-3" style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            Select which blocks to display in the sidebar and drag to reorder
          </p>
          <div className="space-y-2 border border-gray-200 rounded-md p-4 max-w-md" style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            padding: '1rem'
          }}>
            {DUMMY_SIDEBAR_OPTIONS.map((option) => (
              <label 
                key={option.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.25rem'
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.sidebar.includes(option.value)}
                  onChange={() => handleSidebarToggle(option.value)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm" style={{ fontSize: '0.875rem' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Stylesheet */}
        <div className="space-y-3">
          <Label htmlFor="stylesheet" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.customStylesheet')}</Label>
          <Input
            id="stylesheet"
            type="file"
            accept=".css"
            onChange={(e) => setSettings({ 
              ...settings, 
              stylesheet: e.target.files?.[0] || null 
            })}
            className="max-w-md"
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
          />
          <p className="text-sm text-gray-600" style={{ fontSize: '0.875rem' }}>
            Upload a custom CSS file to override default styles
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(AppearanceSetupPage, 'admin');

