import { 
  AuditLog, 
  IPWhitelist, 
  RateLimit, 
  SecuritySettings 
} from "@/types/security";
import { encrypt, decrypt } from "@/utils/encryption";

// Mock data
const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-03-15T10:30:00Z",
    userId: "user-1",
    action: "login",
    resource: "auth",
    details: { success: true },
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0..."
  },
  {
    id: "2",
    timestamp: "2024-03-15T11:15:00Z",
    userId: "user-2",
    action: "create",
    resource: "campaign",
    resourceId: "campaign-1",
    details: { name: "Q1 Sales" },
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0..."
  }
];

const mockIPWhitelist: IPWhitelist[] = [
  {
    id: "1",
    ipAddress: "192.168.1.0/24",
    description: "Office Network",
    createdAt: "2024-03-01T00:00:00Z",
    createdBy: "admin",
    lastUsed: "2024-03-15T10:30:00Z"
  }
];

const mockRateLimits: RateLimit[] = [
  {
    id: "1",
    endpoint: "/api/campaigns",
    limit: 100,
    window: 60,
    currentCount: 45,
    resetAt: "2024-03-15T11:30:00Z"
  }
];

const mockSecuritySettings: SecuritySettings = {
  encryptionEnabled: true,
  encryptionKey: "mock-encryption-key",
  auditLoggingEnabled: true,
  ipWhitelistingEnabled: true,
  rateLimitingEnabled: true,
  maxRequestsPerMinute: 100,
  sessionTimeout: 30,
  passwordPolicy: {
    minLength: 8,
    requireNumbers: true,
    requireSpecialChars: true,
    requireUppercase: true,
    requireLowercase: true
  }
};

// Audit Log Functions
export async function fetchAuditLogs(
  startDate?: string,
  endDate?: string,
  userId?: string,
  action?: string
): Promise<AuditLog[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAuditLogs;
}

export async function createAuditLog(log: Omit<AuditLog, "id">): Promise<AuditLog> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newLog = {
    ...log,
    id: Math.random().toString(36).substr(2, 9)
  };
  mockAuditLogs.push(newLog);
  return newLog;
}

// IP Whitelist Functions
export async function fetchIPWhitelist(): Promise<IPWhitelist[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockIPWhitelist;
}

export async function addIPToWhitelist(ip: Omit<IPWhitelist, "id">): Promise<IPWhitelist> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newIP = {
    ...ip,
    id: Math.random().toString(36).substr(2, 9)
  };
  mockIPWhitelist.push(newIP);
  return newIP;
}

export async function removeIPFromWhitelist(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockIPWhitelist.findIndex(ip => ip.id === id);
  if (index === -1) {
    throw new Error("IP not found in whitelist");
  }
  mockIPWhitelist.splice(index, 1);
}

// Rate Limiting Functions
export async function fetchRateLimits(): Promise<RateLimit[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockRateLimits;
}

export async function updateRateLimit(limit: RateLimit): Promise<RateLimit> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockRateLimits.findIndex(l => l.id === limit.id);
  if (index === -1) {
    throw new Error("Rate limit not found");
  }
  mockRateLimits[index] = limit;
  return limit;
}

// Security Settings Functions
export async function fetchSecuritySettings(): Promise<SecuritySettings> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockSecuritySettings;
}

export async function updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  Object.assign(mockSecuritySettings, settings);
  return mockSecuritySettings;
}

// Encryption Functions
export async function encryptData(data: string): Promise<string> {
  if (!mockSecuritySettings.encryptionEnabled) {
    throw new Error("Encryption is not enabled");
  }
  return encrypt(data, mockSecuritySettings.encryptionKey!);
}

export async function decryptData(encryptedData: string): Promise<string> {
  if (!mockSecuritySettings.encryptionEnabled) {
    throw new Error("Encryption is not enabled");
  }
  return decrypt(encryptedData, mockSecuritySettings.encryptionKey!);
} 