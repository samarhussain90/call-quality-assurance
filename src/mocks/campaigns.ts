export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: "active" | "paused" | "completed";
  startDate: string;
  endDate?: string;
  totalCalls: number;
  successRate: number;
  agentCount: number;
}

export const mockCampaigns: Campaign[] = [
  {
    id: "debt",
    name: "Debt Calls",
    description: "Outbound campaign for debt collection",
    status: "active",
    startDate: "2023-05-01T00:00:00Z",
    totalCalls: 1250,
    successRate: 68,
    agentCount: 12
  },
  {
    id: "roofing",
    name: "Roofing",
    description: "Inbound campaign for roofing services",
    status: "active",
    startDate: "2023-06-15T00:00:00Z",
    totalCalls: 850,
    successRate: 72,
    agentCount: 8
  },
  {
    id: "medicare",
    name: "Medicare ACA",
    description: "Outbound campaign for Medicare ACA enrollment",
    status: "paused",
    startDate: "2023-04-10T00:00:00Z",
    endDate: "2023-07-31T00:00:00Z",
    totalCalls: 2100,
    successRate: 65,
    agentCount: 15
  }
]; 