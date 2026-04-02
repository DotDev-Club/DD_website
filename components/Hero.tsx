"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const subtitles = ["We Build Products.", "We Ship Fast.", "We Innovate.", "We Engineer Solutions."];

export default function Hero() {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = subtitles[subtitleIndex];

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 60);
      return () => clearTimeout(t);
    }

    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex > 0) {
      const t = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, 35);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setSubtitleIndex((i) => (i + 1) % subtitles.length);
    }
  }, [charIndex, deleting, subtitleIndex]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 sm:px-8 pt-20">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      {/* Radial gradient hero glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-500/8 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main headline */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-4">
          <span className="font-mono text-green-400">.Dev</span>
        </h1>

        {/* Typewriter subtitle */}
        <div className="h-12 sm:h-14 flex items-center justify-center mb-6">
          <p className="text-xl sm:text-2xl md:text-3xl font-mono text-gray-300">
            {displayed}
            <span className="inline-block w-0.5 h-6 bg-green-400 ml-0.5 align-middle animate-blink" />
          </p>
        </div>

        <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          A community of builders, designers, and engineers at REVA University
          who turn ideas into real products.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/join"
            className="px-8 py-3 bg-green-500 text-black font-mono font-semibold rounded hover:bg-green-400 transition-all duration-200 hover:shadow-glow-green"
          >
            Join the Club
          </Link>
          <Link
            href="/projects"
            className="px-8 py-3 border border-green-500/40 text-green-400 font-mono font-semibold rounded hover:border-green-400 hover:bg-green-500/5 transition-all duration-200"
          >
            See Our Work
          </Link>
        </div>

        {/* Club tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
          <span className="font-mono text-xs text-green-600 tracking-wider uppercase">
            Product Engineering &amp; Innovation Club · REVA University
          </span>
        </div>
      </div>
    </section>
  );
}
