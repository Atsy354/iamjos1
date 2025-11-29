import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function SiteIndex() {
    const supabase = await createSupabaseServerClient();
    const { data: journals } = await supabase
        .from('journals')
        .select('*')
        .eq('enabled', true)
        .order('name');

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Journals
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
                    Browse our collection of peer-reviewed journals.
                </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {journals?.map((journal) => (
                    <div key={journal.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg ring-1 ring-gray-200 transition hover:shadow-xl">
                        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                            <div className="flex-1">
                                <Link href={`/journals/${journal.path}`} className="mt-2 block">
                                    <p className="text-xl font-semibold text-gray-900">{journal.name}</p>
                                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                        {journal.description || "No description available."}
                                    </p>
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center">
                                <div className="flex-shrink-0">
                                    <Link href={`/journals/${journal.path}`} className="text-base font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]">
                                        View Journal <span aria-hidden="true">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {(!journals || journals.length === 0) && (
                    <div className="col-span-full text-center text-gray-500">
                        No journals available at the moment.
                    </div>
                )}
            </div>
        </div>
    );
}
