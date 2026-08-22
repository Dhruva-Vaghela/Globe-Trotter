import React from 'react';

interface AnalyticsChartsProps {
  tripStats: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    publicShared: number;
  };
  engagementStats: {
    totalPosts: number;
    totalSectionsCreated: number;
    totalExpensesLogged: number;
  };
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  tripStats,
  engagementStats,
}) => {
  const upcomingPct = tripStats.total > 0 ? Math.round((tripStats.upcoming / tripStats.total) * 100) : 0;
  const ongoingPct = tripStats.total > 0 ? Math.round((tripStats.ongoing / tripStats.total) * 100) : 0;
  const completedPct = tripStats.total > 0 ? Math.round((tripStats.completed / tripStats.total) * 100) : 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Trip Status Distribution */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
          Trip Status Analytics
        </h3>
        <p style={{ margin: '0 0 1.1rem 0', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
          Distribution across upcoming, ongoing, and completed trips.
        </p>

        {/* Multi-segment Progress Bar */}
        <div
          style={{
            height: '20px',
            width: '100%',
            display: 'flex',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#f1f5f9',
            marginBottom: '1rem',
          }}
        >
          {upcomingPct > 0 && <div style={{ width: `${upcomingPct}%`, background: '#3b82f6' }} title={`Upcoming: ${upcomingPct}%`} />}
          {ongoingPct > 0 && <div style={{ width: `${ongoingPct}%`, background: '#10b981' }} title={`Ongoing: ${ongoingPct}%`} />}
          {completedPct > 0 && <div style={{ width: `${completedPct}%`, background: '#64748b' }} title={`Completed: ${completedPct}%`} />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700 }}>
          <span style={{ color: '#3b82f6' }}>Upcoming: {tripStats.upcoming} ({upcomingPct}%)</span>
          <span style={{ color: '#10b981' }}>Ongoing: {tripStats.ongoing} ({ongoingPct}%)</span>
          <span style={{ color: '#64748b' }}>Completed: {tripStats.completed} ({completedPct}%)</span>
        </div>
      </div>

      {/* User Engagement Analytics */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
          System Engagement Metrics
        </h3>
        <p style={{ margin: '0 0 1.1rem 0', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
          Activity across community sharing, itinerary sections, and expenses.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5' }}>
              {engagementStats.totalPosts}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-muted)', marginTop: '0.2rem' }}>
              Community Posts
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
              {engagementStats.totalSectionsCreated}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-muted)', marginTop: '0.2rem' }}>
              Day Sections
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
              {engagementStats.totalExpensesLogged}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-muted)', marginTop: '0.2rem' }}>
              Expenses Logged
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
