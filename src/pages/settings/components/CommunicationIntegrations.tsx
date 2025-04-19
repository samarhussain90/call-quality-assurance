import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Webhook,
  Settings, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Save,
  TestTube2
} from "lucide-react";
import { 
  CommunicationConfig, 
  NotificationEvent,
  NotificationType,
  NotificationConfig,
  ConditionalRule,
  WebhookConfig,
  EmailConfig,
  SlackConfig,
  SMSConfig
} from "@/types/communication";
import { 
  fetchNotificationConfigs, 
  createNotificationConfig, 
  updateNotificationConfig,
  deleteNotificationConfig,
  testNotification,
  validateConfig
} from "@/api/communication";
import { toast } from "@/components/ui/use-toast";
import { ConditionalRules } from "@/components/integrations/ConditionalRules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EVENT_OPTIONS: { value: NotificationEvent; label: string }[] = [
  { value: "call_started", label: "Call Started" },
  { value: "call_ended", label: "Call Ended" },
  { value: "compliance_violation", label: "Compliance Violation" },
  { value: "quality_score_low", label: "Quality Score Low" },
  { value: "agent_offline", label: "Agent Offline" },
  { value: "agent_online", label: "Agent Online" },
  { value: "campaign_completed", label: "Campaign Completed" },
  { value: "custom", label: "Custom Event" }
];

