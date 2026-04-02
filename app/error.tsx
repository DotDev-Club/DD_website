"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-4">
      <p className="font-mono text-green-500 text-sm mb-2">// runtime error</p>
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 border border-green-500 text-green-400 font-mono rounded hover:bg-green-500 hover:text-black transition-colors"
      >
        try again()
      </button>
    </div>
  );
}
