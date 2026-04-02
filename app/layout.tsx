import "./css/style.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: ".Dev — Product Engineering & Innovation Club",
  description:
    "Build. Ship. Innovate. The Product Engineering & Innovation Club at REVA University, Bengaluru.",
  keywords: ["product engineering", "innovation", "hackathon", "REVA University", "tech club", ".Dev"],
  authors: [{ name: ".Dev Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-inter antialiased bg-[#0a0a0a] text-white tracking-tight`}
      >
        {children}
      </body>
    </html>
  );
}
