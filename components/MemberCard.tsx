import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { IMember } from "@/models/Member";

interface Props {
  member: Partial<IMember> & {
    id: string;
    name: string;
    role: string;
    category: string;
    photo: string;
    batch: string;
    linkedin?: string;
    github?: string;
    bio?: string;
  };
}

export default function MemberCard({ member }: Props) {
  return (
    <div className="card-hover group bg-[#111] border border-gray-800 rounded-xl p-5 text-center hover:border-green-500/25 transition-all duration-300">
      {/* Photo */}
      <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-green-500/40 transition-colors mb-4">
        <Image
          src={member.photo || "/placeholder-member.jpg"}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="text-sm font-semibold text-white mb-0.5">{member.name}</h3>
      <p className="text-xs text-green-500 font-mono mb-1">{member.role}</p>
      <p className="text-[10px] text-gray-600 mb-3">Batch {member.batch}</p>

      {member.bio && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{member.bio}</p>
      )}

      {/* Social links */}
      <div className="flex items-center justify-center gap-3">
        {member.linkedin && (
          <Link
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-400 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={14} />
          </Link>
        )}
        {member.github && (
          <Link
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
