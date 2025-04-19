import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { CRMConfig } from "@/types/crm";

interface CRMConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  crm: CRMConfig;
  onSave: (config: CRMConfig) => void;
}

export function CRMConfigModal({ isOpen, onClose, crm, onSave }: CRMConfigModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    domain: "",
    apiKey: "",
    clientId: "",
    clientSecret: "",
    refreshToken: "",
  });

  // Reset form data when modal opens with a new CRM
  useEffect(() => {
    if (isOpen && crm) {
      setFormData({
        domain: crm.apiUrl || "",
        apiKey: crm.apiKey || "",
        clientId: "",
        clientSecret: "",
        refreshToken: "",
      });
    }
  }, [isOpen, crm]);

  /**
   * Handles form submission and validates required fields
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate required fields based on CRM type
      if (crm.type === "custom") {
        if (!formData.domain || !formData.clientId || !formData.clientSecret) {
          throw new Error("Please fill in all required fields");
        }
      } else if (crm.type === "salesforce" || crm.type === "hubspot") {
        if (!formData.apiKey) {
          throw new Error("API Key is required");
        }
      }

      // Create updated config
      const updatedConfig: CRMConfig = {
        ...crm,
        apiKey: formData.apiKey,
        apiUrl: formData.domain,
      };

      onSave(updatedConfig);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Returns the appropriate form fields based on CRM type
   */
  const getFields = () => {
    switch (crm.type) {
      case "custom":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="your-domain.example.com"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                placeholder="Enter your Client ID"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                placeholder="Enter your Client Secret"
                value={formData.clientSecret}
                onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refreshToken">Refresh Token (Optional)</Label>
              <Input
                id="refreshToken"
                type="password"
                placeholder="Enter your Refresh Token"
                value={formData.refreshToken}
                onChange={(e) => setFormData({ ...formData, refreshToken: e.target.value })}
              />
            </div>
          </>
        );
      case "salesforce":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Salesforce API Key"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Instance URL (Optional)</Label>
              <Input
                id="domain"
                placeholder="https://your-org.salesforce.com"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
          </>
        );
      case "hubspot":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your HubSpot API Key"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Portal ID (Optional)</Label>
              <Input
                id="domain"
                placeholder="Enter your HubSpot Portal ID"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {crm.name}</DialogTitle>
          <DialogDescription>
            Enter your {crm.name} credentials to enable integration
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {getFields()}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 