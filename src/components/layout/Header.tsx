"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bell, Sun, Moon, Flame, TrendingUp, Bot, Zap } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const NOTIFICATIONS = [
  { icon: <Flame size={16} className="text-[var(--orange)]" />, text: "AI Tool trend is peaking — post in next 48h", time: "2m ago", urgent: true },
  { icon: <TrendingUp size={16} className="text-[var(--green)]" />, text: "Your last video hit 100K views!", time: "1h ago", urgent: false },
  { icon: <Bot size={16} className="text-[var(--purple)]" />, text: "Script Writer AI completed your draft", time: "3h ago", urgent: false },
  { icon: <Zap size={16} className="text-[var(--accent)]" />, text: "New viral opportunity detected in Finance niche", time: "5h ago", urgent: true },
];

export function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => n.urgent).length;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <header className="h-[var(--header-height)] border-b border-default bg-[var(--bg-glass)] backdrop-blur-xl flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-[var(--text-primary)] truncate">{title}</h1>
        {subtitle && <p className="text-xs text-[var(--text-secondary)] truncate">{subtitle}</p>}
      </div>

      {/* AI Status Pill */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--purple-light)] border border-[var(--border-default)]">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--purple)] animate-pulse" />
        <span className="text-xs font-medium text-[var(--purple)]">7 AI Agents Active</span>
      </div>

      {/* Quick Add */}
      <Link
        href="/dashboard/scripts"
        className="btn-primary btn-sm hidden sm:inline-flex"
      >
        <span>+</span>
        <span>Create</span>
      </Link>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        aria-label="Toggle theme"
      >
        {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifs((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] relative"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--red)] rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
              {unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-80 glass-card-solid p-1 z-50"
            >
              <div className="px-3 py-2 border-b border-[var(--border-default)]">
                <span className="text-xs font-semibold text-[var(--text-primary)]">Notifications</span>
              </div>
              {NOTIFICATIONS.map((n, i) => (
                <button
                  key={i}
                  className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-left"
                >
                  <span className="text-base mt-0.5">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-primary)] leading-snug">{n.text}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{n.time}</p>
                  </div>
                  {n.urgent && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowProfile((v) => !v)}
          className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold text-white shadow-sm border border-[var(--border-default)] cursor-pointer"
        >
          {session?.user?.name?.[0]?.toUpperCase() || "U"}
        </button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-48 glass-card-solid p-1 z-50"
            >
              <div className="px-3 py-2 border-b border-[var(--border-default)] mb-1">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{session?.user?.name || "User"}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{session?.user?.email || ""}</p>
              </div>
              <Link href="/dashboard/settings" className="w-full flex items-center px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors">
                Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center px-3 py-2 text-sm text-[var(--red)] hover:bg-[var(--red-light)] rounded-md transition-colors"
              >
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
