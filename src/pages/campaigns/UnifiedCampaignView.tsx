import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";
import { useCampaign } from "@/contexts/CampaignContext";
import { mockCallsByCampaign } from "@/mocks/calls";
import { Call } from "@/types/call";
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
import { ExternalLink, ChevronLeft, Search, ArrowUpDown, Phone, Clock, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown, Meh, User, BarChart2, Brain, Settings, HelpCircle, LineChart, Shield, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { AIInsights } from "@/pages/analytics/components/AIInsights";
import { CallAnalytics } from "@/pages/calls/components/CallAnalytics";
import { AgentAnalytics } from "@/pages/calls/components/AgentAnalytics";
import { HistoricalTrends } from "@/pages/analytics/components/HistoricalTrends";
import { QualityTrends } from "@/pages/performance/components/QualityTrends";
import { ComplianceMonitoring } from "@/pages/performance/components/ComplianceMonitoring";
import { AIAssistant } from "@/components/support/AIAssistant";
import { HelpSupport } from "@/pages/help/HelpSupport";

export function UnifiedCampaignView() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { selectedCampaign, setSelectedCampaign, getCampaignById } = useCampaign();
  const { metrics, calls } = useCallAnalytics();
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const allCampaignCalls = useMemo(() => 
    campaignId ? mockCallsByCampaign[campaignId] || [] : []
  , [campaignId]);

  const sentimentData = useMemo(() => {
    return [
      { name: 'Positive', value: metrics.sentimentBreakdown.positive, color: '#22c55e' },
      { name: 'Neutral', value: metrics.sentimentBreakdown.neutral, color: '#eab308' },
      { name: 'Negative', value: metrics.sentimentBreakdown.negative, color: '#ef4444' },
    ];
  }, [metrics.sentimentBreakdown]);

  const callVolumeData = useMemo(() => {
    const volumeByDay: Record<string, number> = {};
    
    calls.forEach(call => {
      const date = new Date(call.timestamp).toLocaleDateString();
      volumeByDay[date] = (volumeByDay[date] || 0) + 1;
    });
    
    return Object.entries(volumeByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [calls]);

  const displayedCalls = useMemo(() => {
    let filteredCalls = allCampaignCalls;
    if (filterText) {
      const text = filterText.toLowerCase();
      filteredCalls = filteredCalls.filter(call =>
        call.phoneNumber.toLowerCase().includes(text) ||
        call.agent.toLowerCase().includes(text) ||
        (call.notes && call.notes.toLowerCase().includes(text)) ||
        (call.customerName && call.customerName.toLowerCase().includes(text))
      );
    }
    return [...filteredCalls].sort((a, b) => {
      const getVal = (call: any) => {
        switch (sortField) {
          case 'timestamp':
            return new Date(call.timestamp).getTime();
          case 'duration':
            return call.duration;
          case 'debtAmount':
            return call.debtAmount || 0;
          default:
            return 0;
        }
      };
      const aVal = getVal(a);
      const bVal = getVal(b);
      const comp = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [allCampaignCalls, filterText, sortField, sortDirection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
          <p className="mt-2 text-sm text-gray-600">Loading campaign data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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

      <h2 className="text-3xl font-bold tracking-tight">
        {selectedCampaign?.name || "Campaign"} Analytics
      </h2>

      {/* Campaign Analytics Metrics */}
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
              Total calls for this campaign
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
              Average call duration
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
              Percentage of successful calls
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
              Number of completed calls
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Rate
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Calls with compliance score ≥ 90%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Quality Score
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.qualityScore}%</div>
            <p className="text-xs text-muted-foreground">
              Average quality score across all calls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sentiment Breakdown
            </CardTitle>
            <div className="flex gap-1">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <Meh className="h-4 w-4 text-yellow-500" />
              <ThumbsDown className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span className="text-green-500">{metrics.sentimentBreakdown.positive}%</span>
              <span className="text-yellow-500">{metrics.sentimentBreakdown.neutral}%</span>
              <span className="text-red-500">{metrics.sentimentBreakdown.negative}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Call Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {payload[0].name}
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Volume by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Date
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].payload.date}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Calls
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.topPerformingAgents.map((agent) => (
              <Card key={agent.agent}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Agent</span>
                      </div>
                      <p className="font-medium">{agent.agent}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Calls</span>
                      </div>
                      <p className="font-medium">{agent.totalCalls}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Success Rate</span>
                      </div>
                      <p className="font-medium">{agent.successRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg Duration</span>
                      </div>
                      <p className="font-medium">{formatDuration(metrics.avgDuration)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Call Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quality Score
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.qualityScore}%</div>
                <p className="text-xs text-muted-foreground">
                  Average quality score across all calls
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Compliance Rate
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.complianceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Calls with compliance score ≥ 90%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Call Score
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.avgCallScore}%</div>
                <p className="text-xs text-muted-foreground">
                  Overall call performance score
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Call Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Call Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {displayedCalls[0]?.metrics && Object.entries(displayedCalls[0].metrics).map(([key, metric]) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </CardTitle>
                  <div className={`h-4 w-4 rounded-full ${
                    metric.score >= 90 ? 'bg-green-500' :
                    metric.score >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.score}%</div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {metric.explanation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call Volume and Duration Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Call Volume and Duration Analysis</CardTitle>
        </CardHeader>
        <CardContent>
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
                  Total calls for this campaign
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
                  Successfully completed calls
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
                  Average call duration
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
                  Percentage of successful calls
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Positive Sentiment
                </CardTitle>
                <ThumbsUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {Math.round((metrics.sentimentBreakdown.positive / metrics.totalCalls) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.sentimentBreakdown.positive} calls
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Neutral Sentiment
                </CardTitle>
                <Meh className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {Math.round((metrics.sentimentBreakdown.neutral / metrics.totalCalls) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.sentimentBreakdown.neutral} calls
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Negative Sentiment
                </CardTitle>
                <ThumbsDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {Math.round((metrics.sentimentBreakdown.negative / metrics.totalCalls) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.sentimentBreakdown.negative} calls
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Call Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Call Log</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search calls..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select
              value={sortField}
              onValueChange={setSortField}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Date</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="debtAmount">Debt Amount</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    {new Date(call.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{call.phoneNumber}</TableCell>
                  <TableCell>{call.agent}</TableCell>
                  <TableCell>{formatDuration(call.duration)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(call.status)}>
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{call.notes}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/campaigns/${campaignId}/calls/${call.id}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 