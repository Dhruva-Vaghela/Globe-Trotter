import React from 'react';
import { IndianRupee, AlertTriangle, TrendingUp, Calendar, Edit3 } from 'lucide-react';

interface BudgetOverviewCardProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  dailyAverageCost: number;
  totalDurationDays: number;
  status: 'UNDER_BUDGET' | 'ON_TRACK' | 'OVER_BUDGET';
  warningMessage?: string | null;
  onOpenSetBudget: () => void;
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({
  totalBudget,
  totalSpent,
  remainingBudget,
  dailyAverageCost,
  totalDurationDays,
  status,
  warningMessage,
  onOpenSetBudget,
}) => {
  const isOverBudget = status === 'OVER_BUDGET';
  const spentRatio = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Warning Banner */}
      {warningMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: isOverBudget ? '#fef2f2' : '#fffbe6',
            border: `1px solid ${isOverBudget ? '#fca5a5' : '#ffe58f'}`,
            color: isOverBudget ? '#dc2626' : '#d48806',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={18} />
          <span>{warningMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.775rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--fg-muted)' }}>
            Trip Budget Overview
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center' }}>
              <IndianRupee size={24} />
              {totalSpent.toLocaleString('en-IN')}
            </h2>
            <span style={{ fontSize: '0.925rem', color: 'var(--fg-muted)', fontWeight: 600 }}>
              spent of ₹{totalBudget.toLocaleString('en-IN')} budget
            </span>
          </div>
        </div>

        <button
          onClick={onOpenSetBudget}
          className="btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          <Edit3 size={15} /> Set Planned Budget
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: '1.1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--fg-secondary)' }}>Spending Progress ({spentRatio}%)</span>
          <span style={{ color: remainingBudget >= 0 ? '#059669' : '#dc2626' }}>
            {remainingBudget >= 0 ? `Remaining: ₹${remainingBudget.toLocaleString('en-IN')}` : `Over Budget by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}`}
          </span>
        </div>
        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${spentRatio}%`,
              background: isOverBudget ? '#ef4444' : spentRatio >= 85 ? '#f59e0b' : '#10b981',
              borderRadius: '5px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fg-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
            <TrendingUp size={15} color="var(--primary-color)" /> Daily Average Cost
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={17} />
            {dailyAverageCost.toLocaleString('en-IN')}
            <span style={{ fontSize: '0.775rem', color: 'var(--fg-muted)', fontWeight: 500, marginLeft: '4px' }}>/ day</span>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fg-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Calendar size={15} color="var(--primary-color)" /> Trip Duration
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            {totalDurationDays} Days
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fg-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
            Status Indicator
          </div>
          <div
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              marginTop: '0.4rem',
              color: isOverBudget ? '#dc2626' : status === 'ON_TRACK' ? '#d97706' : '#059669',
            }}
          >
            {isOverBudget ? '⚠️ OVER BUDGET' : status === 'ON_TRACK' ? '⚡ ON TRACK' : '✅ UNDER BUDGET'}
          </div>
        </div>
      </div>
    </div>
  );
};
