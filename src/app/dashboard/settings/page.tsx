"use client";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Globe, Layers, Target, Instagram, Youtube, Twitter, Save, CheckCircle } from "lucide-react";

const NICHES = ["AI & Technology", "Finance & Investing", "Lifestyle & Vlog", "Gaming", "Education", "Comedy", "Storytelling", "Health & Fitness"];
const PLATFORMS = ["YouTube", "TikTok", "Instagram", "X / Twitter", "Threads", "Facebook Reels"];
const COUNTRIES = [
  { code: "ID", label: "Indonesia" },
  { code: "US", label: "United States" },
  { code: "JP", label: "Japan" },
  { code: "KR", label: "Korea" },
  { code: "IN", label: "India" },
  { code: "GB", label: "United Kingdom" },
  { code: "BR", label: "Brazil" },
];

function loadSettings() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("ractive_settings") || "null"); } catch { return null; }
}

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>(["AI & Technology"]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["YouTube", "TikTok", "Instagram"]);
  const [selectedCountry, setSelectedCountry] = useState("ID");
  const [igUsername, setIgUsername] = useState("");
  const [ytChannel, setYtChannel] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = loadSettings();
    if (s) {
      setName(s.name || "");
      setSelectedNiches(s.niches || ["AI & Technology"]);
      setSelectedPlatforms(s.platforms || ["YouTube", "TikTok", "Instagram"]);
      setSelectedCountry(s.country || "ID");
      setIgUsername(s.igUsername || "");
      setYtChannel(s.ytChannel || "");
      setTwitterHandle(s.twitterHandle || "");
    }
  }, []);

  const toggleNiche = (n: string) => {
    setSelectedNiches(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n].slice(0, 3));
  };

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSave = () => {
    const settings = {
      name,
      niches: selectedNiches,
      platforms: selectedPlatforms,
      country: selectedCountry,
      igUsername,
      ytChannel,
      twitterHandle,
    };
    localStorage.setItem("ractive_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell title="Settings & Creator Memory" subtitle="Customize RACTIVE to your creator profile and goals">
      <div className="max-w-2xl space-y-6">
        {/* Creator Profile */}
        <GlassCard className="p-6" animate>
          <h3 className="text-sm font-bold text-ractive-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-electric-purple-light" />
            Creator Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-ractive-muted block mb-1.5">Channel / Creator Name</label>
              <input 
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your channel name"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-ractive-white placeholder:text-ractive-muted outline-none focus:border-electric-purple/50 transition-colors" 
              />
            </div>
          </div>
        </GlassCard>

        {/* Country */}
        <GlassCard className="p-6" animate delay={0.03}>
          <h3 className="text-sm font-bold text-ractive-white mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-electric-purple-light" />
            Country / Region
          </h3>
          <p className="text-xs text-ractive-muted mb-4">Trends, analytics, and recommendations will be tailored to this region.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => setSelectedCountry(c.code)}
                className={`text-xs px-3 py-2.5 rounded-lg border transition-all text-left ${selectedCountry === c.code ? "border-electric-purple/40 bg-electric-purple/10 text-electric-purple-light font-semibold" : "border-white/[0.06] text-ractive-muted hover:text-ractive-white hover:border-white/10"}`}
              >{c.label}</button>
            ))}
          </div>
        </GlassCard>

        {/* Niche */}
        <GlassCard className="p-6" animate delay={0.06}>
          <h3 className="text-sm font-bold text-ractive-white mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-electric-purple-light" />
            Primary Niches <span className="text-[10px] font-normal text-ractive-muted">(max 3)</span>
          </h3>
          <p className="text-xs text-ractive-muted mb-4">AI agents will prioritize trends and scripts for these niches.</p>
          <div className="grid grid-cols-2 gap-2">
            {NICHES.map(n => (
              <button key={n} onClick={() => toggleNiche(n)}
                className={`text-xs px-3 py-2 rounded-lg border transition-all text-left ${selectedNiches.includes(n) ? "border-electric-purple/40 bg-electric-purple/10 text-electric-purple-light" : "border-white/[0.06] text-ractive-muted hover:text-ractive-white hover:border-white/10"}`}
              >{n}</button>
            ))}
          </div>
        </GlassCard>

        {/* Social Media Accounts */}
        <GlassCard className="p-6" animate delay={0.09}>
          <h3 className="text-sm font-bold text-ractive-white mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-electric-purple-light" />
            Connected Social Accounts
          </h3>
          <p className="text-xs text-ractive-muted mb-4">Enter your usernames to enable social media analytics tracking.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <input 
                value={igUsername} onChange={(e) => setIgUsername(e.target.value)}
                placeholder="Instagram username (e.g. rayyankerz)"
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-ractive-white placeholder:text-ractive-muted outline-none focus:border-electric-purple/50 transition-colors" 
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                <Youtube className="w-4 h-4 text-white" />
              </div>
              <input 
                value={ytChannel} onChange={(e) => setYtChannel(e.target.value)}
                placeholder="YouTube channel name or handle"
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-ractive-white placeholder:text-ractive-muted outline-none focus:border-electric-purple/50 transition-colors" 
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                <Twitter className="w-4 h-4 text-[var(--accent-text)]" />
              </div>
              <input 
                value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="X / Twitter handle (e.g. @username)"
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-ractive-white placeholder:text-ractive-muted outline-none focus:border-electric-purple/50 transition-colors" 
              />
            </div>
          </div>
        </GlassCard>

        {/* Active Platforms */}
        <GlassCard className="p-6" animate delay={0.12}>
          <h3 className="text-sm font-bold text-ractive-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-electric-purple-light" />
            Active Platforms
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => togglePlatform(p)}
                className={`text-xs px-3 py-2 rounded-lg border transition-all text-left ${selectedPlatforms.includes(p) ? "border-electric-purple/40 bg-electric-purple/10 text-electric-purple-light" : "border-white/[0.06] text-ractive-muted hover:text-ractive-white hover:border-white/10"}`}
              >{p}</button>
            ))}
          </div>
        </GlassCard>

        {/* Save */}
        <button onClick={handleSave} className="btn-primary w-full justify-center py-3 flex items-center gap-2">
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved! AI Will Auto-Adapt</>
          ) : (
            <><Save className="w-4 h-4" /> Save Profile</>
          )}
        </button>
      </div>
    </DashboardShell>
  );
}
