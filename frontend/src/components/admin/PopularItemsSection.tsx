import React from 'react';
import { MapPin, Compass, Star, IndianRupee } from 'lucide-react';

interface PopularItemsSectionProps {
  destinations: any[];
  activities: any[];
}

export const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  destinations,
  activities,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Top Popular Cities / Destinations */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
          <MapPin size={18} color="var(--primary-color)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            Popular Cities & Destinations
          </h3>
        </div>

        {destinations.length === 0 ? (
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.85rem' }}>No destination records found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {destinations.map((dest, idx) => (
              <div
                key={dest.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    {dest.name}, {dest.country}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                    <IndianRupee size={12} />
                    Avg Est: ₹{(dest.estimatedDailyCost || 0).toLocaleString('en-IN')}/day
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', color: '#d97706', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                  <Star size={12} fill="#d97706" />
                  {dest.rating || 4.8}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Popular Activities */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
          <Compass size={18} color="var(--primary-color)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            Top Rated Activities & Experiences
          </h3>
        </div>

        {activities.length === 0 ? (
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.85rem' }}>No activity records found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.map((act, idx) => (
              <div
                key={act.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{act.name}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--fg-muted)', marginTop: '0.15rem' }}>
                    {act.locationName} • Est. ₹{(act.estimatedCost || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                  <Star size={12} fill="#4f46e5" />
                  {act.rating || 4.5}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
