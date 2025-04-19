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
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { useCampaign } from "@/contexts/CampaignContext";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";

interface CampaignMetrics {
  id: string;
  name: string;
  totalCalls: number;
  conversionRate: number;
  averageScore: number;
  complianceRate: number;
  customerSatisfaction: number;
  costPerCall: number;
  revenue: number;
}

export function CampaignPerformance() {
  const [timeRange, setTimeRange] = useState("7d");
  const { selectedCampaign } = useCampaign();
  const { metrics, isFiltered, campaignName } = useCallAnalytics();

  // Mock data - in a real app, this would come from an API
  const campaignData: CampaignMetrics[] = selectedCampaign ? [
    {
      id: selectedCampaign.id,
      name: selectedCampaign.name,
      totalCalls: metrics.totalCalls,
      conversionRate: metrics.successRate,
      averageScore: metrics.avgCallScore,
      complianceRate: metrics.complianceRate,
      customerSatisfaction: Math.round((metrics.sentimentBreakdown.positive / metrics.totalCalls) * 100),
      costPerCall: 12.5,
      revenue: metrics.totalCalls * 35 // Mock revenue calculation
    }
  ] : [
    {
      id: "campaign-1",
      name: "Summer Sale 2024",
      totalCalls: 450,
      conversionRate: 35,
      averageScore: 88,
      complianceRate: 94,
      customerSatisfaction: 92,
      costPerCall: 12.5,
      revenue: 15750
    },
    {
      id: "campaign-2",
      name: "Holiday Special",
      totalCalls: 380,
      conversionRate: 42,
      averageScore: 85,
      complianceRate: 91,
      customerSatisfaction: 89,
      costPerCall: 15.2,
      revenue: 15960
    },
    {
      id: "campaign-3",
      name: "Spring Promotion",
      totalCalls: 520,
      conversionRate: 28,
      averageScore: 82,
      complianceRate: 88,
      customerSatisfaction: 86,
      costPerCall: 11.8,
      revenue: 14560
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Campaign Performance: {campaignName}
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
            <CardTitle>Conversion Rates by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="conversionRate" fill="#4caf50" name="Conversion Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#2196f3" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost per Call by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="costPerCall" fill="#ff9800" name="Cost per Call" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="customerSatisfaction" fill="#9c27b0" name="Customer Satisfaction" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isFiltered && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Select a campaign from the sidebar to view campaign-specific performance metrics.
          </p>
        </div>
      )}
    </div>
  );
} 