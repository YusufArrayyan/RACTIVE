import type { ContentCard, ContentStatus } from "@/lib/types";

export const KANBAN_COLUMNS: { id: ContentStatus; label: string; color: string }[] = [
  { id: "Idea", label: "💡 Idea", color: "#6b6b7b" },
  { id: "Research", label: "🔍 Research", color: "#F59E0B" },
  { id: "Script", label: "✍️ Script", color: "#8B5CF6" },
  { id: "Filming", label: "🎬 Filming", color: "#3B82F6" },
  { id: "Editing", label: "✂️ Editing", color: "#06B6D4" },
  { id: "Ready", label: "✅ Ready", color: "#10B981" },
  { id: "Scheduled", label: "📅 Scheduled", color: "#EC4899" },
  { id: "Posted", label: "🚀 Posted", color: "#a78bfa" },
];

export const MOCK_CONTENT: ContentCard[] = [];
