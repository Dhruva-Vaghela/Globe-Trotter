import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Loader } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { AdminStatCard } from '../components/admin/AdminStatCard';
import { UserTable } from '../components/admin/UserTable';
import type { UserRecord } from '../components/admin/UserTable';
import { UserFilters } from '../components/admin/UserFilters';
import { PopularItemsSection } from '../components/admin/PopularItemsSection';
import { AnalyticsCharts } from '../components/admin/AnalyticsCharts';
import { Shield, Users, Map, Compass, Share2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Analytics & Popular state
  const [analytics, setAnalytics] = useState<any>(null);
  const [popular, setPopular] = useState<any>({ popularDestinations: [], popularActivities: [] });

  // Users management state
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      setError('Access Denied. Administrator privileges are required.');
      setLoading(false);
      return;
    }
    loadAdminData();
  }, [user, search, roleFilter]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      let usersUrl = '/admin/users';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (params.toString()) usersUrl += `?${params.toString()}`;

      const [analyticsRes, popularRes, usersRes] = await Promise.all([
        apiRequest('/admin/analytics'),
        apiRequest('/admin/popular'),
        apiRequest(usersUrl),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (popularRes.success) setPopular(popularRes.data);
      if (usersRes.success) setUsers(usersRes.data.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      await apiRequest(`/admin/users/${targetUserId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (targetUserId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await apiRequest(`/admin/users/${targetUserId}`, {
        method: 'DELETE',
      });
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <Loader message="Loading Admin & Analytics Dashboard..." />;
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '1.5rem', textAlign: 'center' }}>
        <Shield size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#0f172a', fontWeight: 800 }}>Access Denied</h2>
        <p style={{ color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
          Back to User Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#4f46e5', color: '#ffffff', padding: '0.65rem', borderRadius: 'var(--radius-md)', display: 'flex' }}>
          <Shield size={26} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Admin & System Analytics Hub
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: 'var(--fg-muted)' }}>
            System overview, user role management, engagement metrics, and popular insights.
          </p>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      {analytics && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <AdminStatCard
            title="Total Registered Users"
            value={analytics.users.total}
            subtitle={`${analytics.users.newLast30Days} new in last 30 days`}
            icon={<Users size={22} />}
            color="#4f46e5"
            bg="#e0e7ff"
          />

          <AdminStatCard
            title="Total Trips Created"
            value={analytics.trips.total}
            subtitle={`${analytics.trips.publicShared} public shared trips`}
            icon={<Map size={22} />}
            color="#0284c7"
            bg="#e0f2fe"
          />

          <AdminStatCard
            title="Curated Destinations"
            value={analytics.destinations.total}
            subtitle={`Avg Est: ₹${analytics.destinations.avgDailyCost}/day`}
            icon={<Compass size={22} />}
            color="#d97706"
            bg="#fef3c7"
          />

          <AdminStatCard
            title="Community Engagement"
            value={analytics.engagement.totalPosts}
            subtitle={`${analytics.engagement.totalSectionsCreated} Day Sections Created`}
            icon={<Share2 size={22} />}
            color="#059669"
            bg="#d1fae5"
          />
        </div>
      )}

      {/* Analytics Charts & Status Distribution */}
      {analytics && (
        <AnalyticsCharts tripStats={analytics.trips} engagementStats={analytics.engagement} />
      )}

      {/* Popular Cities & Activities */}
      <PopularItemsSection
        destinations={popular.popularDestinations || []}
        activities={popular.popularActivities || []}
      />

      {/* User Management Section */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      <UserTable
        users={users}
        currentUserId={user?.id}
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};
