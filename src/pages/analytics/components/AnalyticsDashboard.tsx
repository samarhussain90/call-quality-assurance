import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalCalls: 1247,
    avgDuration: "12:45",
    successRate: 87.5,
    activeAgents: 24,
    callVolumeTrend: [
      { date: "2024-03-10", count: 120 },
      { date: "2024-03-11", count: 145 },
      { date: "2024-03-12", count: 132 },
      { date: "2024-03-13", count: 158 },
      { date: "2024-03-14", count: 142 },
      {4: "2024-03-15", count: 165 },
      { date: "2024-03-16", count: 180 }
    ],
    callDistribution: [
      { label: "Completed", value: 85 },
      { label: "In Progress", value: 10 },
      { label: "Failed", value: 5 }
    ]
  },
  calls: {
    callMetrics: [
      { label: "Total Calls", value: 1247, change: "+12%" },
      { label: "Avg. Duration", value: "12:45", change: "-3%" },
      { label: "Success Rate", value: "87.5%", change: "+5%" },
      { label: "First Call Resolution", value: "76.2%", change: "+2%" }
    ],
    callTrends: [
      { date: "2024-03-10", completed: 102, failed: 18 },
      { date: "2024-03-11", completed: 125, failed: 20 },
      { date: "2024-03-12", completed: 115, failed: 17 },
      { date: "2024-03-13", completed: 138, failed: 20 },
      { date: "2024-03-14", completed: 122, failed: 20 },
      { date: "2024-03-15", completed: 145, failed: 20 },
      { date: "2024-03-16", completed: 160, failed: 20 }
    ],
    agentPerformance: [
      { agent: "John Smith", calls: 145, avgDuration: "13:20", successRate: 92 },
      { agent: "Sarah Johnson", calls: 132, avgDuration: "11:45", successRate: 88 },
      { agent: "Michael Brown", calls: 128, avgDuration: "14:10", successRate: 85 },
      { agent: "Emily Davis", calls: 115, avgDuration: "12:30", successRate: 90 },
      { agent: "David Wilson", calls: 98, avgDuration: "10:15", successRate: 82 }
    ]
  },
  performance: {
    performanceMetrics: [
      { label: "Agent Utilization", value: "78.5%", change: "+5%" },
      { label: "Avg. Handle Time", value: "8:45", change: "-10%" },
      { label: "First Call Resolution", value: "76.2%", change: "+2%" },
      { label: "Customer Satisfaction", value: "4.7/5", change: "+0.3" }
    ],
    agentEfficiency: [
      { agent: "John Smith", efficiency: 92, utilization: 85, satisfaction: 4.8 },
      { agent: "Sarah Johnson", efficiency: 88, utilization: 82, satisfaction: 4.7 },
      { agent: "Michael Brown", efficiency: 85, utilization: 78, satisfaction: 4.6 },
      { agent: "Emily Davis", efficiency: 90, utilization: 80, satisfaction: 4.9 },
      { agent: "David Wilson", efficiency: 82, utilization: 75, satisfaction: 4.5 }
    ],
    qualityTrends: [
      { date: "2024-03-10", score: 85 },
      { date: "2024-03-11", score: 87 },
      { date: "2024-03-12", score: 86 },
      { date: "2024-03-13", score: 89 },
      { date: "2024-03-14", score: 88 },
      { date: "2024-03-15", score: 90 },
      { date: "2024-03-16", score: 92 }
    ]
  }
};

interface AnalyticsDashboardProps {
  view: "overview" | "calls" | "performance";
  onViewChange?: (view: string) => void;
}

