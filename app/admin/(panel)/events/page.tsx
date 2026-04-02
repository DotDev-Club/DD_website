"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Event {
  _id: string;
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  bannerImage: string;
  registrationLink: string;
  status: string;
  venue: string;
}

const EMPTY: Omit<Event, "_id" | "id"> = {
  title: "", description: "", date: "", type: "Workshop",
  bannerImage: "", registrationLink: "", status: "upcoming", venue: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (e: Event) => { setEditing(e); setForm({ title: e.title, description: e.description, date: e.date, type: e.type, bannerImage: e.bannerImage, registrationLink: e.registrationLink, status: e.status, venue: e.venue }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.type || !form.bannerImage) {
      toast.error("Title, date, type and banner image are required");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/events?id=${editing.id}` : "/api/events";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      toast.success(editing ? "Event updated" : "Event created");
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event: Event) => {
    if (!confirm(`Delete "${event.title}"?`)) return;
    try {
      const res = await fetch(`/api/events?id=${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Event deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const TYPE_COLORS: Record<string, string> = {
    Hackathon: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    Workshop: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    Talk: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    "Product Sprint": "text-green-400 bg-green-500/10 border-green-500/20",
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-green-500 mb-1">// manage</p>
          <h2 className="text-xl font-bold text-white">Events</h2>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-mono text-sm font-semibold rounded-lg hover:bg-green-400 transition-colors"
        >
          <Plus size={14} />
          New Event
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-12 bg-[#111] rounded-lg animate-pulse" />)}
        </div>
      ) : events.length === 0 ? (
        <p className="font-mono text-sm text-gray-600 py-12 text-center">// no events yet</p>
      ) : (
        <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 font-mono text-xs text-gray-600">Title</th>
                <th className="px-4 py-3 font-mono text-xs text-gray-600 hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 font-mono text-xs text-gray-600 hidden md:table-cell">Type</th>
                <th className="px-4 py-3 font-mono text-xs text-gray-600 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 font-mono text-xs text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {events.map((ev) => (
                <tr key={ev._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-white font-medium truncate max-w-[180px]">{ev.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell font-mono text-xs">
                    {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${TYPE_COLORS[ev.type] ?? ""}`}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`font-mono text-[10px] capitalize ${ev.status === "upcoming" ? "text-green-400" : ev.status === "ongoing" ? "text-yellow-400" : "text-gray-600"}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(ev)} className="p-1.5 text-gray-600 hover:text-blue-400 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(ev)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="font-mono text-sm font-semibold text-white">
                {editing ? "Edit Event" : "New Event"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="title *" value={form.title} onChange={(v) => set("title", v)} placeholder="Event title" />
              <Field label="date *" type="date" value={form.date} onChange={(v) => set("date", v)} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-1.5">type *</label>
                  <select value={form.type} onChange={(e) => set("type", e.target.value)} className={INPUT}>
                    {["Hackathon", "Workshop", "Talk", "Product Sprint"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-1.5">status</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className={INPUT}>
                    {["upcoming", "ongoing", "past"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <Field label="venue" value={form.venue} onChange={(v) => set("venue", v)} placeholder="e.g. Innovation Lab, REVA" />
              <Field label="registration link" value={form.registrationLink} onChange={(v) => set("registrationLink", v)} placeholder="https://forms.gle/..." />
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Event description..." className={`${INPUT} resize-none`} />
              </div>
              <ImageUpload value={form.bannerImage} onChange={(v) => set("bannerImage", v)} folder="events" label="banner image *" />
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-800 text-gray-400 font-mono text-sm rounded-lg hover:border-gray-600 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-green-500 text-black font-mono text-sm font-semibold rounded-lg hover:bg-green-400 disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT = "w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:border-green-500/50 focus:outline-none transition-colors";

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block font-mono text-xs text-gray-500 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={INPUT} />
    </div>
  );
}
