"use client";

import { useEffect, useState } from "react";
import WorkshopCard from "@/components/WorkshopCard";

interface Workshop {
  id: string;
  title: string;
  facilitator: string;
  date: string;
  duration: string;
  description: string;
  resourcesLink?: string;
  tags?: string[];
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/workshops")
      .then((r) => r.json())
      .then((data) => setWorkshops(data.workshops ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = workshops.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.facilitator.toLowerCase().includes(search.toLowerCase()) ||
      w.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-blue-500 text-sm mb-2">// knowledge sharing</p>
        <h1 className="text-4xl font-bold text-white mb-1">
          <span className="font-mono">&lt;Workshops /&gt;</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Hands-on sessions conducted by .Dev members and industry mentors.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search workshops, topics, or facilitators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:border-blue-500/50 focus:outline-none transition-colors"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-[#111] border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-mono text-gray-600">// no workshops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      )}
    </div>
  );
}
