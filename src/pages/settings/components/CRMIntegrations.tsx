import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Cloud, 
  RefreshCw, 
  Settings, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Loader2,
  Plus
} from "lucide-react";
import { CRMConfig, Contact } from "@/types/crm";
import { 
  fetchCRMConfigs, 
  updateCRMConfig, 
  syncContacts, 
  fetchContacts,
  validateCRMConnection 
} from "@/api/crm";
import { toast } from "@/components/ui/use-toast";
import { CRMConfigModal } from "@/components/integrations/CRMConfigModal";

// Mock CRM configurations
const mockCrmConfigs = [
  {
    id: "salesforce-1",
    name: "Salesforce",
    status: "connected",
    lastSync: "Today at 10:30 AM",
    syncEnabled: true,
    apiKey: "••••••••••••••••",
    domain: "company.salesforce.com",
    icon: "/icons/salesforce.svg"
  },
  {
    id: "hubspot-1",
    name: "HubSpot",
    status: "disconnected",
    lastSync: "Never",
    syncEnabled: false,
    apiKey: "",
    domain: "",
    icon: "/icons/hubspot.svg"
  },
  {
    id: "zoho-1",
    name: "Zoho CRM",
    status: "error",
    lastSync: "Yesterday at 2:15 PM",
    syncEnabled: true,
    apiKey: "••••••••••••••••",
    domain: "company.zohocrm.com",
    icon: "/icons/zoho.svg"
  },
  {
    id: "ms-dynamics-1",
    name: "Microsoft Dynamics",
    status: "disconnected",
    lastSync: "Never",
    syncEnabled: false,
    apiKey: "",
    domain: "",
    icon: "/icons/microsoft.svg"
  }
];

interface CRMIntegrationConfig {
  id: string;
  name: string;
  type: "custom" | "salesforce" | "hubspot";
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  syncEnabled: boolean;
  apiKey?: string;
  domain?: string;
}

export function CRMIntegrations() {
  const [configs, setConfigs] = useState<CRMIntegrationConfig[]>([
    {
      id: "salesforce",
      name: "Salesforce",
      type: "salesforce",
      status: "connected",
      lastSync: "2024-02-20T10:00:00Z",
      syncEnabled: true,
    },
    {
      id: "hubspot",
      name: "HubSpot",
      type: "hubspot",
      status: "connected",
      lastSync: "2024-02-20T09:30:00Z",
      syncEnabled: true,
    },
    {
      id: "zoho",
      name: "Zoho CRM",
      type: "custom",
      status: "disconnected",
      lastSync: "2024-02-20T00:00:00Z",
      syncEnabled: false,
    },
    {
      id: "dynamics",
      name: "Microsoft Dynamics",
      type: "custom",
      status: "disconnected",
      lastSync: "2024-02-20T00:00:00Z",
      syncEnabled: false,
    },
  ]);

  const [selectedCRM, setSelectedCRM] = useState<CRMConfig | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  /**
   * Opens the configuration modal for the selected CRM
   * @param crm - The CRM configuration to edit
   */
  const handleConfigure = (crm: CRMIntegrationConfig) => {
    // Convert CRMIntegrationConfig to CRMConfig for the modal
    const crmConfig: CRMConfig = {
      id: crm.id,
      name: crm.name,
      type: crm.type,
      status: crm.status,
      lastSync: crm.lastSync,
      apiKey: crm.apiKey,
      apiUrl: crm.domain,
      syncEnabled: crm.syncEnabled
    };
    
    setSelectedCRM(crmConfig);
    setIsConfigModalOpen(true);
  };

  /**
   * Saves the updated CRM configuration
   * @param config - The updated CRM configuration
   */
  const handleSaveConfig = async (config: CRMConfig) => {
    try {
      // Update the CRM config with the new values
      setConfigs(prevConfigs =>
        prevConfigs.map(crm =>
          crm.id === config.id
            ? {
                ...crm,
                status: "connected",
                domain: config.apiUrl,
                apiKey: config.apiKey,
              }
            : crm
        )
      );
      
      toast({
        title: "Success",
        description: `${config.name} configuration saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save CRM configuration",
        variant: "destructive",
      });
    }
  };

  /**
   * Synchronizes contacts with the selected CRM
   * @param crmId - The ID of the CRM to sync with
   */
  const handleSync = async (crmId: string) => {
    setIsSyncing(crmId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConfigs(prevConfigs =>
        prevConfigs.map(crm =>
          crm.id === crmId
            ? {
                ...crm,
                lastSync: new Date().toISOString(),
              }
            : crm
        )
      );

      toast({
        title: "Success",
        description: "CRM contacts synchronized successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to synchronize CRM contacts",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(null);
    }
  };

  /**
   * Toggles auto-sync for the selected CRM
   * @param crmId - The ID of the CRM to toggle auto-sync for
   */
  const handleToggleSync = async (crmId: string) => {
    try {
      setConfigs(prevConfigs =>
        prevConfigs.map(crm =>
          crm.id === crmId
            ? {
                ...crm,
                syncEnabled: !crm.syncEnabled,
              }
            : crm
        )
      );

      toast({
        title: "Success",
        description: `Auto-sync ${configs.find(c => c.id === crmId)?.syncEnabled ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update auto-sync settings",
        variant: "destructive",
      });
    }
  };

  /**
   * Returns the appropriate badge component based on CRM status
   * @param status - The status of the CRM
   * @returns A Badge component with the appropriate variant
   */
  const getStatusBadge = (status: CRMConfig["status"]) => {
    switch (status) {
      case "connected":
        return <Badge variant="default">Connected</Badge>;
      case "disconnected":
        return <Badge variant="secondary">Disconnected</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">CRM Integrations</h2>
          <p className="text-muted-foreground">Connect your CRM systems to import contacts and sync data</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add CRM
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {configs.map((crm) => (
          <Card key={crm.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{crm.name}</CardTitle>
                {getStatusBadge(crm.status)}
              </div>
              <CardDescription>
                {crm.lastSync
                  ? `Last synced: ${new Date(crm.lastSync).toLocaleString()}`
                  : "Not configured"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={crm.syncEnabled}
                    onCheckedChange={() => handleToggleSync(crm.id)}
                    disabled={crm.status !== "connected"}
                  />
                  <span className="text-sm">Auto-sync</span>
                </div>
                <div className="flex space-x-2">
                  {crm.status === "connected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(crm.id)}
                      disabled={!!isSyncing}
                    >
                      {isSyncing === crm.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfigure(crm)}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCRM && (
        <CRMConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => {
            setIsConfigModalOpen(false);
            setSelectedCRM(null);
          }}
          crm={selectedCRM}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
} 