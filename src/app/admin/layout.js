"use client";

import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isPreview = pathname === "/admin/builder/preview";

  if (isPreview) {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-content-card animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
