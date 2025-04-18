import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Phone,
  MessageSquare,
  BarChart2
} from "lucide-react";

interface AgentMetrics {
  id: string;
  name: string;
  avatar: string;
  callsHandled: number;
  averageCallDuration: string;
  qualityScore: number;
  complianceRate: number;
  customerSatisfaction: number;
  firstCallResolution: number;
  trends: {
    qualityScore: "up" | "down" | "stable";
    complianceRate: "up" | "down" | "stable";
    customerSatisfaction: "up" | "down" | "stable";
  };
  alerts: {
    type: "warning" | "critical" | "success";
    message: string;
    timestamp: string;
  }[];
}

interface AgentAnalyticsProps {
  agents: AgentMetrics[];
  onAgentSelect?: (agentId: string) => void;
}

export function AgentAnalytics({ agents, onAgentSelect }: AgentAnalyticsProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    onAgentSelect?.(agentId);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getAlertIcon = (type: "warning" | "critical" | "success") => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Agent Performance Analytics</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("day")}
            className="text-white"
          >
            Day
          </Button>
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("week")}
            className="text-white"
          >
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
            className="text-white"
          >
            Month
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card 
            key={agent.id} 
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
              selectedAgent === agent.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleAgentSelect(agent.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-white">{agent.name}</CardTitle>
                    <p className="text-sm text-gray-400">Agent ID: {agent.id}</p>
                  </div>
                </div>
                <Badge 
                  variant={agent.qualityScore >= 90 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {agent.qualityScore}% Quality
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Calls</span>
                    </div>
                    <p className="text-white font-medium">{agent.callsHandled}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Avg Duration</span>
                    </div>
                    <p className="text-white font-medium">{agent.averageCallDuration}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Quality Score</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${getScoreColor(agent.qualityScore)}`}>
                        {agent.qualityScore}%
                      </span>
                      {getTrendIcon(agent.trends.qualityScore)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Compliance Rate</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${getScoreColor(agent.complianceRate)}`}>
                        {agent.complianceRate}%
                      </span>
                      {getTrendIcon(agent.trends.complianceRate)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Customer Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${getScoreColor(agent.customerSatisfaction)}`}>
                        {agent.customerSatisfaction}%
                      </span>
                      {getTrendIcon(agent.trends.customerSatisfaction)}
                    </div>
                  </div>
                </div>

                {agent.alerts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Recent Alerts</h4>
                    <div className="space-y-2">
                      {agent.alerts.map((alert, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-2 p-2 rounded bg-gray-700/50"
                        >
                          {getAlertIcon(alert.type)}
                          <div>
                            <p className="text-sm text-white">{alert.message}</p>
                            <p className="text-xs text-gray-400">{alert.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 