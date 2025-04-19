import React from 'react';
import { Card, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, BarChart, Shield, TrendingUp } from 'lucide-react';

export default function PerformanceMonitoring() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the current tab from the URL path
  const currentPath = location.pathname.split('/').pop() || 'agents';
  
  const handleTabChange = (value: string) => {
    navigate(`/performance/${value}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Performance Monitoring</h1>
      </div>
      <Card className="p-6">
        <Tabs value={currentPath} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="agents" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Agent Performance
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" />
              Campaign Performance
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Compliance Monitoring
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Quality Trends
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <Outlet />
          </div>
        </Tabs>
      </Card>
    </div>
  );
} 