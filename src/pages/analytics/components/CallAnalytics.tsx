import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";

export function CallAnalytics() {
  const { metrics, isFiltered, campaignName } = useCallAnalytics();

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Call Analytics: {campaignName}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyzed Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCalls}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Call Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgCallScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-green-500">Positive</span>
                <span>{metrics.sentimentBreakdown.positive}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-500">Neutral</span>
                <span>{metrics.sentimentBreakdown.neutral}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-500">Negative</span>
                <span>{metrics.sentimentBreakdown.negative}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isFiltered && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Select a campaign from the sidebar to view campaign-specific call analytics.
          </p>
        </div>
      )}
    </div>
  );
} 