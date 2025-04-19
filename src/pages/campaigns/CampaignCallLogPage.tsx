import React, { useState, useEffect, useMemo } from "react";
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
  const { selectedCampaign, setSelectedCampaign, getCampaignById } = useCampaign();
  const { metrics, formatDuration: analyticsFormatDuration } = useCallAnalytics();
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [sortField, setSortField] = useState<'timestamp' | 'duration'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Update selected campaign based on URL param
  useEffect(() => {
    if (campaignId) {
      const campaign = getCampaignById(campaignId);
      setSelectedCampaign(campaign ?? null);
    }
  }, [campaignId, getCampaignById, setSelectedCampaign]);

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

  const allCampaignCalls = campaignId ? mockCallsByCampaign[campaignId] || [] : [];
  const displayedCalls = useMemo(() => {
    let calls = allCampaignCalls;
    if (filterText) {
      const text = filterText.toLowerCase();
      calls = calls.filter(call =>
        call.phoneNumber.toLowerCase().includes(text) ||
        call.agent.toLowerCase().includes(text) ||
        (call.notes && call.notes.toLowerCase().includes(text))
      );
    }
    calls = [...calls].sort((a, b) => {
      const getVal = (call: any) => sortField === 'timestamp'
        ? new Date(call.timestamp).getTime()
        : call.duration;
      const aVal = getVal(a);
      const bVal = getVal(b);
      const comp = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortDirection === 'asc' ? comp : -comp;
    });
    return calls;
  }, [allCampaignCalls, filterText, sortField, sortDirection]);

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

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Filter calls by phone, agent, or notes..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <div className="space-x-4">
          <button
            onClick={() => {
              setSortField('timestamp');
              setSortDirection(prev => sortField === 'timestamp' && prev === 'asc' ? 'desc' : 'asc');
            }}
            className="text-sm underline"
          >
            Sort by Time ({sortField === 'timestamp' ? sortDirection.toUpperCase() : '—'})
          </button>
          <button
            onClick={() => {
              setSortField('duration');
              setSortDirection(prev => sortField === 'duration' && prev === 'asc' ? 'desc' : 'asc');
            }}
            className="text-sm underline"
          >
            Sort by Duration ({sortField === 'duration' ? sortDirection.toUpperCase() : '—'})
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Call Log: {selectedCampaign?.name || "Campaign"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayedCalls.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Call ID</TableHead>
                  <TableHead>Added Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Debt Amount</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Transcription</TableHead>
                  <TableHead>Recording URL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>{call.id}</TableCell>
                    <TableCell>{new Date(call.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{call.callType || 'N/A'}</TableCell>
                    <TableCell>{call.debtAmount !== undefined ? `$${call.debtAmount.toFixed(2)}` : 'N/A'}</TableCell>
                    <TableCell>{/* Publisher data not available */ 'N/A'}</TableCell>
                    <TableCell>{/* Buyer data not available */ 'N/A'}</TableCell>
                    <TableCell>{formatDuration(call.duration)}</TableCell>
                    <TableCell>{/* Customer full name not available */ 'N/A'}</TableCell>
                    <TableCell>{call.phoneNumber}</TableCell>
                    <TableCell>{call.status}</TableCell>
                    <TableCell>{call.notes || 'N/A'}</TableCell>
                    <TableCell>{/* DOB not available */ 'N/A'}</TableCell>
                    <TableCell>{/* Email not available */ 'N/A'}</TableCell>
                    <TableCell>{call.agent}</TableCell>
                    <TableCell>
                      {call.transcript ? (
                        <div className="max-w-xs truncate" title={call.transcript}>{call.transcript}</div>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {call.recordingUrl ? (
                        <a href={call.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Listen
                        </a>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/campaigns/${campaignId}/calls/${call.id}`)}>
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

      {/* Campaign-specific analytics metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsFormatDuration(metrics.avgDuration)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.qualityScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Positive Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sentimentBreakdown.positive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Negative Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sentimentBreakdown.negative}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 