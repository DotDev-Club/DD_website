"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./logo";
import MobileMenu from "./mobile-menu";
import navItems from "./NavItems";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed w-full z-30 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-green-500/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    pathname === item.href
                      ? "text-green-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            <Link
              href="/join"
              className="ml-4 px-4 py-2 text-sm font-mono font-semibold bg-green-500 text-black rounded hover:bg-green-400 transition-colors border border-green-400"
            >
              Join Us
            </Link>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
