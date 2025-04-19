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

interface TrendData {
  date: string;
  calls: number;
  duration: number;
  quality: number;
}

export function HistoricalTrends() {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data - in a real app, this would come from an API
  const data: TrendData[] = [
    { date: "2024-03-10", calls: 45, duration: 4.2, quality: 85 },
    { date: "2024-03-11", calls: 52, duration: 4.5, quality: 88 },
    { date: "2024-03-12", calls: 48, duration: 4.3, quality: 86 },
    { date: "2024-03-13", calls: 55, duration: 4.6, quality: 89 },
    { date: "2024-03-14", calls: 50, duration: 4.4, quality: 87 },
    { date: "2024-03-15", calls: 58, duration: 4.7, quality: 90 },
    { date: "2024-03-16", calls: 62, duration: 4.8, quality: 91 }
  ];

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

      <Card>
        <CardHeader>
          <CardTitle>Call Volume & Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="calls" fill="#8884d8" name="Calls" />
                <Bar yAxisId="right" dataKey="duration" fill="#82ca9d" name="Avg Duration (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call Quality Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="quality" fill="#4caf50" name="Quality Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 