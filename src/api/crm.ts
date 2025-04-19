import { CRMConfig } from "@/types/crm";

// Mock CRM configurations
let mockCRMConfigs: CRMConfig[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    type: "salesforce",
    status: "disconnected",
    lastSync: "Never",
    syncEnabled: false
  },
  {
    id: "hubspot",
    name: "HubSpot",
    type: "hubspot",
    status: "disconnected",
    lastSync: "Never",
    syncEnabled: false
  },
  {
    id: "custom",
    name: "Custom CRM",
    type: "custom",
    status: "disconnected",
    lastSync: "Never",
    apiUrl: "",
    syncEnabled: false
  }
];

// Mock contact data
const mockContacts = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    company: "Acme Corp",
    lastContact: "2024-03-15"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+0987654321",
    company: "TechCo",
    lastContact: "2024-03-14"
  }
];

export async function fetchCRMConfigs(): Promise<CRMConfig[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockCRMConfigs;
}

export async function updateCRMConfig(config: Partial<CRMConfig>): Promise<CRMConfig> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = mockCRMConfigs.findIndex(c => c.id === config.id);
  if (index === -1) {
    throw new Error("CRM configuration not found");
  }

  mockCRMConfigs[index] = {
    ...mockCRMConfigs[index],
    ...config,
    status: "connected"
  };

  return mockCRMConfigs[index];
}

export async function syncContacts(crmId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const config = mockCRMConfigs.find(c => c.id === crmId);
  if (!config) {
    throw new Error("CRM configuration not found");
  }

  // Update last sync time
  config.lastSync = new Date().toISOString();
}

export async function fetchContacts(crmId: string): Promise<any[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const config = mockCRMConfigs.find(c => c.id === crmId);
  if (!config) {
    throw new Error("CRM configuration not found");
  }

  return mockContacts;
}

export async function validateCRMConnection(config: Partial<CRMConfig>): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation logic
  if (config.type === "custom" && (!config.apiUrl || !config.apiKey)) {
    return false;
  }
  
  if (!config.apiKey) {
    return false;
  }

  return true;
} 