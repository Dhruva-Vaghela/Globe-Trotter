import React from 'react';
import { Search, X, MapPin } from 'lucide-react';

interface ActivitySearchBarProps {
  value: string;
  onChange: (val: string) => void;
  locationFilter: string;
  onLocationChange: (val: string) => void;
  placeholder?: string;
}

export const ActivitySearchBar: React.FC<ActivitySearchBarProps> = ({
  value,
  onChange,
  locationFilter,
  onLocationChange,
  placeholder = 'Search by experience name, city, or keyword...',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        background: '#ffffff',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm, 6px)',
        border: '1px solid var(--border-subtle, #e5e7eb)',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
      }}
    >
      {/* Name / Keyword Search */}
      <div
        style={{
          flex: '1 1 260px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-tertiary, #f3f4f6)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm, 6px)',
          border: '1px solid var(--border-subtle, #e5e7eb)',
        }}
      >
        <Search size={18} color="var(--fg-muted, #9ca3af)" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            fontSize: '0.9rem',
            color: 'var(--fg-primary, #111827)',
            fontWeight: 500,
          }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.1rem',
            }}
            title="Clear search"
          >
            <X size={16} color="var(--fg-muted, #9ca3af)" />
          </button>
        )}
      </div>

      {/* Location Filter Input */}
      <div
        style={{
          flex: '0 0 200px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-tertiary, #f3f4f6)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm, 6px)',
          border: '1px solid var(--border-subtle, #e5e7eb)',
        }}
      >
        <MapPin size={18} color="var(--brand-accent, #e11d48)" />
        <input
          type="text"
          value={locationFilter}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Filter by city..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            fontSize: '0.9rem',
            color: 'var(--fg-primary, #111827)',
            fontWeight: 500,
          }}
        />
        {locationFilter && (
          <button
            onClick={() => onLocationChange('')}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.1rem',
            }}
            title="Clear location filter"
          >
            <X size={16} color="var(--fg-muted, #9ca3af)" />
          </button>
        )}
      </div>
    </div>
  );
};
