import React from 'react';

interface AdminStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  bg?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'var(--primary-color)',
  bg = 'rgba(99, 102, 241, 0.1)',
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        padding: '1.25rem 1.4rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
          {value}
        </div>
        {subtitle && <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{subtitle}</span>}
      </div>

      <div
        style={{
          background: bg,
          color,
          padding: '0.8rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
    </div>
  );
};
