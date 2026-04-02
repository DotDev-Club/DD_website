"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
  role: string;
  photo: string;
  category: string;
}

export default function TeamPreview() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data) =>
        setMembers(
          (data.members ?? [])
            .filter((m: Member) => m.category === "Core Team")
            .slice(0, 6)
        )
      );
  }, []);

  if (members.length === 0) return null;

  return (
    <section className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono text-green-500 text-sm mb-2">// the people</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="font-mono text-green-400">&lt;Team /&gt;</span>
          </h2>
        </div>
        <Link
          href="/team"
          className="font-mono text-xs text-green-500 hover:text-green-300 transition-colors border border-green-500/30 hover:border-green-400/50 px-4 py-2 rounded"
        >
          View More →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {members.map((member) => (
          <div key={member.id} className="group text-center">
            <div className="relative mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-green-500/40 transition-colors mb-3">
              <Image
                src={member.photo || "/placeholder-member.jpg"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm font-semibold text-white truncate">{member.name}</p>
            <p className="text-[11px] font-mono text-green-500 truncate">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
