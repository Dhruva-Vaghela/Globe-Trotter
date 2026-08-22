import React from 'react';
import { Accordion } from '../ui/Accordion';
import { ItemRow } from './ItemRow';
import type { SectionData } from './SectionCard';

interface DayWiseLayoutProps {
  sections: SectionData[];
  searchQuery?: string;
}

export const DayWiseLayout: React.FC<DayWiseLayoutProps> = ({ sections, searchQuery = '' }) => {
  const formatDateStr = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const accordionItems = sections.map((sec) => {
    const filteredItems = sec.items.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.activity?.category?.name && item.activity.category.name.toLowerCase().includes(q))
      );
    });

    const totalCost = sec.items.reduce((acc, item) => acc + (item.cost || 0), 0);

    return {
      id: sec.id,
      title: sec.title,
      subtitle: `${formatDateStr(sec.startDate)} — ${formatDateStr(sec.endDate)} • ${sec.items.length} Activities • Total Spent: ₹${totalCost.toLocaleString('en-IN')}`,
      content: (
        <div>
          {filteredItems.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '0.9rem' }}>
              {searchQuery ? `No activities in this section match "${searchQuery}"` : 'No activities added to this day section.'}
            </p>
          ) : (
            filteredItems.map((item, idx) => (
              <ItemRow
                key={item.id}
                item={item}
                index={idx}
                totalItems={filteredItems.length}
                onDelete={() => {}}
                isReadOnly={true}
              />
            ))
          )}
        </div>
      ),
    };
  });

  if (sections.length === 0) {
    return (
      <div
        style={{
          padding: '3rem 1.5rem',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
        }}
      >
        <p style={{ color: 'var(--fg-muted)', margin: 0, fontSize: '0.95rem' }}>
          No day sections created yet. Switch to Builder to compose your itinerary sections.
        </p>
      </div>
    );
  }

  return <Accordion items={accordionItems} defaultOpenId={sections[0]?.id} />;
};
