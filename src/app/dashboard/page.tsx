"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIScoreRing } from "@/components/ui/AIScoreRing";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import { formatNumber, formatPercent } from "@/lib/utils";
import { DASHBOARD_ANALYTICS } from "@/lib/mock-data/agents";
import { Flame, Bot, CalendarDays } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "var(--red)",
  high: "var(--orange)",
  medium: "var(--purple)",
  info: "var(--cyan)",
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"views" | "engagement" | "subscribers">("views");
  const [trends, setTrends] = useState<any[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(true);

  useEffect(() => {
    // Trend Hunter Agent working in the background
    fetch('/api/trends')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTrends(data);
        }
      })
      .catch(err => console.error("Failed to load trends:", err))
      .finally(() => setLoadingTrends(false));
  }, []);

  const { weeklyData, platformData, stats, aiScore, streak, upcomingUploads, suggestions } = DASHBOARD_ANALYTICS;

  return (
    <DashboardShell title="Command Center" subtitle="Your AI-powered content overview">
      <StaggerContainer className="space-y-6">
        {/* Stats Row */}
        <StaggerItem>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <GlassCard key={i} className="p-4" hover animate={false}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">{stat.label}</span>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      color: stat.change > 0 ? "var(--green)" : "var(--red)",
                      background: stat.change > 0 ? "var(--green-light)" : "var(--red-light)",
                    }}
                  >
                    {formatPercent(stat.change)}
                  </span>
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stat.unit === "$" && "$"}
                  {formatNumber(stat.value)}
                  {stat.unit === "%" && "%"}
                </div>
                <div className="mt-2 h-1 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (stat.value / 5000000) * 100)}%`, background: stat.color }}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </StaggerItem>

        {/* Main Grid */}
        <StaggerItem>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Analytics Chart */}
            <GlassCard className="xl:col-span-2 p-5" animate={false}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm">Performance Overview</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Last 7 days</p>
                </div>
                <div className="flex gap-1">
                  {(["views", "engagement", "subscribers"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-all ${
                        activeTab === tab
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                  <Tooltip
                    contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 10, fontSize: 12 }}
                    labelStyle={{ color: "var(--text-primary)" }}
                    itemStyle={{ color: "var(--accent)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeTab}
                    stroke="var(--accent)"
                    strokeWidth={2}
                    fill="url(#grad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Right Column */}
            <div className="space-y-4">
              {/* AI Score */}
              <GlassCard className="p-5" glow="purple" animate={false}>
                <h3 className="text-xs font-semibold text-[var(--text-secondary)] mb-4">AI Productivity Score</h3>
                <div className="flex items-center gap-4">
                  <AIScoreRing score={aiScore} size="md" label="Today" color="var(--purple)" />
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-[var(--purple)] mb-1">{aiScore}/100</div>
                    <div className="text-xs text-[var(--text-secondary)] mb-3">Excellent performance</div>
                    <div className="space-y-1.5">
                      {[
                        { label: "Consistency", val: 92 },
                        { label: "Output Quality", val: 85 },
                        { label: "Trend Timing", val: 79 },
                      ].map(({ label, val }) => (
                        <div key={label}>
                          <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-0.5">
                            <span>{label}</span><span>{val}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill bg-[var(--purple)]" style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Upload Streak */}
              <GlassCard className="p-4" animate={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mb-1">
                      Upload Streak <Flame size={12} className="text-[var(--orange)]" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--text-primary)]">{streak} <span className="text-sm font-normal text-[var(--text-secondary)]">days</span></div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Keep it going! Best: 21 days</p>
                  </div>
                  <div className="flex gap-1 flex-wrap max-w-[100px]">
                    {Array.from({ length: 14 }, (_, i) => (
                      <div
                         key={i}
                         className="w-5 h-5 rounded-sm"
                         style={{
                           background: i < streak
                             ? `color-mix(in srgb, var(--purple) ${40 + (i / streak) * 60}%, transparent)`
                             : "var(--bg-tertiary)",
                         }}
                       />
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </StaggerItem>

        {/* Bottom Grid */}
        <StaggerItem>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Platform Distribution */}
            <GlassCard className="p-5" animate={false}>
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Platform Distribution</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={platformData} dataKey="value" cx="50%" cy="50%" outerRadius={45} innerRadius={28} strokeWidth={0}>
                      {platformData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {platformData.map((p) => (
                    <div key={p.platform} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                         <span className="text-xs text-[var(--text-secondary)]">{p.platform}</span>
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* AI Suggestions */}
            <GlassCard className="p-5" animate={false}>
              <div className="flex items-center gap-2 mb-4">
                 <Bot size={16} className="text-[var(--accent)]" />
                 <h3 className="font-semibold text-sm text-[var(--text-primary)]">AI Suggestions</h3>
              </div>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
                  >
                    <span className="text-sm flex-shrink-0 mt-0.5 text-[var(--text-tertiary)]">•</span>
                    <p className="text-xs text-[var(--text-primary)] leading-snug">{s.text}</p>
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                      style={{ background: PRIORITY_COLORS[s.priority] ?? "var(--text-tertiary)" }}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Upcoming Uploads */}
            <GlassCard className="p-5" animate={false}>
              <div className="flex items-center gap-2 mb-4">
                 <CalendarDays size={16} className="text-[var(--purple)]" />
                 <h3 className="font-semibold text-sm text-[var(--text-primary)]">Upcoming Uploads</h3>
              </div>
              <div className="space-y-3">
                {(() => {
                  let uploads = upcomingUploads;
                  if (typeof window !== "undefined") {
                    try {
                      const cards = JSON.parse(localStorage.getItem("ractive_content_manager") || "[]");
                      const scheduled = cards.filter((c: any) => c.status === "Scheduled" && c.scheduledDate);
                      if (scheduled.length > 0) {
                        uploads = scheduled.map((c: any) => ({
                          title: c.title,
                          platform: c.platform,
                          date: c.scheduledDate,
                          time: "10:00 AM"
                        })).slice(0, 3);
                      }
                    } catch {}
                  }
                  return uploads.map((u: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--purple-light)] border border-[var(--border-default)] flex items-center justify-center flex-shrink-0 text-[var(--purple)]">
                        <PlatformIcon platform={u.platform as "YouTube" | "TikTok" | "Instagram"} size="xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)] truncate">{u.title}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{u.date} · {u.time}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </GlassCard>
          </div>
        </StaggerItem>

        {/* Trending Now Widget */}
        <StaggerItem>
          <GlassCard className="p-5" animate={false}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <Flame size={16} className="text-[var(--orange)]" />
                 <h3 className="font-semibold text-sm text-[var(--text-primary)]">Trending Now</h3>
              </div>
              <a href="/dashboard/trends" className="text-xs text-electric-purple-light hover:underline">View all →</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {loadingTrends ? (
                <div className="col-span-full text-center py-8 text-xs text-ractive-muted">
                  <div className="w-5 h-5 rounded-full border-2 border-electric-purple/30 border-t-electric-purple animate-spin mx-auto mb-2" />
                  Trend Hunter is scanning platforms...
                </div>
              ) : trends.length > 0 ? (
                trends.slice(0, 4).map((t: any, i: number) => {
                  const topic = t.topic || t.title || "Untitled";
                  const niche = t.niche || "Tech";
                  const score = t.score || t.viralScore || 0;
                  const vel = t.vel || t.trendVelocity || "Rising";
                  const color = t.color || "#8B5CF6";
                  return (
                    <div
                      key={topic + i}
                      className="p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--purple-light)] text-[var(--purple)] border border-[var(--purple-light)]">{niche}</span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ color, background: `${color}18` }}
                        >
                          {vel}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[var(--text-primary)] mb-2 leading-snug line-clamp-2">{topic}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color }}>{score}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-4 text-xs text-ractive-muted">No trends found</div>
              )}
            </div>
          </GlassCard>
        </StaggerItem>
      </StaggerContainer>
    </DashboardShell>
  );
}
