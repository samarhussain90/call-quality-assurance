import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback = null 
}: RoleGuardProps) {
  const { hasPermission, hasSpecificPermission } = useAuth();

  if (requiredRole && !hasPermission(requiredRole)) {
    return fallback;
  }

  if (requiredPermission && !hasSpecificPermission(requiredPermission)) {
    return fallback;
  }

  return <>{children}</>;
}

// Example usage:
// <RoleGuard requiredRole="admin">
//   <AdminOnlyComponent />
// </RoleGuard>
//
// <RoleGuard requiredPermission="manage_calls">
//   <CallManagementComponent />
// </RoleGuard>
//
// <RoleGuard 
//   requiredRole="manager" 
//   requiredPermission="export_analytics"
//   fallback={<AccessDeniedMessage />}
// >
//   <AnalyticsExportComponent />
// </RoleGuard> 