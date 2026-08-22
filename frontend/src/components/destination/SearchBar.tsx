import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../common/Button';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search cities, countries, or regions (e.g. Goa, Paris, Kyoto)...',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-sm)',
        padding: '0.4rem 0.6rem 0.4rem 1rem',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <Search size={20} color="#9ca3af" style={{ flexShrink: 0, marginRight: '0.75rem' }} />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          color: '#111827',
          background: 'transparent',
        }}
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          title="Clear search"
          style={{
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            cursor: 'pointer',
            marginRight: '0.5rem',
            flexShrink: 0,
          }}
        >
          <X size={14} />
        </button>
      )}

      <Button
        variant="primary"
        size="md"
        style={{ flexShrink: 0, borderRadius: 'var(--radius-sm)', padding: '0.5rem 1.25rem' }}
      >
        Search
      </Button>
    </div>
  );
};
