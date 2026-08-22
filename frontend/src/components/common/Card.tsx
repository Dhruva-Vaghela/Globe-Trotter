import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  style,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`glass-panel ${hoverable ? 'glass-panel-hover' : ''} ${className}`}
      style={{
        padding: '1.5rem',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
