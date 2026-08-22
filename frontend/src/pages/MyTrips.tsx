import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/ui/Badge';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { Plus, Search, MapPin, Calendar, ArrowRight, SlidersHorizontal, Luggage } from 'lucide-react';

export const MyTrips: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'startDate' | 'createdAt' | 'name'>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const navigate = useNavigate();

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (statusFilter !== 'ALL') queryParams.set('status', statusFilter);
      if (sortBy) queryParams.set('sortBy', sortBy);
      if (sortOrder) queryParams.set('sortOrder', sortOrder);

      const res = await apiRequest(`/trips?${queryParams.toString()}`);
      setTrips(res.data || []);
    } catch (err) {
      console.error('Failed to fetch trips', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [statusFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return <Badge variant="brand">Upcoming</Badge>;
      case 'ONGOING':
        return <Badge variant="default">Ongoing</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Luggage size={24} color="#2563eb" /> My Trip Itineraries
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>
            Manage, filter, and plan day-wise itineraries across your upcoming and completed travels.
          </p>
        </div>
        <Link to="/trips/new">
          <Button variant="brand" size="md">
            <Plus size={16} /> Create New Trip
          </Button>
        </Link>
      </div>

      {/* Filter & Controls Bar */}
      <Card style={{ marginBottom: '2rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by trip name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input"
              style={{ width: '100%', padding: '0.5rem 0.85rem 0.5rem 2.2rem', fontSize: '0.875rem' }}
            />
          </form>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <SlidersHorizontal size={16} color="#6b7280" />
            <select
              className="glass-input"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#6b7280', fontWeight: 600 }}>Sort:</span>
            <select
              className="glass-input"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-') as [any, any];
                setSortBy(by);
                setSortOrder(order);
              }}
            >
              <option value="startDate-asc">Date (Earliest First)</option>
              <option value="startDate-desc">Date (Latest First)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="createdAt-desc">Recently Created</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Trips Grid */}
      {loading ? (
        <Loader message="Loading trip list..." />
      ) : trips.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {trips.map((trip) => (
            <Card key={trip.id} hoverable style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '155px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'}
                  alt={trip.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem' }}>
                  {getStatusBadge(trip.status)}
                </div>
              </div>

              <div style={{ padding: '1.15rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                  {trip.name}
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.825rem', lineHeight: 1.4, marginBottom: '0.85rem', height: '36px', overflow: 'hidden' }}>
                  {trip.description || 'No description added yet.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} color="#2563eb" />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {trip.stops && trip.stops[0] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="#e11d48" />
                      <span>{trip.stops[0].city}, {trip.stops[0].country}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>Total Budget</span>
                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>
                      {trip.budget?.totalBudget ? `₹${trip.budget.totalBudget.toLocaleString()}` : 'Not set'}
                    </p>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => navigate(`/trips/${trip.id}`)}>
                    View Details <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No trips found"
          description="Create your first trip itinerary or try adjusting your search filters."
          actionText="Create New Trip"
          onAction={() => navigate('/trips/new')}
        />
      )}
    </div>
  );
};
