import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Accordion } from '../components/ui/Accordion';
import { Loader } from '../components/common/Loader';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  DollarSign,
  CheckCircle,
  Eye,
  Sliders,
  PieChart,
} from 'lucide-react';

export const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('UPCOMING');
  const [totalBudget, setTotalBudget] = useState('');

  const fetchTripDetails = async () => {
    try {
      const res = await apiRequest(`/trips/${id}`);
      setTrip(res.data);
      setName(res.data.name || '');
      setDescription(res.data.description || '');
      setStatus(res.data.status || 'UPCOMING');
      setTotalBudget(res.data.budget?.totalBudget ? String(res.data.budget.totalBudget) : '');
    } catch (err) {
      console.error('Failed to fetch trip details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiRequest(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          description,
          status,
          totalBudget: totalBudget ? parseFloat(totalBudget) : undefined,
        }),
      });
      setTrip(res.data);
      setIsEditing(false);
    } catch (err: any) {
      alert(`Error updating trip: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFinishTrip = async () => {
    try {
      const res = await apiRequest(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
      setTrip(res.data);
      setStatus('COMPLETED');
      alert('🎉 Trip marked as Completed! Saved into your Past Trips History.');
    } catch (err: any) {
      alert(`Failed to complete trip: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await apiRequest(`/trips/${id}`, { method: 'DELETE' });
      navigate('/trips');
    } catch (err: any) {
      alert(`Failed to delete trip: ${err.message}`);
    }
  };

  if (loading) return <Loader message="Loading trip details..." />;
  if (!trip) return <div className="container" style={{ padding: '3rem' }}>Trip not found</div>;

  const totalSpent = trip.expenses
    ? trip.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
    : 0;

  const budgetGoal = trip.budget?.totalBudget || 0;
  const budgetPercentage = budgetGoal > 0 ? Math.min(Math.round((totalSpent / budgetGoal) * 100), 100) : 0;

  const accordionItems = (trip.sections || []).map((sec: any) => ({
    id: sec.id,
    title: sec.title,
    subtitle: `${new Date(sec.startDate).toLocaleDateString()} · ${sec.items?.length || 0} Planned Activities`,
    content: (
      <div>
        {sec.items && sec.items.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sec.items.map((item: any) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{item.title}</h5>
                  {item.notes && <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.notes}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb' }}>
                    {item.cost ? `₹${item.cost.toLocaleString()}` : 'Free'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>
            No activity items added for this day section yet.
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.25rem' }}>
      {/* Back Navigation */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/trips" style={{ color: '#4b5563', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to My Trips
        </Link>
      </div>

      {/* Main Cover Header */}
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
          <img
            src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
            alt={trip.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Badge variant={trip.status === 'COMPLETED' ? 'success' : 'brand'}>{trip.status}</Badge>
              {trip.stops && trip.stops[0] && (
                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <MapPin size={14} color="#e11d48" /> {trip.stops[0].city}, {trip.stops[0].country}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{trip.name}</h1>
          </div>
        </div>

        {/* Header Actions Bar */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: '#4b5563' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} color="#2563eb" />
              <strong>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {trip.status !== 'COMPLETED' ? (
              <Button variant="success" size="sm" onClick={handleFinishTrip}>
                <CheckCircle size={15} /> Finish & Complete Trip
              </Button>
            ) : (
              <Badge variant="success">✓ Saved to Past Trips History</Badge>
            )}

            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 size={15} /> Edit Details
            </Button>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 size={15} /> Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Access Module Hub */}
      <Card style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '0.85rem' }}>
          Itinerary & Budget Modules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          <Button variant="secondary" size="md" onClick={() => navigate(`/trips/${id}/view`)}>
            <Eye size={16} color="#2563eb" /> View Full Itinerary & Timeline
          </Button>

          <Button variant="secondary" size="md" onClick={() => navigate(`/trips/${id}/builder`)}>
            <Sliders size={16} color="#059669" /> Open Itinerary Builder
          </Button>

          <Button variant="secondary" size="md" onClick={() => navigate(`/trips/${id}/budget`)}>
            <PieChart size={16} color="#d97706" /> Expense Tracker & Budget
          </Button>
        </div>
      </Card>

      {/* Budget Breakdown & Progress Card */}
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={18} color="#059669" /> Budget & Expense Overview
          </h2>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>
            ₹{totalSpent.toLocaleString()} / {budgetGoal > 0 ? `₹${budgetGoal.toLocaleString()}` : 'No limit'}
          </span>
        </div>

        {/* Budget Progress Bar */}
        {budgetGoal > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${budgetPercentage}%`,
                  height: '100%',
                  background: budgetPercentage > 90 ? '#e11d48' : '#059669',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem', display: 'block' }}>
              {budgetPercentage}% of budget utilized
            </span>
          </div>
        )}
      </Card>

      {/* Day-Wise Itinerary Sections */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>
            Day-Wise Itinerary
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigate(`/trips/${id}/view`)}>
            <Eye size={15} /> View Full Itinerary
          </Button>
        </div>

        {accordionItems.length > 0 ? (
          <Accordion items={accordionItems} defaultOpenId={accordionItems[0]?.id} />
        ) : (
          <Card style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No day-wise itinerary sections added yet.
          </Card>
        )}
      </div>

      {/* Destination Stops Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={20} color="#e11d48" /> Destination Stops ({trip.stops?.length || 0})
          </h2>
          <Link to="/discover">
            <Button variant="outline" size="sm">
              + Discover & Add Destinations
            </Button>
          </Link>
        </div>

        {trip.stops && trip.stops.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {trip.stops.map((stop: any) => (
              <Card
                key={stop.id}
                style={{
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    {stop.city}, {stop.country}
                  </h4>
                  <span style={{ fontSize: '0.775rem', color: '#6b7280', display: 'block', marginTop: '0.15rem' }}>
                    {stop.destinationName || 'Trip Stop'}
                  </span>
                </div>
                <button
                  type="button"
                  title="Remove stop from trip"
                  onClick={async () => {
                    try {
                      await apiRequest(`/trips/${id}/stops/${stop.id}`, { method: 'DELETE' });
                      fetchTripDetails();
                    } catch (err: any) {
                      alert(`Failed to remove stop: ${err.message}`);
                    }
                  }}
                  style={{
                    background: '#fef2f2',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem 0.6rem',
                    color: '#e11d48',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                  }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </Card>
            ))}
          </div>
        ) : (
          <Card style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No destination stops attached to this trip yet.
          </Card>
        )}
      </div>

      {/* Edit Trip Dialog */}
      <Dialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Trip Details"
        description="Update trip title, description, status, or total budget."
      >
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <Input label="Trip Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '0.35rem' }}>
              Trip Status
            </label>
            <select
              className="glass-input"
              style={{ width: '100%', padding: '0.6rem 0.85rem' }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <Input
            label="Total Budget (₹ / $)"
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Description</label>
            <textarea
              className="glass-input"
              rows={3}
              style={{ padding: '0.75rem', width: '100%', fontFamily: 'inherit' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" isLoading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Trip Deletion"
        description="Are you sure you want to delete this trip itinerary? All day plans and expenses will be permanently deleted."
      >
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
