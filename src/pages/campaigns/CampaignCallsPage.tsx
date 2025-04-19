import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Phone, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Call, mockCallsByCampaign } from "@/mocks";

export function CampaignCallsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (campaignId && mockCallsByCampaign[campaignId]) {
          setCalls(mockCallsByCampaign[campaignId]);
        } else {
          setCalls([]);
        }
      } catch (error) {
        console.error("Error fetching calls:", error);
        setCalls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [campaignId]);

  const getStatusIcon = (status: Call["status"]) => {
    switch (status) {
      case "completed":
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case "failed":
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case "in-progress":
        return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
      default:
        return null;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading calls...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate("/campaigns")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
        <h1 className="text-2xl font-bold">Campaign Calls</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Call History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Added Time</TableHead>
                <TableHead>Call Type</TableHead>
                <TableHead>Debt Amount</TableHead>
                <TableHead>Transcription</TableHead>
                <TableHead>Recording</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    {new Date(call.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{call.callType}</TableCell>
                  <TableCell>{formatCurrency(call.debtAmount)}</TableCell>
                  <TableCell>
                    {call.transcript ? (
                      <div className="max-w-xs truncate" title={call.transcript}>
                        {call.transcript}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {call.recordingUrl ? (
                      <a 
                        href={call.recordingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Listen
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(call.status)}
                      <Badge variant="secondary">
                        {call.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{formatDuration(call.duration)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/campaigns/${campaignId}/calls/${call.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {calls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No calls found for this campaign
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 