const NOTIFICATION_TYPES: { value: NotificationType; label: string; icon: React.ReactNode }[] = [
  { value: "webhook", label: "Webhook", icon: <Webhook className="h-4 w-4" /> },
  { value: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { value: "slack", label: "Slack", icon: <MessageSquare className="h-4 w-4" /> },
  { value: "sms", label: "SMS", icon: <Bell className="h-4 w-4" /> }
];

export function CommunicationIntegrations() {
  const [configurations, setConfigurations] = useState<NotificationConfig[]>([]);
  const [selectedType, setSelectedType] = useState<NotificationType | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<NotificationEvent[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [slackChannel, setSlackChannel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [conditionalRules, setConditionalRules] = useState<ConditionalRule[]>([]);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const configs = await fetchNotificationConfigs();
      setConfigurations(configs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notification configurations",
        variant: "destructive"
      });
    }
  };

  const handleAddConfig = async () => {
    if (!selectedType || !name || selectedEvents.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate type-specific fields
    let isValid = true;
    let errorMessage = "";

    switch (selectedType) {
      case "webhook":
        if (!webhookUrl) {
          isValid = false;
          errorMessage = "Webhook URL is required";
        } else if (!webhookUrl.startsWith("https://")) {
          isValid = false;
          errorMessage = "Webhook URL must use HTTPS";
        }
        break;
      case "email":
        if (!emailAddress) {
          isValid = false;
          errorMessage = "Email address is required";
        } else if (!emailAddress.includes("@")) {
          isValid = false;
          errorMessage = "Invalid email address";
        }
        break;
      case "slack":
        if (!slackChannel) {
          isValid = false;
          errorMessage = "Slack channel is required";
        } else if (!slackChannel.startsWith("#")) {
          isValid = false;
          errorMessage = "Slack channel must start with #";
        }
        break;
      case "sms":
        if (!phoneNumber) {
          isValid = false;
          errorMessage = "Phone number is required";
        } else if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
          isValid = false;
          errorMessage = "Invalid phone number format (E.164)";
        }
        break;
    }

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }

    try {
      // Create type-specific configuration
      let newConfig: CommunicationConfig;
      
      switch (selectedType) {
        case "webhook":
          newConfig = {
            id: crypto.randomUUID(),
            type: "webhook",
            name,
            description,
            enabled: isEnabled,
            events: selectedEvents,
            conditionalRules,
            url: webhookUrl,
            method: "POST",
            headers: {},
            config: {
              url: webhookUrl,
              method: "POST"
            }
          } as WebhookConfig;
          break;
        case "email":
          newConfig = {
            id: crypto.randomUUID(),
            type: "email",
            name,
            description,
            enabled: isEnabled,
            events: selectedEvents,
            conditionalRules,
            recipients: [emailAddress],
            config: {
              email: emailAddress
            }
          } as EmailConfig;
          break;
        case "slack":
          newConfig = {
            id: crypto.randomUUID(),
            type: "slack",
            name,
            description,
            enabled: isEnabled,
            events: selectedEvents,
            conditionalRules,
            webhookUrl: "",  // This would come from Slack app integration
            channel: slackChannel,
            config: {
              channel: slackChannel
            }
          } as SlackConfig;
          break;
        case "sms":
          newConfig = {
            id: crypto.randomUUID(),
            type: "sms",
            name,
            description,
            enabled: isEnabled,
            events: selectedEvents,
            conditionalRules,
            phoneNumbers: [phoneNumber],
            config: {
              phoneNumber
            }
          } as SMSConfig;
          break;
        default:
          throw new Error("Invalid notification type");
      }

      // Validate the configuration before saving
      const configIsValid = await validateConfig(newConfig);
      if (!configIsValid) {
        throw new Error("Invalid configuration");
      }

      await createNotificationConfig(newConfig);
      setConfigurations([...configurations, newConfig as NotificationConfig]);
      resetForm();
      
      toast({
        title: "Success",
        description: "Configuration added successfully"
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to add configuration: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const handleRemoveConfig = async (configId: string) => {
    try {
      await deleteNotificationConfig(configId);
      setConfigurations(configurations.filter(config => config.id !== configId));
      toast({
        title: "Success",
        description: "Configuration removed successfully"
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to remove configuration: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const handleSaveConfig = async (configId: string) => {
    try {
      const baseConfig = configurations.find(c => c.id === configId);
      if (!baseConfig) {
        throw new Error("Configuration not found");
      }

      // Convert to specific config type
      let config: CommunicationConfig;
      switch (baseConfig.type) {
        case "webhook":
          config = {
            ...baseConfig,
            url: baseConfig.config.url || "",
            method: baseConfig.config.method || "POST",
            headers: {},
          } as WebhookConfig;
          break;
        case "email":
          config = {
            ...baseConfig,
            recipients: [baseConfig.config.email || ""],
          } as EmailConfig;
          break;
        case "slack":
          config = {
            ...baseConfig,
            webhookUrl: baseConfig.config.url || "",
            channel: baseConfig.config.channel || "",
          } as SlackConfig;
          break;
        case "sms":
          config = {
            ...baseConfig,
            phoneNumbers: [baseConfig.config.phoneNumber || ""],
          } as SMSConfig;
          break;
        default:
          throw new Error("Invalid notification type");
      }

      await updateNotificationConfig(config);
      toast({
        title: "Success",
        description: "Configuration saved successfully"
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to save configuration: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const handleTestConfig = async (configId: string) => {
    try {
      const baseConfig = configurations.find(c => c.id === configId);
      if (!baseConfig) {
        throw new Error("Configuration not found");
      }

      // Convert to specific config type
      let config: CommunicationConfig;
      switch (baseConfig.type) {
        case "webhook":
          config = {
            ...baseConfig,
            url: baseConfig.config.url || "",
            method: baseConfig.config.method || "POST",
            headers: {},
          } as WebhookConfig;
          break;
        case "email":
          config = {
            ...baseConfig,
            recipients: [baseConfig.config.email || ""],
          } as EmailConfig;
          break;
        case "slack":
          config = {
            ...baseConfig,
            webhookUrl: baseConfig.config.url || "",
            channel: baseConfig.config.channel || "",
          } as SlackConfig;
          break;
        case "sms":
          config = {
            ...baseConfig,
            phoneNumbers: [baseConfig.config.phoneNumber || ""],
          } as SMSConfig;
          break;
        default:
          throw new Error("Invalid notification type");
      }

      // Validate configuration before testing
      const isValid = await validateConfig(config);
      if (!isValid) {
        throw new Error("Invalid configuration");
      }

      // Use the first event from the config's events list for testing
      if (!config.events.length) {
        throw new Error("No events configured for testing");
      }

      await testNotification(config, config.events[0]);
      toast({
        title: "Success",
        description: "Test notification sent successfully"
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to send test notification: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setSelectedEvents([]);
    setName("");
    setDescription("");
    setIsEnabled(true);
    setWebhookUrl("");
    setEmailAddress("");
    setSlackChannel("");
    setPhoneNumber("");
    setConditionalRules([]);
  };

  const getConfigFields = () => {
    switch (selectedType) {
      case "webhook":
        return (
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
        );
      case "email":
        return (
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address</Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="notifications@example.com"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>
        );
      case "slack":
        return (
          <div className="space-y-2">
            <Label htmlFor="slackChannel">Slack Channel</Label>
            <Input
              id="slackChannel"
              placeholder="#notifications"
              value={slackChannel}
              onChange={(e) => setSlackChannel(e.target.value)}
            />
          </div>
        );
      case "sms":
        return (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Add a helper function for consistent status badges
  const getStatusBadge = (enabled: boolean) => {
    return enabled ? (
      <Badge variant="secondary" className="bg-green-500/10 text-green-500 ml-2">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="ml-2">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  if (configurations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Configurations</h3>
        <p className="text-sm text-muted-foreground mb-4">Get started by adding your first notification configuration.</p>
        <TabsTrigger value="new" className="inline-flex">
          <Plus className="h-4 w-4 mr-2" />
          Add Configuration
        </TabsTrigger>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Communication Integrations</h2>
          <p className="text-muted-foreground">
            Configure how you want to receive notifications
          </p>
        </div>
      </div>

      <Tabs defaultValue="configs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="configs">Existing Configurations</TabsTrigger>
          <TabsTrigger value="new">Add New Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="configs" className="space-y-4">
          {configurations.length > 0 ? (
            <div className="grid gap-4">
              {configurations.map((config) => (
                <Card key={config.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div>
                          <CardTitle className="text-lg font-semibold flex items-center">
                            {config.name}
                            {getStatusBadge(config.enabled)}
                          </CardTitle>
                          <CardDescription>{config.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestConfig(config.id)}
                        >
                          <TestTube2 className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveConfig(config.id)}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveConfig(config.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Type</Label>
                        <div className="flex items-center space-x-2">
                          {NOTIFICATION_TYPES.find(t => t.value === config.type)?.icon}
                          <span className="text-sm">
                            {NOTIFICATION_TYPES.find(t => t.value === config.type)?.label}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Events</Label>
                        <div className="flex flex-wrap gap-2">
                          {config.events.map(event => (
                            <Badge 
                              key={event}
                              variant="secondary"
                              className="flex items-center"
                            >
                              {EVENT_OPTIONS.find(e => e.value === event)?.label || event}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {config.conditionalRules && config.conditionalRules.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Conditional Rules</Label>
                          <div className="space-y-2">
                            {config.conditionalRules.map(rule => (
                              <div 
                                key={rule.id}
                                className="p-2 bg-muted rounded-md text-sm"
                              >
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">
                                    {EVENT_OPTIONS.find(e => e.value === rule.event)?.label || rule.event}
                                  </Badge>
                                  <span className="text-muted-foreground">
                                    {rule.field} {rule.operator} {rule.value.toString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No notification configurations added yet.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Configuration</CardTitle>
              <CardDescription>
                Create a new notification configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Notification Type</Label>
                  <Select
                    value={selectedType || ""}
                    onValueChange={(value: NotificationType) => setSelectedType(value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFICATION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            {type.icon}
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Production Alerts"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Receive alerts for production issues"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Events</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {EVENT_OPTIONS.map(event => (
                      <div key={event.value} className="flex items-center space-x-2">
                        <Switch
                          checked={selectedEvents.includes(event.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEvents([...selectedEvents, event.value]);
                            } else {
                              setSelectedEvents(selectedEvents.filter(e => e !== event.value));
                            }
                          }}
                        />
                        <Label>{event.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedType && getConfigFields()}
              </div>

              {selectedEvents.length > 0 && (
                <ConditionalRules
                  events={selectedEvents}
                  rules={conditionalRules}
                  onChange={setConditionalRules}
                />
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
                <Label>Enabled</Label>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleAddConfig}
                  disabled={!selectedType || !name || selectedEvents.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 