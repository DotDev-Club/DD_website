"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarDays,
  FolderKanban,
  Users,
  FileText,
  ImageIcon,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/events",       label: "Events",       icon: CalendarDays },
  { href: "/admin/projects",     label: "Projects",     icon: FolderKanban },
  { href: "/admin/members",      label: "Members",      icon: Users },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/gallery",      label: "Gallery",      icon: ImageIcon },
  { href: "/admin/cycles",       label: "Cycles",       icon: RefreshCw },
  { href: "/admin/admins",       label: "Admins",       icon: ShieldCheck },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-[#0d0d0d] border-r border-gray-900 z-30 flex flex-col transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-900">
          <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-green-500/40 shrink-0">
              <Image
                src="/club_logo.jpeg"
                alt=".Dev"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-white leading-none">.Dev</p>
              <p className="font-mono text-[10px] text-gray-600">Admin Panel</p>
            </div>
          </Link>
          <button onClick={onClose} className="md:hidden text-gray-600 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={15} className={active ? "text-green-400" : ""} />
                <span className={active ? "font-medium" : ""}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-900">
          <Link
            href="/"
            target="_blank"
            className="font-mono text-[10px] text-gray-700 hover:text-gray-400 transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
