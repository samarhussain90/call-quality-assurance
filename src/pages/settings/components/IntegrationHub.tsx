import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CRMIntegrations } from './CRMIntegrations';
import { CommunicationIntegrations } from './CommunicationIntegrations';

export function IntegrationHub() {
  const [activeTab, setActiveTab] = useState('crm');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Integration Hub</h2>
      <p className="text-muted-foreground mb-6">Configure integrations with external services and tools</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="crm">CRM Integrations</TabsTrigger>
          <TabsTrigger value="communication">Communication Tools</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        <TabsContent value="crm">
          <CRMIntegrations />
        </TabsContent>
        <TabsContent value="communication">
          <CommunicationIntegrations />
        </TabsContent>
        <TabsContent value="data">
          <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Data Source Integrations</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect to external data sources and platforms</p>
            <Button variant="outline">Add Data Source</Button>
          </div>
        </TabsContent>
        <TabsContent value="webhooks">
          <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Webhook Configuration</h3>
            <p className="text-sm text-muted-foreground mb-4">Set up webhooks to communicate with external services</p>
            <Button variant="outline">Add Webhook</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 