import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBudget: (totalBudget: number) => Promise<void>;
  currentBudget: number;
}

export const SetBudgetModal: React.FC<SetBudgetModalProps> = ({
  isOpen,
  onClose,
  onSaveBudget,
  currentBudget,
}) => {
  const [totalBudget, setTotalBudget] = useState(currentBudget);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTotalBudget(currentBudget);
    setError('');
  }, [currentBudget, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalBudget < 0) {
      setError('Planned budget cannot be negative');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSaveBudget(Number(totalBudget));
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Set Trip Planned Budget"
      description="Define total financial budget allocation for this trip."
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
            Total Planned Trip Budget (₹) *
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder="e.g. 100000"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
            required
          />
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
            {isSubmitting ? 'Updating...' : 'Save Budget'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
