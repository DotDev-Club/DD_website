"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  year: string;
  branch: string;
  whyJoin: string;
  skills: string;
}

export default function JoinForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Submission failed");
      }

      toast.success("Application submitted! We'll be in touch.");
      setSubmitted(true);
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
        <p className="text-gray-400 text-sm">
          Thanks for applying to <span className="text-green-400 font-mono">.Dev</span>. We&apos;ll review your application and reach out soon.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 font-mono text-xs text-green-500 hover:text-green-400 underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-mono text-xs text-gray-500 mb-1.5">name *</label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Your full name"
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:border-green-500/60 focus:ring-0 focus:outline-none transition-colors"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block font-mono text-xs text-gray-500 mb-1.5">email *</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
            type="email"
            placeholder="you@reva.edu.in"
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:border-green-500/60 focus:ring-0 focus:outline-none transition-colors"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      {/* Year + Branch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-mono text-xs text-gray-500 mb-1.5">year *</label>
          <select
            {...register("year", { required: "Year is required" })}
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-green-500/60 focus:ring-0 focus:outline-none transition-colors"
          >
            <option value="">Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          {errors.year && <p className="mt-1 text-xs text-red-400">{errors.year.message}</p>}
        </div>
        <div>
          <label className="block font-mono text-xs text-gray-500 mb-1.5">branch *</label>
          <input
            {...register("branch", { required: "Branch is required" })}
            placeholder="e.g. CSE, ECE, ISE"
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:border-green-500/60 focus:ring-0 focus:outline-none transition-colors"
          />
          {errors.branch && <p className="mt-1 text-xs text-red-400">{errors.branch.message}</p>}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block font-mono text-xs text-gray-500 mb-1.5">skills / interests *</label>
        <input
          {...register("skills", { required: "Please list your skills" })}
          placeholder="e.g. React, Python, UI Design, ML, Product Management"
          className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:border-green-500/60 focus:ring-0 focus:outline-none transition-colors"
        />
        {errors.skills && <p className="mt-1 text-xs text-red-400">{errors.skills.message}</p>}
      </div>

      {/* Why join */}
      <div>
        <label className="block font-mono text-xs text-gray-500 mb-1.5">why do you want to join .Dev? *</label>
        <textarea
          {...register("whyJoin", {
            required: "This field is required",
            minLength: { value: 30, message: "Please write at least 30 characters" },
          })}
          rows={4}
          placeholder="Tell us what motivates you and what you hope to build..."
          className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:border-green-500/60 focus:ring-0 focus:outline-none transition-colors resize-none"
        />
        {errors.whyJoin && <p className="mt-1 text-xs text-red-400">{errors.whyJoin.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-green-500 text-black font-mono font-semibold rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Submitting..." : "Submit Application →"}
      </button>
    </form>
  );
}
