"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/zustand/store";
import { sendVerificationEmail, verifyToken } from "@/lib/server/auth";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminSignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(true);
  const [sent, setSent] = useState(false);
  const { isLoggedIn, setLoggedIn } = useStore();
  const router = useRouter();

  // Handle magic link token from URL (after clicking email link)
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      verifyToken(token).then((auth) => {
        if (auth?.email) {
          setLoggedIn(true, auth.email);
          toast.success("Signed in successfully!");
          router.push("/admin/dashboard");
        } else {
          toast.error("Invalid or expired link.");
          setLocked(false);
        }
      });
    } else {
      setLocked(false);
    }
  }, [router, setLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) router.push("/admin/dashboard");
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked || loading) return;
    setLoading(true);
    try {
      const ok = await sendVerificationEmail(email.trim());
      if (!ok) {
        toast.error("Access denied. Your email is not whitelisted.");
        return;
      }
      setSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080808] px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500/40 mb-4">
            <Image
              src="/club_logo.jpeg"
              alt=".Dev Logo"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="font-mono text-2xl font-bold text-white">
            .Dev <span className="text-green-400">Admin</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1 font-mono">Product Engineering &amp; Innovation Club</p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-white font-semibold mb-2">Check your inbox</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                A magic link has been sent to{" "}
                <span className="text-green-400 font-mono">{email}</span>.<br />
                It expires in 15 minutes.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-6 font-mono text-xs text-green-600 hover:text-green-400 underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <p className="font-mono text-xs text-green-500 mb-5">// enter your admin email</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block font-mono text-xs text-gray-500 mb-2">
                    email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@reva.edu.in"
                    required
                    disabled={locked}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:border-green-500/60 focus:outline-none transition-colors disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={locked || loading}
                  className="w-full py-2.5 bg-green-500 text-black font-mono font-semibold rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Sending..." : locked ? "Please wait..." : "Send Magic Link →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
