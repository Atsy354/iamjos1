import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/site-header";

type Props = {
    children: ReactNode;
};

import { getNavigationMenus } from "@/features/navigation/actions";

export default async function SiteLayout({ children }: Props) {
    const menus = await getNavigationMenus();

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <SiteHeader menus={menus} />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t border-gray-200 bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
                    <p>&copy; {new Date().getFullYear()} Open Journal Systems. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
