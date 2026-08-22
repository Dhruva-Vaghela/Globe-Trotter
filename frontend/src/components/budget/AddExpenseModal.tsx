import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import type { ExpenseRecord } from './ExpenseTable';
import type { ExpenseCategory } from './CategoryBreakdown';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { category: ExpenseCategory; amount: number; description: string; date: string }) => Promise<void>;
  editingExpense?: ExpenseRecord | null;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('TRANSPORT');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setCategory(editingExpense.category);
      setAmount(editingExpense.amount);
      setDescription(editingExpense.description);
      setDate(new Date(editingExpense.date).toISOString().split('T')[0]);
    } else {
      setCategory('TRANSPORT');
      setAmount(0);
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setError('');
  }, [editingExpense, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (amount < 0) {
      setError('Amount cannot be negative');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        category,
        amount: Number(amount),
        description,
        date: date || new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingExpense ? 'Edit Expense Record' : 'Log New Expense'}
      description="Record an expense item with category classification and cost amount."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div
            style={{
              padding: '0.65rem 0.9rem',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: 'var(--radius-sm)',
              color: '#dc2626',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
            Expense Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
              background: '#ffffff',
            }}
          >
            <option value="TRANSPORT">Transport (Flights, Train, Cabs)</option>
            <option value="ACCOMMODATION">Accommodation (Hotels, Resorts)</option>
            <option value="ACTIVITIES">Activities & Excursions</option>
            <option value="MEALS">Meals & Dining</option>
            <option value="MISCELLANEOUS">Miscellaneous / Shopping</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
            Description *
          </label>
          <input
            type="text"
            placeholder="e.g. Flight ticket booking via Indigo"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
            }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              Amount (₹) *
            </label>
            <input
              type="number"
              min="0"
              step="100"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.925rem',
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              Expense Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.925rem',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.6rem 1.1rem',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'var(--primary-color)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: isSubmitting ? 'wait' : 'pointer',
            }}
          >
            {isSubmitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Save Expense'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
