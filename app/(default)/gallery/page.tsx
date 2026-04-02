"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string;
  eventTag?: string;
  uploadedAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setImages(data.images ?? []))
      .finally(() => setLoading(false));
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-green-500 text-sm mb-2">// captured moments</p>
        <h1 className="text-4xl font-bold text-white mb-1">
          <span className="font-mono">.gallery {"{"}</span>
        </h1>
        <p className="font-mono text-gray-500 text-sm mt-1">{"}"}</p>
      </div>

      {loading ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{ height: `${150 + (i % 3) * 60}px` }}
              className="bg-[#111] border border-gray-800 rounded-lg animate-pulse w-full block"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-mono text-gray-600">// gallery coming soon</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative overflow-hidden rounded-lg border border-gray-800 hover:border-green-500/30 cursor-pointer group transition-all duration-300 break-inside-avoid"
              onClick={() => setLightbox(img)}
            >
              <Image
                src={img.imageUrl}
                alt={img.caption || "Gallery image"}
                width={400}
                height={300}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {(img.caption || img.eventTag) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {img.eventTag && (
                    <span className="font-mono text-[10px] text-green-400 block">{img.eventTag}</span>
                  )}
                  {img.caption && (
                    <p className="text-xs text-white line-clamp-2">{img.caption}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-gray-400 hover:text-white font-mono text-sm"
            >
              [close]
            </button>
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.caption || "Gallery"}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto object-contain rounded-lg"
            />
            {lightbox.caption && (
              <p className="mt-2 text-xs text-gray-400 text-center">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
