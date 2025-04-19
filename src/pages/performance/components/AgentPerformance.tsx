import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useCampaign } from "@/contexts/CampaignContext";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";

interface AgentMetrics {
  id: string;
  name: string;
  totalCalls: number;
  averageScore: number;
  complianceRate: number;
  customerSatisfaction: number;
  firstCallResolution: number;
  averageHandleTime: number;
}

export function AgentPerformance() {
  const [timeRange, setTimeRange] = useState("7d");
  const { selectedCampaign } = useCampaign();
  const { metrics, isFiltered, campaignName } = useCallAnalytics();

  // Mock data - in a real app, this would come from an API
  const agentData: AgentMetrics[] = selectedCampaign ? 
    metrics.topPerformingAgents.map(agent => ({
      id: agent.agent,
      name: agent.agent,
      totalCalls: agent.totalCalls,
      averageScore: agent.successRate,
      complianceRate: metrics.complianceRate,
      customerSatisfaction: Math.round((metrics.sentimentBreakdown.positive / metrics.totalCalls) * 100),
      firstCallResolution: Math.round(agent.successRate * 0.9), // Mock FCR calculation
      averageHandleTime: Math.round(metrics.avgDuration / 60) // Convert seconds to minutes
    })) : [
      {
        id: "agent-1",
        name: "John Smith",
        totalCalls: 150,
        averageScore: 85,
        complianceRate: 92,
        customerSatisfaction: 88,
        firstCallResolution: 82,
        averageHandleTime: 4.5
      },
      {
        id: "agent-2",
        name: "Sarah Johnson",
        totalCalls: 120,
        averageScore: 78,
        complianceRate: 88,
        customerSatisfaction: 90,
        firstCallResolution: 75,
        averageHandleTime: 5.2
      },
      {
        id: "agent-3",
        name: "Michael Brown",
        totalCalls: 180,
        averageScore: 92,
        complianceRate: 95,
        customerSatisfaction: 94,
        firstCallResolution: 88,
        averageHandleTime: 4.8
      }
    ];

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Agent Performance: {campaignName}
      </h2>

      <div className="flex justify-end">
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quality Scores by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="averageScore" fill="#4caf50" name="Quality Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Rates by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="complianceRate" fill="#2196f3" name="Compliance Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="customerSatisfaction" fill="#ff9800" name="Customer Satisfaction" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>First Call Resolution by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="firstCallResolution" fill="#9c27b0" name="First Call Resolution" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isFiltered && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Select a campaign from the sidebar to view campaign-specific agent performance metrics.
          </p>
        </div>
      )}
    </div>
  );
} 