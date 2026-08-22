import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Loader } from '../components/common/Loader';
import { BudgetOverviewCard } from '../components/budget/BudgetOverviewCard';
import { CategoryBreakdown } from '../components/budget/CategoryBreakdown';
import { BudgetChart } from '../components/budget/BudgetChart';
import { ExpenseTable } from '../components/budget/ExpenseTable';
import type { ExpenseRecord } from '../components/budget/ExpenseTable';
import type { ExpenseCategory } from '../components/budget/CategoryBreakdown';
import { AddExpenseModal } from '../components/budget/AddExpenseModal';
import { SetBudgetModal } from '../components/budget/SetBudgetModal';
import { ArrowLeft, Wallet } from 'lucide-react';

export const TripBudget: React.FC = () => {
  const { id: tripId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | undefined>(undefined);

  // Modals state
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);

  useEffect(() => {
    if (tripId) {
      loadBudgetOverview();
    }
  }, [tripId, selectedCategory]);

  const loadBudgetOverview = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiRequest(`/trips/${tripId}/budget`);
      if (res.success) {
        setOverview(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load trip budget overview');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async (totalBudget: number) => {
    if (!tripId) return;
    await apiRequest(`/trips/${tripId}/budget`, {
      method: 'PUT',
      body: JSON.stringify({ totalBudget }),
    });
    await loadBudgetOverview();
  };

  const handleSaveExpense = async (data: { category: ExpenseCategory; amount: number; description: string; date: string }) => {
    if (!tripId) return;
    if (editingExpense) {
      // Update expense
      await apiRequest(`/trips/${tripId}/expenses/${editingExpense.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } else {
      // Create expense
      await apiRequest(`/trips/${tripId}/expenses`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    await loadBudgetOverview();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!tripId) return;
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await apiRequest(`/trips/${tripId}/expenses/${expenseId}`, {
        method: 'DELETE',
      });
      await loadBudgetOverview();
    } catch (err: any) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  if (loading) {
    return <Loader message="Loading Budget & Cost Management..." />;
  }

  if (error || !overview) {
    return (
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1.5rem' }}>
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          {error || 'Budget details unavailable'}
        </div>
        <button onClick={() => navigate('/trips')} style={{ marginTop: '1rem' }} className="btn-secondary">
          Back to My Trips
        </button>
      </div>
    );
  }

  const filteredExpenses = selectedCategory
    ? overview.expenses.filter((e: ExpenseRecord) => e.category === selectedCategory)
    : overview.expenses;

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '1.5rem' }}>
      <button
        onClick={() => navigate(`/trips/${tripId}`)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          border: 'none',
          background: 'transparent',
          color: 'var(--fg-secondary)',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Trip Details
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--primary-color)', color: '#ffffff', padding: '0.6rem', borderRadius: 'var(--radius-md)', display: 'flex' }}>
          <Wallet size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Budget & Cost Management Hub
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: 'var(--fg-muted)' }}>
            Trip: <strong>{overview.tripName}</strong> • Track planned budget, expenses, and category breakdowns.
          </p>
        </div>
      </div>

      {/* Budget Overview Card */}
      <BudgetOverviewCard
        totalBudget={overview.totalBudget}
        totalSpent={overview.totalSpent}
        remainingBudget={overview.remainingBudget}
        dailyAverageCost={overview.dailyAverageCost}
        totalDurationDays={overview.totalDurationDays}
        status={overview.status}
        warningMessage={overview.warningMessage}
        onOpenSetBudget={() => setIsSetBudgetOpen(true)}
      />

      {/* Distribution Chart & Category Breakdown */}
      <BudgetChart categoryTotals={overview.categoryBreakdown} totalSpent={overview.totalSpent} />

      <CategoryBreakdown categoryTotals={overview.categoryBreakdown} totalSpent={overview.totalSpent} />

      {/* Expense Log Table */}
      <ExpenseTable
        expenses={filteredExpenses}
        selectedCategory={selectedCategory}
        onFilterCategory={(cat) => setSelectedCategory(cat)}
        onEditExpense={(exp) => {
          setEditingExpense(exp);
          setIsAddExpenseOpen(true);
        }}
        onDeleteExpense={handleDeleteExpense}
        onOpenAddExpense={() => {
          setEditingExpense(null);
          setIsAddExpenseOpen(true);
        }}
      />

      {/* Modals */}
      <SetBudgetModal
        isOpen={isSetBudgetOpen}
        onClose={() => setIsSetBudgetOpen(false)}
        onSaveBudget={handleSaveBudget}
        currentBudget={overview.totalBudget}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
      />
    </div>
  );
};
