import React from 'react';
import { IndianRupee, Plane, Home, Compass, Utensils, Tag } from 'lucide-react';

export type ExpenseCategory = 'TRANSPORT' | 'ACCOMMODATION' | 'ACTIVITIES' | 'MEALS' | 'MISCELLANEOUS';

interface CategoryBreakdownProps {
  categoryTotals: Record<ExpenseCategory, number>;
  totalSpent: number;
}

const categoryMeta: Record<ExpenseCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  TRANSPORT: { label: 'Transport', icon: <Plane size={16} />, color: '#0284c7', bg: '#e0f2fe' },
  ACCOMMODATION: { label: 'Accommodation', icon: <Home size={16} />, color: '#7c3aed', bg: '#f3e8ff' },
  ACTIVITIES: { label: 'Activities', icon: <Compass size={16} />, color: '#4f46e5', bg: '#e0e7ff' },
  MEALS: { label: 'Meals & Dining', icon: <Utensils size={16} />, color: '#d97706', bg: '#fef3c7' },
  MISCELLANEOUS: { label: 'Miscellaneous', icon: <Tag size={16} />, color: '#475569', bg: '#f1f5f9' },
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categoryTotals, totalSpent }) => {
  const categories: ExpenseCategory[] = ['TRANSPORT', 'ACCOMMODATION', 'ACTIVITIES', 'MEALS', 'MISCELLANEOUS'];

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        padding: '1.4rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h3 style={{ margin: '0 0 1.1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
        Category Cost Breakdown
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {categories.map((cat) => {
          const meta = categoryMeta[cat];
          const amount = categoryTotals[cat] || 0;
          const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;

          return (
            <div
              key={cat}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div
                    style={{
                      background: meta.bg,
                      color: meta.color,
                      padding: '0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                    }}
                  >
                    {meta.icon}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{meta.label}</span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg-muted)' }}>{percentage}%</span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', margin: '0.3rem 0' }}>
                <IndianRupee size={15} />
                {amount.toLocaleString('en-IN')}
              </div>

              {/* Mini progress bar */}
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: meta.color,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
