import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'brand' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    transition: 'all var(--transition-fast)',
    border: 'none',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--brand-primary)',
      color: '#ffffff',
    },
    brand: {
      background: 'var(--brand-accent)',
      color: '#ffffff',
    },
    secondary: {
      background: '#f3f4f6',
      color: '#111827',
      border: '1px solid #e5e7eb',
    },
    outline: {
      background: '#ffffff',
      color: '#111827',
      border: '1px solid #d1d5db',
    },
    danger: {
      background: 'var(--status-danger)',
      color: '#ffffff',
    },
    success: {
      background: '#059669',
      color: '#ffffff',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.35rem 0.75rem', fontSize: '0.85rem' },
    md: { padding: '0.5rem 1.15rem', fontSize: '0.9rem' },
    lg: { padding: '0.7rem 1.5rem', fontSize: '1rem' },
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        opacity: disabled || isLoading ? 0.6 : 1,
        pointerEvents: disabled || isLoading ? 'none' : 'auto',
        ...style,
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span>Loading...</span> : children}
    </button>
  );
};
