import React from 'react';
import type { ExpenseCategory } from './CategoryBreakdown';
import { IndianRupee } from 'lucide-react';

interface BudgetChartProps {
  categoryTotals: Record<ExpenseCategory, number>;
  totalSpent: number;
}

const colors: Record<ExpenseCategory, string> = {
  TRANSPORT: '#0284c7',
  ACCOMMODATION: '#7c3aed',
  ACTIVITIES: '#4f46e5',
  MEALS: '#d97706',
  MISCELLANEOUS: '#475569',
};

const labels: Record<ExpenseCategory, string> = {
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Accommodation',
  ACTIVITIES: 'Activities',
  MEALS: 'Meals & Dining',
  MISCELLANEOUS: 'Miscellaneous',
};

export const BudgetChart: React.FC<BudgetChartProps> = ({ categoryTotals, totalSpent }) => {
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
      <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
        Spending Share & Distribution
      </h3>
      <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
        Proportional expenditure by travel category.
      </p>

      {/* Multi-segment Horizontal Bar */}
      <div
        style={{
          height: '24px',
          width: '100%',
          display: 'flex',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#f1f5f9',
          marginBottom: '1.25rem',
        }}
      >
        {categories.map((cat) => {
          const amt = categoryTotals[cat] || 0;
          const pct = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={cat}
              style={{
                width: `${pct}%`,
                background: colors[cat],
                height: '100%',
                transition: 'width 0.4s ease',
              }}
              title={`${labels[cat]}: ₹${amt.toLocaleString('en-IN')} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
        {categories.map((cat) => {
          const amt = categoryTotals[cat] || 0;
          const pct = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0;
          return (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors[cat] }} />
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f172a' }}>{labels[cat]}:</span>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--fg-secondary)', display: 'inline-flex', alignItems: 'center' }}>
                <IndianRupee size={12} />
                {amt.toLocaleString('en-IN')} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
