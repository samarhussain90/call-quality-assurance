import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  History, 
  Globe,
  Gauge,
  Save,
  Loader2
} from "lucide-react";
import { 
  SecuritySettings as SecuritySettingsType,
  AuditLog,
  IPWhitelist,
  RateLimit
} from "@/types/security";
import {
  fetchSecuritySettings,
  updateSecuritySettings,
  fetchAuditLogs,
  fetchIPWhitelist,
  addIPToWhitelist,
  removeIPFromWhitelist,
  fetchRateLimits,
  updateRateLimit
} from "@/api/security";
import { toast } from "@/components/ui/use-toast";

export function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettingsType | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [ipWhitelist, setIPWhitelist] = useState<IPWhitelist[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newIP, setNewIP] = useState({ ipAddress: "", description: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [settingsData, logsData, whitelistData, limitsData] = await Promise.all([
        fetchSecuritySettings(),
        fetchAuditLogs(),
        fetchIPWhitelist(),
        fetchRateLimits()
      ]);
      setSettings(settingsData);
      setAuditLogs(logsData);
      setIPWhitelist(whitelistData);
      setRateLimits(limitsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load security settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof SecuritySettingsType, value: any) => {
    if (!settings) return;
    try {
      setIsLoading(true);
      const updatedSettings = await updateSecuritySettings({
        [key]: value
      });
      setSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Security settings updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIP = async () => {
    if (!newIP.ipAddress || !newIP.description) return;
    try {
      setIsLoading(true);
      const addedIP = await addIPToWhitelist({
        ...newIP,
        createdAt: new Date().toISOString(),
        createdBy: "current-user" // Replace with actual user ID
      });
      setIPWhitelist(prev => [...prev, addedIP]);
      setNewIP({ ipAddress: "", description: "" });
      toast({
        title: "Success",
        description: "IP address added to whitelist"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add IP address",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveIP = async (id: string) => {
    try {
      setIsLoading(true);
      await removeIPFromWhitelist(id);
      setIPWhitelist(prev => prev.filter(ip => ip.id !== id));
      toast({
        title: "Success",
        description: "IP address removed from whitelist"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove IP address",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRateLimit = async (limit: RateLimit) => {
    try {
      setIsLoading(true);
      const updatedLimit = await updateRateLimit(limit);
      setRateLimits(prev => 
        prev.map(l => l.id === limit.id ? updatedLimit : l)
      );
      toast({
        title: "Success",
        description: "Rate limit updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rate limit",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">
          <Shield className="h-4 w-4 mr-2" />
          General
        </TabsTrigger>
        <TabsTrigger value="encryption">
          <Lock className="h-4 w-4 mr-2" />
          Encryption
        </TabsTrigger>
        <TabsTrigger value="audit">
          <History className="h-4 w-4 mr-2" />
          Audit Logs
        </TabsTrigger>
        <TabsTrigger value="ip">
          <Globe className="h-4 w-4 mr-2" />
          IP Whitelist
        </TabsTrigger>
        <TabsTrigger value="rate">
          <Gauge className="h-4 w-4 mr-2" />
          Rate Limiting
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="audit-logging">Audit Logging</Label>
              <Switch
                id="audit-logging"
                checked={settings?.auditLoggingEnabled}
                onCheckedChange={(checked) => 
                  handleSettingChange("auditLoggingEnabled", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ip-whitelisting">IP Whitelisting</Label>
              <Switch
                id="ip-whitelisting"
                checked={settings?.ipWhitelistingEnabled}
                onCheckedChange={(checked) => 
                  handleSettingChange("ipWhitelistingEnabled", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rate-limiting">Rate Limiting</Label>
              <Switch
                id="rate-limiting"
                checked={settings?.rateLimitingEnabled}
                onCheckedChange={(checked) => 
                  handleSettingChange("rateLimitingEnabled", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={settings?.sessionTimeout}
                onChange={(e) => 
                  handleSettingChange("sessionTimeout", parseInt(e.target.value))
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="encryption">
        <Card>
          <CardHeader>
            <CardTitle>Encryption Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="encryption-enabled">Enable Encryption</Label>
              <Switch
                id="encryption-enabled"
                checked={settings?.encryptionEnabled}
                onCheckedChange={(checked) => 
                  handleSettingChange("encryptionEnabled", checked)
                }
              />
            </div>
            {settings?.encryptionEnabled && (
              <div className="space-y-2">
                <Label htmlFor="encryption-key">Encryption Key</Label>
                <Input
                  id="encryption-key"
                  type="password"
                  value={settings?.encryptionKey}
                  onChange={(e) => 
                    handleSettingChange("encryptionKey", e.target.value)
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audit">
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLogs.map(log => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline">{log.resource}</Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>User: {log.userId}</p>
                    <p>IP: {log.ipAddress}</p>
                    <p>Details: {JSON.stringify(log.details)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ip">
        <Card>
          <CardHeader>
            <CardTitle>IP Whitelist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="ip-address">IP Address</Label>
                <Input
                  id="ip-address"
                  placeholder="192.168.1.0/24"
                  value={newIP.ipAddress}
                  onChange={(e) => setNewIP(prev => ({ ...prev, ipAddress: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="ip-description">Description</Label>
                <Input
                  id="ip-description"
                  placeholder="Office Network"
                  value={newIP.description}
                  onChange={(e) => setNewIP(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddIP} className="self-end">
                Add IP
              </Button>
            </div>
            <div className="space-y-4">
              {ipWhitelist.map(ip => (
                <div key={ip.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <p className="font-medium">{ip.ipAddress}</p>
                    <p className="text-sm text-muted-foreground">{ip.description}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveIP(ip.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rate">
        <Card>
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rateLimits.map(limit => (
              <div key={limit.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{limit.endpoint}</p>
                    <p className="text-sm text-muted-foreground">
                      {limit.currentCount} / {limit.limit} requests per {limit.window}s
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={limit.limit}
                      onChange={(e) => 
                        handleUpdateRateLimit({
                          ...limit,
                          limit: parseInt(e.target.value)
                        })
                      }
                      className="w-24"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => 
                        handleUpdateRateLimit({
                          ...limit,
                          currentCount: 0
                        })
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 