import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className = '',
}) => {
  const sizeMap = {
    sm: { width: '32px', height: '32px', fontSize: '0.85rem' },
    md: { width: '42px', height: '42px', fontSize: '1rem' },
    lg: { width: '64px', height: '64px', fontSize: '1.5rem' },
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'var(--brand-gradient)',
        color: '#ffffff',
        fontWeight: 700,
        overflow: 'visible',
        boxShadow: 'var(--shadow-sm)',
        ...sizeMap[size],
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <span>{initials}</span>
      )}

      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid #ffffff',
            background:
              status === 'online' ? '#10b981' : status === 'busy' ? '#ef4444' : '#94a3b8',
          }}
        />
      )}
    </div>
  );
};
