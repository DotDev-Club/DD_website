"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";

type Domain = "All" | "Web" | "Mobile" | "AI/ML" | "Blockchain" | "Open Source";
const domains: Domain[] = ["All", "Web", "Mobile", "AI/ML", "Blockchain", "Open Source"];

interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  domain: string;
  coverImage: string;
  liveUrl?: string;
  githubUrl?: string;
  year: string;
  featured?: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<Domain>("All");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = domain === "All" ? projects : projects.filter((p) => p.domain === domain);
  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-green-500 text-sm mb-2">// what we ship</p>
        <h1 className="text-4xl font-bold text-white mb-1">
          <span className="font-mono">&lt;Projects /&gt;</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Real products built by .Dev members — from concept to deployment.
        </p>
      </div>

      {/* Domain filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {domains.map((d) => (
          <button
            key={d}
            onClick={() => setDomain(d)}
            className={`px-4 py-1.5 rounded-full font-mono text-xs border transition-colors ${
              domain === d
                ? "bg-green-500 text-black border-green-500"
                : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-[#111] border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-mono text-gray-600">// no projects in this domain yet</p>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <div className="mb-12">
              <h2 className="font-mono text-sm text-green-600 mb-5">// featured</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
          {rest.length > 0 && (
            <div>
              {featured.length > 0 && (
                <h2 className="font-mono text-sm text-gray-600 mb-5">// all projects</h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
