import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCampaign } from "@/contexts/CampaignContext";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface DashboardMetrics {
  totalCalls: number;
  completedCalls: number;
  successRate: number;
  avgDuration: number;
  complianceRate: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topAgents: {
    name: string;
    calls: number;
    successRate: number;
  }[];
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const { selectedCampaign } = useCampaign();
  const { metrics, isFiltered, campaignName } = useCallAnalytics();

  // Mock data - in a real app, this would come from an API
  const dashboardData: DashboardMetrics = selectedCampaign ? {
    totalCalls: metrics.totalCalls,
    completedCalls: metrics.completedCalls,
    successRate: metrics.successRate,
    avgDuration: metrics.avgDuration,
    complianceRate: metrics.complianceRate,
    sentimentBreakdown: metrics.sentimentBreakdown,
    topAgents: metrics.topPerformingAgents.map(agent => ({
      name: agent.agent,
      calls: agent.totalCalls,
      successRate: agent.successRate
    }))
  } : {
    totalCalls: 1250,
    completedCalls: 1180,
    successRate: 85,
    avgDuration: 240,
    complianceRate: 92,
    sentimentBreakdown: {
      positive: 850,
      neutral: 300,
      negative: 100
    },
    topAgents: [
      { name: "John Smith", calls: 150, successRate: 88 },
      { name: "Sarah Johnson", calls: 120, successRate: 85 },
      { name: "Michael Brown", calls: 180, successRate: 90 }
    ]
  };

  const sentimentData = [
    { name: "Positive", value: dashboardData.sentimentBreakdown.positive },
    { name: "Neutral", value: dashboardData.sentimentBreakdown.neutral },
    { name: "Negative", value: dashboardData.sentimentBreakdown.negative }
  ];

  const COLORS = ["#4caf50", "#ff9800", "#f44336"];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard: {campaignName}
        </h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.completedCalls} completed calls
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.completedCalls} successful calls
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dashboardData.avgDuration / 60)}m</div>
            <p className="text-xs text-muted-foreground">
              Per call
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Across all calls
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.topAgents}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#4caf50" name="Total Calls" />
                  <Bar dataKey="successRate" fill="#2196f3" name="Success Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isFiltered && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Select a campaign from the sidebar to view campaign-specific dashboard metrics.
          </p>
        </div>
      )}
    </div>
  );
} 