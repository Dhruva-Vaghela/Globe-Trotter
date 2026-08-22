import React from 'react';
import { Calendar, Compass, MapPin, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ItinerarySummaryProps {
  tripId: string;
  tripName: string;
  totalDurationDays: number;
  totalActivitiesCount: number;
  totalBudget: number;
  totalSpent: number;
  destinationSequence: string[];
  isBuilderMode?: boolean;
}

export const ItinerarySummaryCard: React.FC<ItinerarySummaryProps> = ({
  tripId,
  tripName,
  totalDurationDays,
  totalActivitiesCount,
  totalBudget,
  totalSpent,
  destinationSequence,
  isBuilderMode = false,
}) => {
  const navigate = useNavigate();

  const spentPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Element */}
      <div
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <Compass size={220} color="#ffffff" />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span
            style={{
              fontSize: '0.775rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#a5b4fc',
            }}
          >
            Itinerary Suite Overview
          </span>
          <h1 style={{ margin: '0.3rem 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 800 }}>{tripName}</h1>

          {/* Destination sequence list */}
          {destinationSequence.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <MapPin size={15} color="#e0e7ff" />
              {destinationSequence.map((dest, idx) => (
                <React.Fragment key={idx}>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {dest}
                  </span>
                  {idx < destinationSequence.length - 1 && <span style={{ color: '#a5b4fc', fontSize: '0.85rem' }}>→</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div>
          {!isBuilderMode ? (
            <button
              onClick={() => navigate(`/trips/${tripId}/builder`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#ffffff',
                color: '#312e81',
                border: 'none',
                padding: '0.65rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform 0.2s ease',
              }}
            >
              <Edit3 size={16} /> Edit Itinerary
            </button>
          ) : (
            <button
              onClick={() => navigate(`/trips/${tripId}/view`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '0.65rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
            >
              View Hub
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginTop: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
            <Calendar size={22} color="#a5b4fc" />
          </div>
          <div>
            <div style={{ fontSize: '0.775rem', color: '#c7d2fe', fontWeight: 600 }}>Trip Duration</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{totalDurationDays} Days</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
            <Compass size={22} color="#a5b4fc" />
          </div>
          <div>
            <div style={{ fontSize: '0.775rem', color: '#c7d2fe', fontWeight: 600 }}>Planned Activities</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{totalActivitiesCount} Events</div>
          </div>
        </div>

        <div style={{ gridColumn: 'span 2 / span 2', minWidth: '240px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
            <span style={{ color: '#c7d2fe', fontWeight: 600 }}>Budget Allocation</span>
            <span style={{ fontWeight: 700, color: isOverBudget ? '#fca5a5' : '#86efac' }}>
              ₹{totalSpent.toLocaleString('en-IN')} / ₹{totalBudget.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${spentPercentage}%`,
                background: isOverBudget ? '#ef4444' : '#10b981',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
