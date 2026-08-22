import React from 'react';
import { Search, Filter } from 'lucide-react';

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '400px' }}>
        <Search
          size={16}
          color="var(--fg-muted)"
          style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.85rem 0.6rem 2.4rem',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            background: '#ffffff',
          }}
        />
      </div>

      {/* Role Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Filter size={15} color="var(--fg-muted)" />
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          style={{
            padding: '0.6rem 0.85rem',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            background: '#ffffff',
            fontWeight: 600,
          }}
        >
          <option value="">All Roles</option>
          <option value="USER">Standard User</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </div>
    </div>
  );
};
