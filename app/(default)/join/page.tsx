import JoinForm from "@/components/JoinForm";
import { Toaster } from "react-hot-toast";
import { Github, Linkedin, Instagram } from "lucide-react";

const socials = [
  { icon: Github, href: "https://github.com/dotdev-reva", label: "GitHub", handle: "@dotdev-reva" },
  { icon: Linkedin, href: "https://linkedin.com/company/dotdev-reva", label: "LinkedIn", handle: "dotdev-reva" },
  {
    icon: Instagram,
    href: "https://instagram.com/dotdev.reva",
    label: "Instagram",
    handle: "@dotdev.reva",
  },
];

export default function JoinPage() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }} />
      <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="font-mono text-green-500 text-sm mb-2">// become a builder</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Join <span className="font-mono text-green-400">.Dev</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
              We&apos;re always looking for passionate engineers, designers, and product thinkers.
              Fill out the form below and we&apos;ll reach out soon.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-[#111] border border-gray-800 rounded-xl p-6 sm:p-8">
                <p className="font-mono text-xs text-green-600 mb-6">// application form</p>
                <JoinForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Why join */}
              <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
                <p className="font-mono text-xs text-green-500 mb-4">// why .Dev?</p>
                <ul className="space-y-3 text-sm text-gray-400">
                  {[
                    "Build real products used by real people",
                    "Mentorship from industry professionals",
                    "Compete in hackathons and win prizes",
                    "Workshop sessions on cutting-edge tech",
                    "Network with top engineers and founders",
                    "Internship & job referrals",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5 shrink-0">›</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Socials */}
              <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
                <p className="font-mono text-xs text-green-500 mb-4">// find us here</p>
                <div className="space-y-3">
                  {socials.map(({ icon: Icon, href, label, handle }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
                    >
                      <Icon size={16} className="text-gray-600 group-hover:text-green-400 transition-colors" />
                      <div>
                        <p className="text-xs text-gray-600">{label}</p>
                        <p className="text-sm font-mono">{handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
