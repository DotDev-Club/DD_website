"use client";

import { useEffect, useState } from "react";
import MemberCard from "@/components/MemberCard";

type Category = "Core Team" | "Faculty Advisor" | "Mentor";
const CATEGORIES: Category[] = ["Core Team", "Faculty Advisor", "Mentor"];

interface Member {
  id: string;
  name: string;
  role: string;
  category: string;
  photo: string;
  batch: string;
  linkedin?: string;
  github?: string;
  bio?: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data) => setMembers(data.members ?? []))
      .finally(() => setLoading(false));
  }, []);

  const byCategory = (cat: Category) => members.filter((m) => m.category === cat);

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-green-500 text-sm mb-2">// the people behind .Dev</p>
        <h1 className="text-4xl font-bold text-white">
          <span className="font-mono">.team {"{"}</span>
        </h1>
        <p className="font-mono text-gray-500 text-sm mt-1">{"}"}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-52 bg-[#111] border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        CATEGORIES.map((cat) => {
          const group = byCategory(cat);
          if (group.length === 0) return null;
          return (
            <div key={cat} className="mb-14">
              <h2 className="font-mono text-xs text-green-500 uppercase tracking-widest mb-6">
                // {cat.toLowerCase()}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {group.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
