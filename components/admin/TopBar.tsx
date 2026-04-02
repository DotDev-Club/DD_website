"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useStore } from "@/lib/zustand/store";
import { verifyToken } from "@/lib/server/auth";

interface TopBarProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export default function TopBar({ onMenuClick, pageTitle }: TopBarProps) {
  const { isLoggedIn, adminEmail, setLoggedIn, reset } = useStore();
  const router = useRouter();

  // On mount, verify the token from the query string (set after magic link login)
  useEffect(() => {
    if (isLoggedIn) return;
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      verifyToken(token).then((auth) => {
        if (auth?.email) {
          setLoggedIn(true, auth.email);
          // Clean the token from URL without a page reload
          window.history.replaceState({}, "", window.location.pathname);
        }
      });
    } else {
      // Try to restore from localStorage (tab reload)
      const stored = localStorage.getItem("dev_admin_email");
      if (stored) setLoggedIn(true, stored);
    }
  }, [isLoggedIn, setLoggedIn]);

  // Persist admin email in localStorage
  useEffect(() => {
    if (adminEmail) localStorage.setItem("dev_admin_email", adminEmail);
  }, [adminEmail]);

  const handleSignOut = () => {
    reset();
    localStorage.removeItem("dev_admin_email");
    router.push("/admin/logout");
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-5 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-900">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="font-mono text-xs text-green-600 leading-none">// admin</p>
          <h1 className="text-sm font-semibold text-white">{pageTitle}</h1>
        </div>
      </div>

      {/* Right: email + sign out */}
      <div className="flex items-center gap-4">
        {adminEmail && (
          <span className="hidden sm:block font-mono text-xs text-gray-600 truncate max-w-[180px]">
            {adminEmail}
          </span>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors font-mono"
          title="Sign Out"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
