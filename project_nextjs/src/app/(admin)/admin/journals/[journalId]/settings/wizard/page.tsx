'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { PkpInput } from '@/components/ui/pkp-input';
import { PkpCheckbox } from '@/components/ui/pkp-checkbox';
import { PkpRichTextEditor } from '@/components/ui/pkp-rich-text-editor';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/providers/supabase-provider';
import { updateJournalAction } from '../../../../site-management/hosted-journals/actions';
import { pkpColors, pkpTypography } from '@/lib/theme';
import { toast } from 'sonner';
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";

function WizardHeader({ journalName }: { journalName?: string }) {
    const { t } = useI18n();

    return (
        <div className="bg-gray-200 px-6 py-4" style={{
            backgroundColor: '#e5e5e5',
            padding: '1rem 1.5rem'
        }}>
            {/* Breadcrumb removed as requested */}
            <h1 className="text-xl font-semibold text-gray-900" style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827'
            }}>
                {t('wizard.title')}
            </h1>
        </div>
    );
}

export default function JournalWizardPage({ params }: { params: Promise<{ journalId: string }> }) {
    const { journalId } = use(params);
    const router = useRouter();
    const supabase = useSupabase();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pathPrefix, setPathPrefix] = useState('http://localhost/');

    // Navigation State
    const [activeTab, setActiveTab] = useState<'settings' | 'plugins' | 'users'>('settings');
    const [activeSection, setActiveSection] = useState<'journal' | 'appearance' | 'languages' | 'indexing' | 'emails'>('journal');

    const [formData, setFormData] = useState({
        title: '',
        initials: '',
        abbreviation: '',
        description: '',
        path: '',
        isPublic: false,
        // Appearance (Mock data for UI)
        theme: 'Default Theme',
        typography: 'Noto Sans',
        headerColor: '#1E6292',
        showSummary: false,
        showHeaderImage: false,
        // Languages (Mock data for UI)
        primaryLocale: 'en_US',
        locales: [
            { code: 'en_US', name: 'English', ui: true, forms: true, submissions: true },
            { code: 'es_ES', name: 'Español (España)', ui: false, forms: false, submissions: false },
            { code: 'id_ID', name: 'Bahasa Indonesia', ui: false, forms: false, submissions: false },
        ],
        // Search Indexing
        searchDescription: '',
        customTags: '',
        // Restrict Bulk Emails
        disableBulkEmails: [] as string[],
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPathPrefix(`${window.location.origin}/`);
        }
    }, []);

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                const { data: journal, error: journalError } = await supabase
                    .from('journals')
                    .select('*')
                    .eq('id', journalId)
                    .single();

                if (journalError) throw journalError;

                const { data: settings, error: settingsError } = await supabase
                    .from('journal_settings')
                    .select('setting_name, setting_value')
                    .eq('journal_id', journalId);

                if (settingsError) throw settingsError;

                const settingsMap = (settings || []).reduce((acc: any, curr) => {
                    acc[curr.setting_name] = curr.setting_value;
                    return acc;
                }, {});

                setFormData(prev => ({
                    ...prev,
                    title: settingsMap.name || '',
                    initials: settingsMap.initials || '',
                    abbreviation: settingsMap.abbreviation || '',
                    description: settingsMap.description || '',
                    path: journal.path || '',
                    isPublic: journal.enabled || false,
                }));
            } catch (error) {
                console.error('Error fetching journal:', error);
                toast.error('Failed to load journal data');
            } finally {
                setLoading(false);
            }
        };

        if (journalId) {
            fetchJournal();
        }
    }, [journalId, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const result = await updateJournalAction({
                id: journalId,
                title: formData.title,
                initials: formData.initials,
                abbreviation: formData.abbreviation,
                path: formData.path,
                description: formData.description,
                isPublic: formData.isPublic,
            });

            if (result.success) {
                toast.success('Journal updated successfully');
                router.refresh();
            } else {
                toast.error(result.message || 'Failed to update journal');
            }
        } catch (error) {
            console.error('Error updating journal:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#eaedee] flex flex-col">
            <WizardHeader journalName={formData.title} />

            <div className="flex-1 p-8">
                <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-sm rounded-sm min-h-[600px] flex flex-col">

                    {/* Top Tabs */}
                    <div className="flex border-b border-gray-200 px-4 pt-4">
                        {[
                            { label: 'Journal Settings', key: 'settings' },
                            { label: 'Plugins', key: 'plugins' },
                            { label: 'Users', key: 'users' }
                        ].map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={cn(
                                        "px-4 text-sm font-bold mr-1 rounded-t-sm transition-colors",
                                        isActive
                                            ? "bg-white text-[#202020] border-t-4 border-t-[#006798] border-l border-r border-gray-200 -mb-px pt-1 pb-2.5"
                                            : "bg-transparent text-[#006798] hover:text-[#006798] hover:bg-[#e5e5e5] hover:border-t-[#006798] border-t-4 border-transparent pt-1 pb-2"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-1">
                        {/* Sidebar Navigation (Only for Journal Settings tab) */}
                        {activeTab === 'settings' && (
                            <div className="w-64 border-r border-gray-200 py-4">
                                {[
                                    { id: 'journal', label: 'Journal' },
                                    { id: 'appearance', label: 'Appearance' },
                                    { id: 'languages', label: 'Languages' },
                                    { id: 'indexing', label: 'Search Indexing' },
                                    { id: 'emails', label: 'Restrict Bulk Emails' },
                                ].map((item) => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id as any)}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm transition-colors border-l-4",
                                                isActive
                                                    ? "border-[#006798] text-[#006798] font-bold bg-gray-50"
                                                    : "border-transparent text-[#006798] hover:bg-gray-50"
                                            )}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Form Area */}
                        <div className="flex-1 p-6">
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

                                {activeTab === 'settings' && (
                                    <>
                                        {activeSection === 'journal' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Journal title <span className="text-red-600">*</span>
                                                    </label>
                                                    <PkpInput
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Journal initials <span className="text-red-600">*</span>
                                                    </label>
                                                    <PkpInput
                                                        value={formData.initials}
                                                        onChange={(e) => setFormData({ ...formData, initials: e.target.value })}
                                                        className="w-32"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Journal Abbreviation
                                                    </label>
                                                    <PkpInput
                                                        value={formData.abbreviation}
                                                        onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                                                    />
                                                </div>

                                                <PkpRichTextEditor
                                                    label="Journal description"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={8}
                                                />

                                                <div className="relative">
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Path <span className="text-red-600">*</span>
                                                    </label>
                                                    <div className="relative flex items-center">
                                                        <div className="absolute left-3 text-gray-500 text-sm select-none pointer-events-none">
                                                            {pathPrefix}
                                                        </div>
                                                        <PkpInput
                                                            value={formData.path}
                                                            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                                            required
                                                            style={{ paddingLeft: `${pathPrefix.length * 7 + 10}px` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-200 pt-4 mt-4">
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Enable
                                                    </label>
                                                    <div className="border border-[#e5e5e5] rounded p-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <PkpCheckbox
                                                                checked={formData.isPublic}
                                                                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                                            />
                                                            <span className="text-sm text-gray-700">
                                                                Enable this journal to appear publicly on the site
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {activeSection === 'appearance' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Theme
                                                    </label>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        New themes may be installed from the Plugins tab at the top of this page.
                                                    </p>
                                                    <select
                                                        className="w-full max-w-md p-2 border border-[#e5e5e5] rounded text-sm bg-white"
                                                        value={formData.theme}
                                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                                    >
                                                        <option>Default Theme</option>
                                                    </select>
                                                </div>

                                                <div className="border border-[#e5e5e5] rounded p-4">
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Typography
                                                    </label>
                                                    <p className="text-sm text-gray-700 mb-4">
                                                        Choose a font combination that suits this journal.
                                                    </p>
                                                    <div className="space-y-3">
                                                        {[
                                                            "Noto Sans: A digital-native font designed by Google for extensive language support.",
                                                            "Noto Serif: A serif variant of Google's digital-native font.",
                                                            "Noto Serif/Noto Sans: A complementary pairing with serif headings and sans-serif body text.",
                                                            "Noto Sans/Noto Serif: A complementary pairing with sans-serif headings and serif body text.",
                                                            "Lato: A popular modern sans-serif font.",
                                                            "Lora: A wide-set serif font good for reading online.",
                                                            "Lora/Open Sans: A complimentary pairing with serif headings and sans-serif body text."
                                                        ].map((option, idx) => (
                                                            <label key={idx} className="flex items-start gap-2 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="typography"
                                                                    className="mt-1"
                                                                    checked={formData.typography === option.split(':')[0]}
                                                                    onChange={() => setFormData({ ...formData, typography: option.split(':')[0] })}
                                                                />
                                                                <span className="text-sm text-gray-700">{option}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Colour
                                                    </label>
                                                    <p className="text-sm text-gray-700 mb-2">Choose a colour for the header.</p>
                                                    <div className="border border-[#e5e5e5] p-4 rounded inline-block bg-white">
                                                        <div className="w-48 h-24 bg-gradient-to-br from-gray-200 to-gray-400 mb-2 relative rounded overflow-hidden">
                                                            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${formData.headerColor}, transparent)` }}></div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="color"
                                                                value={formData.headerColor}
                                                                onChange={(e) => setFormData({ ...formData, headerColor: e.target.value })}
                                                                className="h-8 w-8 p-0 border-0"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={formData.headerColor}
                                                                onChange={(e) => setFormData({ ...formData, headerColor: e.target.value })}
                                                                className="border border-[#e5e5e5] px-2 py-1 text-sm w-24"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-200 pt-4">
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Journal Summary
                                                    </label>
                                                    <div className="border border-[#e5e5e5] rounded p-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <PkpCheckbox
                                                                checked={formData.showSummary}
                                                                onChange={(e) => setFormData({ ...formData, showSummary: e.target.checked })}
                                                            />
                                                            <span className="text-sm text-gray-700">Show the journal summary on the homepage.</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-200 pt-4">
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2">
                                                        Header Background Image
                                                    </label>
                                                    <div className="border border-[#e5e5e5] rounded p-4">
                                                        <p className="text-sm text-gray-700 mb-3">
                                                            When a homepage image has been uploaded, display it in the background of the header instead of it's usual position on the homepage.
                                                        </p>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <PkpCheckbox
                                                                checked={formData.showHeaderImage}
                                                                onChange={(e) => setFormData({ ...formData, showHeaderImage: e.target.checked })}
                                                            />
                                                            <span className="text-sm text-gray-700">Show the homepage image as the header background.</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {activeSection === 'languages' && (
                                            <div className="border border-[#e5e5e5] rounded">
                                                <div className="p-4 border-b border-[#e5e5e5] bg-gray-50">
                                                    <h3 className="font-bold text-[#002C40]">Languages</h3>
                                                </div>
                                                <table className="w-full text-sm text-left">
                                                    <thead>
                                                        <tr className="border-b border-[#e5e5e5] text-gray-500">
                                                            <th className="p-3 font-normal">Locale</th>
                                                            <th className="p-3 font-normal text-center">Primary locale</th>
                                                            <th className="p-3 font-normal text-center">UI</th>
                                                            <th className="p-3 font-normal text-center">Forms</th>
                                                            <th className="p-3 font-normal text-center">Submissions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.locales.map((locale) => (
                                                            <tr key={locale.code} className="border-b border-[#e5e5e5] last:border-0">
                                                                <td className="p-3 flex items-center gap-2">
                                                                    <span className="text-[#006798] cursor-pointer">▶</span> {locale.name}
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="primaryLocale"
                                                                        checked={formData.primaryLocale === locale.code}
                                                                        onChange={() => setFormData({ ...formData, primaryLocale: locale.code })}
                                                                    />
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={locale.ui}
                                                                        disabled={locale.code === 'en_US'}
                                                                        onChange={(e) => {
                                                                            const newLocales = formData.locales.map(l =>
                                                                                l.code === locale.code ? { ...l, ui: e.target.checked } : l
                                                                            );
                                                                            setFormData({ ...formData, locales: newLocales });
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={locale.forms}
                                                                        disabled={locale.code === 'en_US'}
                                                                        onChange={(e) => {
                                                                            const newLocales = formData.locales.map(l =>
                                                                                l.code === locale.code ? { ...l, forms: e.target.checked } : l
                                                                            );
                                                                            setFormData({ ...formData, locales: newLocales });
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={locale.submissions}
                                                                        disabled={locale.code === 'en_US'}
                                                                        onChange={(e) => {
                                                                            const newLocales = formData.locales.map(l =>
                                                                                l.code === locale.code ? { ...l, submissions: e.target.checked } : l
                                                                            );
                                                                            setFormData({ ...formData, locales: newLocales });
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {activeSection === 'indexing' && (
                                            <>
                                                <div className="mb-6">
                                                    <h3 className="text-lg font-bold text-[#002C40] mb-2">Search Indexing</h3>
                                                    <p className="text-sm text-gray-700 mb-4">
                                                        Help search engines like Google discover and display your site. You are encouraged to submit your <a href="#" className="text-[#006798] underline">sitemap</a>.
                                                    </p>
                                                </div>

                                                <div className="mb-6">
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2 flex items-center gap-1">
                                                        Description
                                                        <span className="text-gray-400 cursor-help" title="Description for search engines">?</span>
                                                    </label>
                                                    <PkpInput
                                                        value={formData.searchDescription}
                                                        onChange={(e) => setFormData({ ...formData, searchDescription: e.target.value })}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-[#002C40] mb-2 flex items-center gap-1">
                                                        Custom Tags
                                                        <span className="text-gray-400 cursor-help" title="Custom meta tags">?</span>
                                                    </label>
                                                    <textarea
                                                        className="w-full p-2 border border-[#e5e5e5] rounded text-sm focus:outline-none focus:border-[#006798] transition-colors"
                                                        rows={6}
                                                        value={formData.customTags}
                                                        onChange={(e) => setFormData({ ...formData, customTags: e.target.value })}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {activeSection === 'emails' && (
                                            <div className="border border-[#e5e5e5] rounded p-4">
                                                <h3 className="font-bold text-[#002C40] mb-4 border-b border-[#e5e5e5] pb-2">Disable Roles</h3>
                                                <p className="text-sm text-gray-700 mb-4">
                                                    A journal manager will be unable to send bulk emails to any of the roles selected below. Use this setting to limit abuse of the email notification feature. For example, it may be safer to disable bulk emails to readers, authors, or other large user groups that have not consented to receive such emails.
                                                </p>
                                                <p className="text-sm text-gray-700 mb-6">
                                                    The bulk email feature can be disabled completely for this journal in <a href="#" className="text-[#006798] underline">Admin {'>'} Site Settings</a>.
                                                </p>

                                                <div className="space-y-2">
                                                    {[
                                                        "Journal manager", "Journal editor", "Production editor", "Section editor",
                                                        "Guest editor", "Copyeditor", "Designer", "Funding coordinator", "Indexer",
                                                        "Layout Editor", "Marketing and sales coordinator", "Proofreader", "Author",
                                                        "Translator", "Reviewer", "Reader", "Subscription Manager"
                                                    ].map((role) => (
                                                        <label key={role} className="flex items-center gap-2 cursor-pointer">
                                                            <PkpCheckbox
                                                                checked={formData.disableBulkEmails.includes(role)}
                                                                onChange={(e) => {
                                                                    const newRoles = e.target.checked
                                                                        ? [...formData.disableBulkEmails, role]
                                                                        : formData.disableBulkEmails.filter(r => r !== role);
                                                                    setFormData({ ...formData, disableBulkEmails: newRoles });
                                                                }}
                                                            />
                                                            <span className="text-sm text-gray-700">{role}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'plugins' && (
                                    <div className="p-8 text-center text-gray-500 italic border border-dashed border-gray-300 rounded">
                                        Plugin management would appear here.
                                    </div>
                                )}

                                {activeTab === 'users' && (
                                    <div className="p-8 text-center text-gray-500 italic border border-dashed border-gray-300 rounded">
                                        User management would appear here.
                                    </div>
                                )}

                                {/* Save Button (Always visible) */}
                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-[#006798] hover:bg-[#005a87] text-white font-semibold px-4 py-2 rounded shadow-sm"
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
