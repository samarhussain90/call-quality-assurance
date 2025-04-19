import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export function AccessDenied({
  title = 'Access Denied',
  message = 'You do not have permission to view this content.',
  showBackButton = true,
}: AccessDeniedProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="relative mb-6">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <AlertCircle className="h-8 w-8 text-destructive absolute -top-2 -right-2" />
      </div>
      
      <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      
      <div className="space-x-4">
        {showBackButton && (
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        )}
        <Button
          onClick={() => navigate('/')}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

// Example usage:
// <AccessDenied 
//   title="Premium Feature"
//   message="This feature is only available to premium users."
//   showBackButton={false}
// /> 