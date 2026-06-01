"use client";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, ChevronLeft, Clapperboard } from "lucide-react";

interface StoryboardEntry {
  id: string;
  topic: string;
  scenes: any[];
  createdAt: string;
}

function getHistory(): StoryboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("ractive_storyboards") || "[]");
  } catch { return []; }
}

function saveToHistory(entry: StoryboardEntry) {
  const history = getHistory();
  history.unshift(entry);
  if (history.length > 20) history.pop(); // max 20 entries
  localStorage.setItem("ractive_storyboards", JSON.stringify(history));
}

function removeFromHistory(id: string) {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem("ractive_storyboards", JSON.stringify(history));
}

export default function StoryboardPage() {
  const [topic, setTopic] = useState("");
  const [scenes, setScenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<StoryboardEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setScenes([]);
    setShowHistory(false);
    
    try {
      const res = await fetch("/api/storyboard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setScenes(data);
        // Save to history
        const entry: StoryboardEntry = {
          id: Date.now().toString(),
          topic,
          scenes: data,
          createdAt: new Date().toISOString(),
        };
        saveToHistory(entry);
        setHistory(getHistory());
      } else {
        alert("Failed to generate storyboard");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI.");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (entry: StoryboardEntry) => {
    setTopic(entry.topic);
    setScenes(entry.scenes);
    setShowHistory(false);
  };

  const deleteFromHistory = (id: string) => {
    removeFromHistory(id);
    setHistory(getHistory());
  };

  return (
    <DashboardShell title="Storyboard AI" subtitle="AI-generated shot lists, camera angles, and scene breakdowns">
      <div className="space-y-6">
        {/* Input & History Toggle */}
        <div className="flex gap-3">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Enter video topic for AI storyboard generation... (e.g. CV ATS vs Creative)" 
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ractive-white placeholder:text-ractive-muted outline-none focus:border-electric-purple/50" 
          />
          <button onClick={handleGenerate} disabled={loading} className="btn-primary px-6">
            {loading ? "Generating..." : "Generate"}
          </button>
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className={`btn-secondary px-4 flex items-center gap-2 ${showHistory ? 'border-electric-purple/40 bg-electric-purple/10' : ''}`}
            title="History"
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">{history.length}</span>
          </button>
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <GlassCard className="p-5">
                <h3 className="text-sm font-bold text-ractive-white mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-electric-purple-light" />
                  Storyboard History
                </h3>
                {history.length === 0 ? (
                  <p className="text-xs text-ractive-muted py-4 text-center">No storyboards generated yet. Create one above!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {history.map((entry) => (
                      <div key={entry.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/10 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-ractive-white line-clamp-1 flex-1">{entry.topic}</span>
                          <button onClick={() => deleteFromHistory(entry.id)} className="opacity-0 group-hover:opacity-100 text-ractive-muted hover:text-red-400 transition-all ml-2">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-ractive-muted mb-3">{entry.scenes.length} scenes — {new Date(entry.createdAt).toLocaleDateString()}</p>
                        <button onClick={() => loadFromHistory(entry)} className="text-[10px] text-electric-purple-light hover:underline flex items-center gap-1">
                          <ChevronLeft className="w-3 h-3 rotate-180" /> Load storyboard
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scenes */}
        <div className="space-y-3">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-ractive-muted">
              <div className="w-8 h-8 rounded-full border-2 border-electric-purple/30 border-t-electric-purple animate-spin mb-4" />
              <p className="text-sm">AI is directing your storyboard...</p>
            </div>
          )}

          {!loading && scenes.length === 0 && !showHistory && (
            <div className="py-16 flex flex-col items-center justify-center text-ractive-muted">
              <Clapperboard className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm font-medium text-ractive-white mb-1">No storyboard yet</p>
              <p className="text-xs">Enter a topic above and generate your first AI storyboard.</p>
            </div>
          )}

          <AnimatePresence>
            {!loading && scenes.map((scene, i) => (
              <motion.div key={scene.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-5 overflow-hidden relative group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 h-36 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 relative border border-white/[0.05]">
                      {scene.imagePrompt ? (
                        <img 
                          src={`https://image.pollinations.ai/prompt/${encodeURIComponent(scene.imagePrompt)}?width=400&height=225&nologo=true`} 
                          alt={scene.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-ractive-muted">No Image</div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/10">
                        Scene {scene.id || i + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-ractive-white">{scene.label}</h3>
                        <span className="badge badge-purple text-[10px]">AI Generated</span>
                      </div>
                      <p className="text-xs text-ractive-muted mb-4">{scene.desc}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[{ label: "Camera", val: scene.camera }, { label: "Lighting", val: scene.lighting }, { label: "Audio", val: scene.audio }].map(({ label, val }) => (
                          <div key={label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                            <p className="text-[10px] text-ractive-muted mb-1">{label}</p>
                            <p className="text-xs text-ractive-white font-medium line-clamp-2">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}
