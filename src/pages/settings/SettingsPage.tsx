import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceRulesEngine } from "@/pages/calls/components/ComplianceRulesEngine";
import { AgentAnalytics } from "@/pages/calls/components/AgentAnalytics";
import { IntegrationHub } from "@/pages/calls/components/IntegrationHub";
import { ModelTraining } from "@/pages/calls/components/ModelTraining";

// Mock data for AgentAnalytics
const mockAgents = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    callsHandled: 245,
    averageCallDuration: "4m 32s",
    qualityScore: 92,
    complianceRate: 95,
    customerSatisfaction: 88,
    firstCallResolution: 78,
    trends: {
      qualityScore: "up" as const,
      complianceRate: "stable" as const,
      customerSatisfaction: "down" as const
    },
    alerts: [
      {
        type: "warning" as const,
        message: "Customer satisfaction dropped 5% this week",
        timestamp: "2024-02-20T10:30:00Z"
      }
    ]
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    callsHandled: 312,
    averageCallDuration: "3m 45s",
    qualityScore: 88,
    complianceRate: 92,
    customerSatisfaction: 90,
    firstCallResolution: 82,
    trends: {
      qualityScore: "stable" as const,
      complianceRate: "up" as const,
      customerSatisfaction: "up" as const
    },
    alerts: []
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=3",
    callsHandled: 198,
    averageCallDuration: "5m 12s",
    qualityScore: 85,
    complianceRate: 90,
    customerSatisfaction: 87,
    firstCallResolution: 75,
    trends: {
      qualityScore: "down" as const,
      complianceRate: "down" as const,
      customerSatisfaction: "stable" as const
    },
    alerts: [
      {
        type: "critical" as const,
        message: "Compliance violations increased by 15%",
        timestamp: "2024-02-19T14:15:00Z"
      },
      {
        type: "warning" as const,
        message: "Quality score below target threshold",
        timestamp: "2024-02-18T09:45:00Z"
      }
    ]
  }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("compliance");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <Tabs defaultValue="compliance" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="compliance"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
          >
            Compliance Rules
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
          >
            Agent Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="integrations"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
          >
            Integrations
          </TabsTrigger>
          <TabsTrigger 
            value="training"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
          >
            Model Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceRulesEngine />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <AgentAnalytics agents={mockAgents} />
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-6">
          <IntegrationHub />
        </TabsContent>
        
        <TabsContent value="training" className="mt-6">
          <ModelTraining />
        </TabsContent>
      </Tabs>
    </div>
  );
}
