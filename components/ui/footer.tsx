import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";

const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "Workshops", href: "/workshops" },
  { label: "Gallery", href: "/gallery" },
  { label: "Join Us", href: "/join" },
];

const socials = [
  { icon: Github, href: "https://github.com/dotdev-reva", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/dotdev-reva", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/dotdev.reva", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-green-500/10 mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span className="font-mono text-2xl font-bold text-green-400">.Dev</span>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Product Engineering &amp; Innovation Club
              <br />
              REVA University, Bengaluru
            </p>
            <p className="mt-3 font-mono text-xs text-green-600">Build. Ship. Innovate.</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-mono text-xs text-green-500 uppercase tracking-wider mb-4">
              // navigation
            </h3>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 max-w-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-mono text-xs text-green-500 uppercase tracking-wider mb-4">
              // connect
            </h3>
            <div className="flex gap-4 mb-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded border border-gray-800 text-gray-500 hover:text-green-400 hover:border-green-500/40 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div className="space-y-2">
              <a
                href="mailto:dotdevclub@gmail.com"
                className="block text-sm text-gray-500 hover:text-white transition-colors"
              >
                dotdevclub@gmail.com
              </a>
              <a
                href="tel:8217803545"
                className="block text-sm text-gray-500 hover:text-white transition-colors"
              >
                +91 8217803545
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700">
            &copy; {new Date().getFullYear()} .Dev — Product Engineering &amp; Innovation Club
          </p>
          <p className="font-mono text-xs text-gray-700">
            Built by{" "}
            <span className="text-green-600">.Dev</span>
            <span className="text-gray-900 select-none ml-4">· press ` to open terminal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
