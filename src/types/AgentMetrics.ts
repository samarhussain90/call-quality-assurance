export interface AgentMetrics {
  id: string;
  name: string;
  avatar?: string; // Optional avatar URL
  totalCalls: number;
  averageScore: number;
  complianceRate: number;
  trends: {
    qualityScore: "up" | "down" | "stable";
    complianceRate: "up" | "down" | "stable";
    callVolume: "up" | "down" | "stable";
  };
} 