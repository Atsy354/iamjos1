'use client';

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/supabase-provider";

type JournalData = {
  id: string;
  name: string;
  path: string;
  description?: string;
  settings: any[];
};

type Props = {
  journalId: string;
  initialData: JournalData;
};

// Wizard tabs seperti OJS
const WIZARD_TABS = [
  { id: 'context', label: 'Journal Information' },
  { id: 'theme', label: 'Theme' },
  { id: 'indexing', label: 'Search Indexing' },
] as const;

export function JournalSettingsWizard({ journalId, initialData }: Props) {
  const router = useRouter();
  const supabase = useSupabase();
  const [activeTab, setActiveTab] = useState<typeof WIZARD_TABS[number]['id']>('context');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    path: initialData.path || '',
    description: initialData.description || '',
    theme: 'default',
    header_bg_color: '#002C40',
    primary_color: '#006798',
    // Indexing settings
    keywords: '',
    description_text: '',
    include_supplemental: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update journal data
      const { error: journalError } = await supabase
        .from('journals')
        .update({
          title: formData.name,
          path: formData.path,
          description: formData.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', journalId);

      if (journalError) {
        throw journalError;
      }

      // Update journal settings
      const settingsUpdates = [
        { setting_name: 'theme', setting_value: formData.theme },
        { setting_name: 'header_bg_color', setting_value: formData.header_bg_color },
        { setting_name: 'primary_color', setting_value: formData.primary_color },
        { setting_name: 'keywords', setting_value: formData.keywords },
        { setting_name: 'description', setting_value: formData.description_text },
      ];

      for (const setting of settingsUpdates) {
        await supabase
          .from('journal_settings')
          .upsert({
            journal_id: journalId,
            setting_name: setting.setting_name,
            setting_value: setting.setting_value,
            setting_type: 'string',
          }, {
            onConflict: 'journal_id,setting_name'
          });
      }

      // Success - redirect to hosted journals
      router.push('/admin/site-management/hosted-journals');
    } catch (error) {
      console.error('Error saving journal settings:', error);
      alert('Failed to save journal settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'context':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name">
                Journal Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="max-w-2xl"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="path">
                Journal Path <span className="text-red-600">*</span>
              </Label>
              <Input
                id="path"
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                required
                className="max-w-xl"
                placeholder="journal-name"
              />
              <p className="text-sm text-gray-600">
                The URL path for this journal (e.g., /journal-name)
              </p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="max-w-2xl"
              />
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="theme">Theme</Label>
              <select
                id="theme"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="flex h-10 w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="default">Default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="header_bg_color">Header Background Color</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="header_bg_color"
                  type="color"
                  value={formData.header_bg_color}
                  onChange={(e) => setFormData({ ...formData, header_bg_color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={formData.header_bg_color}
                  onChange={(e) => setFormData({ ...formData, header_bg_color: e.target.value })}
                  className="max-w-xs"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>
        );

      case 'indexing':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="max-w-2xl"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-sm text-gray-600">
                Comma-separated keywords for search engine indexing
              </p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="description_text">Meta Description</Label>
              <Textarea
                id="description_text"
                value={formData.description_text}
                onChange={(e) => setFormData({ ...formData, description_text: e.target.value })}
                rows={4}
                className="max-w-2xl"
                placeholder="A brief description for search engines"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.include_supplemental}
                  onChange={(e) => setFormData({ ...formData, include_supplemental: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Include supplemental files in search results</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wizard Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {WIZARD_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-[#006798] text-[#006798]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{
                fontSize: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: activeTab === tab.id ? '2px solid #006798' : 'none',
                fontWeight: '600'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {renderTabContent()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/site-management/hosted-journals')}
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            {activeTab !== 'context' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentIndex = WIZARD_TABS.findIndex(t => t.id === activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(WIZARD_TABS[currentIndex - 1].id);
                  }
                }}
              >
                Previous
              </Button>
            )}
            {activeTab !== WIZARD_TABS[WIZARD_TABS.length - 1].id ? (
              <Button
                type="button"
                onClick={() => {
                  const currentIndex = WIZARD_TABS.findIndex(t => t.id === activeTab);
                  if (currentIndex < WIZARD_TABS.length - 1) {
                    setActiveTab(WIZARD_TABS[currentIndex + 1].id);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
