"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIScoreRing } from "@/components/ui/AIScoreRing";
import { PlatformBadge } from "@/components/ui/PlatformIcon";
import { StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import { PLATFORMS, NICHES } from "@/lib/mock-data/trends";
import { formatNumber } from "@/lib/utils";
import type { Trend } from "@/lib/types";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Search, Globe, Filter } from "lucide-react";

const REGION_MAP: Record<string, { code: string; label: string }> = {
  Global:    { code: "US", label: "Global (US)" },
  Indonesia: { code: "ID", label: "Indonesia" },
  Japan:     { code: "JP", label: "Japan" },
  Korea:     { code: "KR", label: "Korea" },
  India:     { code: "IN", label: "India" },
  UK:        { code: "GB", label: "United Kingdom" },
  Brazil:    { code: "BR", label: "Brazil" },
};

const VEL_COLORS: Record<string, string> = {
  Exploding: "#EF4444", Rising: "#F59E0B", Stable: "#10B981", Declining: "#6b6b7b",
};
const SAT_COLORS: Record<string, string> = {
  Low: "#10B981", Medium: "#F59E0B", High: "#EF4444",
};

export default function TrendsPage() {
  const [platform, setPlatform] = useState("All");
  const [niche, setNiche] = useState("All");
  const [country, setCountry] = useState("Indonesia");
  const [selected, setSelected] = useState<Trend | null>(null);
  const [sort, setSort] = useState<"viralScore" | "opportunityScore" | "estimatedViews">("viralScore");
  const [activeTrends, setActiveTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real trends whenever country changes
  useEffect(() => {
    setLoading(true);
    setSelected(null);
    const regionCode = REGION_MAP[country]?.code || "US";
    fetch(`/api/trends?region=${regionCode}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setActiveTrends(data);
          setSelected(data[0]);
        } else {
          setActiveTrends([]);
        }
      })
      .catch(() => setActiveTrends([]))
      .finally(() => setLoading(false));
  }, [country]);

  const filtered = useMemo(() => {
    return activeTrends
      .filter((t) => {
        if (platform !== "All" && t.platform !== platform) return false;
        if (niche !== "All" && t.niche !== niche) return false;
        return true;
      })
      .sort((a, b) => b[sort] - a[sort]);
  }, [activeTrends, platform, niche, sort]);

  return (
    <DashboardShell title="Trend Discovery Engine" subtitle="Real-time viral opportunity scanner powered by AI">
      <div className="flex flex-col gap-6">
        {/* Filters */}
        <GlassCard className="p-4" animate>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs text-ractive-muted font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Region:
            </span>
            {Object.keys(REGION_MAP).map((c) => (
              <button key={c} onClick={() => setCountry(c)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${country === c ? "bg-electric-purple/20 text-electric-purple-light font-semibold border border-electric-purple/30" : "bg-white/[0.04] text-ractive-muted hover:text-ractive-white border border-transparent"}`}
              >{c}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-center mt-3 pt-3 border-t border-white/[0.05]">
            <span className="text-xs text-ractive-muted font-medium flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Platform:
            </span>
            {["All", ...PLATFORMS].slice(0, 6).map((p) => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${platform === p ? "bg-electric-purple/20 text-electric-purple-light font-semibold border border-electric-purple/30" : "bg-white/[0.04] text-ractive-muted hover:text-ractive-white border border-transparent"}`}
              >{p}</button>
            ))}
            <div className="w-px h-4 bg-white/10" />
            <select value={niche} onChange={(e) => setNiche(e.target.value)}
              className="text-xs bg-white/[0.04] border border-white/[0.08] text-ractive-white rounded-lg px-3 py-1.5 outline-none cursor-pointer">
              {NICHES.map((n) => <option key={n} value={n} className="bg-ractive-dark">{n}</option>)}
            </select>
            <div className="ml-auto">
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
                className="text-xs bg-white/[0.04] border border-white/[0.08] text-ractive-white rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                <option value="viralScore" className="bg-ractive-dark">Sort: Viral Score</option>
                <option value="opportunityScore" className="bg-ractive-dark">Sort: Opportunity</option>
                <option value="estimatedViews" className="bg-ractive-dark">Sort: Est. Views</option>
              </select>
            </div>
          </div>
        </GlassCard>

        <div className="flex items-center justify-between">
          <p className="text-sm text-ractive-muted"><span className="text-ractive-white font-semibold">{filtered.length}</span> trends found in <span className="text-electric-purple-light font-semibold">{country}</span></p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-ractive-muted">Live scanning</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Trend List */}
          <div className="lg:col-span-3 space-y-3">
            <StaggerContainer className="space-y-3">
              {filtered.map((trend, i) => (
                <StaggerItem key={trend.id}>
                  <motion.div onClick={() => setSelected(trend)} whileHover={{ x: 2 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selected?.id === trend.id ? "border-electric-purple/40 bg-electric-purple/[0.06]" : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"}`}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-full sm:w-40 h-24 rounded-lg bg-black/40 border border-white/5 flex-shrink-0 overflow-hidden relative">
                        {trend.thumbnail ? (
                          <img src={trend.thumbnail} alt={trend.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search className="w-5 h-5 text-ractive-muted" />
                          </div>
                        )}
                        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white border border-white/10">{i + 1}</div>
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-ractive-white leading-snug line-clamp-2">{trend.title}</p>
                          <AIScoreRing score={trend.viralScore} size="sm" showLabel={false} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <PlatformBadge platform={trend.platform} />
                          <span className="badge badge-purple text-[10px]">{trend.niche}</span>
                          <span className="badge text-[10px]" style={{ color: VEL_COLORS[trend.trendVelocity], background: `${VEL_COLORS[trend.trendVelocity]}18`, border: `1px solid ${VEL_COLORS[trend.trendVelocity]}30` }}>↑ {trend.trendVelocity}</span>
                          <span className="text-[10px] text-ractive-muted ml-auto">{formatNumber(trend.estimatedViews)} views</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 h-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trend.growthData}>
                          <defs>
                            <linearGradient id={`g-${trend.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={VEL_COLORS[trend.trendVelocity]} stopOpacity={0.4} />
                              <stop offset="95%" stopColor={VEL_COLORS[trend.trendVelocity]} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="score" stroke={VEL_COLORS[trend.trendVelocity]} strokeWidth={1.5} fill={`url(#g-${trend.id})`} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
              {loading && (
                <div className="text-center py-12 text-ractive-muted">
                  <div className="w-8 h-8 rounded-full border-2 border-electric-purple/30 border-t-electric-purple animate-spin mx-auto mb-3" />
                  <p className="text-sm">Fetching real-time trends from YouTube ({REGION_MAP[country]?.label})...</p>
                </div>
              )}
              {!loading && filtered.length === 0 && (
                <div className="text-center py-12 text-ractive-muted">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No trends match your filters</p>
                </div>
              )}
            </StaggerContainer>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div key={selected.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="sticky top-24 space-y-4">
                  <GlassCard className="p-5" glow="purple" animate={false}>
                    {selected.thumbnail && (
                      <div className="w-full h-40 rounded-lg overflow-hidden mb-4 border border-white/10">
                        <img src={selected.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h2 className="font-bold text-ractive-white text-sm mb-1 leading-snug">{selected.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <PlatformBadge platform={selected.platform} />
                      <span className="badge badge-purple text-[10px]">{selected.niche}</span>
                      <span className="badge badge-blue text-[10px]">{selected.country}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center"><AIScoreRing score={selected.viralScore} size="sm" color="#8B5CF6" showLabel /><span className="text-[10px] text-ractive-muted block mt-1">Viral</span></div>
                      <div className="text-center"><AIScoreRing score={selected.opportunityScore} size="sm" color="#10B981" showLabel /><span className="text-[10px] text-ractive-muted block mt-1">Opportunity</span></div>
                      <div className="text-center"><AIScoreRing score={Math.round(selected.engagementRate * 5)} size="sm" color="#F59E0B" showLabel /><span className="text-[10px] text-ractive-muted block mt-1">Engagement</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { label: "Est. Views", val: formatNumber(selected.estimatedViews) },
                        { label: "Velocity", val: selected.trendVelocity, color: VEL_COLORS[selected.trendVelocity] },
                        { label: "Saturation", val: selected.saturationLevel, color: SAT_COLORS[selected.saturationLevel] },
                        { label: "Engagement", val: `${selected.engagementRate}%` },
                      ].map(({ label, val, color }) => (
                        <div key={label} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                          <p className="text-ractive-muted mb-1">{label}</p>
                          <p className="font-bold" style={{ color: color ?? "#F5F5F5" }}>{val}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5" animate={false}>
                    <h3 className="text-xs font-semibold text-ractive-muted mb-3">AI Analysis</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Hook Pattern", val: selected.hookPattern },
                        { label: "Editing Style", val: selected.editingStyle },
                        { label: "Audience Behavior", val: selected.audienceBehavior },
                      ].map(({ label, val }) => (
                        <div key={label}>
                          <p className="text-[10px] text-ractive-muted font-medium uppercase tracking-wide mb-1">{label}</p>
                          <p className="text-xs text-ractive-white">{val}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-4" animate={false}>
                    <h3 className="text-xs font-semibold text-ractive-muted mb-3">Trending Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.hashtags.map((tag) => (
                        <span key={tag} className="badge badge-purple text-[10px]">{tag}</span>
                      ))}
                    </div>
                  </GlassCard>

                  <button className="btn-primary w-full justify-center">Generate Script for This Trend</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
