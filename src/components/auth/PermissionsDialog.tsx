import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'calls' | 'campaigns' | 'analytics' | 'settings';
  checked: boolean;
}

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userRole: string;
}

const defaultPermissions: Permission[] = [
  {
    id: 'view_calls',
    name: 'View Calls',
    description: 'Can view call recordings and transcripts',
    category: 'calls',
    checked: true,
  },
  {
    id: 'manage_calls',
    name: 'Manage Calls',
    description: 'Can delete and archive calls',
    category: 'calls',
    checked: false,
  },
  {
    id: 'create_campaign',
    name: 'Create Campaigns',
    description: 'Can create and edit campaigns',
    category: 'campaigns',
    checked: true,
  },
  {
    id: 'view_analytics',
    name: 'View Analytics',
    description: 'Can view analytics dashboards and reports',
    category: 'analytics',
    checked: true,
  },
  {
    id: 'export_analytics',
    name: 'Export Analytics',
    description: 'Can export analytics data and reports',
    category: 'analytics',
    checked: false,
  },
  {
    id: 'manage_settings',
    name: 'Manage Settings',
    description: 'Can modify system settings',
    category: 'settings',
    checked: false,
  },
];

export function PermissionsDialog({ open, onOpenChange, userName, userRole }: PermissionsDialogProps) {
  const [permissions, setPermissions] = React.useState<Permission[]>(defaultPermissions);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions(permissions.map(permission =>
      permission.id === permissionId ? { ...permission, checked } : permission
    ));
  };

  const renderPermissionGroup = (category: Permission['category']) => {
    const categoryPermissions = permissions.filter(p => p.category === category);
    
    return (
      <div className="space-y-4">
        {categoryPermissions.map((permission) => (
          <div key={permission.id} className="flex items-start space-x-3 py-2">
            <Checkbox
              id={permission.id}
              checked={permission.checked}
              onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
            />
            <div className="space-y-1">
              <label
                htmlFor={permission.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {permission.name}
              </label>
              <p className="text-sm text-muted-foreground">
                {permission.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Permissions - {userName}</DialogTitle>
          <DialogDescription>
            Current role: {userRole}. Customize individual permissions below.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="calls" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="calls" className="flex-1">Calls</TabsTrigger>
            <TabsTrigger value="campaigns" className="flex-1">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[400px] mt-4 pr-4">
            <TabsContent value="calls">
              {renderPermissionGroup('calls')}
            </TabsContent>
            <TabsContent value="campaigns">
              {renderPermissionGroup('campaigns')}
            </TabsContent>
            <TabsContent value="analytics">
              {renderPermissionGroup('analytics')}
            </TabsContent>
            <TabsContent value="settings">
              {renderPermissionGroup('settings')}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 