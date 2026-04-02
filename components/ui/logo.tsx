import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-full overflow-hidden border border-green-500/30 group-hover:border-green-400/60 transition-colors shrink-0">
        <Image
          src="/club_logo.jpeg"
          alt=".Dev Club"
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      </div>
      <span className="font-mono text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">
        .Dev
      </span>
    </Link>
  );
}
