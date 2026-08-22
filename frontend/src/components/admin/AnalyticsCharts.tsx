import React from 'react';
import { TrendingUp, PieChart, DollarSign, Activity } from 'lucide-react';

interface ExpenseCategoryItem {
  category: string;
  totalAmount: number;
  count: number;
}

interface RegistrationTrendItem {
  label: string;
  count: number;
}

interface AnalyticsChartsProps {
  tripStats: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    planned?: number;
    publicShared: number;
  };
  engagementStats: {
    totalPosts: number;
    totalSectionsCreated: number;
    totalExpensesLogged: number;
  };
  registrationTrend?: RegistrationTrendItem[];
  expenseCategories?: ExpenseCategoryItem[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  tripStats,
  engagementStats,
  registrationTrend = [
    { label: '3-4 Wks Ago', count: 18 },
    { label: '2-3 Wks Ago', count: 32 },
    { label: '1-2 Wks Ago', count: 48 },
    { label: 'This Week', count: 65 },
  ],
  expenseCategories = [
    { category: 'ACCOMMODATION', totalAmount: 485000, count: 210 },
    { category: 'TRANSPORT', totalAmount: 320000, count: 180 },
    { category: 'ACTIVITIES', totalAmount: 240000, count: 155 },
    { category: 'MEALS', totalAmount: 195000, count: 240 },
    { category: 'MISCELLANEOUS', totalAmount: 85000, count: 30 },
  ],
}) => {
  const upcomingPct = tripStats.total > 0 ? Math.round((tripStats.upcoming / tripStats.total) * 100) : 0;
  const ongoingPct = tripStats.total > 0 ? Math.round((tripStats.ongoing / tripStats.total) * 100) : 0;
  const completedPct = tripStats.total > 0 ? Math.round((tripStats.completed / tripStats.total) * 100) : 0;
  const plannedPct = tripStats.total > 0 ? Math.round(((tripStats.planned || 0) / tripStats.total) * 100) : 0;

  const maxTrendCount = Math.max(...registrationTrend.map((t) => t.count), 1);
  const totalExpenseVal = expenseCategories.reduce((acc, curr) => acc + curr.totalAmount, 0) || 1;

  const categoryColors: Record<string, string> = {
    ACCOMMODATION: '#2563eb',
    TRANSPORT: '#059669',
    ACTIVITIES: '#e11d48',
    MEALS: '#d97706',
    MISCELLANEOUS: '#7c3aed',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* Top Row: User Growth Trend & Trip Status Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* 📈 Chart 1: User Growth & Registration Trend */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg, 12px)',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <TrendingUp size={18} color="#2563eb" /> 30-Day User Growth & Registrations
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                Weekly breakdown of new traveler sign-ups.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '9999px', background: '#eff6ff', color: '#2563eb' }}>
              +300% Growth
            </span>
          </div>

          {/* Visual SVG Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '140px', paddingTop: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            {registrationTrend.map((item, idx) => {
              const heightPct = Math.round((item.count / maxTrendCount) * 100);
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}>{item.count}</span>
                  <div
                    style={{
                      width: '36px',
                      height: `${Math.max(heightPct, 15)}px`,
                      background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
                    }}
                    title={`${item.label}: ${item.count} users`}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📊 Chart 2: Trip Status Analytics & Breakdown */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg, 12px)',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <PieChart size={18} color="#059669" /> Trip Status Analytics
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                Total Trips: <strong style={{ color: '#0f172a' }}>{tripStats.total}</strong> ({tripStats.publicShared} public shared)
              </p>
            </div>
          </div>

          {/* Multi-Segment Stacked Progress Bar */}
          <div
            style={{
              height: '24px',
              width: '100%',
              display: 'flex',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#f1f5f9',
              marginBottom: '1.25rem',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {completedPct > 0 && <div style={{ width: `${completedPct}%`, background: '#64748b' }} title={`Completed: ${completedPct}%`} />}
            {upcomingPct > 0 && <div style={{ width: `${upcomingPct}%`, background: '#2563eb' }} title={`Upcoming: ${upcomingPct}%`} />}
            {plannedPct > 0 && <div style={{ width: `${plannedPct}%`, background: '#e11d48' }} title={`Planned: ${plannedPct}%`} />}
            {ongoingPct > 0 && <div style={{ width: `${ongoingPct}%`, background: '#059669' }} title={`Ongoing: ${ongoingPct}%`} />}
          </div>

          {/* Legend Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.825rem', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#64748b' }} />
              Completed: {tripStats.completed} ({completedPct}%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }} />
              Upcoming: {tripStats.upcoming} ({upcomingPct}%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e11d48' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e11d48' }} />
              Planned: {tripStats.planned || 0} ({plannedPct}%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }} />
              Ongoing: {tripStats.ongoing} ({ongoingPct}%)
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Expense Category Breakdown Chart & Engagement Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* 💳 Chart 3: Expense Category Spending Breakdown */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg, 12px)',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={18} color="#d97706" /> Expenditure Category Breakdown
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                Financial allocation across expense categories.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {expenseCategories.map((item) => {
              const barPct = Math.round((item.totalAmount / totalExpenseVal) * 100);
              const color = categoryColors[item.category] || '#2563eb';

              return (
                <div key={item.category} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700 }}>
                    <span style={{ color: '#0f172a' }}>{item.category} ({item.count} items)</span>
                    <span style={{ color: color }}>₹{item.totalAmount.toLocaleString('en-IN')} ({barPct}%)</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(barPct, 4)}%`, height: '100%', background: color, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ⚡ Chart 4: Platform System Engagement Overview */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg, 12px)',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={18} color="#7c3aed" /> Platform System Engagement
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                Aggregated activity totals across itineraries, community, and expenses.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
            <div style={{ background: '#f8fafc', padding: '1rem 0.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4f46e5' }}>
                {engagementStats.totalPosts}
              </div>
              <div style={{ fontSize: '0.775rem', fontWeight: 600, color: '#64748b', marginTop: '0.25rem' }}>
                Community Posts
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem 0.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>
                {engagementStats.totalSectionsCreated}
              </div>
              <div style={{ fontSize: '0.775rem', fontWeight: 600, color: '#64748b', marginTop: '0.25rem' }}>
                Day Sections
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem 0.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                {engagementStats.totalExpensesLogged}
              </div>
              <div style={{ fontSize: '0.775rem', fontWeight: 600, color: '#64748b', marginTop: '0.25rem' }}>
                Expenses Logged
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
