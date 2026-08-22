import React from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        gap: '1rem',
        background: '#ffffff',
        border: '1px dashed #cbd5e1',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div
        style={{
          padding: '1rem',
          borderRadius: '50%',
          background: '#eff6ff',
          color: 'var(--brand-blue)',
        }}
      >
        <Compass size={36} />
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--fg-primary)', fontWeight: 700 }}>{title}</h3>
      <p style={{ color: 'var(--fg-secondary)', maxWidth: '400px', fontSize: '0.925rem', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
