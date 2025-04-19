import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface AgentMetrics {
    id: string;
    name: string;
    totalCalls: number;
    averageScore: number;
    complianceRate: number;
    trends: {
        qualityScore: "up" | "down" | "stable";
        complianceRate: "up" | "down" | "stable";
        callVolume: "up" | "down" | "stable";
    };
}

interface AgentAnalyticsProps {
    agents: AgentMetrics[];
}

export function AgentAnalytics({ agents }: AgentAnalyticsProps) {
    const getTrendIcon = (trend: "up" | "down" | "stable") => {
        switch (trend) {
            case "up":
                return <ArrowUp className="w-4 h-4 text-green-500" />;
            case "down":
                return <ArrowDown className="w-4 h-4 text-red-500" />;
            default:
                return <Minus className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Agent Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map(agent => (
                            <Card key={agent.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                                        <Badge variant="outline">
                                            {agent.totalCalls} calls
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Average Score</div>
                                            <div className="text-2xl font-bold">{agent.averageScore}%</div>
                                            <div className="flex items-center text-sm">
                                                {getTrendIcon(agent.trends.qualityScore)}
                                                <span className="ml-1">Quality Score Trend</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Compliance Rate</div>
                                            <div className="text-2xl font-bold">{agent.complianceRate}%</div>
                                            <div className="flex items-center text-sm">
                                                {getTrendIcon(agent.trends.complianceRate)}
                                                <span className="ml-1">Compliance Trend</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Call Volume</div>
                                            <div className="flex items-center text-sm">
                                                {getTrendIcon(agent.trends.callVolume)}
                                                <span className="ml-1">Volume Trend</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 