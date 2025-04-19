export type NotificationType = "email" | "slack" | "sms" | "webhook";

export type NotificationEvent = 
  | "call_started" 
  | "call_ended" 
  | "compliance_violation" 
  | "quality_score_low" 
  | "agent_offline" 
  | "agent_online" 
  | "campaign_completed" 
  | "custom";

export type ConditionOperator = 
  | "equals" 
  | "not_equals" 
  | "contains" 
  | "not_contains" 
  | "greater_than" 
  | "less_than" 
  | "starts_with" 
  | "ends_with";

export type DataFieldType = 
  | "text" 
  | "number" 
  | "boolean" 
  | "date" 
  | "array";

export interface DataField {
  id: string;
  name: string;
  type: DataFieldType;
  description: string;
  event: NotificationEvent;
}

export interface ConditionalRule {
  id: string;
  event: NotificationEvent;
  field: string;
  operator: string;
  value: string | number | boolean;
}

export interface NotificationConfig {
  id: string;
  type: NotificationType;
  name: string;
  description: string;
  enabled: boolean;
  events: NotificationEvent[];
  conditionalRules?: ConditionalRule[];
  config: {
    url?: string;
    email?: string;
    channel?: string;
    phoneNumber?: string;
    method?: "GET" | "POST" | "PUT";
  };
  lastTriggered?: string;
}

export interface SlackConfig extends NotificationConfig {
  type: "slack";
  webhookUrl: string;
  channel?: string;
  username?: string;
}

export interface EmailConfig extends NotificationConfig {
  type: "email";
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  template?: string;
}

export interface SMSConfig extends NotificationConfig {
  type: "sms";
  phoneNumbers: string[];
  provider?: string;
}

export interface WebhookConfig extends NotificationConfig {
  type: "webhook";
  url: string;
  method: "GET" | "POST" | "PUT";
  headers?: Record<string, string>;
  bodyTemplate?: string;
  secret?: string;
}

export type CommunicationConfig = SlackConfig | EmailConfig | SMSConfig | WebhookConfig;

export interface NotificationResult {
  success: boolean;
  message: string;
  timestamp: string;
  configId: string;
  event: NotificationEvent;
  error?: string;
} 