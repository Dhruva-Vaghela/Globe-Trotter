import React from 'react';
import { Clock, MapPin, IndianRupee, Navigation, Utensils, Compass, Calendar } from 'lucide-react';

export interface TimelineEventItem {
  id: string;
  type: 'ARRIVAL' | 'ACTIVITY' | 'MEAL' | 'CUSTOM';
  title: string;
  date: string;
  time: string;
  cost: number;
  notes?: string | null;
  location?: string | null;
  category?: string | null;
}

interface TimelineViewProps {
  events: TimelineEventItem[];
  searchQuery?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events, searchQuery = '' }) => {
  const filteredEvents = events.filter((ev) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ev.title.toLowerCase().includes(q) ||
      (ev.location && ev.location.toLowerCase().includes(q)) ||
      (ev.notes && ev.notes.toLowerCase().includes(q)) ||
      (ev.category && ev.category.toLowerCase().includes(q))
    );
  });

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (filteredEvents.length === 0) {
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
          {searchQuery ? `No timeline events match "${searchQuery}"` : 'No timeline events found for this itinerary.'}
        </p>
      </div>
    );
  }

  // Group events by Date
  const eventsByDate: Record<string, TimelineEventItem[]> = {};
  filteredEvents.forEach((ev) => {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
    eventsByDate[ev.date].push(ev);
  });

  return (
    <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
      {/* Vertical Timeline Stem Line */}
      <div
        style={{
          position: 'absolute',
          left: '19px',
          top: '12px',
          bottom: '12px',
          width: '3px',
          background: 'linear-gradient(180deg, var(--primary-color) 0%, #cbd5e1 100%)',
          borderRadius: '2px',
        }}
      />

      {Object.entries(eventsByDate).map(([dateStr, dateEvents]) => (
        <div key={dateStr} style={{ marginBottom: '2rem' }}>
          {/* Date Header Node */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--primary-color)',
              color: '#ffffff',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '1rem',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Calendar size={14} /> {formatDateLabel(dateStr)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {dateEvents.map((event) => {
              const isArrival = event.type === 'ARRIVAL';
              const isMeal = event.type === 'MEAL';

              return (
                <div
                  key={event.id}
                  style={{
                    position: 'relative',
                    marginLeft: '0.5rem',
                    padding: '1rem 1.2rem',
                    background: '#ffffff',
                    border: `1px solid ${isArrival ? '#818cf8' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Timeline Node Circle Icon */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-26px',
                      top: '1.1rem',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isArrival ? '#4f46e5' : isMeal ? '#f59e0b' : 'var(--primary-color)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 4px #ffffff',
                      zIndex: 3,
                    }}
                  >
                    {isArrival ? (
                      <Navigation size={12} />
                    ) : isMeal ? (
                      <Utensils size={12} />
                    ) : (
                      <Compass size={12} />
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                          {event.title}
                        </span>
                        {event.time && (
                          <span
                            style={{
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              color: 'var(--primary-color)',
                              background: 'rgba(99, 102, 241, 0.1)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '10px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Clock size={12} /> {event.time}
                          </span>
                        )}
                      </div>

                      {event.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.825rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>
                          <MapPin size={13} color="#ef4444" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.cost > 0 && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: '#059669',
                          background: '#ecfdf5',
                          padding: '0.3rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid #a7f3d0',
                        }}
                      >
                        <IndianRupee size={13} />
                        {event.cost.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {event.notes && (
                    <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--fg-muted)', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      {event.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
