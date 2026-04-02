"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, FolderKanban, Users, FileText, ImageIcon, RefreshCw, ArrowRight } from "lucide-react";

interface Stats {
  events: number;
  projects: number;
  members: number;
  pendingApplications: number;
  galleryImages: number;
  activeCycles: number;
}

const quickLinks = [
  { href: "/admin/events",       label: "Manage Events",    icon: CalendarDays,  color: "text-purple-400" },
  { href: "/admin/projects",     label: "Manage Projects",  icon: FolderKanban,  color: "text-blue-400" },
  { href: "/admin/members",      label: "Manage Members",   icon: Users,         color: "text-green-400" },
  { href: "/admin/applications", label: "Applications",     icon: FileText,      color: "text-yellow-400" },
  { href: "/admin/gallery",      label: "Gallery",          icon: ImageIcon,     color: "text-pink-400" },
  { href: "/admin/cycles",       label: "Product Cycles",   icon: RefreshCw,     color: "text-cyan-400" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    events: 0, projects: 0, members: 0,
    pendingApplications: 0, galleryImages: 0, activeCycles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/members").then((r) => r.json()),
      fetch("/api/applications").then((r) => r.json()),
      fetch("/api/gallery").then((r) => r.json()),
      fetch("/api/cycles").then((r) => r.json()),
    ]).then(([events, projects, members, apps, gallery, cycles]) => {
      setStats({
        events: events.events?.length ?? 0,
        projects: projects.projects?.length ?? 0,
        members: members.members?.length ?? 0,
        pendingApplications: apps.applications?.filter((a: { status: string }) => a.status === "pending").length ?? 0,
        galleryImages: gallery.images?.length ?? 0,
        activeCycles: cycles.cycles?.filter((c: { status: string }) => c.status === "active").length ?? 0,
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Events",        value: stats.events,             icon: CalendarDays, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Total Projects",      value: stats.projects,           icon: FolderKanban, color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Team Members",        value: stats.members,            icon: Users,        color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
    { label: "Pending Applications",value: stats.pendingApplications,icon: FileText,     color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { label: "Gallery Images",      value: stats.galleryImages,      icon: ImageIcon,    color: "text-pink-400",   bg: "bg-pink-500/10 border-pink-500/20" },
    { label: "Active Cycles",       value: stats.activeCycles,       icon: RefreshCw,    color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="font-mono text-xs text-green-500 mb-1">// overview</p>
        <h2 className="text-xl font-bold text-white">Welcome back 👋</h2>
        <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with .Dev</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-xl border p-5 ${bg}`}>
            <div className="flex items-center justify-between mb-3">
              <Icon size={16} className={color} />
              {loading ? (
                <div className="w-8 h-6 bg-gray-800 rounded animate-pulse" />
              ) : (
                <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
              )}
            </div>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <p className="font-mono text-xs text-gray-600 mb-4">// quick access</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between p-4 bg-[#111] border border-gray-800 rounded-xl hover:border-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={color} />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
              </div>
              <ArrowRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
