"use client";

import { cn } from "@/lib/utils";

type Platform = "YouTube" | "TikTok" | "Instagram" | "X" | "Threads" | "Facebook" | "Shorts";

interface PlatformIconProps {
  platform: Platform;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const PLATFORM_CONFIG: Record<Platform, { emoji: string; label: string; color: string; bg: string }> = {
  YouTube: { emoji: "▶", label: "YouTube", color: "#FF0000", bg: "rgba(255,0,0,0.12)" },
  TikTok: { emoji: "♪", label: "TikTok", color: "#69C9D0", bg: "rgba(105,201,208,0.12)" },
  Instagram: { emoji: "◉", label: "Instagram", color: "#E1306C", bg: "rgba(225,48,108,0.12)" },
  X: { emoji: "✕", label: "X / Twitter", color: "#F5F5F5", bg: "rgba(245,245,245,0.08)" },
  Threads: { emoji: "⊕", label: "Threads", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  Facebook: { emoji: "f", label: "Facebook", color: "#1877F2", bg: "rgba(24,119,242,0.12)" },
  Shorts: { emoji: "⚡", label: "Shorts", color: "#FF0000", bg: "rgba(255,0,0,0.12)" },
};

const sizes = {
  xs: { box: "w-5 h-5", text: "text-[9px]", label: "text-[10px]" },
  sm: { box: "w-6 h-6", text: "text-[10px]", label: "text-xs" },
  md: { box: "w-8 h-8", text: "text-sm", label: "text-sm" },
  lg: { box: "w-10 h-10", text: "text-base", label: "text-base" },
};

export function PlatformIcon({ platform, size = "sm", showLabel = false, className }: PlatformIconProps) {
  const config = PLATFORM_CONFIG[platform];
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className={cn("flex items-center justify-center rounded-md font-bold flex-shrink-0", s.box)}
        style={{ background: config.bg, color: config.color }}
      >
        <span className={s.text}>{config.emoji}</span>
      </div>
      {showLabel && (
        <span className={cn("font-medium text-ractive-white", s.label)}>{config.label}</span>
      )}
    </div>
  );
}

export function PlatformBadge({ platform }: { platform: Platform }) {
  const config = PLATFORM_CONFIG[platform];
  return (
    <span
      className="badge text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.color}30`,
      }}
    >
      {config.label}
    </span>
  );
}
