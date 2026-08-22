import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  List,
  Grid,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [tripsCount, setTripsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'MONTH' | 'TIMELINE'>('MONTH');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const navigate = useNavigate();

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/calendar/overview');
      setEvents(res.data?.events || []);
      setTripsCount(res.data?.tripsCount || 0);
    } catch (err) {
      console.error('Failed to fetch calendar data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  // Days in month generator (August 2026 default)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const getEventsForDay = (dayNumber: number) => {
    return events.filter((e) => {
      if (!e.start) return false;
      const date = new Date(e.start);
      return date.getDate() === dayNumber;
    });
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={24} color="#2563eb" /> Travel Calendar & Timeline
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>
            Visual monthly schedule, trip date bars, and day-wise activity timelines.
          </p>
        </div>

        {/* View Switcher & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant="brand">{tripsCount} Scheduled Trips</Badge>
          <Badge variant="success">{events.length} Calendar Events</Badge>

          <div style={{ display: 'flex', background: '#f3f4f6', padding: '0.25rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setViewMode('MONTH')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                background: viewMode === 'MONTH' ? '#ffffff' : 'transparent',
                color: viewMode === 'MONTH' ? '#2563eb' : '#4b5563',
                fontWeight: viewMode === 'MONTH' ? 700 : 500,
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Grid size={14} /> Month Grid
            </button>
            <button
              onClick={() => setViewMode('TIMELINE')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                background: viewMode === 'TIMELINE' ? '#ffffff' : 'transparent',
                color: viewMode === 'TIMELINE' ? '#2563eb' : '#4b5563',
                fontWeight: viewMode === 'TIMELINE' ? 700 : 500,
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <List size={14} /> Timeline View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading travel calendar from database..." />
      ) : viewMode === 'MONTH' ? (
        /* Monthly Calendar View */
        <div>
          {/* Month Header Controls */}
          <Card style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>August 2026</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button size="sm" variant="secondary"><ChevronLeft size={16} /></Button>
              <Button size="sm" variant="secondary"><ChevronRight size={16} /></Button>
            </div>
          </Card>

          {/* Month Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '0.775rem',
                  fontWeight: 800,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  padding: '0.35rem',
                }}
              >
                {day}
              </div>
            ))}

            {daysInMonth.map((dayNum) => {
              const dayEvents = getEventsForDay(dayNum);
              const hasTrip = dayEvents.some((e) => e.type === 'TRIP');

              return (
                <Card
                  key={dayNum}
                  style={{
                    minHeight: '105px',
                    padding: '0.5rem',
                    background: hasTrip ? '#eff6ff' : '#ffffff',
                    borderColor: hasTrip ? '#bfdbfe' : '#e5e7eb',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: hasTrip ? '#2563eb' : '#374151' }}>
                      {dayNum}
                    </span>
                    {hasTrip && <Badge variant="brand">Trip</Badge>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {dayEvents.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        style={{
                          textAlign: 'left',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.35rem',
                          borderRadius: '3px',
                          background: ev.type === 'TRIP' ? '#2563eb' : ev.type === 'ACTIVITY' ? '#ecfdf5' : '#f3f4f6',
                          color: ev.type === 'TRIP' ? '#ffffff' : ev.type === 'ACTIVITY' ? '#047857' : '#374151',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {ev.type === 'ACTIVITY' ? `🕒 ${ev.startTime || '09:00'} ${ev.title}` : ev.title}
                      </button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Vertical Chronological Timeline View */
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem' }}>
            Chronological Events Timeline
          </h2>

          {events.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid #e5e7eb', paddingLeft: '1.25rem' }}>
              {events.map((ev) => (
                <div key={ev.id} style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '-1.65rem',
                      top: '0.2rem',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: ev.type === 'TRIP' ? '#2563eb' : '#059669',
                      border: '2px solid #ffffff',
                    }}
                  />

                  <Card hoverable style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <div>
                        <Badge variant={ev.type === 'TRIP' ? 'brand' : 'success'}>{ev.type}</Badge>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginTop: '0.35rem' }}>{ev.title}</h3>
                      </div>
                      {ev.cost !== undefined && ev.cost > 0 && (
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>₹{ev.cost.toLocaleString()}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} /> {new Date(ev.start).toLocaleDateString()} {ev.startTime ? `at ${ev.startTime}` : ''}
                      </span>
                      {ev.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={13} color="#e11d48" /> {ev.location}
                        </span>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No calendar events"
              description="Create a trip or add activities to populate your travel timeline!"
              actionText="Create Trip"
              onAction={() => navigate('/trips/new')}
            />
          )}
        </div>
      )}

      {/* Event Details Dialog */}
      <Dialog
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
        description={`Scheduled event details for ${selectedEvent?.type}`}
      >
        {selectedEvent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Badge variant={selectedEvent.type === 'TRIP' ? 'brand' : 'success'}>{selectedEvent.type}</Badge>
              {selectedEvent.status && <Badge variant="secondary">{selectedEvent.status}</Badge>}
            </div>

            <div style={{ fontSize: '0.875rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div><strong>Start Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</div>
              {selectedEvent.end && <div><strong>End Date:</strong> {new Date(selectedEvent.end).toLocaleDateString()}</div>}
              {selectedEvent.startTime && <div><strong>Start Time:</strong> {selectedEvent.startTime}</div>}
              {selectedEvent.location && <div><strong>Location:</strong> {selectedEvent.location}</div>}
              {selectedEvent.cost > 0 && <div><strong>Cost:</strong> ₹{selectedEvent.cost.toLocaleString()}</div>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button
                variant="brand"
                size="sm"
                onClick={() => {
                  const id = selectedEvent.tripId;
                  setSelectedEvent(null);
                  navigate(`/trips/${id}`);
                }}
              >
                Go to Trip Itinerary
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
