import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Ticket,
  User,
  Building
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: "crm" | "helpdesk" | "slack" | "email";
  status: "connected" | "disconnected" | "error";
  config: {
    apiKey?: string;
    webhookUrl?: string;
    channel?: string;
    email?: string;
  };
  lastSync: string;
  autoCreate: boolean;
  templates: {
    id: string;
    name: string;
    content: string;
    type: "ticket" | "task" | "note";
  }[];
}

interface IntegrationHubProps {
  onIntegrationChange?: (integrations: Integration[]) => void;
}

export function IntegrationHub({ onIntegrationChange }: IntegrationHubProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Salesforce CRM",
      type: "crm",
      status: "connected",
      config: {
        apiKey: "********",
        webhookUrl: "https://salesforce.com/webhook"
      },
      lastSync: "2024-02-20T10:30:00Z",
      autoCreate: true,
      templates: [
        {
          id: "1",
          name: "New Customer Ticket",
          content: "New customer inquiry from {customerName}. Call quality score: {qualityScore}",
          type: "ticket"
        },
        {
          id: "2",
          name: "Follow-up Task",
          content: "Follow up with {customerName} regarding {issue}",
          type: "task"
        }
      ]
    },
    {
      id: "2",
      name: "Zendesk Helpdesk",
      type: "helpdesk",
      status: "connected",
      config: {
        apiKey: "********",
        webhookUrl: "https://zendesk.com/webhook"
      },
      lastSync: "2024-02-20T10:30:00Z",
      autoCreate: true,
      templates: [
        {
          id: "1",
          name: "Support Ticket",
          content: "Support ticket created for {customerName}. Issue: {issue}",
          type: "ticket"
        }
      ]
    },
    {
      id: "3",
      name: "Slack Notifications",
      type: "slack",
      status: "connected",
      config: {
        webhookUrl: "https://hooks.slack.com/services/xxx",
        channel: "#call-center-alerts"
      },
      lastSync: "2024-02-20T10:30:00Z",
      autoCreate: true,
      templates: [
        {
          id: "1",
          name: "Alert Message",
          content: "🚨 Alert: {alertType} for call with {customerName}",
          type: "note"
        }
      ]
    }
  ]);

  const [isAddingIntegration, setIsAddingIntegration] = useState(false);
  const [newIntegration, setNewIntegration] = useState<Partial<Integration>>({
    name: "",
    type: "crm",
    status: "disconnected",
    config: {},
    autoCreate: false,
    templates: []
  });

  const handleAddIntegration = () => {
    if (newIntegration.name && newIntegration.type) {
      const integration: Integration = {
        id: Date.now().toString(),
        name: newIntegration.name,
        type: newIntegration.type as Integration["type"],
        status: "disconnected",
        config: {},
        lastSync: new Date().toISOString(),
        autoCreate: false,
        templates: []
      };

      setIntegrations([...integrations, integration]);
      setNewIntegration({
        name: "",
        type: "crm",
        status: "disconnected",
        config: {},
        autoCreate: false,
        templates: []
      });
      setIsAddingIntegration(false);
      onIntegrationChange?.(integrations);
    }
  };

  const handleDeleteIntegration = (id: string) => {
    const updatedIntegrations = integrations.filter(integration => integration.id !== id);
    setIntegrations(updatedIntegrations);
    onIntegrationChange?.(updatedIntegrations);
  };

  const handleToggleAutoCreate = (id: string) => {
    const updatedIntegrations = integrations.map(integration => 
      integration.id === id ? { ...integration, autoCreate: !integration.autoCreate } : integration
    );
    setIntegrations(updatedIntegrations);
    onIntegrationChange?.(updatedIntegrations);
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case "crm":
        return <Building className="h-5 w-5" />;
      case "helpdesk":
        return <Ticket className="h-5 w-5" />;
      case "slack":
        return <MessageSquare className="h-5 w-5" />;
      case "email":
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-500";
      case "disconnected":
        return "text-gray-400";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Integration Hub</h2>
        <Button 
          variant="outline" 
          onClick={() => setIsAddingIntegration(!isAddingIntegration)}
          className="text-white border-gray-700 hover:bg-gray-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {isAddingIntegration && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">New Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Integration Name</label>
                <Input
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter integration name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Integration Type</label>
                <select
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as Integration["type"] })}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                >
                  <option value="crm">CRM</option>
                  <option value="helpdesk">Helpdesk</option>
                  <option value="slack">Slack</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddingIntegration(false)}
                className="text-white border-gray-700 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddIntegration}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Integration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIntegrationIcon(integration.type)}
                  <div>
                    <CardTitle className="text-white">{integration.name}</CardTitle>
                    <p className="text-sm text-gray-400">
                      Last synced: {new Date(integration.lastSync).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={integration.status === "connected" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {integration.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Auto-create items</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleAutoCreate(integration.id)}
                    className="text-white hover:bg-gray-700"
                  >
                    {integration.autoCreate ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>

                {integration.templates.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Templates</h4>
                    <div className="space-y-2">
                      {integration.templates.map((template) => (
                        <div 
                          key={template.id}
                          className="p-2 rounded bg-gray-700/50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white">{template.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {template.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{template.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-gray-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteIntegration(integration.id)}
                    className="text-white hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 