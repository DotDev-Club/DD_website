"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Project {
  _id: string;
  id: string;
  name: string;
  description: string;
  techStack: string[];
  domain: string;
  coverImage: string;
  liveUrl: string;
  githubUrl: string;
  teamMembers: string[];
  year: string;
  featured: boolean;
}

const EMPTY = {
  name: "", description: "", techStack: "", domain: "Web",
  coverImage: "", liveUrl: "", githubUrl: "", teamMembers: "", year: new Date().getFullYear().toString(), featured: false,
};

const INPUT = "w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:border-green-500/50 focus:outline-none transition-colors";
const DOMAINS = ["Web", "Mobile", "AI/ML", "Blockchain", "Open Source"];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/projects").then(r => r.json()).then(d => setProjects(d.projects ?? [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, techStack: p.techStack.join(", "), domain: p.domain, coverImage: p.coverImage, liveUrl: p.liveUrl, githubUrl: p.githubUrl, teamMembers: p.teamMembers.join(", "), year: p.year, featured: p.featured });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.domain || !form.coverImage || !form.year) {
      toast.error("Name, description, domain, cover image and year are required"); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(",").map(s => s.trim()).filter(Boolean),
        teamMembers: form.teamMembers.split(",").map(s => s.trim()).filter(Boolean),
      };
      const url = editing ? `/api/projects?id=${editing.id}` : "/api/projects";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success(editing ? "Project updated" : "Project added");
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Project) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      const res = await fetch(`/api/projects?id=${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Project deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const DOMAIN_COLORS: Record<string, string> = {
    Web: "text-blue-400", Mobile: "text-purple-400", "AI/ML": "text-orange-400",
    Blockchain: "text-yellow-400", "Open Source": "text-green-400",
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-green-500 mb-1">// manage</p>
          <h2 className="text-xl font-bold text-white">Projects</h2>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-mono text-sm font-semibold rounded-lg hover:bg-green-400 transition-colors">
          <Plus size={14} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-[#111] rounded-lg animate-pulse" />)}</div>
      ) : projects.length === 0 ? (
        <p className="font-mono text-sm text-gray-600 py-12 text-center">// no projects yet</p>
      ) : (
        <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 font-mono text-xs text-gray-600">Name</th>
                <th className="px-4 py-3 font-mono text-xs text-gray-600 hidden sm:table-cell">Domain</th>
                <th className="px-4 py-3 font-mono text-xs text-gray-600 hidden md:table-cell">Year</th>
                <th className="px-4 py-3 font-mono text-xs text-gray-600 hidden md:table-cell">Featured</th>
                <th className="px-4 py-3 font-mono text-xs text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {projects.map(p => (
                <tr key={p._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-white font-medium truncate max-w-[180px]">{p.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`font-mono text-xs ${DOMAIN_COLORS[p.domain] ?? "text-gray-400"}`}>{p.domain}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs hidden md:table-cell">{p.year}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {p.featured && <Star size={12} className="text-yellow-400" />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-600 hover:text-blue-400 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(p)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="font-mono text-sm font-semibold text-white">{editing ? "Edit Project" : "New Project"}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="name *" value={form.name} onChange={v => set("name", v)} placeholder="Project name" />
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">description *</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="What does it do?" className={`${INPUT} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-1.5">domain *</label>
                  <select value={form.domain} onChange={e => set("domain", e.target.value)} className={INPUT}>
                    {DOMAINS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <Field label="year *" value={form.year} onChange={v => set("year", v)} placeholder="2025" />
              </div>
              <Field label="tech stack (comma-separated)" value={form.techStack} onChange={v => set("techStack", v)} placeholder="React, Node.js, MongoDB" />
              <Field label="team members (comma-separated)" value={form.teamMembers} onChange={v => set("teamMembers", v)} placeholder="Arjun Sharma, Priya Nair" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="live URL" value={form.liveUrl} onChange={v => set("liveUrl", v)} placeholder="https://..." />
                <Field label="github URL" value={form.githubUrl} onChange={v => set("githubUrl", v)} placeholder="https://github.com/..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0a] accent-green-500" />
                <span className="font-mono text-xs text-gray-400">Featured project</span>
              </label>
              <ImageUpload value={form.coverImage} onChange={v => set("coverImage", v)} folder="projects" label="cover image *" />
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-800 text-gray-400 font-mono text-sm rounded-lg hover:border-gray-600 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-green-500 text-black font-mono text-sm font-semibold rounded-lg hover:bg-green-400 disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const INPUT = "w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:border-green-500/50 focus:outline-none transition-colors";
  return (
    <div>
      <label className="block font-mono text-xs text-gray-500 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={INPUT} />
    </div>
  );
}
