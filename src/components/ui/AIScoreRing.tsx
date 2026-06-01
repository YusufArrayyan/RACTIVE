"use client";

import { cn } from "@/lib/utils";

interface AIScoreRingProps {
  score: number;       // 0–100
  size?: "sm" | "md" | "lg";
  label?: string;
  color?: string;
  showLabel?: boolean;
}

export function AIScoreRing({ score, size = "md", label, color, showLabel = true }: AIScoreRingProps) {
  const sizes = {
    sm: { outer: 64, stroke: 4, fontSize: "text-base" },
    md: { outer: 96, stroke: 5, fontSize: "text-xl" },
    lg: { outer: 140, stroke: 7, fontSize: "text-3xl" },
  };

  const { outer, stroke, fontSize } = sizes[size];
  const radius = (outer - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const scoreColor =
    color ??
    (score >= 80 ? "#8B5CF6" : score >= 60 ? "#3B82F6" : score >= 40 ? "#F59E0B" : "#EF4444");

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: outer, height: outer }}>
        <svg width={outer} height={outer} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {/* Progress ring */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s ease",
              filter: `drop-shadow(0 0 6px ${scoreColor}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", fontSize)} style={{ color: scoreColor }}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && label && (
        <span className="text-xs text-ractive-muted font-medium">{label}</span>
      )}
    </div>
  );
}
