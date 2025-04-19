import React from 'react';
import { Spinner } from './spinner';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton';
  message?: string;
  className?: string;
  skeletonCount?: number;
  skeletonClassName?: string;
}

export function LoadingState({
  type = 'spinner',
  message = 'Loading...',
  className,
  skeletonCount = 3,
  skeletonClassName
}: LoadingStateProps) {
  if (type === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn('h-12 w-full', skeletonClassName)} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <Spinner size="lg" className="mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
} 