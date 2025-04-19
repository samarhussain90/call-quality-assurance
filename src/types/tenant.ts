export type UserRole = 
  | "owner" 
  | "admin" 
  | "manager" 
  | "agent" 
  | "viewer";

export type OrganizationStatus = 
  | "active" 
  | "suspended" 
  | "trial" 
  | "cancelled";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
  settings: OrganizationSettings;
  subscriptionId?: string;
  customerId?: string;
};

export type OrganizationSettings = {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  features: {
    [key: string]: boolean;
  };
  branding: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  notifications: {
    email: boolean;
    slack: boolean;
    webhook?: string;
  };
};

export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  status: "active" | "pending" | "inactive";
  invitedBy: string;
  invitedAt: string;
  acceptedAt?: string;
  lastActiveAt?: string;
};

export type OrganizationInvite = {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  invitedBy: string;
  invitedAt: string;
  acceptedAt?: string;
};

export type UserPermissions = {
  canManageUsers: boolean;
  canManageBilling: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canManageCampaigns: boolean;
  canManageCalls: boolean;
  canExportData: boolean;
  canAccessApi: boolean;
  maxApiCalls?: number;
  maxStorage?: number;
  maxUsers?: number;
  maxConcurrentCalls?: number;
};

export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  planLevel: "free" | "basic" | "pro" | "enterprise";
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
};

export type TenantContext = {
  organizationId: string;
  userId: string;
  role: UserRole;
  permissions: UserPermissions;
  features: {
    [key: string]: boolean;
  };
}; 