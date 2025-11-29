import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

type Props = {
    params: Promise<{ path: string; issueId: string }>;
};

export default async function IssuePage({ params }: Props) {
    const { path, issueId } = await params;
    const supabase = await createSupabaseServerClient();

    // Fetch Journal
    const { data: journal } = await supabase
        .from('journals')
        .select('id, name, path')
        .eq('path', path)
        .eq('enabled', true)
        .single();

    if (!journal) {
        notFound();
    }

    // Fetch Issue
    const { data: issue } = await supabase
        .from('issues')
        .select(`
            *,
            submission_versions!inner (
                submission:submissions (
                    id,
                    title,
                    metadata,
                    status
                ),
                version
            )
        `)
        .eq('id', issueId)
        .eq('journal_id', journal.id)
        .not('published_at', 'is', null)
        .single();

    if (!issue) {
        notFound();
    }

    // Process articles
    const articles = issue.submission_versions?.map((sv: any) => ({
        id: sv.submission.id,
        title: sv.submission.title,
        authors: sv.submission.metadata?.authors || [],
        version: sv.version
    })) || [];

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <nav className="mb-8" aria-label="Breadcrumb">
                <ol role="list" className="flex items-center space-x-4">
                    <li>
                        <Link href={`/journals/${path}`} className="text-gray-500 hover:text-gray-700">
                            Home
                        </Link>
                    </li>
                    <li>
                        <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                        </svg>
                    </li>
                    <li>
                        <Link href={`/journals/${path}/issue/archive`} className="text-gray-500 hover:text-gray-700">
                            Archives
                        </Link>
                    </li>
                    <li>
                        <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                        </svg>
                    </li>
                    <li>
                        <span className="text-gray-900 font-medium" aria-current="page">
                            {issue.title || `Vol ${issue.volume} No ${issue.number} (${issue.year})`}
                        </span>
                    </li>
                </ol>
            </nav>

            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                        {issue.title || `Vol ${issue.volume} No ${issue.number} (${issue.year})`}
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Published: {format(new Date(issue.published_at), 'MMMM d, yyyy')}
                    </p>

                    {issue.cover_image && (
                        <div className="mb-8">
                            <img src={issue.cover_image} alt="Issue Cover" className="rounded-lg shadow-md max-w-md" />
                        </div>
                    )}

                    {issue.description && (
                        <div className="prose prose-lg text-gray-500 mb-12">
                            <p>{issue.description}</p>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Table of Contents</h2>

                        <div className="space-y-6">
                            {articles.length > 0 ? (
                                articles.map((article: any) => (
                                    <div key={article.id} className="border-b border-gray-100 pb-4 last:border-0">
                                        <h3 className="text-xl font-medium text-gray-900">
                                            <Link href={`/journals/${path}/article/${article.id}`} className="hover:text-[#006798]">
                                                {article.title}
                                            </Link>
                                        </h3>
                                        <div className="text-gray-600 mt-2">
                                            {article.authors.map((a: any) => `${a.givenName} ${a.familyName}`).join(", ")}
                                        </div>
                                        <div className="mt-3">
                                            <Link
                                                href={`/journals/${path}/article/${article.id}`}
                                                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                PDF
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No articles in this issue.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
