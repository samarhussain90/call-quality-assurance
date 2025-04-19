import React, { useState } from 'react';
import { Card, Button, Select, Input, Checkbox, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { BarChart, LineChart, PieChart, Table, Download, Save, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReportBuilderProps {
  onSave?: (report: any) => void;
  onCancel?: () => void;
}

interface Metric {
  id: string;
  name: string;
  type: 'number' | 'percentage' | 'currency' | 'duration';
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

interface Filter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string;
}

interface Visualization {
  id: string;
  type: 'table' | 'bar' | 'line' | 'pie';
  title: string;
  metrics: string[];
  dimensions: string[];
}

export function ReportBuilder({ onSave, onCancel }: ReportBuilderProps) {
  const navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [description, setDescription] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: '1', name: 'Call Duration', type: 'duration', aggregation: 'avg' },
    { id: '2', name: 'Customer Satisfaction', type: 'number', aggregation: 'avg' },
  ]);
  const [filters, setFilters] = useState<Filter[]>([
    { id: '1', field: 'status', operator: 'equals', value: 'completed' },
  ]);
  const [visualizations, setVisualizations] = useState<Visualization[]>([
    { id: '1', type: 'table', title: 'Call Metrics', metrics: ['1', '2'], dimensions: ['date', 'agent'] },
    { id: '2', type: 'bar', title: 'Performance by Agent', metrics: ['1'], dimensions: ['agent'] },
  ]);
  const [activeTab, setActiveTab] = useState('metrics');

  const availableMetrics = [
    { id: '1', name: 'Call Duration', type: 'duration' },
    { id: '2', name: 'Customer Satisfaction', type: 'number' },
    { id: '3', name: 'First Call Resolution', type: 'percentage' },
    { id: '4', name: 'Call Volume', type: 'number' },
    { id: '5', name: 'Average Handle Time', type: 'duration' },
    { id: '6', name: 'Cost per Call', type: 'currency' },
  ];

  const availableDimensions = [
    { id: 'date', name: 'Date' },
    { id: 'agent', name: 'Agent' },
    { id: 'campaign', name: 'Campaign' },
    { id: 'customer', name: 'Customer' },
    { id: 'status', name: 'Status' },
  ];

  const handleAddMetric = () => {
    const newMetric: Metric = {
      id: Date.now().toString(),
      name: '',
      type: 'number',
      aggregation: 'avg',
    };
    setMetrics([...metrics, newMetric]);
  };

  const handleRemoveMetric = (id: string) => {
    setMetrics(metrics.filter(metric => metric.id !== id));
  };

  const handleAddFilter = () => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const handleAddVisualization = () => {
    const newVisualization: Visualization = {
      id: Date.now().toString(),
      type: 'table',
      title: 'New Visualization',
      metrics: [],
      dimensions: [],
    };
    setVisualizations([...visualizations, newVisualization]);
  };

  const handleRemoveVisualization = (id: string) => {
    setVisualizations(visualizations.filter(viz => viz.id !== id));
  };

  const handleSaveReport = () => {
    const report = {
      name: reportName,
      description,
      timeRange,
      metrics,
      filters,
      visualizations,
    };
    
    if (onSave) {
      onSave(report);
    } else {
      // If no onSave prop is provided, navigate back to reports page
      navigate('/reports');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // If no onCancel prop is provided, navigate back to reports page
      navigate('/reports');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Create Custom Report</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSaveReport}>
            <Save className="w-4 h-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Report Name</label>
            <Input
              value={reportName}
              onChange={e => setReportName(e.target.value)}
              placeholder="Enter report name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter report description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom range</option>
            </Select>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Metrics</h3>
              <Button onClick={handleAddMetric}>
                <Plus className="w-4 h-4 mr-2" />
                Add Metric
              </Button>
            </div>
            <div className="space-y-4">
              {metrics.map(metric => (
                <div key={metric.id} className="flex items-start space-x-4 p-4 border rounded-md">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Metric</label>
                      <Select
                        value={metric.name}
                        onValueChange={value => {
                          const updatedMetrics = metrics.map(m =>
                            m.id === metric.id ? { ...m, name: value } : m
                          );
                          setMetrics(updatedMetrics);
                        }}
                      >
                        <option value="">Select a metric</option>
                        {availableMetrics.map(m => (
                          <option key={m.id} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Aggregation</label>
                      <Select
                        value={metric.aggregation}
                        onValueChange={value => {
                          const updatedMetrics = metrics.map(m =>
                            m.id === metric.id ? { ...m, aggregation: value as any } : m
                          );
                          setMetrics(updatedMetrics);
                        }}
                      >
                        <option value="sum">Sum</option>
                        <option value="avg">Average</option>
                        <option value="min">Minimum</option>
                        <option value="max">Maximum</option>
                        <option value="count">Count</option>
                      </Select>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMetric(metric.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button onClick={handleAddFilter}>
                <Plus className="w-4 h-4 mr-2" />
                Add Filter
              </Button>
            </div>
            <div className="space-y-4">
              {filters.map(filter => (
                <div key={filter.id} className="flex items-start space-x-4 p-4 border rounded-md">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Field</label>
                      <Select
                        value={filter.field}
                        onValueChange={value => {
                          const updatedFilters = filters.map(f =>
                            f.id === filter.id ? { ...f, field: value } : f
                          );
                          setFilters(updatedFilters);
                        }}
                      >
                        <option value="">Select a field</option>
                        {availableDimensions.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Operator</label>
                      <Select
                        value={filter.operator}
                        onValueChange={value => {
                          const updatedFilters = filters.map(f =>
                            f.id === filter.id ? { ...f, operator: value as any } : f
                          );
                          setFilters(updatedFilters);
                        }}
                      >
                        <option value="equals">Equals</option>
                        <option value="contains">Contains</option>
                        <option value="greater_than">Greater Than</option>
                        <option value="less_than">Less Than</option>
                        <option value="between">Between</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Value</label>
                      <Input
                        value={filter.value}
                        onChange={e => {
                          const updatedFilters = filters.map(f =>
                            f.id === filter.id ? { ...f, value: e.target.value } : f
                          );
                          setFilters(updatedFilters);
                        }}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFilter(filter.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="visualizations" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Visualizations</h3>
              <Button onClick={handleAddVisualization}>
                <Plus className="w-4 h-4 mr-2" />
                Add Visualization
              </Button>
            </div>
            <div className="space-y-4">
              {visualizations.map(viz => (
                <div key={viz.id} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {viz.type === 'table' && <Table className="w-5 h-5" />}
                      {viz.type === 'bar' && <BarChart className="w-5 h-5" />}
                      {viz.type === 'line' && <LineChart className="w-5 h-5" />}
                      {viz.type === 'pie' && <PieChart className="w-5 h-5" />}
                      <h4 className="font-medium">{viz.title}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVisualization(viz.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <Select
                        value={viz.type}
                        onValueChange={value => {
                          const updatedVizs = visualizations.map(v =>
                            v.id === viz.id ? { ...v, type: value as any } : v
                          );
                          setVisualizations(updatedVizs);
                        }}
                      >
                        <option value="table">Table</option>
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="pie">Pie Chart</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={viz.title}
                        onChange={e => {
                          const updatedVizs = visualizations.map(v =>
                            v.id === viz.id ? { ...v, title: e.target.value } : v
                          );
                          setVisualizations(updatedVizs);
                        }}
                        placeholder="Enter title"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Metrics</label>
                    <div className="grid grid-cols-2 gap-2">
                      {metrics.map(metric => (
                        <div key={metric.id} className="flex items-center">
                          <Checkbox
                            checked={viz.metrics.includes(metric.id)}
                            onCheckedChange={checked => {
                              const updatedVizs = visualizations.map(v => {
                                if (v.id === viz.id) {
                                  const updatedMetrics = checked
                                    ? [...v.metrics, metric.id]
                                    : v.metrics.filter(m => m !== metric.id);
                                  return { ...v, metrics: updatedMetrics };
                                }
                                return v;
                              });
                              setVisualizations(updatedVizs);
                            }}
                          />
                          <span className="ml-2">{metric.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Dimensions</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableDimensions.map(dimension => (
                        <div key={dimension.id} className="flex items-center">
                          <Checkbox
                            checked={viz.dimensions.includes(dimension.id)}
                            onCheckedChange={checked => {
                              const updatedVizs = visualizations.map(v => {
                                if (v.id === viz.id) {
                                  const updatedDimensions = checked
                                    ? [...v.dimensions, dimension.id]
                                    : v.dimensions.filter(d => d !== dimension.id);
                                  return { ...v, dimensions: updatedDimensions };
                                }
                                return v;
                              });
                              setVisualizations(updatedVizs);
                            }}
                          />
                          <span className="ml-2">{dimension.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 