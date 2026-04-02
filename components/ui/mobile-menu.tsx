"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import navItems from "./NavItems";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="p-2 text-gray-300 hover:text-white transition-colors"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-[#0d0d0d] border-b border-green-500/20 shadow-lg z-40">
          <nav className="flex flex-col px-5 py-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-2 px-3 rounded font-medium text-sm transition-colors ${
                  pathname === item.href
                    ? "text-green-400 bg-green-500/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className="mt-2 py-2 px-3 text-center rounded font-mono text-sm font-semibold bg-green-500 text-black hover:bg-green-400 transition-colors"
            >
              Join Us
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
