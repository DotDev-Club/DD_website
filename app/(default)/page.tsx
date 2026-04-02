import Hero from "@/components/Hero";
import About from "@/components/About";
import StatsBar from "@/components/StatsBar";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <About />

      {/* CTA banner */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-[#111] border border-green-500/20 rounded-2xl p-12 overflow-hidden">
            {/* Background dots */}
            <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <p className="font-mono text-green-500 text-sm mb-3">// ready to build?</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Join <span className="text-green-400 font-mono">.Dev</span> Today
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
                Be part of a community that ships real products. Learn, build, and grow alongside
                the best student engineers at REVA University.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/join"
                  className="px-8 py-3 bg-green-500 text-black font-mono font-semibold rounded hover:bg-green-400 transition-colors"
                >
                  Apply Now →
                </Link>
                <Link
                  href="/events"
                  className="px-8 py-3 border border-gray-700 text-gray-300 font-mono font-semibold rounded hover:border-gray-500 hover:text-white transition-colors"
                >
                  See Upcoming Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
