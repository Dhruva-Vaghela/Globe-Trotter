import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/apiClient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { Plus, MapPin, Calendar, Luggage, DollarSign, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [tripsData, setTripsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [sumRes, tripsRes] = await Promise.all([
          apiRequest('/dashboard/summary'),
          apiRequest('/dashboard/trips'),
        ]);
        setSummary(sumRes.data);
        setTripsData(tripsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard DB data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) return <Loader message="Loading your dashboard from database..." />;

  const stats = summary?.stats || {
    totalTrips: 0,
    upcomingTripsCount: 0,
    completedTripsCount: 0,
    visitedCitiesCount: 0,
    totalExpenses: 0,
  };

  const upcomingTrips = tripsData?.upcomingTrips || [];
  const previousTrips = tripsData?.previousTrips || [];

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Welcome Banner */}
      <Card style={{ marginBottom: '2rem', background: '#111827', color: '#ffffff', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Avatar src={user?.avatarUrl} name={user?.name} size="lg" status="online" />
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem', color: '#ffffff', fontWeight: 800 }}>
                Welcome back, <span style={{ color: '#e11d48' }}>{user?.name}</span> 👋
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                Your personal travel dashboard powered live by Neon PostgreSQL.
              </p>
            </div>
          </div>
          <Button variant="brand" size="md" onClick={() => navigate('/trips/new')}>
            <Plus size={16} /> Plan New Trip
          </Button>
        </div>
      </Card>

      {/* Real DB Overview Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.15rem',
          marginBottom: '2.5rem',
        }}
      >
        <Card hoverable onClick={() => navigate('/trips')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.65rem',
                borderRadius: '6px',
                background: '#eff6ff',
                color: '#2563eb',
              }}
            >
              <Luggage size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.775rem', color: '#6b7280', fontWeight: 600 }}>Total Trips</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>{stats.totalTrips}</h3>
            </div>
          </div>
        </Card>

        <Card hoverable onClick={() => navigate('/trips')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.65rem',
                borderRadius: '6px',
                background: '#ecfdf5',
                color: '#059669',
              }}
            >
              <Calendar size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.775rem', color: '#6b7280', fontWeight: 600 }}>
                Upcoming Trips
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>{stats.upcomingTripsCount}</h3>
            </div>
          </div>
        </Card>

        <Card hoverable onClick={() => navigate('/discover')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.65rem',
                borderRadius: '6px',
                background: '#fff1f2',
                color: '#e11d48',
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.775rem', color: '#6b7280', fontWeight: 600 }}>
                Visited Cities
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>{stats.visitedCitiesCount}</h3>
            </div>
          </div>
        </Card>

        <Card hoverable onClick={() => navigate('/trips')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.65rem',
                borderRadius: '6px',
                background: '#fef3c7',
                color: '#d97706',
              }}
            >
              <DollarSign size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.775rem', color: '#6b7280', fontWeight: 600 }}>
                Total Expenses
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>
                ₹{stats.totalExpenses.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Trips Section (Live from DB) */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>Upcoming Trips ({upcomingTrips.length})</h2>
          {upcomingTrips.length > 0 && <Badge variant="brand">Scheduled</Badge>}
        </div>

        {upcomingTrips.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {upcomingTrips.map((trip: any) => (
              <Card key={trip.id} hoverable style={{ padding: 0 }}>
                <div style={{ position: 'relative', height: '150px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'}
                    alt={trip.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem' }}>
                    <Badge variant="brand">{trip.status}</Badge>
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>{trip.name}</h3>
                  <p style={{ color: '#4b5563', fontSize: '0.825rem', marginBottom: '0.85rem' }}>{trip.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.65rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>Start Date</span>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                        {new Date(trip.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="brand" onClick={() => navigate(`/trips/${trip.id}`)}>
                      View Itinerary <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming trips scheduled"
            description="Explore our 100+ destinations and book your next vacation!"
            actionText="Browse Destinations"
            onAction={() => navigate('/discover')}
          />
        )}
      </section>

      {/* Previous Completed Trips Section (Live from DB) */}
      {previousTrips.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>Past Travels ({previousTrips.length})</h2>
            <Badge variant="success">Completed</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {previousTrips.map((trip: any) => (
              <Card key={trip.id} hoverable style={{ padding: 0 }}>
                <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80'}
                    alt={trip.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem' }}>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>{trip.name}</h3>
                  <p style={{ color: '#4b5563', fontSize: '0.825rem', marginBottom: '0.85rem' }}>{trip.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.65rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>Total Spent</span>
                      <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                        ₹{(trip.budget?.totalBudget || 18000).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/trips/${trip.id}`)}>
                      Trip Details <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
