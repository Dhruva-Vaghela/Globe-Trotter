import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import type { SectionData } from './SectionCard';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; startDate: string; endDate: string; sectionBudget: number }) => Promise<void>;
  editingSection?: SectionData | null;
  tripStartDate?: string;
  tripEndDate?: string;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSection,
  tripStartDate,
  tripEndDate,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sectionBudget, setSectionBudget] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSection) {
      setTitle(editingSection.title);
      setStartDate(new Date(editingSection.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(editingSection.endDate).toISOString().split('T')[0]);
      setSectionBudget(editingSection.sectionBudget || 0);
    } else {
      setTitle('');
      setStartDate(tripStartDate ? new Date(tripStartDate).toISOString().split('T')[0] : '');
      setEndDate(tripEndDate ? new Date(tripEndDate).toISOString().split('T')[0] : '');
      setSectionBudget(0);
    }
    setError('');
  }, [editingSection, isOpen, tripStartDate, tripEndDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Section title is required');
      return;
    }
    if (!startDate || !endDate) {
      setError('Start date and End date are required');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after End date');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        title,
        startDate,
        endDate,
        sectionBudget: Number(sectionBudget) || 0,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save section');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingSection ? 'Edit Day Section' : 'Create New Day Section'}
      description="Define the day section title, target dates, and allocated budget."
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
            Section Title
          </label>
          <input
            type="text"
            placeholder="e.g. Day 1: City Highlights & Historic Walk"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
            Allocated Budget (₹)
          </label>
          <input
            type="number"
            min="0"
            step="500"
            placeholder="e.g. 15000"
            value={sectionBudget}
            onChange={(e) => setSectionBudget(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
            }}
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
              color: 'var(--fg-secondary)',
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
            {isSubmitting ? 'Saving...' : editingSection ? 'Update Section' : 'Create Section'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
