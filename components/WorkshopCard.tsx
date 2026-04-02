import Link from "next/link";
import { Calendar, Clock, User, BookOpen } from "lucide-react";
import { IWorkshop } from "@/models/Workshop";

interface Props {
  workshop: Partial<IWorkshop> & {
    id: string;
    title: string;
    facilitator: string;
    date: string;
    duration: string;
    description: string;
    resourcesLink?: string;
    tags?: string[];
  };
}

export default function WorkshopCard({ workshop }: Props) {
  const formattedDate = new Date(workshop.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="card-hover group bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
      {/* Top line accent */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-base font-semibold text-white leading-snug">{workshop.title}</h3>
        <BookOpen size={16} className="shrink-0 text-blue-500 mt-0.5" />
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{workshop.description}</p>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <User size={11} className="text-blue-600" />
          <span className="truncate">{workshop.facilitator}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-blue-600" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-blue-600" />
          <span>{workshop.duration}</span>
        </div>
      </div>

      {/* Tags */}
      {workshop.tags && workshop.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {workshop.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {workshop.resourcesLink && (
        <Link
          href={workshop.resourcesLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Resources →</span>
        </Link>
      )}
    </div>
  );
}