export function AnalyticsDashboard({ view = "overview", onViewChange }: AnalyticsDashboardProps) {
  const [data, setData] = useState(mockAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState(view);

  // Update active tab when view prop changes
  useEffect(() => {
    setActiveTab(view);
  }, [view]);

  // Simulate data fetching
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setData(mockAnalyticsData);
      } catch (err) {
        setError("Failed to load analytics data. Please try again.");
        console.error("Error loading analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const handleTabChange = (value: "overview" | "calls" | "performance") => {
    setActiveTab(value);
    if (onViewChange) {
      onViewChange(value);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setData(mockAnalyticsData);
      setLoading(false);
    }, 500);
  };

  const handleExport = () => {
    // In a real implementation, this would trigger a download of the analytics data
    // For now, we'll just show a toast notification
    toast({
      title: "Exporting data",
      description: "Your analytics data is being prepared for download.",
    });
  };

  if (loading) {
    return <LoadingState message="Loading analytics data..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="flex items-center space-x-2">
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
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} className="space-y-4" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calls">Call Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.totalCalls}</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>12% from previous period</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Call Duration</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.avgDuration}</div>
                <div className="flex items-center text-xs text-red-500">
                  <TrendingUp className="mr-1 h-3 w-3 rotate-180" />
                  <span>3% from previous period</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.successRate}%</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>5% from previous period</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.activeAgents}</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>2 new this period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume Trend</CardTitle>
                <CardDescription>Call activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-gray-900/50">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-12 w-12 mb-2" />
                    <p>Call volume trend chart will be displayed here</p>
                    <p className="text-sm">(Placeholder for visualization)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Call Distribution</CardTitle>
                <CardDescription>Breakdown of call outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-gray-900/50">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-12 w-12 mb-2" />
                    <p>Call distribution chart will be displayed here</p>
                    <p className="text-sm">(Placeholder for visualization)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calls" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.calls.callMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className={`flex items-center text-xs ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className={`mr-1 h-3 w-3 ${metric.change.startsWith('-') ? 'rotate-180' : ''}`} />
                    <span>{metric.change} from previous period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Call Trends</CardTitle>
              <CardDescription>Completed vs. Failed calls over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-gray-900/50">
                <div className="text-center text-muted-foreground">
                  <BarChart className="mx-auto h-12 w-12 mb-2" />
                  <p>Call trends chart will be displayed here</p>
                  <p className="text-sm">(Placeholder for visualization)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
              <CardDescription>Call metrics by agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-900/50">
                      <th className="px-4 py-2 text-left text-sm font-medium">Agent</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Calls</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Avg. Duration</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.calls.agentPerformance.map((agent, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 text-sm">{agent.agent}</td>
                        <td className="px-4 py-2 text-sm">{agent.calls}</td>
                        <td className="px-4 py-2 text-sm">{agent.avgDuration}</td>
                        <td className="px-4 py-2 text-sm">{agent.successRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.performance.performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className={`flex items-center text-xs ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className={`mr-1 h-3 w-3 ${metric.change.startsWith('-') ? 'rotate-180' : ''}`} />
                    <span>{metric.change} from previous period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quality Score Trend</CardTitle>
                <CardDescription>Average quality score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-gray-900/50">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-12 w-12 mb-2" />
                    <p>Quality score trend chart will be displayed here</p>
                    <p className="text-sm">(Placeholder for visualization)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Agent Efficiency</CardTitle>
                <CardDescription>Performance metrics by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-gray-900/50">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="mx-auto h-12 w-12 mb-2" />
                    <p>Agent efficiency chart will be displayed here</p>
                    <p className="text-sm">(Placeholder for visualization)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Details</CardTitle>
              <CardDescription>Detailed performance metrics by agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-900/50">
                      <th className="px-4 py-2 text-left text-sm font-medium">Agent</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Efficiency</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Utilization</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.performance.agentEfficiency.map((agent, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 text-sm">{agent.agent}</td>
                        <td className="px-4 py-2 text-sm">{agent.efficiency}%</td>
                        <td className="px-4 py-2 text-sm">{agent.utilization}%</td>
                        <td className="px-4 py-2 text-sm">{agent.satisfaction}/5</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 