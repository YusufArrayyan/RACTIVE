"use client";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIScoreRing } from "@/components/ui/AIScoreRing";
import { Search, Loader2, Trash2 } from "lucide-react";

interface Competitor {
  name: string;
  handle?: string;
  thumbnail?: string;
  niche: string;
  subs: string;
  cadence: string;
  avgViews: string;
  viralScore: number;
}

const DEFAULT_COMPETITORS: Competitor[] = [
  { name: "MKBHD", niche: "Tech", subs: "18.2M", cadence: "2x/week", avgViews: "1.2M", viralScore: 88 },
  { name: "Graham Stephan", niche: "Finance", subs: "4.7M", cadence: "1x/week", avgViews: "420K", viralScore: 79 },
  { name: "MrBeast", niche: "Entertainment", subs: "245M", cadence: "3x/week", avgViews: "45M", viralScore: 99 },
  { name: "Ali Abdaal", niche: "Productivity", subs: "5.1M", cadence: "1x/week", avgViews: "380K", viralScore: 82 },
];

function loadCompetitors(): Competitor[] {
  if (typeof window === "undefined") return DEFAULT_COMPETITORS;
  try {
    const saved = localStorage.getItem("ractive_competitors");
    if (saved) return JSON.parse(saved);
    return DEFAULT_COMPETITORS;
  } catch {
    return DEFAULT_COMPETITORS;
  }
}

function saveCompetitors(comps: Competitor[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("ractive_competitors", JSON.stringify(comps));
  }
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCompetitors(loadCompetitors());
  }, []);

  const handleAnalyze = async () => {
    if (!inputUrl.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze competitor");
      }

      const newComp: Competitor = {
        name: data.name,
        handle: data.handle,
        thumbnail: data.thumbnail,
        niche: data.niche || "General",
        subs: data.subs,
        cadence: data.cadence,
        avgViews: data.avgViews,
        viralScore: data.viralScore,
      };

      // Check if already exists to avoid duplicates
      setCompetitors(prev => {
        const filtered = prev.filter(c => c.name !== newComp.name && c.handle !== newComp.handle);
        const updated = [newComp, ...filtered].slice(0, 10); // Keep max 10
        saveCompetitors(updated);
        return updated;
      });
      setInputUrl("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  const removeCompetitor = (name: string) => {
    setCompetitors(prev => {
      const updated = prev.filter(c => c.name !== name);
      saveCompetitors(updated);
      return updated;
    });
    if (selectedCompetitor?.name === name) setSelectedCompetitor(null);
  };

  return (
    <DashboardShell title="Competitor Analysis" subtitle="AI-powered competitor intelligence and content gap discovery">
      <div className="space-y-5">
        <GlassCard className="p-4" animate>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ractive-muted" />
              <input 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Enter YouTube channel name or URL to analyze... (e.g. @MrBeast)" 
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-ractive-white placeholder:text-ractive-muted outline-none focus:border-electric-purple/50" 
              />
            </div>
            <button onClick={handleAnalyze} disabled={loading} className="btn-primary px-6 flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "🎯 Analyze"}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-2 ml-2">{error}</p>}
        </GlassCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {competitors.map((c, i) => (
            <GlassCard key={c.name + i} className="p-5 group" hover delay={i * 0.05}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center text-electric-purple-light font-bold">
                      {c.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-ractive-white leading-tight">{c.name}</h3>
                    <p className="text-[10px] text-ractive-muted">{c.handle || "YouTube"}</p>
                    <div className="flex gap-2 mt-1"><span className="badge badge-purple text-[10px]">{c.niche}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => removeCompetitor(c.name)} className="opacity-0 group-hover:opacity-100 text-ractive-muted hover:text-red-400 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <AIScoreRing score={c.viralScore} size="sm" showLabel={false} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[{ label: "Subscribers", val: c.subs }, { label: "Cadence", val: c.cadence }, { label: "Avg Views", val: c.avgViews }].map(({ label, val }) => (
                  <div key={label} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-center">
                    <p className="text-[10px] text-ractive-muted mb-0.5">{label}</p>
                    <p className="text-xs font-bold text-ractive-white">{val}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedCompetitor(c)} className="btn-ghost btn-sm w-full justify-center">View Full Analysis →</button>
            </GlassCard>
          ))}
          {competitors.length === 0 && (
            <div className="col-span-full py-12 text-center text-ractive-muted">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No competitors analyzed yet. Search a channel above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Competitor Modal */}
      {selectedCompetitor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCompetitor(null)}>
          <div className="glass-card p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {selectedCompetitor.thumbnail ? (
                  <img src={selectedCompetitor.thumbnail} alt={selectedCompetitor.name} className="w-14 h-14 rounded-full border border-white/10" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-electric-purple/20 flex items-center justify-center text-electric-purple-light font-bold text-xl">
                    {selectedCompetitor.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-ractive-white">{selectedCompetitor.name}</h2>
                  <p className="text-xs text-ractive-muted">{selectedCompetitor.handle}</p>
                </div>
              </div>
              <AIScoreRing score={selectedCompetitor.viralScore} size="md" showLabel />
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <h4 className="text-[10px] text-electric-purple-light uppercase mb-2">Content Strategy</h4>
                <p className="text-xs text-ractive-white leading-relaxed">
                  Based on AI analysis, this creator focuses heavily on high-retention editing and fast-paced hooks. Their posting cadence of {selectedCompetitor.cadence} suggests a quality-over-quantity approach.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <h4 className="text-[10px] text-electric-purple-light uppercase mb-2">Content Gaps You Can Fill</h4>
                <ul className="text-xs text-ractive-white list-disc pl-4 space-y-1">
                  <li>More actionable step-by-step tutorials</li>
                  <li>Behind-the-scenes content (highly requested in their comments)</li>
                  <li>Shorter, more punchy YouTube Shorts</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setSelectedCompetitor(null)} className="btn-primary w-full justify-center">Close Analysis</button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
