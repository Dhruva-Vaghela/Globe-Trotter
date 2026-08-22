import React from 'react';

interface DestinationFilterBarProps {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  maxCost: number;
  onChangeMaxCost: (cost: number) => void;
  sortBy: string;
  onChangeSortBy: (sort: string) => void;
  popularCountries?: string[];
  regions?: string[];
}

const DEFAULT_COUNTRIES = [
  'All',
  'India',
  'France',
  'Japan',
  'Italy',
  'Indonesia',
  'United Kingdom',
  'United States',
  'UAE',
  'Singapore',
  'Thailand',
  'Spain',
];

const DEFAULT_REGIONS = [
  'All',
  'South Asia',
  'Europe',
  'East Asia',
  'Southeast Asia',
  'Middle East',
  'North America',
  'Oceania',
  'Africa',
];

export const DestinationFilterBar: React.FC<DestinationFilterBarProps> = ({
  selectedCountry,
  onSelectCountry,
  selectedRegion,
  onSelectRegion,
  maxCost,
  onChangeMaxCost,
  sortBy,
  onChangeSortBy,
  popularCountries = DEFAULT_COUNTRIES,
  regions = DEFAULT_REGIONS,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid #e5e7eb',
        padding: '1rem 1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Country Pills Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}
        >
          Country:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap', overflowX: 'auto' }}>
          {popularCountries.map((country) => {
            const isSelected = selectedCountry === country;
            return (
              <button
                key={country}
                type="button"
                onClick={() => onSelectCountry(country)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid #2563eb' : '1px solid #e5e7eb',
                  background: isSelected ? '#2563eb' : '#f9fafb',
                  color: isSelected ? '#ffffff' : '#374151',
                  fontSize: '0.825rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {country}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Dropdowns & Cost Slider Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center',
          borderTop: '1px solid #f3f4f6',
          paddingTop: '0.85rem',
        }}
      >
        {/* Region Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => onSelectRegion(e.target.value)}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              fontSize: '0.875rem',
              color: '#111827',
              outline: 'none',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg === 'All' ? 'All Regions' : reg}
              </option>
            ))}
          </select>
        </div>

        {/* Max Daily Cost Range Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>
              Max Daily Cost
            </label>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb' }}>
              ${maxCost} / day
            </span>
          </div>
          <input
            type="range"
            min={30}
            max={300}
            step={10}
            value={maxCost}
            onChange={(e) => onChangeMaxCost(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#2563eb',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Sort By Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onChangeSortBy(e.target.value)}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              fontSize: '0.875rem',
              color: '#111827',
              outline: 'none',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <option value="popularity">Popularity / Top Rated ⭐</option>
            <option value="cost_asc">Daily Cost: Low to High 💵</option>
            <option value="cost_desc">Daily Cost: High to Low 💰</option>
            <option value="name">City Name (A - Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
