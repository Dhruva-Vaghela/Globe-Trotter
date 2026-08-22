import React from 'react';
import {
  Compass,
  Palmtree,
  Landmark,
  Mountain,
  Utensils,
  Zap,
  Flame,
} from 'lucide-react';

export interface CategoryOption {
  id: string;
  name: string;
  iconName?: string;
}

interface ActivityCategoryRailProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('beach') || lower.includes('island')) return <Palmtree size={16} />;
  if (lower.includes('culture') || lower.includes('heritage')) return <Landmark size={16} />;
  if (lower.includes('hill') || lower.includes('trek')) return <Mountain size={16} />;
  if (lower.includes('food') || lower.includes('dining')) return <Utensils size={16} />;
  if (lower.includes('adventure') || lower.includes('safari')) return <Zap size={16} />;
  if (lower.includes('spiritual') || lower.includes('trail')) return <Flame size={16} />;
  return <Compass size={16} />;
};

export const ActivityCategoryRail: React.FC<ActivityCategoryRailProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories = [
    { id: 'all', name: 'All Categories', iconName: 'Compass' },
    ...categories,
  ];

  return (
    <div
      className="no-scrollbar"
      style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        padding: '0.25rem 0',
        scrollbarWidth: 'none',
      }}
    >
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat.id || (selectedCategory === '' && cat.id === 'all');
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id === 'all' ? '' : cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full, 9999px)',
              border: isSelected
                ? '1px solid var(--brand-blue, #2563eb)'
                : '1px solid var(--border-subtle, #e5e7eb)',
              background: isSelected
                ? 'var(--brand-blue, #2563eb)'
                : '#ffffff',
              color: isSelected ? '#ffffff' : 'var(--fg-primary, #111827)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
            }}
          >
            {getCategoryIcon(cat.name)}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
