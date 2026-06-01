"use client";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Brain, Trash2, Search } from "lucide-react";

interface Note {
  id: string;
  title: string;
  preview: string;
  type: string;
  date: string;
  color: string;
}

const NOTE_TYPES = ["All", "Ideas", "Hooks", "Research", "Swipe File", "Scripts", "Competitor"];
const TYPE_COLORS: Record<string, string> = {
  Ideas: "#F59E0B",
  Hooks: "#EF4444",
  Research: "#3B82F6",
  "Swipe File": "#10B981",
  Scripts: "#8B5CF6",
  Competitor: "#EC4899",
};

function getNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("ractive_brain_notes") || "[]");
  } catch { return []; }
}

function saveNotes(notes: Note[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("ractive_brain_notes", JSON.stringify(notes));
  }
}

export default function BrainPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const handleAdd = () => {
    if (!input.trim()) return;
    const isUrl = input.startsWith("http");
    const type = isUrl ? "Swipe File" : "Ideas";
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: isUrl ? "Saved Link" : "Quick Note",
      preview: input,
      type: type,
      date: new Date().toLocaleDateString(),
      color: TYPE_COLORS[type] || "#8B5CF6"
    };

    setNotes(prev => {
      const updated = [newNote, ...prev];
      saveNotes(updated);
      return updated;
    });
    setInput("");
  };

  const removeNote = (id: string) => {
    setNotes(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotes(updated);
      return updated;
    });
  };

  const filtered = selectedType === "All" ? notes : notes.filter(n => n.type === selectedType);

  return (
    <DashboardShell title="Content Brain" subtitle="Your second brain — ideas, research, hooks, swipe files, and inspiration">
      <div className="space-y-5">
        <GlassCard className="p-4">
          <div className="flex gap-3">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Add idea, note, or paste inspiration URL..." 
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ractive-white placeholder:text-ractive-muted outline-none focus:border-electric-purple/50" 
            />
            <button onClick={handleAdd} className="btn-primary px-6">+ Add</button>
          </div>
        </GlassCard>

        <div className="flex gap-2 flex-wrap">
          {NOTE_TYPES.map(t => (
            <button 
              key={t} 
              onClick={() => setSelectedType(t)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${selectedType === t ? "bg-electric-purple/20 text-electric-purple-light border border-electric-purple/30 font-semibold" : "bg-white/[0.04] text-ractive-muted hover:text-ractive-white border border-white/[0.06]"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note, i) => (
            <GlassCard key={note.id} className="p-5 cursor-pointer group" hover delay={i * 0.05}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-ractive-white">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-ractive-white truncate">{note.title}</h3>
                  <p className="text-[10px] text-ractive-muted">{note.date}</p>
                </div>
                <button onClick={() => removeNote(note.id)} className="opacity-0 group-hover:opacity-100 text-ractive-muted hover:text-red-400 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: note.color }} />
              </div>
              <p className="text-xs text-ractive-muted leading-relaxed line-clamp-3">{note.preview}</p>
            </GlassCard>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-ractive-muted">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notes found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
