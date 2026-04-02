import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-4">
      <p className="font-mono text-green-500 text-sm mb-2">// 404 not found</p>
      <h1 className="text-8xl font-bold text-green-500 mb-4">404</h1>
      <p className="text-gray-400 mb-8 text-lg">Page not found in the codebase.</p>
      <Link
        href="/"
        className="px-6 py-2 border border-green-500 text-green-400 font-mono rounded hover:bg-green-500 hover:text-black transition-colors"
      >
        cd ~/home
      </Link>
    </div>
  );
}
