import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";

export function PerformanceMetrics() {
  const { metrics, isFiltered, campaignName } = useCallAnalytics();

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Performance Metrics: {campaignName}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.qualityScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topPerformingAgents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{agent.agent}</p>
                    <p className="text-xs text-muted-foreground">{agent.totalCalls} calls</p>
                  </div>
                  <div className="text-sm font-medium">{agent.successRate}%</div>
                </div>
              ))}
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