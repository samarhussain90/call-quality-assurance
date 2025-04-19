import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface ComplianceMetrics {
  id: string;
  name: string;
  totalCalls: number;
  compliantCalls: number;
  violations: number;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
}

export function ComplianceMonitoring() {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data - in a real app, this would come from an API
  const complianceData: ComplianceMetrics[] = [
    {
      id: "rule-1",
      name: "Personal Information Protection",
      totalCalls: 450,
      compliantCalls: 420,
      violations: 30,
      severity: "critical",
      category: "Data Privacy"
    },
    {
      id: "rule-2",
      name: "Script Adherence",
      totalCalls: 450,
      compliantCalls: 380,
      violations: 70,
      severity: "medium",
      category: "Process"
    },
    {
      id: "rule-3",
      name: "Call Recording Disclosure",
      totalCalls: 450,
      compliantCalls: 445,
      violations: 5,
      severity: "high",
      category: "Legal"
    },
    {
      id: "rule-4",
      name: "Product Claims",
      totalCalls: 450,
      compliantCalls: 410,
      violations: 40,
      severity: "high",
      category: "Marketing"
    }
  ];

  const COLORS = ["#4caf50", "#ff9800", "#f44336", "#9c27b0"];

  const getSeverityColor = (severity: ComplianceMetrics["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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
            <CardTitle>Compliance Violations by Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="violations" fill="#f44336" name="Violations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violations by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Low", value: 15 },
                      { name: "Medium", value: 25 },
                      { name: "High", value: 35 },
                      { name: "Critical", value: 25 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Compliance Rules Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceData.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{rule.name}</h3>
                      <Badge className={getSeverityColor(rule.severity)}>
                        {rule.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {((rule.compliantCalls / rule.totalCalls) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rule.violations} violations
                    </div>
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