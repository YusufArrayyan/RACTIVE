"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIScoreRing } from "@/components/ui/AIScoreRing";
import { StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import { MOCK_AGENTS } from "@/lib/mock-data/agents";
import { useRouter } from "next/navigation";

const STATUS_COLORS = { Active: "#10B981", Processing: "#F59E0B", Idle: "#6b6b7b" };

export default function AgentsPage() {
  const router = useRouter();

  return (
    <DashboardShell title="AI Agents System" subtitle="Your AI team works 24/7 to optimize your content pipeline">
      <StaggerContainer className="space-y-6">
        {/* Overview */}
        <StaggerItem>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Agents", val: MOCK_AGENTS.filter(a => a.status === "Active").length, color: "#10B981" },
              { label: "Tasks Today", val: MOCK_AGENTS.reduce((s, a) => s + Math.floor(a.tasksCompleted / 30), 0), color: "#8B5CF6" },
              { label: "Total Completed", val: MOCK_AGENTS.reduce((s, a) => s + a.tasksCompleted, 0).toLocaleString(), color: "#3B82F6" },
            ].map(({ label, val, color }) => (
              <GlassCard key={label} className="p-5" animate={false}>
                <p className="text-xs text-ractive-muted mb-1">{label}</p>
                <p className="text-3xl font-bold" style={{ color }}>{val}</p>
              </GlassCard>
            ))}
          </div>
        </StaggerItem>

        {/* Agent Cards */}
        <StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {MOCK_AGENTS.map((agent, i) => (
              <GlassCard key={agent.id} className="p-5" hover delay={i * 0.05} glow={agent.status === "Active" ? "purple" : "none"}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${agent.color}18`, border: `1px solid ${agent.color}30` }}>
                      {agent.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ractive-white">{agent.name} AI</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[agent.status] }} />
                        <span className="text-[10px] font-medium" style={{ color: STATUS_COLORS[agent.status] }}>{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <AIScoreRing score={Math.min(100, Math.round(agent.tasksCompleted / 35))} size="sm" color={agent.color} showLabel={false} />
                </div>
                <p className="text-xs text-ractive-muted mb-3 leading-snug">{agent.role}</p>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04] mb-3">
                  <p className="text-[10px] text-ractive-muted mb-0.5">Last Action</p>
                  <p className="text-xs text-ractive-white">{agent.lastAction}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-ractive-muted">{agent.tasksCompleted.toLocaleString()} tasks completed</span>
                  <button 
                    onClick={() => router.push("/dashboard/settings")}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-ractive-muted hover:text-ractive-white border border-white/[0.06] transition-colors"
                  >
                    Configure
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </StaggerItem>
      </StaggerContainer>
    </DashboardShell>
  );
}
