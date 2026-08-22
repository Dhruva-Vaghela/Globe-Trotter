import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg-secondary)' }}>
          {label}
        </label>
      )}
      <input
        className="glass-input"
        style={{
          padding: '0.65rem 0.85rem',
          fontSize: '0.95rem',
          width: '100%',
          borderColor: '#cbd5e1',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.8rem', color: 'var(--status-danger)' }}>{error}</span>}
    </div>
  );
};
