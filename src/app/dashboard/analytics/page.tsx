"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import { DASHBOARD_ANALYTICS } from "@/lib/mock-data/agents";
import { formatNumber, formatPercent } from "@/lib/utils";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function AnalyticsPage() {
  const { weeklyData, stats } = DASHBOARD_ANALYTICS;
  return (
    <DashboardShell title="Advanced Analytics" subtitle="Deep performance insights powered by AI analysis">
      <StaggerContainer className="space-y-6">
        <StaggerItem>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <GlassCard key={i} className="p-5" animate={false}>
                <p className="text-xs text-ractive-muted mb-2">{s.label}</p>
                <p className="text-3xl font-bold" style={{ color: s.color }}>
                  {s.unit === "$" ? "$" : ""}{formatNumber(s.value)}{s.unit === "%" ? "%" : ""}
                </p>
                <p className="text-xs mt-1" style={{ color: s.change > 0 ? "#34d399" : "#f87171" }}>{formatPercent(s.change)} this month</p>
              </GlassCard>
            ))}
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-5" animate={false}>
              <h3 className="text-sm font-semibold text-ractive-white mb-4">Weekly Views</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: "#6b6b7b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b6b7b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                  <Tooltip contentStyle={{ background: "#16161c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} fill="url(#v)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
            <GlassCard className="p-5" animate={false}>
              <h3 className="text-sm font-semibold text-ractive-white mb-4">Weekly Engagement</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData} barSize={20}>
                  <XAxis dataKey="day" tick={{ fill: "#6b6b7b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b6b7b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#16161c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, fontSize: 12 }} />
                  <Bar dataKey="engagement" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </StaggerItem>
        <StaggerItem>
          <GlassCard className="p-5" animate={false}>
            <h3 className="text-sm font-semibold text-ractive-white mb-4">🤖 AI Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: "📈", tip: "Your best posting time is Thursday at 6PM — 3x higher average views" },
                { icon: "🎯", tip: "Videos under 8 minutes get 40% higher completion rate for your audience" },
                { icon: "🔥", tip: "AI niche videos outperform lifestyle 2.4x in subscriber conversion" },
                { icon: "💡", tip: "Adding 'How I' to titles increases CTR by 23% for your channel" },
              ].map(({ icon, tip }, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-lg">{icon}</span>
                  <p className="text-xs text-ractive-white leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </StaggerItem>
      </StaggerContainer>
    </DashboardShell>
  );
}
