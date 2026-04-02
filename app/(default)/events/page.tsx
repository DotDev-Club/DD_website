"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";

type EventType = "All" | "Hackathon" | "Workshop" | "Talk" | "Product Sprint";

const filters: EventType[] = ["All", "Hackathon", "Workshop", "Talk", "Product Sprint"];

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  bannerImage: string;
  registrationLink?: string;
  status: string;
  venue?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EventType>("All");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data.events ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? events : events.filter((e) => e.type === filter);

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-green-500 text-sm mb-2">// what&apos;s happening</p>
        <h1 className="text-4xl font-bold text-white mb-3">
          <span className="font-mono">.events {"{"}</span>
        </h1>
        <p className="text-gray-500 font-mono text-sm">{"}"}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full font-mono text-xs border transition-colors ${
              filter === f
                ? "bg-green-500 text-black border-green-500"
                : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-[#111] border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-mono text-gray-600">// no events found</p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {filtered.some((e) => e.status === "upcoming" || e.status === "ongoing") && (
            <div className="mb-12">
              <h2 className="font-mono text-sm text-green-600 mb-5">// upcoming</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered
                  .filter((e) => e.status === "upcoming" || e.status === "ongoing")
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            </div>
          )}

          {/* Past */}
          {filtered.some((e) => e.status === "past") && (
            <div>
              <h2 className="font-mono text-sm text-gray-600 mb-5">// past</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered
                  .filter((e) => e.status === "past")
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
