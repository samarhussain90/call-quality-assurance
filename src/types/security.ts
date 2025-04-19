export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

export interface IPWhitelist {
  id: string;
  ipAddress: string;
  description: string;
  createdAt: string;
  createdBy: string;
  lastUsed?: string;
}

export interface RateLimit {
  id: string;
  endpoint: string;
  limit: number;
  window: number; // in seconds
  currentCount: number;
  resetAt: string;
}

export interface SecuritySettings {
  encryptionEnabled: boolean;
  encryptionKey?: string;
  auditLoggingEnabled: boolean;
  ipWhitelistingEnabled: boolean;
  rateLimitingEnabled: boolean;
  maxRequestsPerMinute: number;
  sessionTimeout: number; // in minutes
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
  };
} 