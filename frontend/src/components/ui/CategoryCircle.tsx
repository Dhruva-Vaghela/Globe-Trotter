import React from 'react';

interface CategoryCircleProps {
  id: string;
  label: string;
  imageUrl: string;
  isActive?: boolean;
  onClick?: () => void;
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80';

export const CategoryCircle: React.FC<CategoryCircleProps> = ({
  label,
  imageUrl,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.45rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        minWidth: '76px',
        padding: '0.2rem',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          padding: '2px',
          border: isActive ? '2px solid #2563eb' : '2px solid #e5e7eb',
          background: '#ffffff',
          boxShadow: isActive
            ? '0 4px 12px rgba(37, 99, 235, 0.2)'
            : '0 2px 6px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          transition: 'all 0.15s ease',
        }}
      >
        <img
          src={imageUrl}
          alt={label}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMG;
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </div>
      <span
        style={{
          fontSize: '0.775rem',
          fontWeight: isActive ? 700 : 600,
          color: isActive ? '#2563eb' : '#374151',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: '80px',
        }}
      >
        {label}
      </span>
    </button>
  );
};
