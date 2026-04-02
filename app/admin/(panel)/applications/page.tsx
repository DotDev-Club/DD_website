"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";

interface Application {
  _id: string;
  name: string;
  email: string;
  year: string;
  branch: string;
  whyJoin: string;
  skills: string;
  submittedAt: string;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  reviewed:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  accepted:  "bg-green-500/10 text-green-400 border-green-500/20",
  rejected:  "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_OPTIONS = ["pending", "reviewed", "accepted", "rejected"];

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const load = () => {
    setLoading(true);
    fetch("/api/applications").then(r => r.json()).then(d => setApps(d.applications ?? [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Marked as ${status}`);
      setApps(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = filterStatus === "all" ? apps : apps.filter(a => a.status === filterStatus);
  const counts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {} as Record<string, number>);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="font-mono text-xs text-green-500 mb-1">// review</p>
        <h2 className="text-xl font-bold text-white">Join Applications</h2>
        <p className="text-sm text-gray-500 mt-1">{apps.length} total · {counts.pending ?? 0} pending</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full font-mono text-xs border transition-colors ${
              filterStatus === s
                ? "bg-green-500 text-black border-green-500"
                : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600"
            }`}
          >
            {s === "all" ? `All (${apps.length})` : `${s} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-[#111] rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <p className="font-mono text-sm text-gray-600 py-12 text-center">// no applications</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(app => (
            <div key={app._id} className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
              {/* Row */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(expanded === app._id ? null : app._id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <ChevronDown
                    size={14}
                    className={`text-gray-600 shrink-0 transition-transform ${expanded === app._id ? "rotate-180" : ""}`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{app.name}</p>
                    <p className="text-xs text-gray-600 font-mono truncate">{app.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="hidden sm:block text-xs text-gray-600">{app.year} · {app.branch}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${STATUS_STYLES[app.status] ?? ""}`}>
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Expanded */}
              {expanded === app._id && (
                <div className="px-5 pb-5 border-t border-gray-900">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="font-mono text-[10px] text-gray-600 mb-1">Why join .Dev</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{app.whyJoin}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-gray-600 mb-1">Skills &amp; Interests</p>
                      <p className="text-sm text-gray-300">{app.skills}</p>
                      <p className="font-mono text-[10px] text-gray-600 mt-3 mb-1">Submitted</p>
                      <p className="text-xs text-gray-500">{new Date(app.submittedAt).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {STATUS_OPTIONS.filter(s => s !== app.status).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(app._id, s)}
                        className={`px-3 py-1.5 rounded font-mono text-xs border transition-colors ${STATUS_STYLES[s] ?? ""} hover:opacity-80`}
                      >
                        Mark as {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
