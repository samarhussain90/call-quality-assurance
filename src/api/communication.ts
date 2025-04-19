import { 
  CommunicationConfig, 
  NotificationEvent,
  NotificationResult,
  SlackConfig,
  EmailConfig,
  SMSConfig,
  WebhookConfig
} from "@/types/communication";

// Mock data for notification configurations
const mockConfigs: CommunicationConfig[] = [
  {
    id: "1",
    type: "slack",
    name: "Sales Team Notifications",
    enabled: true,
    events: ["call_started", "call_ended", "compliance_violation"],
    lastTriggered: "2024-03-15T10:30:00Z",
    webhookUrl: "https://hooks.slack.com/services/xxx/yyy/zzz",
    channel: "#sales-alerts"
  } as SlackConfig,
  {
    id: "2",
    type: "email",
    name: "Management Alerts",
    enabled: true,
    events: ["quality_score_low", "compliance_violation"],
    lastTriggered: "2024-03-15T09:15:00Z",
    recipients: ["manager@example.com", "supervisor@example.com"]
  } as EmailConfig,
  {
    id: "3",
    type: "sms",
    name: "Emergency Alerts",
    enabled: false,
    events: ["compliance_violation"],
    lastTriggered: null,
    phoneNumbers: ["+1234567890"]
  } as SMSConfig,
  {
    id: "4",
    type: "webhook",
    name: "Custom Integration",
    enabled: true,
    events: ["call_ended", "campaign_completed"],
    lastTriggered: "2024-03-15T11:45:00Z",
    url: "https://api.example.com/webhook",
    method: "POST"
  } as WebhookConfig
];

// Mock notification history
const mockHistory: NotificationResult[] = [
  {
    success: true,
    message: "Notification sent successfully",
    timestamp: "2024-03-15T10:30:00Z",
    configId: "1",
    event: "call_started"
  },
  {
    success: false,
    message: "Failed to send notification",
    timestamp: "2024-03-15T09:15:00Z",
    configId: "2",
    event: "quality_score_low",
    error: "Invalid email format"
  }
];

export async function fetchNotificationConfigs(): Promise<CommunicationConfig[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockConfigs;
}

export async function createNotificationConfig(config: CommunicationConfig): Promise<CommunicationConfig> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newConfig = {
    ...config,
    id: Math.random().toString(36).substr(2, 9)
  };
  mockConfigs.push(newConfig);
  return newConfig;
}

export async function updateNotificationConfig(config: CommunicationConfig): Promise<CommunicationConfig> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockConfigs.findIndex(c => c.id === config.id);
  if (index === -1) {
    throw new Error("Configuration not found");
  }
  mockConfigs[index] = config;
  return config;
}

export async function deleteNotificationConfig(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockConfigs.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error("Configuration not found");
  }
  mockConfigs.splice(index, 1);
}

export async function testNotification(config: CommunicationConfig, event: NotificationEvent): Promise<NotificationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 90% success rate
  const success = Math.random() > 0.1;
  
  return {
    success,
    message: success ? "Test notification sent successfully" : "Failed to send test notification",
    timestamp: new Date().toISOString(),
    configId: config.id,
    event,
    error: success ? undefined : "Test error message"
  };
}

export async function fetchNotificationHistory(): Promise<NotificationResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockHistory;
}

export async function validateConfig(config: CommunicationConfig): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  switch (config.type) {
    case "slack":
      return !!(config as SlackConfig).webhookUrl;
    case "email":
      return !!(config as EmailConfig).recipients?.length;
    case "sms":
      return !!(config as SMSConfig).phoneNumbers?.length;
    case "webhook":
      return !!(config as WebhookConfig).url;
    default:
      return false;
  }
} 