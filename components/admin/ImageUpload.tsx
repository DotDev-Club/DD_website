"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "misc",
  label = "Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onChange(url);
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  return (
    <div>
      <label className="block font-mono text-xs text-gray-500 mb-2">{label}</label>

      {value ? (
        <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-800 group">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-black/70 rounded text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full h-36 border-2 border-dashed border-gray-800 hover:border-green-500/40 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
        >
          {uploading ? (
            <Loader2 size={20} className="text-green-500 animate-spin" />
          ) : (
            <>
              <Upload size={20} className="text-gray-600 group-hover:text-green-500 transition-colors" />
              <p className="font-mono text-xs text-gray-600 group-hover:text-gray-400">
                Click or drag to upload
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {/* Or paste URL */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL..."
        className="mt-2 w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-400 placeholder-gray-700 focus:border-green-500/50 focus:outline-none transition-colors"
      />
    </div>
  );
}
