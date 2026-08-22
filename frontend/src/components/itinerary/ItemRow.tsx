import React from 'react';
import { Clock, IndianRupee, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export interface ItineraryItemData {
  id: string;
  sectionId: string;
  activityId?: string | null;
  title: string;
  notes?: string | null;
  date?: string | Date;
  startTime?: string | null;
  cost: number;
  orderIndex: number;
  activity?: {
    locationName?: string;
    category?: { name: string };
  } | null;
}

interface ItemRowProps {
  item: ItineraryItemData;
  index: number;
  totalItems: number;
  onDelete: (itemId: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  isReadOnly?: boolean;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  index,
  totalItems,
  onDelete,
  onMoveUp,
  onMoveDown,
  isReadOnly = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 1.1rem',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-md)',
        marginBottom: '0.6rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        {!isReadOnly && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button
              onClick={() => onMoveUp && onMoveUp(index)}
              disabled={index === 0}
              style={{
                border: 'none',
                background: 'transparent',
                color: index === 0 ? '#cbd5e1' : 'var(--fg-secondary)',
                cursor: index === 0 ? 'not-allowed' : 'pointer',
                padding: '1px',
              }}
              title="Move Up"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => onMoveDown && onMoveDown(index)}
              disabled={index === totalItems - 1}
              style={{
                border: 'none',
                background: 'transparent',
                color: index === totalItems - 1 ? '#cbd5e1' : 'var(--fg-secondary)',
                cursor: index === totalItems - 1 ? 'not-allowed' : 'pointer',
                padding: '1px',
              }}
              title="Move Down"
            >
              <ArrowDown size={14} />
            </button>
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.975rem', color: '#0f172a' }}>{item.title}</span>
            {item.startTime && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  color: 'var(--primary-color)',
                  background: 'rgba(99, 102, 241, 0.08)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '12px',
                }}
              >
                <Clock size={12} />
                {item.startTime}
              </span>
            )}
            {item.activity?.category?.name && (
              <span
                style={{
                  fontSize: '0.75rem',
                  background: '#f1f5f9',
                  color: 'var(--fg-secondary)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px',
                  fontWeight: 500,
                }}
              >
                {item.activity.category.name}
              </span>
            )}
          </div>

          {item.notes && (
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
              {item.notes}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: item.cost > 0 ? '#059669' : '#64748b',
            background: item.cost > 0 ? '#ecfdf5' : '#f8fafc',
            padding: '0.35rem 0.7rem',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${item.cost > 0 ? '#a7f3d0' : '#e2e8f0'}`,
          }}
        >
          <IndianRupee size={14} style={{ marginRight: '2px' }} />
          {item.cost.toLocaleString('en-IN')}
        </div>

        {!isReadOnly && (
          <button
            onClick={() => onDelete(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            title="Delete Item"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
