export interface CRMConfig {
  id: string;
  name: string;
  type: "salesforce" | "hubspot" | "custom";
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  apiKey?: string;
  apiUrl?: string;
  syncEnabled: boolean;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  lastContact: string;
  metadata?: Record<string, any>;
}

export interface CRMSyncResult {
  success: boolean;
  message: string;
  syncedContacts: number;
  errors?: string[];
} 