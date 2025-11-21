"use client";

import type { ReactNode } from "react";

// Manager layout - similar to admin layout
type Props = {
  children: ReactNode;
};

export default function ManagerLayout({ children }: Props) {
  return <>{children}</>;
}
export const dynamic = "force-dynamic";

