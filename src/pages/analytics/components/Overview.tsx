import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";
import { useCampaign } from '@/contexts/CampaignContext';
import { Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function Overview() {
  const { selectedCampaign } = useCampaign();
  const { metrics, isFiltered, campaignName, formatDuration } = useCallAnalytics();

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Analytics Overview: {campaignName}
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Calls
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              {isFiltered ? `For ${campaignName}` : 'Across all campaigns'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(metrics.avgDuration)}</div>
            <p className="text-xs text-muted-foreground">
              {isFiltered ? `For ${campaignName}` : 'Across all campaigns'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {isFiltered ? `For ${campaignName}` : 'Across all campaigns'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Calls
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedCalls}</div>
            <p className="text-xs text-muted-foreground">
              {isFiltered ? `For ${campaignName}` : 'Across all campaigns'}
            </p>
          </CardContent>
        </Card>
      </div>

      {!isFiltered && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Select a campaign from the sidebar to view campaign-specific analytics
          </p>
        </div>
      )}
    </div>
  );
} 