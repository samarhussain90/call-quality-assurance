import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Phone, Clock, CheckCircle, XCircle, User, Calendar, MessageSquare, ExternalLink } from "lucide-react";
import { Call, mockCalls } from "@/mocks";

interface CallMetrics {
  proper_greeting: { score: number; explanation: string };
  needs_assessment: { score: number; explanation: string };
  product_presentation: { score: number; explanation: string };
  handling_objections: { score: number; explanation: string };
  closing_techniques: { score: number; explanation: string };
  approved_language: { score: number; explanation: string };
  call_structure: { score: number; explanation: string };
  compliance: { score: number; explanation: string };
  customer_engagement: { score: number; explanation: string };
  tone_and_pacing: { score: number; explanation: string };
  handling_interruptions: { score: number; explanation: string };
  company_policies: { score: number; explanation: string };
  post_call_procedures: { score: number; explanation: string };
  emotional_intelligence: { score: number; explanation: string };
  prohibited_actions: { score: number; explanation: string };
}

interface CallWithMetrics extends Call {
  metrics: CallMetrics;
}

export function CallDetailPage() {
  const { campaignId, callId } = useParams<{ campaignId: string; callId: string }>();
  const navigate = useNavigate();
  const [call, setCall] = useState<CallWithMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCall = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (callId && mockCalls[callId]) {
          setCall(mockCalls[callId] as CallWithMetrics);
        }
      } catch (error) {
        console.error("Error fetching call:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCall();
  }, [callId]);

  const getStatusIcon = (status: Call["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getSentimentColor = (sentiment?: Call["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
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
          <div className="text-muted-foreground">Loading call details...</div>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Call not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/campaigns/${campaignId}/calls`)}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Campaign Calls
        </Button>
        <h1 className="text-2xl font-bold">Call Details</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{call.phoneNumber}</div>
                  <div className="text-sm text-muted-foreground">Phone Number</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{call.agent}</div>
                  <div className="text-sm text-muted-foreground">Agent</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {new Date(call.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Date & Time</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{formatDuration(call.duration)}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getStatusIcon(call.status)}
                <div>
                  <div className="font-medium">
                    <Badge variant="secondary">{call.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">Status</div>
                </div>
              </div>
              {call.callType && (
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{call.callType}</div>
                    <div className="text-sm text-muted-foreground">Call Type</div>
                  </div>
                </div>
              )}
              {call.debtAmount !== undefined && (
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 text-muted-foreground flex items-center justify-center">$</div>
                  <div>
                    <div className="font-medium">{formatCurrency(call.debtAmount)}</div>
                    <div className="text-sm text-muted-foreground">Debt Amount</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {call.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">{call.notes}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {call.transcript && (
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap font-mono text-sm">
                {call.transcript}
              </div>
            </CardContent>
          </Card>
        )}

        {call.recordingUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={call.recordingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Listen to Recording
              </a>
            </CardContent>
          </Card>
        )}

        {call.tags && call.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {call.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {call.sentiment && (
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-medium ${getSentimentColor(call.sentiment)}`}>
                {call.sentiment.charAt(0).toUpperCase() + call.sentiment.slice(1)}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Call Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Overall Score</h3>
                  <p className="text-sm text-muted-foreground">{call.summary}</p>
                </div>
                <div className="text-2xl font-bold">{call.overall_score}%</div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Call Result</h3>
                <p className="text-sm">{call.call_result}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {call.metrics && Object.entries(call.metrics).map(([key, metric]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h4>
                      <div className="text-lg font-semibold">{metric.score}%</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 