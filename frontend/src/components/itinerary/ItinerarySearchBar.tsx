import React from 'react';
import { Search, X } from 'lucide-react';

interface ItinerarySearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const ItinerarySearchBar: React.FC<ItinerarySearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search activities, meals, notes, or locations...',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
      }}
    >
      <Search
        size={16}
        color="var(--fg-secondary)"
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.55rem 2.2rem 0.55rem 2.3rem',
          border: '1px solid #cbd5e1',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          background: '#ffffff',
          boxShadow: 'var(--shadow-sm)',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: 'var(--fg-secondary)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
