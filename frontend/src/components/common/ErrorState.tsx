import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load requested data. Please try again.',
  onRetry,
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
        gap: '1rem',
        maxWidth: '480px',
        margin: '2rem auto',
      }}
    >
      <AlertCircle size={44} color="#ef4444" />
      <h3 style={{ fontSize: '1.25rem', color: 'var(--fg-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem' }}>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
