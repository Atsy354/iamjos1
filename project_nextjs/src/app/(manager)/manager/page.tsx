'use client'

import Link from "next/link";
import { withAuth } from '@/lib/auth-client'

const MANAGER_LINKS = [
  {
    label: "Hosted Journals",
    href: "/admin/site-management/hosted-journals",
    description: "Manage hosted journals",
  },
];

function ManagerLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar - Light Gray */}
      <div className="bg-[#e5e5e5] px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Journal Manager
        </h1>
      </div>

      {/* Content Panel - OJS 3.3 Style */}
      <div className="px-6 py-8">
        {/* Journal Management Section */}
        <h2 className="text-2xl font-bold mb-5 text-[#002C40]">
          Journal Management
        </h2>
        <ul className="list-none p-0 m-0 mb-12">
          {MANAGER_LINKS.map((link) => (
            <li key={link.href} className="mb-3.5">
              <Link 
                href={link.href} 
                className="text-[#006798] underline text-[0.9375rem] hover:no-underline"
              >
                {link.label}
              </Link>
              {link.description && (
                <p className="text-sm text-gray-500 mt-1 ml-0">
                  {link.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withAuth(ManagerLandingPage, 'manager')