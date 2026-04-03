"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, UserPlus, ShieldCheck } from "lucide-react";

interface Admin {
  _id: string;
  email: string;
  addedAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  async function load() {
    const res = await fetch("/api/admins");
    const data = await res.json();
    setAdmins(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to add"); return; }
      toast.success(`${email} added as admin`);
      setEmail("");
      load();
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(adminEmail: string) {
    if (!confirm(`Remove ${adminEmail} from admins?`)) return;
    const res = await fetch(`/api/admins?email=${encodeURIComponent(adminEmail)}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error || "Failed to remove"); return; }
    toast.success("Removed");
    load();
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Add admin */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
        <h2 className="font-mono text-sm text-green-400 mb-4 flex items-center gap-2">
          <UserPlus size={15} /> Add Admin
        </h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-700 focus:border-green-500/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 bg-green-500 text-black font-mono text-sm font-semibold rounded-lg hover:bg-green-400 disabled:opacity-50 transition-colors"
          >
            {adding ? "Adding…" : "Add"}
          </button>
        </form>
        <p className="mt-3 text-xs text-gray-600 font-mono">
          They'll receive a magic link email when they sign in at /admin.
        </p>
      </div>

      {/* Current admins */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
        <h2 className="font-mono text-sm text-green-400 mb-4 flex items-center gap-2">
          <ShieldCheck size={15} /> Current Admins
        </h2>
        {loading ? (
          <p className="text-gray-600 text-sm font-mono">Loading…</p>
        ) : (
          <ul className="space-y-2">
            {admins.map((a) => (
              <li key={a._id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#0a0a0a] border border-gray-900">
                <div>
                  <p className="text-sm text-white font-mono">{a.email}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Added {new Date(a.addedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(a.email)}
                  className="text-gray-700 hover:text-red-400 transition-colors p-1"
                  title="Remove admin"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
