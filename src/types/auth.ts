export type UserRole = 'admin' | 'manager' | 'agent' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'calls' | 'campaigns' | 'analytics' | 'settings';
  checked: boolean;
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  manager: 2,
  agent: 1,
  viewer: 0,
};

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'view_calls',
    'manage_calls',
    'create_campaign',
    'view_analytics',
    'export_analytics',
    'manage_settings',
  ],
  manager: [
    'view_calls',
    'manage_calls',
    'create_campaign',
    'view_analytics',
    'export_analytics',
  ],
  agent: [
    'view_calls',
    'create_campaign',
    'view_analytics',
  ],
  viewer: [
    'view_calls',
    'view_analytics',
  ],
}; 