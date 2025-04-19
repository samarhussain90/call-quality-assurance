import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";
import { useCampaign } from "@/contexts/CampaignContext";
import { mockCallsByCampaign } from "@/mocks/calls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronLeft } from "lucide-react";

export function CampaignCallLogPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { selectedCampaign } = useCampaign();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "in-progress":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading call log...</p>
        </div>
      </div>
    );
  }

  const campaignCalls = campaignId ? mockCallsByCampaign[campaignId] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/campaigns")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Call Log - {selectedCampaign?.name || "Campaign"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {campaignCalls.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>{call.phoneNumber}</TableCell>
                    <TableCell>
                      {new Date(call.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{formatDuration(call.duration)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(call.status)}
                      >
                        {call.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{call.agent}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/campaigns/${campaignId}/calls/${call.id}`)
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No calls found for this campaign.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 