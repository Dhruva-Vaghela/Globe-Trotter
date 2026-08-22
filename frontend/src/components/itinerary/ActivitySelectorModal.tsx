import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { apiRequest } from '../../utils/apiClient';
import { Search, IndianRupee, Plus } from 'lucide-react';

interface ActivityCatalogItem {
  id: string;
  name: string;
  description?: string;
  locationName?: string;
  estimatedCost: number;
  durationMinutes: number;
  category?: { name: string };
}

interface ActivitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectActivity: (item: {
    activityId?: string;
    title: string;
    notes?: string;
    startTime?: string;
    cost: number;
  }) => Promise<void>;
  sectionTitle?: string;
}

export const ActivitySelectorModal: React.FC<ActivitySelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectActivity,
  sectionTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');
  const [catalog, setCatalog] = useState<ActivityCatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [customStartTime, setCustomStartTime] = useState('09:30 AM');
  const [customCost, setCustomCost] = useState(0);

  const [startTime, setStartTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCatalog();
      // Reset forms
      setCustomTitle('');
      setCustomNotes('');
      setCustomStartTime('09:30 AM');
      setCustomCost(0);
      setNotes('');
      setError('');
    }
  }, [isOpen]);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/activities');
      if (res.success && Array.isArray(res.data)) {
        setCatalog(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch activity catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCatalog = catalog.filter((act) =>
    act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (act.locationName && act.locationName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddCatalogItem = async (act: ActivityCatalogItem) => {
    try {
      setIsSubmitting(true);
      setError('');
      await onSelectActivity({
        activityId: act.id,
        title: act.name,
        notes: notes || act.description || '',
        startTime: startTime,
        cost: act.estimatedCost || 0,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCustomItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      setError('Title is required for custom activity item');
      return;
    }
    try {
      setIsSubmitting(true);
      setError('');
      await onSelectActivity({
        title: customTitle,
        notes: customNotes,
        startTime: customStartTime,
        cost: Number(customCost) || 0,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add custom item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Activity to Section"
      description={sectionTitle ? `Target: ${sectionTitle}` : 'Pick from activity catalog or create custom entry.'}
      maxWidth="620px"
    >
      {/* Tabs Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '1.25rem',
        }}
      >
        <button
          onClick={() => setActiveTab('catalog')}
          style={{
            padding: '0.6rem 1.25rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'catalog' ? '2px solid var(--primary-color)' : 'none',
            color: activeTab === 'catalog' ? 'var(--primary-color)' : 'var(--fg-secondary)',
            fontWeight: activeTab === 'catalog' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Activity Catalog
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          style={{
            padding: '0.6rem 1.25rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'custom' ? '2px solid var(--primary-color)' : 'none',
            color: activeTab === 'custom' ? 'var(--primary-color)' : 'var(--fg-secondary)',
            fontWeight: activeTab === 'custom' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Custom Activity Item
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '0.65rem 0.9rem',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--radius-sm)',
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {activeTab === 'catalog' ? (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search activities by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--fg-muted)' }}>Default Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00 AM"
                style={{
                  width: '100%',
                  padding: '0.4rem 0.6rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--fg-muted)' }}>Optional Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Confirm booking"
                style={{
                  width: '100%',
                  padding: '0.4rem 0.6rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--fg-muted)', padding: '1rem' }}>Loading catalog...</p>
            ) : filteredCatalog.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--fg-muted)', padding: '1rem' }}>No activities found matching "{searchQuery}"</p>
            ) : (
              filteredCatalog.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    background: '#ffffff',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>{act.name}</h4>
                    <span style={{ fontSize: '0.775rem', color: 'var(--fg-muted)' }}>
                      {act.locationName} • {act.category?.name || 'General'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#059669',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <IndianRupee size={13} />
                      {act.estimatedCost.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => handleAddCatalogItem(act)}
                      disabled={isSubmitting}
                      style={{
                        padding: '0.35rem 0.7rem',
                        background: 'var(--primary-color)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                      }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddCustomItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              Item Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Sunset Dinner at Cliffside Restaurant"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                Start Time
              </label>
              <input
                type="text"
                placeholder="e.g. 07:30 PM"
                value={customStartTime}
                onChange={(e) => setCustomStartTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                Estimated Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="e.g. 2500"
                value={customCost}
                onChange={(e) => setCustomCost(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              Notes / Instructions
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Table reservation under Smith"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.55rem 1.25rem',
                background: 'var(--primary-color)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Custom Item'}
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
};
