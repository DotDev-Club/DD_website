"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, Trash2, Loader2, X } from "lucide-react";

interface GalleryImage {
  _id: string;
  id: string;
  imageUrl: string;
  caption: string;
  eventTag: string;
  uploadedAt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [eventTag, setEventTag] = useState("");
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/gallery").then(r => r.json()).then(d => setImages(d.images ?? [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      // 1. Upload to Cloudinary
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "gallery");
      const upRes = await fetch("/api/upload", { method: "POST", body: form });
      if (!upRes.ok) throw new Error("Upload failed");
      const { url } = await upRes.json();

      // 2. Save record to DB
      const saveRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url, caption, eventTag }),
      });
      if (!saveRes.ok) throw new Error("Save failed");

      toast.success("Image uploaded");
      setCaption(""); setEventTag(""); setShowUploadPanel(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleUpload(file);
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${img.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Image deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-green-500 mb-1">// manage</p>
          <h2 className="text-xl font-bold text-white">Gallery</h2>
          <p className="text-sm text-gray-500 mt-1">{images.length} images</p>
        </div>
        <button
          onClick={() => setShowUploadPanel(!showUploadPanel)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-mono text-sm font-semibold rounded-lg hover:bg-green-400 transition-colors"
        >
          <Upload size={14} /> Upload Image
        </button>
      </div>

      {/* Upload panel */}
      {showUploadPanel && (
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs text-green-500">// new upload</p>
            <button onClick={() => setShowUploadPanel(false)} className="text-gray-600 hover:text-white"><X size={14} /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">caption</label>
                <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..." className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:border-green-500/50 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">event tag</label>
                <input value={eventTag} onChange={e => setEventTag(e.target.value)} placeholder="e.g. DevSprint 1.0" className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:border-green-500/50 focus:outline-none transition-colors" />
              </div>
            </div>
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-800 hover:border-green-500/40 rounded-xl h-32 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {uploading ? (
                <Loader2 size={20} className="text-green-500 animate-spin" />
              ) : (
                <>
                  <Upload size={20} className="text-gray-600" />
                  <p className="font-mono text-xs text-gray-600">Click or drag &amp; drop to upload</p>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
          </div>
        </div>
      )}

      {/* Gallery grid */}
      {loading ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ height: `${140 + (i % 3) * 50}px` }} className="bg-[#111] rounded-lg animate-pulse w-full block" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <p className="font-mono text-sm text-gray-600 py-12 text-center">// no images yet</p>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map(img => (
            <div key={img._id} className="relative group overflow-hidden rounded-lg border border-gray-800 break-inside-avoid">
              <Image
                src={img.imageUrl}
                alt={img.caption || "Gallery"}
                width={300}
                height={250}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <button
                  onClick={() => handleDelete(img)}
                  className="self-end p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
                <div>
                  {img.eventTag && <p className="font-mono text-[10px] text-green-400">{img.eventTag}</p>}
                  {img.caption && <p className="text-xs text-white line-clamp-2">{img.caption}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
