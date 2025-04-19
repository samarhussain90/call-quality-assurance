import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { AlertTriangle, TrendingUp, Lightbulb, RefreshCw, Download, Filter, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from '@/components/ui/use-toast';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Insight {
  id: string;
  type: 'anomaly' | 'trend' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: 'performance' | 'compliance' | 'customer' | 'financial';
  timestamp: string;
  metric?: string;
  value?: number;
  previousValue?: number;
  changePercentage?: number;
  data?: any[];
}

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Mock data for insights
  const mockInsights: Insight[] = [
    {
      id: '1',
      type: 'anomaly',
      title: 'Unusual Call Duration Spike',
      description: 'Average call duration increased by 45% in the last hour compared to the previous period.',
      severity: 'high',
      category: 'performance',
      timestamp: new Date().toISOString(),
      metric: 'avg_call_duration',
      value: 450,
      previousValue: 310,
      changePercentage: 45,
      data: [
        { time: '09:00', value: 310 },
        { time: '10:00', value: 320 },
        { time: '11:00', value: 330 },
        { time: '12:00', value: 450 },
      ],
    },
    {
      id: '2',
      type: 'trend',
      title: 'Improving Customer Satisfaction',
      description: 'CSAT scores have shown consistent improvement over the last 7 days.',
      severity: 'low',
      category: 'customer',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      metric: 'csat_score',
      value: 4.8,
      previousValue: 4.5,
      changePercentage: 6.7,
      data: [
        { date: '2023-03-14', value: 4.5 },
        { date: '2023-03-15', value: 4.6 },
        { date: '2023-03-16', value: 4.7 },
        { date: '2023-03-17', value: 4.8 },
      ],
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Agent Training Opportunity',
      description: 'Consider scheduling training sessions for handling escalations based on recent patterns.',
      severity: 'medium',
      category: 'performance',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      type: 'anomaly',
      title: 'Compliance Violation Increase',
      description: 'Compliance violations have increased by 30% in the last 24 hours.',
      severity: 'high',
      category: 'compliance',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      metric: 'compliance_violations',
      value: 15,
      previousValue: 10,
      changePercentage: 30,
      data: [
        { date: '2023-03-19', value: 10 },
        { date: '2023-03-20', value: 12 },
        { date: '2023-03-21', value: 15 },
      ],
    },
    {
      id: '5',
      type: 'trend',
      title: 'Cost per Call Reduction',
      description: 'Cost per call has decreased by 12% over the last month.',
      severity: 'low',
      category: 'financial',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      metric: 'cost_per_call',
      value: 2.8,
      previousValue: 3.2,
      changePercentage: -12.5,
      data: [
        { date: '2023-02-21', value: 3.2 },
        { date: '2023-03-01', value: 3.1 },
        { date: '2023-03-10', value: 3.0 },
        { date: '2023-03-21', value: 2.8 },
      ],
    },
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setInsights(mockInsights);
      setFilteredInsights(mockInsights);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...insights];
    
    // Filter by type
    if (activeTab !== 'all') {
      filtered = filtered.filter(insight => insight.type === activeTab);
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(insight => insight.category === categoryFilter);
    }
    
    // Filter by severity
    if (severityFilter !== 'all') {
      filtered = filtered.filter(insight => insight.severity === severityFilter);
    }
    
    setFilteredInsights(filtered);
  }, [insights, activeTab, categoryFilter, severityFilter]);

  const handleRefreshInsights = () => {
    setLoading(true);
    // Simulate refreshing data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDismissInsight = (id: string) => {
    setInsights(insights.filter(insight => insight.id !== id));
  };

  const handleExport = () => {
    // In a real implementation, this would trigger a download of the insights
    // For now, we'll just show a toast notification
    toast({
      title: "Exporting insights",
      description: "Your AI insights are being prepared for download.",
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderChart = (insight: Insight) => {
    if (!insight.data || insight.data.length === 0) return null;

    const isTimeSeries = insight.data[0].hasOwnProperty('date') || insight.data[0].hasOwnProperty('time');
    
    if (isTimeSeries) {
      return (
        <div className="h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={insight.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={insight.data[0].hasOwnProperty('date') ? 'date' : 'time'} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    } else {
      return (
        <div className="h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insight.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleRefreshInsights} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 gap-4 mb-6">
            <TabsTrigger value="all">All Insights</TabsTrigger>
            <TabsTrigger value="anomaly">Anomalies</TabsTrigger>
            <TabsTrigger value="trend">Trends</TabsTrigger>
            <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4 mb-6">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="all">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredInsights.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No insights found matching your filters
                </div>
              ) : (
                filteredInsights.map((insight) => (
                  <Card key={insight.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {getInsightIcon(insight.type)}
                        <div>
                          <h3 className="font-semibold">{insight.title}</h3>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={getSeverityBadgeVariant(insight.severity)}>
                              {insight.severity}
                            </Badge>
                            <Badge variant="outline">{insight.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatTimestamp(insight.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDismissInsight(insight.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {renderChart(insight)}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="anomaly">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredInsights.filter(i => i.type === 'anomaly').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No anomalies found matching your filters
                </div>
              ) : (
                filteredInsights
                  .filter(i => i.type === 'anomaly')
                  .map((insight) => (
                    <Card key={insight.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getInsightIcon(insight.type)}
                          <div>
                            <h3 className="font-semibold">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={getSeverityBadgeVariant(insight.severity)}>
                                {insight.severity}
                              </Badge>
                              <Badge variant="outline">{insight.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatTimestamp(insight.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDismissInsight(insight.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {renderChart(insight)}
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="trend">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredInsights.filter(i => i.type === 'trend').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No trends found matching your filters
                </div>
              ) : (
                filteredInsights
                  .filter(i => i.type === 'trend')
                  .map((insight) => (
                    <Card key={insight.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getInsightIcon(insight.type)}
                          <div>
                            <h3 className="font-semibold">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={getSeverityBadgeVariant(insight.severity)}>
                                {insight.severity}
                              </Badge>
                              <Badge variant="outline">{insight.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatTimestamp(insight.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDismissInsight(insight.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {renderChart(insight)}
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="recommendation">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredInsights.filter(i => i.type === 'recommendation').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recommendations found matching your filters
                </div>
              ) : (
                filteredInsights
                  .filter(i => i.type === 'recommendation')
                  .map((insight) => (
                    <Card key={insight.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getInsightIcon(insight.type)}
                          <div>
                            <h3 className="font-semibold">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={getSeverityBadgeVariant(insight.severity)}>
                                {insight.severity}
                              </Badge>
                              <Badge variant="outline">{insight.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatTimestamp(insight.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDismissInsight(insight.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {renderChart(insight)}
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 