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
const DUMMY_THEMES = [
  { id: 'default', name: 'Default', description: 'Default theme' },
  { id: 'light', name: 'Light', description: 'Light theme' },
  { id: 'dark', name: 'Dark', description: 'Dark theme' },
];

function ThemeManagementPage() {
  const { t } = useI18n();
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState({
    theme_id: 'default',
    header_bg_color: '#002C40',
    primary_color: '#006798',
    secondary_color: '#002C40',
    footer_text: '',
  });

  useEffect(() => {
    // Load theme settings (dummy for now)
    const loadTheme = async () => {
      // In production, load from database
      // For now, use dummy data
    };
    loadTheme();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, save to database
      // await supabase.from('site_settings').upsert({ ... });
      
      toast.success(t('messages.saved'));
    } catch (error) {
      toast.error(t('messages.saveError'));
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        }}>{t('siteSettings.theme')}</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label htmlFor="theme_id" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.selectTheme')}</Label>
          <select
            id="theme_id"
            name="theme_id"
            title={t('siteSettings.selectTheme')}
            value={theme.theme_id}
            onChange={(e) => setTheme({ ...theme, theme_id: e.target.value })}
            className="flex h-10 w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
          >
            {DUMMY_THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <p className="text-sm text-gray-600" style={{ fontSize: '0.875rem' }}>
            {t('siteSettings.chooseDefaultTheme')}
          </p>
        </div>

        {/* Color Settings */}
        <div className="space-y-3">
          <Label htmlFor="header_bg_color" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.headerBackgroundColor')}</Label>
          <div className="flex gap-3 items-center">
            <Input
              id="header_bg_color"
              type="color"
              value={theme.header_bg_color}
              onChange={(e) => setTheme({ ...theme, header_bg_color: e.target.value })}
              className="w-20 h-10"
              style={{ width: '5rem', height: '2.5rem' }}
            />
            <Input
              type="text"
              value={theme.header_bg_color}
              onChange={(e) => setTheme({ ...theme, header_bg_color: e.target.value })}
              className="max-w-xs"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 0.75rem'
              }}
              placeholder="#002C40"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="primary_color" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.primaryColor')}</Label>
          <div className="flex gap-3 items-center">
            <Input
              id="primary_color"
              type="color"
              value={theme.primary_color}
              onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
              className="w-20 h-10"
              style={{ width: '5rem', height: '2.5rem' }}
            />
            <Input
              type="text"
              value={theme.primary_color}
              onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
              className="max-w-xs"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 0.75rem'
              }}
              placeholder="#006798"
            />
          </div>
        </div>

        {/* Footer Text */}
        <div className="space-y-3">
          <Label htmlFor="footer_text" style={{
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>{t('siteSettings.footerText')}</Label>
          <Textarea
            id="footer_text"
            value={theme.footer_text}
            onChange={(e) => setTheme({ ...theme, footer_text: e.target.value })}
            rows={4}
            className="max-w-2xl"
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
            placeholder="Footer text content"
          />
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

export default withAuth(ThemeManagementPage, 'admin');

