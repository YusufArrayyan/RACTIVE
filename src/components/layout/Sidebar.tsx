"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIScoreRing } from "@/components/ui/AIScoreRing";
import { useSession } from "next-auth/react";

import { 
  Zap, 
  TrendingUp, 
  PenTool, 
  CalendarDays, 
  Clapperboard, 
  BarChart3, 
  Bot, 
  Brain, 
  Crosshair, 
  Settings 
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Command Center", icon: <Zap size={18} strokeWidth={2} />, exact: true },
  { href: "/dashboard/trends", label: "Trend Discovery", icon: <TrendingUp size={18} strokeWidth={2} /> },
  { href: "/dashboard/scripts", label: "AI Script Engine", icon: <PenTool size={18} strokeWidth={2} /> },
  { href: "/dashboard/content", label: "Content Manager", icon: <CalendarDays size={18} strokeWidth={2} /> },
  { href: "/dashboard/storyboard", label: "Storyboard AI", icon: <Clapperboard size={18} strokeWidth={2} /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart3 size={18} strokeWidth={2} /> },
  { href: "/dashboard/agents", label: "AI Agents", icon: <Bot size={18} strokeWidth={2} /> },
  { href: "/dashboard/brain", label: "Content Brain", icon: <Brain size={18} strokeWidth={2} /> },
  { href: "/dashboard/competitors", label: "Competitors", icon: <Crosshair size={18} strokeWidth={2} /> },
];

const BOTTOM_ITEMS = [
  { href: "/dashboard/settings", label: "Settings", icon: <Settings size={18} strokeWidth={2} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 bottom-0 bg-[var(--bg-secondary)] border-r border-[var(--border-default)] z-50 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border-default)]">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
          style={{ background: "var(--accent)" }}
        >
          R
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-lg text-[var(--text-primary)] tracking-wide"
              style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
            >
              RACTIVE
            </motion.span>
          )}
        </AnimatePresence>
        <div className="flex-1" />
        <button
          onClick={onToggle}
          className="w-6 h-6 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-xs flex-shrink-0"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                active
                  ? "bg-[var(--accent-light)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              )}
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-[var(--accent-light)] border border-[var(--accent-medium)]"
                  transition={{ duration: 0.2 }}
                />
              )}
              <span className="relative text-base flex-shrink-0">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* AI Score */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-tertiary)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-secondary)] font-medium">AI Productivity</span>
              <span className="badge badge-purple text-[10px]">↑ +12%</span>
            </div>
            <div className="flex items-center gap-3">
              <AIScoreRing score={87} size="sm" showLabel={false} color="var(--purple)" />
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">87/100</div>
                <div className="text-[11px] text-[var(--text-secondary)]">Excellent streak</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-[var(--border-default)] pt-3">
        {BOTTOM_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200"
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}

        {/* Avatar */}
        <div className={cn("flex items-center gap-3 px-3 py-2.5", collapsed && "justify-center")}>
          <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold flex-shrink-0 text-white shadow-sm border border-[var(--border-default)]">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <div className="text-xs font-semibold text-[var(--text-primary)] truncate">{session?.user?.name || "User"}</div>
                <div className="text-[10px] text-[var(--text-secondary)] truncate">Pro Plan</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
