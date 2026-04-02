"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 120, label: "Members", suffix: "+" },
  { value: 30, label: "Projects Shipped", suffix: "+" },
  { value: 25, label: "Workshops Conducted", suffix: "+" },
  { value: 8, label: "Hackathons Won", suffix: "" },
];

function useCountUp(target: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [start, target]);
  return count;
}

function StatItem({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center px-6 py-4">
      <p className="text-4xl sm:text-5xl font-bold text-green-400 font-mono">
        {count}
        {suffix}
      </p>
      <p className="text-sm text-gray-500 mt-1 tracking-wide">{label}</p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="py-12 border-y border-green-500/10 bg-[#0d0d0d]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-green-500/10">
          {stats.map((s) => (
            <StatItem key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
          ))}
        </div>
      </div>
    </section>
  );
}
