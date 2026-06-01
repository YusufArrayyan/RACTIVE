"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlatformBadge } from "@/components/ui/PlatformIcon";
import { AIScoreRing } from "@/components/ui/AIScoreRing";
import { formatNumber } from "@/lib/utils";
import type { ContentCard, ContentStatus } from "@/lib/types";

const PRIORITY_COLORS = { High: "#EF4444", Medium: "#F59E0B", Low: "#6b6b7b" };

const KANBAN_COLUMNS: { id: ContentStatus; label: string; color: string }[] = [
  { id: "Idea", label: "Ideas", color: "#6b6b7b" },
  { id: "Script", label: "Scripting", color: "#3B82F6" },
  { id: "Filming", label: "Filming", color: "#F59E0B" },
  { id: "Editing", label: "Editing", color: "#8B5CF6" },
  { id: "Scheduled", label: "Scheduled", color: "#EC4899" },
  { id: "Posted", label: "Posted", color: "#10B981" },
];

function getCards(): ContentCard[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("ractive_content_manager");
    if (data) return JSON.parse(data);
    return [];
  } catch {
    return [];
  }
}

function saveCards(cards: ContentCard[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("ractive_content_manager", JSON.stringify(cards));
  }
}

export default function ContentPage() {
  const [view, setView] = useState<"kanban" | "calendar">("kanban");
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<ContentCard | null>(null);
  const [dragOver, setDragOver] = useState<ContentStatus | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    setCards(getCards());
  }, []);

  const columnMap = useMemo(() => {
    const map: Record<ContentStatus, ContentCard[]> = {} as Record<ContentStatus, ContentCard[]>;
    KANBAN_COLUMNS.forEach(({ id }) => { map[id] = []; });
    cards.forEach((c) => { 
      if (!map[c.status]) map[c.status] = [];
      map[c.status].push(c); 
    });
    return map;
  }, [cards]);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("cardId", cardId);
    setDragging(cardId);
  };

  const handleDrop = (e: React.DragEvent, status: ContentStatus) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    setCards((prev) => {
      const updated = prev.map((c) => c.id === cardId ? { ...c, status } : c);
      saveCards(updated);
      return updated;
    });
    setDragOver(null);
    setDragging(null);
  };

  const removeCard = (id: string) => {
    setCards((prev) => {
      const updated = prev.filter(c => c.id !== id);
      saveCards(updated);
      return updated;
    });
    setSelectedCard(null);
  };

  return (
    <DashboardShell title="Content Manager" subtitle="Plan, organize, and schedule your content across all platforms">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
            <button onClick={() => setView("kanban")}
              className={`text-xs px-4 py-2 rounded-lg transition-all font-medium ${view === "kanban" ? "bg-electric-purple/20 text-electric-purple-light" : "text-ractive-muted hover:text-ractive-white"}`}>
              📋 Kanban
            </button>
            <button onClick={() => setView("calendar")}
              className={`text-xs px-4 py-2 rounded-lg transition-all font-medium ${view === "calendar" ? "bg-electric-purple/20 text-electric-purple-light" : "text-ractive-muted hover:text-ractive-white"}`}>
              📅 Calendar
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-ractive-muted">{cards.length} total pieces</div>
            <button 
              onClick={() => {
                const newCard = {
                  id: "card-" + Date.now(),
                  title: "New Content Idea",
                  description: "Click to edit this idea",
                  status: "Idea" as ContentStatus,
                  platform: "YouTube",
                  niche: "General",
                  aiPriority: "Medium" as "Low" | "Medium" | "High",
                  viralScore: 0,
                  estimatedViews: 0,
                };
                setCards(prev => {
                  const updated = [...prev, newCard];
                  saveCards(updated);
                  return updated;
                });
              }}
              className="btn-primary btn-sm"
            >
              + New Content
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "In Pipeline", val: cards.filter(c => !["Posted"].includes(c.status)).length, color: "#8B5CF6" },
            { label: "Scheduled", val: cards.filter(c => c.status === "Scheduled").length, color: "#EC4899" },
            { label: "Posted This Month", val: cards.filter(c => c.status === "Posted").length, color: "#10B981" },
            { label: "Avg Viral Score", val: cards.length > 0 ? Math.round(cards.reduce((s, c) => s + c.viralScore, 0) / cards.length) : 0, color: "#F59E0B" },
          ].map(({ label, val, color }) => (
            <GlassCard key={label} className="p-4" animate delay={0.05}>
              <p className="text-xs text-ractive-muted mb-1">{label}</p>
              <p className="text-2xl font-bold" style={{ color }}>{val}</p>
            </GlassCard>
          ))}
        </div>

        {view === "kanban" ? (
          /* ---- KANBAN VIEW ---- */
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {KANBAN_COLUMNS.map((col) => {
                const colCards = columnMap[col.id] ?? [];
                return (
                  <div key={col.id}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`w-64 rounded-2xl border p-3 transition-all duration-200 ${dragOver === col.id ? "border-electric-purple/40 bg-electric-purple/[0.04]" : "border-white/[0.06] bg-white/[0.02]"}`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{col.label}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${col.color}18`, color: col.color }}>
                        {colCards.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-2 min-h-[200px]">
                      {colCards.map((card) => (
                        <div key={card.id}
                          draggable
                          onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, card.id)}
                          onDragEnd={() => setDragging(null)}
                          onClick={() => setSelectedCard(card)}
                          className={`kanban-card hover:-translate-y-[1px] transition-transform ${dragging === card.id ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <PlatformBadge platform={card.platform} />
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ background: PRIORITY_COLORS[card.aiPriority] }} />
                          </div>
                          <p className="text-xs font-semibold text-ractive-white mb-2 leading-snug truncate-2">{card.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-ractive-muted">{formatNumber(card.estimatedViews)} est.</span>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3">
                                <svg viewBox="0 0 12 12">
                                  <circle cx="6" cy="6" r="4.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                                  <circle cx="6" cy="6" r="4.5" fill="none" stroke="#8B5CF6" strokeWidth="1.5"
                                    strokeDasharray={`${2 * Math.PI * 4.5 * card.viralScore / 100} ${2 * Math.PI * 4.5}`}
                                    strokeDashoffset={2 * Math.PI * 4.5 * 0.25}
                                    strokeLinecap="round" />
                                </svg>
                              </div>
                              <span className="text-[10px] font-bold text-electric-purple-light">{card.viralScore}</span>
                            </div>
                          </div>
                          {card.scheduledDate && (
                            <div className="mt-2 text-[10px] text-ractive-muted border-t border-white/[0.05] pt-2">
                              📅 {card.scheduledDate}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ---- CALENDAR VIEW ---- */
          <GlassCard className="p-6" animate>
            <div className="text-center mb-4">
              <h3 className="text-sm font-semibold text-ractive-white">Content Calendar</h3>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-center text-[10px] text-ractive-muted font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                // Simplified calendar visualization
                const dayCards = cards.filter(c => c.scheduledDate && new Date(c.scheduledDate).getDate() === day);
                const isToday = day === new Date().getDate();
                return (
                  <div key={day}
                    className={`min-h-[72px] rounded-xl p-1.5 border transition-colors ${isToday ? "border-electric-purple/40 bg-electric-purple/[0.06]" : "border-white/[0.04] hover:border-white/10"}`}>
                    <div className={`text-[10px] font-semibold mb-1 ${isToday ? "text-electric-purple-light" : "text-ractive-muted"}`}>{day}</div>
                    {dayCards.map(c => (
                      <div key={c.id} onClick={() => setSelectedCard(c)}
                        className="text-[9px] font-medium text-white mb-0.5 px-1.5 py-0.5 rounded truncate cursor-pointer"
                        style={{ background: c.platform === "YouTube" ? "rgba(255,0,0,0.25)" : c.platform === "TikTok" ? "rgba(105,201,208,0.2)" : "rgba(225,48,108,0.2)" }}>
                        {c.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* Card Detail Modal */}
        {selectedCard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedCard(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-6 max-w-md w-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <PlatformBadge platform={selectedCard.platform} />
                  <h2 className="text-base font-bold text-ractive-white mt-2">{selectedCard.title}</h2>
                </div>
                <AIScoreRing score={selectedCard.viralScore} size="sm" showLabel={false} />
              </div>
              <p className="text-sm text-ractive-muted mb-4">{selectedCard.description}</p>
              
              {selectedCard.script && (
                <div className="bg-white/[0.03] p-3 rounded-lg border border-white/[0.05] mb-4 max-h-32 overflow-y-auto">
                  <h4 className="text-[10px] text-electric-purple-light uppercase mb-1">Generated Script</h4>
                  <p className="text-xs text-ractive-white font-mono whitespace-pre-wrap">{selectedCard.script}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[10px] text-ractive-muted mb-1">Status</p>
                  <p className="text-sm font-semibold text-ractive-white">{selectedCard.status}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[10px] text-ractive-muted mb-1">AI Priority</p>
                  <p className="text-sm font-semibold" style={{ color: PRIORITY_COLORS[selectedCard.aiPriority] }}>{selectedCard.aiPriority}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => removeCard(selectedCard.id)} className="btn-ghost flex-1 justify-center text-sm text-red-400 hover:text-red-300">🗑️ Delete</button>
                <button onClick={() => setSelectedCard(null)} className="btn-primary flex-1 justify-center text-sm">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardShell>
  );
}
