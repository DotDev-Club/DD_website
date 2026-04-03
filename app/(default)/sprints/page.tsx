"use client";

import { useEffect, useState } from "react";
import { Star, GitFork, CircleDot, Clock, Github, Users, GraduationCap } from "lucide-react";

interface GitHubStats {
  stars: number;
  forks: number;
  openIssues: number;
  lastPush: string;
}

interface Cycle {
  id: string;
  name: string;
  description: string;
  week: number;
  squad: string[];
  githubRepo: string;
  startDate: string;
  endDate: string;
  industryMentor: string;
  status: "active" | "completed" | "upcoming";
  outcome: string;
  github: GitHubStats | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function WeekBar({ week }: { week: number }) {
  return (
    <div>
      <div className="flex gap-0.5 mb-1.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i < week - 1
                ? "bg-green-500"
                : i === week - 1
                ? "bg-green-400 animate-pulse"
                : "bg-gray-800"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-gray-600">
        <span>Week {week} of 12</span>
        <span>{Math.round((week / 12) * 100)}% complete</span>
      </div>
    </div>
  );
}

function ActiveCard({ cycle }: { cycle: Cycle }) {
  return (
    <div className="bg-[#111] border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] text-green-500 uppercase tracking-widest">Active Sprint</span>
          </div>
          <h3 className="text-lg font-bold text-white">{cycle.name}</h3>
        </div>
        {cycle.githubRepo && (
          <a
            href={cycle.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-gray-800 rounded-lg text-gray-600 hover:text-white hover:border-gray-600 transition-colors shrink-0"
          >
            <Github size={14} />
          </a>
        )}
      </div>

      {/* Week progress */}
      <div className="mb-5">
        <WeekBar week={cycle.week} />
      </div>

      {/* Description */}
      {cycle.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cycle.description}</p>
      )}

      {/* Squad */}
      {cycle.squad?.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Users size={11} className="text-gray-600" />
            <span className="font-mono text-[10px] text-gray-600">squad</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cycle.squad.map((member) => (
              <span key={member} className="font-mono text-[10px] px-2 py-0.5 bg-gray-900 border border-gray-800 rounded text-gray-400">
                {member}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mentor */}
      {cycle.industryMentor && (
        <div className="flex items-center gap-1.5 mb-4">
          <GraduationCap size={11} className="text-gray-600" />
          <span className="font-mono text-[10px] text-gray-600">mentor:</span>
          <span className="font-mono text-[10px] text-gray-400">{cycle.industryMentor}</span>
        </div>
      )}

      {/* GitHub stats */}
      {cycle.github && (
        <div className="flex items-center gap-4 pt-3 border-t border-gray-800/60">
          <span className="flex items-center gap-1 font-mono text-[10px] text-gray-600">
            <Star size={10} /> {cycle.github.stars}
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-gray-600">
            <GitFork size={10} /> {cycle.github.forks}
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-gray-600">
            <CircleDot size={10} /> {cycle.github.openIssues} open
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-gray-600 ml-auto">
            <Clock size={10} /> {timeAgo(cycle.github.lastPush)}
          </span>
        </div>
      )}
    </div>
  );
}

function CycleCard({ cycle }: { cycle: Cycle }) {
  const isCompleted = cycle.status === "completed";
  return (
    <div className={`rounded-xl p-5 border transition-colors ${
      isCompleted
        ? "bg-[#0d0d0d] border-gray-900 hover:border-gray-800"
        : "bg-[#111] border-gray-800 hover:border-gray-700"
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-white text-sm">{cycle.name}</h3>
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border shrink-0 ${
          isCompleted
            ? "text-gray-600 border-gray-800"
            : "text-blue-400 border-blue-500/20"
        }`}>
          {cycle.status}
        </span>
      </div>

      {cycle.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{cycle.description}</p>
      )}

      {!isCompleted && cycle.startDate && (
        <p className="font-mono text-[10px] text-gray-700 mb-3">
          starts {new Date(cycle.startDate).toLocaleDateString()}
        </p>
      )}

      {cycle.squad?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {cycle.squad.slice(0, 4).map((m) => (
            <span key={m} className="font-mono text-[10px] px-1.5 py-0.5 bg-gray-900 border border-gray-900 rounded text-gray-600">
              {m}
            </span>
          ))}
          {cycle.squad.length > 4 && (
            <span className="font-mono text-[10px] text-gray-700">+{cycle.squad.length - 4} more</span>
          )}
        </div>
      )}

      {isCompleted && cycle.outcome && (
        <div className="mt-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
          <p className="font-mono text-[10px] text-green-700 mb-1">// outcome</p>
          <p className="text-xs text-gray-500">{cycle.outcome}</p>
        </div>
      )}
    </div>
  );
}

export default function SprintsPage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sprints")
      .then((r) => r.json())
      .then((data) => setCycles(data.cycles ?? []))
      .finally(() => setLoading(false));
  }, []);

  const active = cycles.filter((c) => c.status === "active");
  const upcoming = cycles.filter((c) => c.status === "upcoming");
  const completed = cycles.filter((c) => c.status === "completed");

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-green-500 text-sm mb-2">// 12-week build cycles</p>
        <h1 className="text-4xl font-bold text-white mb-3 font-mono">
          .sprints {"{"}<span className="text-green-400"> ▋</span>
        </h1>
        <p className="text-gray-500 font-mono text-sm max-w-xl">
          {"}"}{"  "}<span className="text-gray-700">// real products. real teams. real deadlines.</span>
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-[#111] border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : cycles.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-mono text-gray-600">// no sprints yet</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Active */}
          {active.length > 0 && (
            <div>
              <h2 className="font-mono text-sm text-green-600 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                // active sprints
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {active.map((c) => <ActiveCard key={c.id} cycle={c} />)}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-mono text-sm text-blue-500/70 mb-5">// upcoming</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((c) => <CycleCard key={c.id} cycle={c} />)}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="font-mono text-sm text-gray-600 mb-5">// completed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((c) => <CycleCard key={c.id} cycle={c} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
