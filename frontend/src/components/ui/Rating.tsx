import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  reviewsCount?: number;
  size?: number;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  reviewsCount,
  size = 14,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
        {Array.from({ length: max }).map((_, i) => {
          const isFilled = i < Math.floor(value);
          const isHalf = i === Math.floor(value) && value % 1 >= 0.5;
          return (
            <Star
              key={i}
              size={size}
              fill={isFilled || isHalf ? '#f59e0b' : 'none'}
              color={isFilled || isHalf ? '#f59e0b' : '#cbd5e1'}
            />
          );
        })}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
        {value.toFixed(1)}
      </span>
      {reviewsCount !== undefined && (
        <span style={{ fontSize: '0.775rem', color: 'var(--fg-muted)' }}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
