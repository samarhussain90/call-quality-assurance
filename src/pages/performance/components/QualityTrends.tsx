import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface QualityMetrics {
  date: string;
  averageScore: number;
  complianceRate: number;
  customerSatisfaction: number;
  firstCallResolution: number;
}

interface QualityCategory {
  name: string;
  score: number;
  trend: "up" | "down" | "stable";
}

export function QualityTrends() {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data - in a real app, this would come from an API
  const qualityData: QualityMetrics[] = [
    { date: "2024-03-10", averageScore: 85, complianceRate: 92, customerSatisfaction: 88, firstCallResolution: 82 },
    { date: "2024-03-11", averageScore: 87, complianceRate: 93, customerSatisfaction: 89, firstCallResolution: 84 },
    { date: "2024-03-12", averageScore: 86, complianceRate: 91, customerSatisfaction: 90, firstCallResolution: 85 },
    { date: "2024-03-13", averageScore: 88, complianceRate: 94, customerSatisfaction: 91, firstCallResolution: 86 },
    { date: "2024-03-14", averageScore: 89, complianceRate: 95, customerSatisfaction: 92, firstCallResolution: 87 },
    { date: "2024-03-15", averageScore: 90, complianceRate: 96, customerSatisfaction: 93, firstCallResolution: 88 },
    { date: "2024-03-16", averageScore: 91, complianceRate: 97, customerSatisfaction: 94, firstCallResolution: 89 }
  ];

  const qualityCategories: QualityCategory[] = [
    { name: "Communication", score: 92, trend: "up" },
    { name: "Problem Solving", score: 88, trend: "stable" },
    { name: "Product Knowledge", score: 85, trend: "up" },
    { name: "Call Handling", score: 90, trend: "up" },
    { name: "Script Adherence", score: 87, trend: "down" }
  ];

  const getTrendColor = (trend: QualityCategory["trend"]) => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      case "stable":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
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
            <CardTitle>Quality Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="averageScore" stroke="#4caf50" name="Quality Score" />
                  <Line type="monotone" dataKey="complianceRate" stroke="#2196f3" name="Compliance Rate" />
                  <Line type="monotone" dataKey="customerSatisfaction" stroke="#ff9800" name="Customer Satisfaction" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>First Call Resolution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="firstCallResolution" stroke="#9c27b0" name="First Call Resolution" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quality Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityCategories.map(category => (
                <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{category.name}</h3>
                    <Badge className={getTrendColor(category.trend)}>
                      {category.trend}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{category.score}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 