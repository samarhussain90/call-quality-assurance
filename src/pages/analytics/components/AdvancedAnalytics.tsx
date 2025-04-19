import React, { useState } from 'react';
import { Card, Button, Select, Input, Table, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Download, Database, Bot, LineChart, Clock, AlertTriangle } from 'lucide-react';

interface ReportSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'csv' | 'pdf';
  recipients: string[];
  lastRun?: string;
  nextRun?: string;
}

interface DataWarehouseConfig {
  id: string;
  type: 'bigquery' | 'redshift';
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  nextSync?: string;
}

interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp: string;
  metric?: string;
  value?: number;
}

export function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState('reports');
  const [schedules, setSchedules] = useState<ReportSchedule[]>([
    {
      id: '1',
      name: 'Daily Performance Summary',
      frequency: 'daily',
      format: 'pdf',
      recipients: ['team@example.com'],
      lastRun: '2024-03-20T08:00:00Z',
      nextRun: '2024-03-21T08:00:00Z',
    },
    {
      id: '2',
      name: 'Weekly Compliance Report',
      frequency: 'weekly',
      format: 'csv',
      recipients: ['compliance@example.com'],
      lastRun: '2024-03-18T08:00:00Z',
      nextRun: '2024-03-25T08:00:00Z',
    },
  ]);

  const [warehouses, setWarehouses] = useState<DataWarehouseConfig[]>([
    {
      id: '1',
      type: 'bigquery',
      name: 'Analytics Warehouse',
      status: 'connected',
      lastSync: '2024-03-20T07:30:00Z',
      nextSync: '2024-03-20T08:30:00Z',
    },
    {
      id: '2',
      type: 'redshift',
      name: 'Data Lake',
      status: 'disconnected',
      lastSync: '2024-03-19T07:30:00Z',
    },
  ]);

  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      type: 'anomaly',
      title: 'Unusual Call Duration Spike',
      description: 'Average call duration increased by 45% in the last hour',
      severity: 'high',
      timestamp: '2024-03-20T07:45:00Z',
      metric: 'avg_call_duration',
      value: 450,
    },
    {
      id: '2',
      type: 'trend',
      title: 'Improving Customer Satisfaction',
      description: 'CSAT scores have shown consistent improvement over the last 7 days',
      severity: 'low',
      timestamp: '2024-03-20T07:00:00Z',
      metric: 'csat_score',
      value: 4.8,
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Agent Training Opportunity',
      description: 'Consider scheduling training sessions for handling escalations based on recent patterns',
      timestamp: '2024-03-20T06:30:00Z',
    },
  ]);

  const handleCreateSchedule = () => {
    // Implementation for creating new report schedule
  };

  const handleConfigureWarehouse = (warehouseId: string) => {
    // Implementation for configuring data warehouse
  };

  const handleDismissInsight = (insightId: string) => {
    setInsights(insights.filter(insight => insight.id !== insightId));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          <TabsTrigger value="warehouse">Data Warehouse</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Scheduled Reports</h2>
                <Button onClick={handleCreateSchedule}>
                  Create Schedule
                </Button>
              </div>
              <Table>
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Frequency</th>
                    <th>Format</th>
                    <th>Recipients</th>
                    <th>Last Run</th>
                    <th>Next Run</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>{schedule.name}</td>
                      <td>
                        <Badge>{schedule.frequency}</Badge>
                      </td>
                      <td>{schedule.format.toUpperCase()}</td>
                      <td>{schedule.recipients.join(', ')}</td>
                      <td>{new Date(schedule.lastRun!).toLocaleString()}</td>
                      <td>{new Date(schedule.nextRun!).toLocaleString()}</td>
                      <td>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse" className="mt-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Data Warehouse Integration</h2>
                <Button>Add Connection</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {warehouses.map(warehouse => (
                  <Card key={warehouse.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{warehouse.name}</h3>
                        <p className="text-gray-500">{warehouse.type}</p>
                      </div>
                      <Badge
                        variant={
                          warehouse.status === 'connected'
                            ? 'default'
                            : warehouse.status === 'error'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {warehouse.status}
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      {warehouse.lastSync && (
                        <p className="text-sm">
                          Last sync: {new Date(warehouse.lastSync).toLocaleString()}
                        </p>
                      )}
                      {warehouse.nextSync && (
                        <p className="text-sm">
                          Next sync: {new Date(warehouse.nextSync).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleConfigureWarehouse(warehouse.id)}
                      >
                        Configure
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
                <Select defaultValue="all">
                  <option value="all">All Types</option>
                  <option value="anomaly">Anomalies</option>
                  <option value="trend">Trends</option>
                  <option value="recommendation">Recommendations</option>
                </Select>
              </div>
              <div className="space-y-4">
                {insights.map(insight => (
                  <Card key={insight.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {insight.type === 'anomaly' && (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        )}
                        {insight.type === 'trend' && (
                          <LineChart className="w-5 h-5 text-blue-500" />
                        )}
                        {insight.type === 'recommendation' && (
                          <Bot className="w-5 h-5 text-purple-500" />
                        )}
                        <div>
                          <h3 className="font-semibold">{insight.title}</h3>
                          <p className="text-gray-500">{insight.description}</p>
                          {insight.metric && (
                            <p className="text-sm mt-1">
                              {insight.metric}: {insight.value}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(insight.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {insight.severity && (
                        <Badge
                          variant={
                            insight.severity === 'high'
                              ? 'destructive'
                              : insight.severity === 'medium'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {insight.severity}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismissInsight(insight.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 