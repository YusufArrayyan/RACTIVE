"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { AITypingEffect } from "@/components/ui/AITypingEffect";
import { PlatformBadge } from "@/components/ui/PlatformIcon";
import { SCRIPT_STYLES } from "@/lib/mock-data/agents";
import { PLATFORMS } from "@/lib/mock-data/trends";

const TOPICS = [
  "AI tools that replace your entire team",
  "How I made $10K with no followers",
  "5 investing mistakes beginners make",
  "I tried every productivity app for 30 days",
  "The truth about passive income",
];

export default function ScriptsPage() {
  const [topic, setTopic] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("mrbeast");
  const [selectedPlatform, setSelectedPlatform] = useState("YouTube");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [scriptKey, setScriptKey] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const [currentScript, setCurrentScript] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim() && !generating) return;
    setGenerating(true);
    setGenerated(false);
    
    try {
      const res = await fetch("/api/scripts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, style: selectedStyle, platform: selectedPlatform })
      });
      
      const data = await res.json();
      if (res.ok && data) {
        setCurrentScript(data);
        setGenerated(true);
        setScriptKey((k) => k + 1);
      } else {
        alert("Failed to generate script: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI engine.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (section: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <DashboardShell title="AI Script Engine" subtitle="Generate viral scripts, hooks, and copy for any platform">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left — Controls */}
        <div className="xl:col-span-2 space-y-5">
          {/* Topic Input */}
          <GlassCard className="p-5" animate>
            <h3 className="text-sm font-semibold text-ractive-white mb-3 flex items-center gap-2">
              <LucideIcons.Lightbulb className="w-4 h-4 text-electric-purple-light" />
              Topic / Idea
            </h3>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is your video about? e.g. 'AI tools that replace your entire marketing team'"
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ractive-white placeholder:text-ractive-muted outline-none resize-none focus:border-electric-purple/50 transition-colors"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-ractive-muted">Quick ideas:</span>
              {TOPICS.slice(0, 3).map((t) => (
                <button key={t} onClick={() => setTopic(t)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] text-ractive-muted hover:text-ractive-white border border-white/[0.06] hover:border-white/10 transition-all truncate max-w-[200px]">
                  {t}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Writing Style */}
          <GlassCard className="p-5" animate delay={0.05}>
            <h3 className="text-sm font-semibold text-ractive-white mb-3 flex items-center gap-2">
              <LucideIcons.PenTool className="w-4 h-4 text-electric-purple-light" />
              Writing Style
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SCRIPT_STYLES.map((style) => {
                const Icon = (LucideIcons as any)[style.iconName || "FileText"] || LucideIcons.FileText;
                return (
                  <button key={style.id} onClick={() => setSelectedStyle(style.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${selectedStyle === style.id ? "border-electric-purple/40 bg-electric-purple/10" : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"}`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedStyle === style.id ? 'text-electric-purple-light' : 'text-ractive-muted'}`} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-ractive-white truncate">{style.label}</div>
                      <div className="text-[10px] text-ractive-muted mt-0.5 leading-snug">{style.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </GlassCard>

          {/* Platform */}
          <GlassCard className="p-5" animate delay={0.1}>
            <h3 className="text-sm font-semibold text-ractive-white mb-3 flex items-center gap-2">
              <LucideIcons.MonitorSmartphone className="w-4 h-4 text-electric-purple-light" />
              Target Platform
            </h3>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.slice(0, 6).map((p) => (
                <button key={p} onClick={() => setSelectedPlatform(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${selectedPlatform === p ? "bg-electric-purple/20 text-electric-purple-light font-semibold border border-electric-purple/30" : "bg-white/[0.04] text-ractive-muted hover:text-ractive-white border border-white/[0.06]"}`}
                >{p}</button>
              ))}
            </div>
          </GlassCard>

          {/* Generate Button */}
          <button onClick={handleGenerate} disabled={generating}
            className={`btn-primary w-full justify-center py-4 text-sm ${generating ? "opacity-70 cursor-not-allowed" : ""}`}
            style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)", fontSize: 14 }}>
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI is writing your script...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LucideIcons.Zap className="w-4 h-4" />
                Generate Script
              </span>
            )}
          </button>
        </div>

        {/* Right — Output */}
        <div className="xl:col-span-3">
          <AnimatePresence mode="wait">
            {!generated && !generating && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center glass-card p-12">
                <LucideIcons.Sparkles className="w-12 h-12 text-electric-purple-light mb-4" />
                <h3 className="text-lg font-bold text-ractive-white mb-2">Ready to Write</h3>
                <p className="text-sm text-ractive-muted max-w-xs">Enter your topic, choose a writing style, select your platform, and let the AI generate your viral script.</p>
              </motion.div>
            )}

            {generating && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center glass-card p-12 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-electric-purple/30 border-t-electric-purple animate-spin mb-6" />
                <h3 className="text-base font-semibold text-ractive-white mb-2">AI Writing Your Script</h3>
                <div className="space-y-1 text-xs text-ractive-muted">
                  <p>Analyzing top-performing content...</p>
                  <p>Optimizing for {selectedPlatform}...</p>
                  <p>Applying {SCRIPT_STYLES.find(s => s.id === selectedStyle)?.label} style...</p>
                </div>
              </motion.div>
            )}

            {generated && (
              <motion.div key={`result-${scriptKey}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Header */}
                <GlassCard className="p-4" animate={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-electric-purple/20 flex items-center justify-center text-electric-purple-light">
                        {(() => {
                          const styleObj = SCRIPT_STYLES.find(s => s.id === selectedStyle);
                          const Icon = styleObj ? (LucideIcons as any)[styleObj.iconName] : LucideIcons.FileText;
                          return <Icon className="w-4 h-4" />;
                        })()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ractive-white">{SCRIPT_STYLES.find(s => s.id === selectedStyle)?.label} Style</div>
                        <div className="flex items-center gap-2"><PlatformBadge platform={selectedPlatform as "YouTube" | "TikTok" | "Instagram"} /></div>
                      </div>
                    </div>
                    <span className="badge badge-green text-[10px]">✓ Generated</span>
                  </div>
                </GlassCard>

                {/* Title */}
                <GlassCard className="p-5" animate={false}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-ractive-muted uppercase tracking-wide">Suggested Title</h3>
                    <button onClick={() => handleCopy("title", currentScript.title)} className="text-[10px] text-electric-purple-light hover:underline">{copiedSection === "title" ? "✓ Copied!" : "Copy"}</button>
                  </div>
                  <p className="text-sm font-bold text-ractive-white">
                    <AITypingEffect key={`title-${scriptKey}`} text={currentScript.title} speed={20} />
                  </p>
                </GlassCard>

                {/* Hook */}
                <GlassCard className="p-5" glow="purple" animate={false}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-electric-purple-light uppercase tracking-wide">🎣 Hook</h3>
                    <button onClick={() => handleCopy("hook", currentScript.hook)} className="text-[10px] text-electric-purple-light hover:underline">{copiedSection === "hook" ? "✓ Copied!" : "Copy"}</button>
                  </div>
                  <p className="text-sm text-ractive-white leading-relaxed">
                    <AITypingEffect key={`hook-${scriptKey}`} text={currentScript.hook} speed={15} startDelay={300} />
                  </p>
                </GlassCard>

                {/* Full Script */}
                <GlassCard className="p-5" animate={false}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-ractive-muted uppercase tracking-wide">📝 Full Script</h3>
                    <button onClick={() => handleCopy("script", currentScript.script)} className="text-[10px] text-electric-purple-light hover:underline">{copiedSection === "script" ? "✓ Copied!" : "Copy Script"}</button>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] font-mono text-xs text-ractive-white/90 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                    <AITypingEffect key={`script-${scriptKey}`} text={currentScript.script} speed={8} startDelay={600} />
                  </div>
                </GlassCard>

                {/* CTA + Hashtags */}
                <div className="grid grid-cols-2 gap-4">
                  <GlassCard className="p-4" animate={false}>
                    <h3 className="text-xs font-semibold text-ractive-muted mb-2">📣 CTA</h3>
                    <p className="text-xs text-ractive-white">{currentScript.cta}</p>
                  </GlassCard>
                  <GlassCard className="p-4" animate={false}>
                    <h3 className="text-xs font-semibold text-ractive-muted mb-2"># Hashtags</h3>
                    <p className="text-xs text-electric-purple-light">{currentScript.hashtags}</p>
                  </GlassCard>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={handleGenerate} className="btn-ghost flex-1 justify-center text-sm">🔄 Regenerate</button>
                  <button onClick={() => {
                    const cards = JSON.parse(localStorage.getItem("ractive_content_manager") || "[]");
                    const newCard = {
                      id: "card-" + Date.now(),
                      title: currentScript.title,
                      description: "AI Generated Script: " + topic,
                      status: "Idea",
                      platform: selectedPlatform,
                      niche: "AI Generated",
                      aiPriority: "High",
                      viralScore: Math.floor(Math.random() * 15) + 80,
                      estimatedViews: Math.floor(Math.random() * 500000) + 100000,
                      script: currentScript.script
                    };
                    localStorage.setItem("ractive_content_manager", JSON.stringify([...cards, newCard]));
                    alert("Added to Content Manager!");
                  }} className="btn-primary flex-1 justify-center text-sm">📅 Add to Content Manager</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}
