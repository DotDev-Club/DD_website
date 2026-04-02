import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { IEvent } from "@/models/Event";

const typeColors: Record<string, string> = {
  Hackathon: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Workshop: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Talk: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Product Sprint": "bg-green-500/15 text-green-400 border-green-500/30",
};

const statusDot: Record<string, string> = {
  upcoming: "bg-green-500",
  ongoing: "bg-yellow-500 animate-pulse",
  past: "bg-gray-600",
};

interface Props {
  event: Partial<IEvent> & {
    id: string;
    title: string;
    date: string;
    type: string;
    status: string;
    description: string;
    bannerImage: string;
    registrationLink?: string;
    venue?: string;
  };
}

export default function EventCard({ event }: Props) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="card-hover group bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/30 transition-all duration-300">
      {/* Banner */}
      <div className="relative h-44 bg-[#1a1a1a] overflow-hidden">
        <Image
          src={event.bannerImage || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        {/* Status dot */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full">
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[event.status] ?? "bg-gray-500"}`} />
          <span className="text-xs text-white capitalize">{event.status}</span>
        </div>
        {/* Type badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-mono px-2 py-0.5 rounded border ${typeColors[event.type] ?? "bg-gray-800 text-gray-400 border-gray-700"}`}
        >
          {event.type}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-white mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{event.description}</p>

        <div className="flex flex-col gap-1.5 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-green-600" />
            <span>{formattedDate}</span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-green-600" />
              <span>{event.venue}</span>
            </div>
          )}
        </div>

        {event.registrationLink && event.status === "upcoming" ? (
          <Link
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2 px-4 text-xs font-mono font-semibold rounded border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black hover:border-green-500 transition-colors"
          >
            Register Now
          </Link>
        ) : (
          <button
            disabled
            className="block w-full text-center py-2 px-4 text-xs font-mono font-semibold rounded border border-gray-800 text-gray-600 cursor-not-allowed"
          >
            {event.status === "ongoing" ? "Ongoing" : "View Details"}
          </button>
        )}
      </div>
    </div>
  );
}
