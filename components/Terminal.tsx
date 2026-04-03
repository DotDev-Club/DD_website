"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type LineType = "input" | "output" | "error" | "success" | "dim";
interface Line { type: LineType; text: string }

const BOOT = [
  { type: "success" as LineType, text: "DotDev-OS 1.0.0 #1 SMP REVA University" },
  { type: "dim"     as LineType, text: 'Type "help" for available commands.' },
];

const FAKE_LOG = [
  "a3f9c12 feat: ship product at 3am before demo day",
  "b7d2e45 fix: remove 47 console.logs before presentation",
  "c1a8f33 chore: update README for the 14th time this week",
  "d5e9b21 feat: add dark mode (it was already dark mode)",
  "e2c7a18 fix: make it work on mentor's laptop",
  "f4b3d09 initial commit: we are so back",
];

const HELP_TEXT = [
  "  help          show this message",
  "  ls            list site directories",
  "  ls /projects  browse projects",
  "  ls /team      meet the team",
  "  cat about.txt read about .Dev",
  "  git log       view commit history",
  "  ./join.sh     apply to .Dev",
  "  whoami        who are you?",
  "  pwd           print working directory",
  "  uname         system info",
  "  clear         clear terminal",
  "  exit          close terminal",
];

export default function Terminal() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [history, setHistory] = useState<Line[]>(BOOT);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Global backtick toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const editable = (e.target as HTMLElement).isContentEditable;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || editable) return;
      if (e.key === "`") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Auto-focus when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const push = (...lines: Line[]) => setHistory((h) => [...h, ...lines]);
  const out  = (text: string) => ({ type: "output"  as LineType, text });
  const err  = (text: string) => ({ type: "error"   as LineType, text });
  const suc  = (text: string) => ({ type: "success" as LineType, text });
  const dim  = (text: string) => ({ type: "dim"     as LineType, text });

  const handleCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    push({ type: "input", text: `$ ${cmd}` });
    setCmdHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    setInput("");

    switch (cmd.toLowerCase()) {
      case "help":
        push(out(""), out("available commands:"), ...HELP_TEXT.map(out), out(""));
        break;

      case "ls":
        push(
          out("events/    projects/    team/"),
          out("workshops/ open-source/ sprints/"),
          out("blog/      gallery/     join/"),
        );
        break;

      case "ls /projects":
        push(suc("opening /projects..."));
        setTimeout(() => router.push("/projects"), 800);
        break;

      case "ls /team":
        push(suc("opening /team..."));
        setTimeout(() => router.push("/team"), 800);
        break;

      case "cat about.txt":
        push(
          out(""),
          out(".Dev — Product Engineering & Innovation Club"),
          out("REVA University, Bengaluru"),
          out(""),
          dim("  We don't just learn to code."),
          dim("  We build products that matter."),
          dim("  We ship. We iterate. We innovate."),
          out(""),
          dim("  12-week product sprints. Real mentors."),
          dim("  Real deadlines. Real impact."),
          out(""),
        );
        break;

      case "git log":
        push(out(""));
        FAKE_LOG.forEach((line) => push(dim(line)));
        push(out(""));
        break;

      case "./join.sh":
        push(
          suc("Starting application process..."),
          dim("Checking eligibility... ✓"),
          dim("Loading form... ✓"),
          suc("Redirecting to /join"),
        );
        setTimeout(() => router.push("/join"), 1000);
        break;

      case "whoami":
        push(suc(".Dev member — Builder. Shipper. Innovator."));
        break;

      case "pwd":
        push(out("/home/dotdev"));
        break;

      case "uname":
        push(out("DotDev-OS 1.0.0 #1 SMP REVA University aarch64 GNU/Linux"));
        break;

      case "clear":
        setHistory(BOOT);
        break;

      case "exit":
        setOpen(false);
        break;

      default:
        push(err(`command not found: ${cmd}. Type "help" for available commands.`));
    }
  };

  const lineClass: Record<LineType, string> = {
    input:   "text-green-400",
    output:  "text-gray-300",
    error:   "text-red-400",
    success: "text-green-300",
    dim:     "text-gray-600",
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-green-500/10 bg-[#0d0d0d] shrink-0">
        <div className="flex gap-1.5">
          <button onClick={() => setOpen(false)} className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-green-500/40 text-xs ml-2">dotdev — bash — 80×24</span>
        <button
          onClick={() => setOpen(false)}
          className="ml-auto text-gray-700 hover:text-gray-400 text-xs transition-colors"
        >
          [esc]
        </button>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-0.5">
        {history.map((line, i) => (
          <div key={i} className={`text-sm leading-relaxed ${lineClass[line.type]}`}>
            {line.text || "\u00a0"}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="flex items-center gap-2 px-5 py-3 border-t border-green-500/10 bg-[#0d0d0d] shrink-0"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.focus(); }}
      >
        <span className="text-green-500 text-sm shrink-0">visitor@dotdev:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommand(input);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const next = Math.min(histIdx + 1, cmdHistory.length - 1);
              setHistIdx(next);
              setInput(cmdHistory[next] ?? "");
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const next = Math.max(histIdx - 1, -1);
              setHistIdx(next);
              setInput(next === -1 ? "" : cmdHistory[next] ?? "");
            }
          }}
          className="flex-1 bg-transparent text-green-300 text-sm outline-none caret-green-500"
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
        />
        <span className="w-2 h-4 bg-green-500 animate-blink opacity-80" />
      </div>
    </div>
  );
}
