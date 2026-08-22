import React from 'react';
import { Calendar, IndianRupee, Plus, Edit2, Trash2 } from 'lucide-react';
import { ItemRow } from './ItemRow';
import type { ItineraryItemData } from './ItemRow';

export interface SectionData {
  id: string;
  tripId: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  sectionBudget: number;
  orderIndex: number;
  items: ItineraryItemData[];
}

interface SectionCardProps {
  section: SectionData;
  onEditSection: (section: SectionData) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddItem: (sectionId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItems: (sectionId: string, itemIds: string[]) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  onEditSection,
  onDeleteSection,
  onAddItem,
  onDeleteItem,
  onReorderItems,
}) => {
  const formatDateStr = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalItemCost = section.items.reduce((sum, item) => sum + (item.cost || 0), 0);

  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    const newItems = [...section.items];
    const temp = newItems[idx];
    newItems[idx] = newItems[idx - 1];
    newItems[idx - 1] = temp;
    onReorderItems(
      section.id,
      newItems.map((i) => i.id)
    );
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= section.items.length - 1) return;
    const newItems = [...section.items];
    const temp = newItems[idx];
    newItems[idx] = newItems[idx + 1];
    newItems[idx + 1] = temp;
    onReorderItems(
      section.id,
      newItems.map((i) => i.id)
    );
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.4rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderBottom: '1px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            {section.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--fg-muted)', fontSize: '0.85rem' }}>
            <Calendar size={14} color="var(--primary-color)" />
            <span>
              {formatDateStr(section.startDate)} — {formatDateStr(section.endDate)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Budget Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#ffffff',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <span style={{ color: 'var(--fg-muted)' }}>Section Budget:</span>
            <span style={{ color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center' }}>
              <IndianRupee size={13} />
              {section.sectionBudget.toLocaleString('en-IN')}
            </span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ color: 'var(--fg-muted)' }}>Spent:</span>
            <span style={{ color: totalItemCost > section.sectionBudget && section.sectionBudget > 0 ? '#ef4444' : '#059669', display: 'inline-flex', alignItems: 'center' }}>
              <IndianRupee size={13} />
              {totalItemCost.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Edit & Delete Section Buttons */}
          <button
            onClick={() => onEditSection(section)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.65rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--fg-secondary)',
            }}
            title="Edit Section Details"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => onDeleteSection(section.id)}
            style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.65rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#dc2626',
            }}
            title="Delete Section"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Items Section */}
      <div style={{ padding: '1.25rem' }}>
        {section.items.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              background: '#f8fafc',
              border: '2px dashed #e2e8f0',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
            }}
          >
            <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '0.9rem' }}>
              No activities or events planned for this section yet.
            </p>
          </div>
        ) : (
          section.items.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              index={idx}
              totalItems={section.items.length}
              onDelete={onDeleteItem}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          ))
        )}

        <button
          onClick={() => onAddItem(section.id)}
          className="btn-primary"
          style={{
            width: '100%',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.65rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <Plus size={16} /> Add Activity Item to Section
        </button>
      </div>
    </div>
  );
};
