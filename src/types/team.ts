export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
}

export interface RolePermissions {
  admin: {
    canManageTeam: true;
    canManageBilling: true;
    canViewAnalytics: true;
    canManageSettings: true;
  };
  manager: {
    canManageTeam: true;
    canManageBilling: false;
    canViewAnalytics: true;
    canManageSettings: false;
  };
  agent: {
    canManageTeam: false;
    canManageBilling: false;
    canViewAnalytics: false;
    canManageSettings: false;
  };
} 