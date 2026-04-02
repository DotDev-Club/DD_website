"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Member {
  _id: string;
  id: string;
  name: string;
  role: string;
  category: string;
  photo: string;
  linkedin: string;
  github: string;
  batch: string;
  bio: string;
}

const EMPTY: Omit<Member, "_id" | "id"> = {
  name: "", role: "", category: "Core Team",
  photo: "", linkedin: "", github: "", batch: "", bio: "",
};

const INPUT = "w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:border-green-500/50 focus:outline-none transition-colors";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/members").then(r => r.json()).then(d => setMembers(d.members ?? [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({ name: m.name, role: m.role, category: m.category, photo: m.photo, linkedin: m.linkedin, github: m.github, batch: m.batch, bio: m.bio });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.category || !form.photo || !form.batch) {
      toast.error("Name, role, category, photo and batch are required"); return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/members?id=${editing.id}` : "/api/members";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success(editing ? "Member updated" : "Member added");
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: Member) => {
    if (!confirm(`Remove "${m.name}"?`)) return;
    try {
      const res = await fetch(`/api/members?id=${m.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Member removed");
      load();
    } catch { toast.error("Delete failed"); }
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const CATEGORY_GROUPS = ["Core Team", "Faculty Advisor", "Mentor"];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-green-500 mb-1">// manage</p>
          <h2 className="text-xl font-bold text-white">Members</h2>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-mono text-sm font-semibold rounded-lg hover:bg-green-400 transition-colors">
          <Plus size={14} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-[#111] rounded-xl animate-pulse" />)}
        </div>
      ) : members.length === 0 ? (
        <p className="font-mono text-sm text-gray-600 py-12 text-center">// no members yet</p>
      ) : (
        CATEGORY_GROUPS.map(cat => {
          const group = members.filter(m => m.category === cat);
          if (!group.length) return null;
          return (
            <div key={cat} className="mb-10">
              <p className="font-mono text-xs text-green-600 uppercase tracking-widest mb-4">// {cat.toLowerCase()}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.map(m => (
                  <div key={m._id} className="bg-[#111] border border-gray-800 rounded-xl p-4 text-center group hover:border-gray-700 transition-colors">
                    <div className="relative mx-auto w-14 h-14 rounded-full overflow-hidden border border-gray-700 mb-3">
                      <Image src={m.photo} alt={m.name} fill className="object-cover" />
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{m.name}</p>
                    <p className="text-[10px] text-green-500 font-mono mt-0.5 truncate">{m.role}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{m.batch}</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <button onClick={() => openEdit(m)} className="p-1 text-gray-600 hover:text-blue-400 transition-colors"><Pencil size={12} /></button>
                      <button onClick={() => handleDelete(m)} className="p-1 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="font-mono text-sm font-semibold text-white">{editing ? "Edit Member" : "Add Member"}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="name *" value={form.name} onChange={v => set("name", v)} placeholder="Full name" />
                <Field label="role *" value={form.role} onChange={v => set("role", v)} placeholder="e.g. President" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-1.5">category *</label>
                  <select value={form.category} onChange={e => set("category", e.target.value)} className={INPUT}>
                    {["Core Team", "Faculty Advisor", "Mentor"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <Field label="batch *" value={form.batch} onChange={v => set("batch", v)} placeholder="2022-2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="linkedin" value={form.linkedin} onChange={v => set("linkedin", v)} placeholder="https://linkedin.com/in/..." />
                <Field label="github" value={form.github} onChange={v => set("github", v)} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">bio</label>
                <textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={2} placeholder="Short bio..." className={`${INPUT} resize-none`} />
              </div>
              <ImageUpload value={form.photo} onChange={v => set("photo", v)} folder="members" label="photo *" />
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
