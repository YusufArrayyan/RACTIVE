export type Platform = "YouTube" | "TikTok" | "Instagram" | "X" | "Threads" | "Facebook" | "Shorts";
export type Niche = "Tech" | "AI" | "Finance" | "Gaming" | "Lifestyle" | "Storytelling" | "Education" | "Comedy" | "Investing";
export type Country = "Global" | "USA" | "Indonesia" | "Japan" | "Korea";

export interface Trend {
  id: string;
  title: string;
  niche: Niche;
  platform: Platform;
  country: Country;
  thumbnail?: string;
  viralScore: number;         // 0-100
  opportunityScore: number;   // 0-100
  saturationLevel: "Low" | "Medium" | "High";
  trendVelocity: "Exploding" | "Rising" | "Stable" | "Declining";
  estimatedViews: number;
  engagementRate: number;
  hookPattern: string;
  editingStyle: string;
  audienceBehavior: string;
  growthData: { day: string; score: number }[];
  hashtags: string[];
}

export interface ContentCard {
  id: string;
  title: string;
  platform: Platform;
  niche: Niche;
  status: ContentStatus;
  viralScore: number;
  aiPriority: "High" | "Medium" | "Low";
  scheduledDate?: string;
  thumbnail?: string;
  description: string;
  estimatedViews: number;
}

export type ContentStatus =
  | "Idea"
  | "Research"
  | "Script"
  | "Filming"
  | "Editing"
  | "Ready"
  | "Scheduled"
  | "Posted";

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Idle" | "Processing";
  lastAction: string;
  tasksCompleted: number;
  icon: string;
  color: string;
}

export interface AnalyticsStat {
  label: string;
  value: number;
  change: number;
  unit: string;
  color: string;
}
