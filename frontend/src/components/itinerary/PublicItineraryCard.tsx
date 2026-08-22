import React from 'react';
import { Calendar, Compass, IndianRupee, MapPin, Copy, User as UserIcon } from 'lucide-react';
import { Accordion } from '../ui/Accordion';
import { ItemRow } from './ItemRow';

interface OwnerInfo {
  id: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

interface PublicTripInfo {
  id: string;
  name: string;
  description?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  coverImageUrl?: string | null;
  totalBudget: number;
  totalSpent: number;
  totalActivitiesCount: number;
  stops: {
    id: string;
    city: string;
    country: string;
    destinationName: string;
  }[];
}

interface PublicItineraryCardProps {
  owner: OwnerInfo;
  trip: PublicTripInfo;
  sections: any[];
  onCopyTrip: () => void;
  isCopying?: boolean;
}

export const PublicItineraryCard: React.FC<PublicItineraryCardProps> = ({
  owner,
  trip,
  sections,
  onCopyTrip,
  isCopying = false,
}) => {
  const formatDateStr = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const startMs = new Date(trip.startDate).getTime();
  const endMs = new Date(trip.endDate).getTime();
  const durationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

  const accordionItems = sections.map((sec) => {
    const totalCost = sec.items.reduce((acc: number, item: any) => acc + (item.cost || 0), 0);
    return {
      id: sec.id,
      title: sec.title,
      subtitle: `${formatDateStr(sec.startDate)} — ${formatDateStr(sec.endDate)} • ${sec.items.length} Activities • Total Cost: ₹${totalCost.toLocaleString('en-IN')}`,
      content: (
        <div>
          {sec.items.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '0.9rem' }}>No activity items added for this section.</p>
          ) : (
            sec.items.map((item: any, idx: number) => (
              <ItemRow
                key={item.id}
                item={item}
                index={idx}
                totalItems={sec.items.length}
                onDelete={() => {}}
                isReadOnly={true}
              />
            ))
          )}
        </div>
      ),
    };
  });

  return (
    <div>
      {/* Public Header Hero Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            {/* Owner Info Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.35rem 0.8rem', borderRadius: '20px', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <UserIcon size={14} color="#a5b4fc" />
              <span>Created by {owner.name}</span>
            </div>

            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800 }}>{trip.name}</h1>
            {trip.description && <p style={{ margin: '0 0 1rem 0', color: '#94a3b8', fontSize: '0.95rem' }}>{trip.description}</p>}

            {/* Destination Sequence */}
            {trip.stops.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <MapPin size={15} color="#818cf8" />
                {trip.stops.map((stop, idx) => (
                  <React.Fragment key={stop.id}>
                    <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.825rem', fontWeight: 600 }}>
                      {stop.city}, {stop.country}
                    </span>
                    {idx < trip.stops.length - 1 && <span style={{ color: '#818cf8' }}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onCopyTrip}
            disabled={isCopying}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--primary-color)',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.4rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: isCopying ? 'wait' : 'pointer',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Copy size={18} /> {isCopying ? 'Copying...' : 'Copy Trip to My Account'}
          </button>
        </div>

        {/* Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
              <Calendar size={20} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.775rem', color: '#94a3b8', fontWeight: 600 }}>Trip Duration</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{durationDays} Days</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
              <Compass size={20} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.775rem', color: '#94a3b8', fontWeight: 600 }}>Planned Activities</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{trip.totalActivitiesCount} Events</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
              <IndianRupee size={20} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '0.775rem', color: '#94a3b8', fontWeight: 600 }}>Estimated Total Cost</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                ₹{trip.totalSpent.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Accordion */}
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
        Day-Wise Itinerary ({sections.length} Sections)
      </h3>

      {sections.length === 0 ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
          <p style={{ color: 'var(--fg-muted)', margin: 0 }}>No day sections detailed in this public itinerary.</p>
        </div>
      ) : (
        <Accordion items={accordionItems} defaultOpenId={sections[0]?.id} />
      )}
    </div>
  );
};
