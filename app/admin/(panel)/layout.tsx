"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/admin/dashboard":    "Dashboard",
  "/admin/events":       "Events",
  "/admin/projects":     "Projects",
  "/admin/members":      "Members",
  "/admin/applications": "Applications",
  "/admin/gallery":      "Gallery",
  "/admin/cycles":       "Product Cycles",
};

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Admin";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset for sidebar on desktop */}
      <div className="flex-1 flex flex-col md:ml-56 min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} pageTitle={title} />
        <main className="flex-1 p-5 sm:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
