"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Zap } from "lucide-react";

interface Cycle {
  _id: string;
  id: string;
  name: string;
  description: string;
  week: number;
  squad: string[];
  githubRepo: string;
  startDate: string;
  endDate: string;
  industryMentor: string;
  status: string;
  outcome: string;
  dateCreated: string;
}

const EMPTY = {
  name: "", description: "", week: 1, squad: "",
  githubRepo: "", startDate: "", endDate: "", industryMentor: "",
  status: "upcoming", outcome: "",
};

const INPUT = "w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:border-green-500/50 focus:outline-none transition-colors";

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-green-500/10 text-green-400 border-green-500/20",
  upcoming:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function AdminCyclesPage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cycle | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/cycles").then(r => r.json()).then(d => setCycles(d.cycles ?? [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (c: Cycle) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, week: c.week, squad: c.squad.join(", "), githubRepo: c.githubRepo, startDate: c.startDate, endDate: c.endDate, industryMentor: c.industryMentor, status: c.status, outcome: c.outcome });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.startDate) { toast.error("Name and start date are required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, squad: form.squad.split(",").map(s => s.trim()).filter(Boolean), week: Number(form.week) };
      const url = editing ? `/api/cycles?id=${editing.id}` : "/api/cycles";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success(editing ? "Cycle updated" : "Cycle created");
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Cycle) => {
    if (!confirm(`Delete cycle "${c.name}"?`)) return;
    try {
      const res = await fetch(`/api/cycles?id=${c.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Cycle deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const active = cycles.filter(c => c.status === "active");
  const others = cycles.filter(c => c.status !== "active");

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-green-500 mb-1">// manage</p>
          <h2 className="text-xl font-bold text-white">Product Cycles</h2>
          <p className="text-sm text-gray-500 mt-1">{active.length} active · {cycles.length} total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-mono text-sm font-semibold rounded-lg hover:bg-green-400 transition-colors">
          <Plus size={14} /> New Cycle
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-28 bg-[#111] rounded-xl animate-pulse" />)}</div>
      ) : cycles.length === 0 ? (
        <p className="font-mono text-sm text-gray-600 py-12 text-center">// no cycles yet</p>
      ) : (
        <>
          {active.length > 0 && (
            <div className="mb-8">
              <p className="font-mono text-xs text-green-600 mb-4">// active cycle</p>
              {active.map(c => <CycleCard key={c._id} cycle={c} onEdit={openEdit} onDelete={handleDelete} />)}
            </div>
          )}
          {others.length > 0 && (
            <div>
              <p className="font-mono text-xs text-gray-600 mb-4">// all cycles</p>
              <div className="space-y-3">
                {others.map(c => <CycleCard key={c._id} cycle={c} onEdit={openEdit} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="font-mono text-sm font-semibold text-white">{editing ? "Edit Cycle" : "New Cycle"}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="cycle name *" value={form.name} onChange={v => set("name", v)} placeholder="e.g. CampusEats v2" />
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">description</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="What is this cycle building?" className={`${INPUT} resize-none`} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-1.5">week</label>
                  <input type="number" min={1} max={12} value={form.week} onChange={e => set("week", Number(e.target.value))} className={INPUT} />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-1.5">start date *</label>
                  <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-1.5">end date</label>
                  <input type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} className={INPUT} />
                </div>
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">status</label>
                <select value={form.status} onChange={e => set("status", e.target.value)} className={INPUT}>
                  {["upcoming", "active", "completed"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Field label="squad members (comma-separated)" value={form.squad} onChange={v => set("squad", v)} placeholder="Arjun Sharma, Priya Nair" />
              <Field label="industry mentor" value={form.industryMentor} onChange={v => set("industryMentor", v)} placeholder="Mentor name" />
              <Field label="github repo" value={form.githubRepo} onChange={v => set("githubRepo", v)} placeholder="https://github.com/..." />
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">outcome / result</label>
                <textarea value={form.outcome} onChange={e => set("outcome", e.target.value)} rows={2} placeholder="What was built / achieved?" className={`${INPUT} resize-none`} />
              </div>
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

function CycleCard({ cycle, onEdit, onDelete }: { cycle: Cycle; onEdit: (c: Cycle) => void; onDelete: (c: Cycle) => void }) {
  const STATUS_STYLES: Record<string, string> = {
    active:    "bg-green-500/10 text-green-400 border-green-500/20",
    upcoming:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <div className="bg-[#111] border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Zap size={14} className="text-green-500 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-white">{cycle.name}</p>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${STATUS_STYLES[cycle.status] ?? ""}`}>{cycle.status}</span>
              <span className="text-[10px] font-mono text-gray-600">Week {cycle.week}</span>
            </div>
            {cycle.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cycle.description}</p>}
            {cycle.squad.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">Squad: {cycle.squad.join(", ")}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => onEdit(cycle)} className="p-1.5 text-gray-600 hover:text-blue-400 transition-colors"><Pencil size={13} /></button>
          <button onClick={() => onDelete(cycle)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>
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
