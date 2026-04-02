const pillars = [
  {
    code: ".build {}",
    description:
      "Hands-on product development sessions, design sprints, and end-to-end engineering projects that ship real value.",
  },
  {
    code: ".ship {}",
    description:
      "We don't stop at prototypes. Members deploy, launch, and iterate on real products with real users.",
  },
  {
    code: ".innovate {}",
    description:
      "Hackathons, idea jams, and cross-domain collaborations that push the boundaries of what's possible.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="mb-14">
        <p className="font-mono text-green-500 text-sm mb-2">// who we are</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="font-mono text-green-400">&lt;About /&gt;</span>
        </h2>
        <p className="text-gray-400 max-w-2xl leading-relaxed">
          <span className="text-white font-semibold">.Dev</span> is the Product Engineering &amp; Innovation Club at REVA University.
          We bring together students passionate about building software, designing products, and shipping at scale.
          Whether you're a developer, designer, or product thinker — there's a place for you here.
        </p>
      </div>

      {/* Three pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <div
            key={pillar.code}
            className="card-hover group relative bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300"
          >
            {/* Top corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-bl-3xl rounded-tr-xl pointer-events-none group-hover:bg-green-500/10 transition-colors" />

            <p className="font-mono text-sm text-green-500 mb-4">{pillar.code}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
