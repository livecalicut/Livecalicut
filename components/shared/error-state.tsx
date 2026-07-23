import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to Load Module',
  message,
  description,
  onRetry,
}) => {
  const displayMessage = description || message || 'An unexpected error occurred while communicating with the service.';
  return (
    <Card className="p-8 text-center border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500 mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed">{displayMessage}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-2">
          Retry Request
        </Button>
      )}
    </Card>
  );
};
