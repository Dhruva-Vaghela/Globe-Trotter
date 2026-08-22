import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'brand' | 'success' | 'danger';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  style,
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: '#eff6ff',
      color: '#2563eb',
      border: '1px solid #bfdbfe',
    },
    secondary: {
      background: '#f3f4f6',
      color: '#4b5563',
      border: '1px solid #e5e7eb',
    },
    outline: {
      background: '#ffffff',
      color: '#111827',
      border: '1px solid #d1d5db',
    },
    brand: {
      background: '#fff1f2',
      color: '#e11d48',
      border: '1px solid #fecdd3',
    },
    success: {
      background: '#ecfdf5',
      color: '#059669',
      border: '1px solid #a7f3d0',
    },
    danger: {
      background: '#fef2f2',
      color: '#e11d48',
      border: '1px solid #fecaca',
    },
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.55rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
};
