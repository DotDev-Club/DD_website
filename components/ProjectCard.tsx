import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";
const domainColors: Record<string, string> = {
  Web: "bg-blue-500/10 text-blue-400 border-blue-500/25",
  Mobile: "bg-purple-500/10 text-purple-400 border-purple-500/25",
  "AI/ML": "bg-orange-500/10 text-orange-400 border-orange-500/25",
  Blockchain: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
  "Open Source": "bg-green-500/10 text-green-400 border-green-500/25",
};

interface Props {
  project: {
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
  };
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className="card-hover group bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/25 transition-all duration-300">
      {/* Cover */}
      <div className="relative h-44 bg-[#1a1a1a] overflow-hidden">
        <Image
          src={project.coverImage || "/placeholder-project.jpg"}
          alt={project.name}
          fill
          className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
        {/* Domain badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-mono px-2 py-0.5 rounded border ${domainColors[project.domain] ?? "bg-gray-800 text-gray-400 border-gray-700"}`}
        >
          {project.domain}
        </span>
        {project.featured && (
          <span className="absolute top-3 right-3 text-xs font-mono px-2 py-0.5 rounded border bg-green-500/15 text-green-400 border-green-500/30">
            ★ Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-white line-clamp-1">{project.name}</h3>
          <span className="shrink-0 font-mono text-xs text-gray-600">{project.year}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{project.description}</p>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 text-gray-500 border border-gray-800"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
            >
              <Github size={13} />
              <span>Code</span>
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-400 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Live</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
