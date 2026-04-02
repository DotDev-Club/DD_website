"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  eventTag: string;
}

export default function GalleryPreview() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setImages((data.images ?? []).slice(0, 6)));
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono text-green-500 text-sm mb-2">// moments</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="font-mono text-green-400">&lt;Gallery /&gt;</span>
          </h2>
        </div>
        <Link
          href="/gallery"
          className="font-mono text-xs text-green-500 hover:text-green-300 transition-colors border border-green-500/30 hover:border-green-400/50 px-4 py-2 rounded"
        >
          View More →
        </Link>
      </div>

      <div className="columns-2 sm:columns-3 gap-3">
        {images.map((img) => (
          <div key={img.id} className="break-inside-avoid mb-3 group relative overflow-hidden rounded-lg border border-gray-800">
            <div className="relative">
              <Image
                src={img.imageUrl}
                alt={img.caption || img.eventTag}
                width={600}
                height={400}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {img.eventTag && (
                <span className="absolute bottom-2 left-2 font-mono text-[10px] px-2 py-0.5 rounded bg-black/70 text-green-400 border border-green-500/20">
                  {img.eventTag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
