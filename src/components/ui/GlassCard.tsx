"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "blue" | "cyan" | "none";
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
  animate?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  hover = false,
  onClick,
  delay = 0,
  animate = true,
}: GlassCardProps) {
  const glowClasses = {
    purple: "shadow-lg border-[var(--purple-light)]",
    blue: "shadow-lg border-[var(--accent-light)]",
    cyan: "shadow-lg border-[var(--cyan-light)]",
    none: "border-[var(--border-default)]",
  };

  const card = (
    <div
      onClick={onClick}
      className={cn(
        "glass-card relative overflow-hidden",
        glowClasses[glow],
        hover && "cursor-pointer transition-all duration-300 hover:border-[var(--accent-medium)] hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );

  if (!animate) return card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className={cn(
        "glass-card relative overflow-hidden",
        glowClasses[glow],
        hover && "cursor-pointer transition-all duration-300 hover:border-[var(--accent-medium)] hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
