import React from 'react';
import { IndianRupee, Edit2, Trash2, Calendar, Filter } from 'lucide-react';
import type { ExpenseCategory } from './CategoryBreakdown';

export interface ExpenseRecord {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string | Date;
}

interface ExpenseTableProps {
  expenses: ExpenseRecord[];
  selectedCategory?: string;
  onFilterCategory: (cat?: ExpenseCategory) => void;
  onEditExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (expenseId: string) => void;
  onOpenAddExpense: () => void;
}

const categoryLabels: Record<ExpenseCategory, { label: string; color: string; bg: string }> = {
  TRANSPORT: { label: 'Transport', color: '#0284c7', bg: '#e0f2fe' },
  ACCOMMODATION: { label: 'Accommodation', color: '#7c3aed', bg: '#f3e8ff' },
  ACTIVITIES: { label: 'Activities', color: '#4f46e5', bg: '#e0e7ff' },
  MEALS: { label: 'Meals & Dining', color: '#d97706', bg: '#fef3c7' },
  MISCELLANEOUS: { label: 'Miscellaneous', color: '#475569', bg: '#f1f5f9' },
};

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  selectedCategory,
  onFilterCategory,
  onEditExpense,
  onDeleteExpense,
  onOpenAddExpense,
}) => {
  const formatDate = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        padding: '1.4rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            Expense Log ({expenses.length})
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
            Record and review individual travel expenses.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Category Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={15} color="var(--fg-secondary)" />
            <select
              value={selectedCategory || ''}
              onChange={(e) => onFilterCategory((e.target.value as ExpenseCategory) || undefined)}
              style={{
                padding: '0.45rem 0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                background: '#ffffff',
                fontWeight: 600,
              }}
            >
              <option value="">All Categories</option>
              <option value="TRANSPORT">Transport</option>
              <option value="ACCOMMODATION">Accommodation</option>
              <option value="ACTIVITIES">Activities</option>
              <option value="MEALS">Meals & Dining</option>
              <option value="MISCELLANEOUS">Miscellaneous</option>
            </select>
          </div>

          <button
            onClick={onOpenAddExpense}
            className="btn-primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            + Log New Expense
          </button>
        </div>
      </div>

      {/* Table */}
      {expenses.length === 0 ? (
        <div
          style={{
            padding: '2.5rem 1rem',
            textAlign: 'center',
            background: '#f8fafc',
            border: '2px dashed #e2e8f0',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '0.9rem' }}>
            {selectedCategory ? `No expenses logged under category "${selectedCategory}"` : 'No expenses logged yet. Click "Log New Expense" to add your first expense.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => {
                const catInfo = categoryLabels[exp.category] || categoryLabels.MISCELLANEOUS;
                return (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          background: catInfo.bg,
                          color: catInfo.color,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                        }}
                      >
                        {catInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>{exp.description}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--fg-muted)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} color="var(--fg-secondary)" />
                        {formatDate(exp.date)}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <IndianRupee size={14} />
                        {exp.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => onEditExpense(exp)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--fg-secondary)',
                            cursor: 'pointer',
                            padding: '0.3rem',
                          }}
                          title="Edit Expense"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.3rem',
                          }}
                          title="Delete Expense"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
