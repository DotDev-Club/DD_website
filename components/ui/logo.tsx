import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group">
      <span className="font-mono text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">
        &lt; .DEV &gt;
      </span>
    </Link>
  );
}
