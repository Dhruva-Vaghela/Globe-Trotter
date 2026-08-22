import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CommunityFeedCard, type CommunityPostFeedData } from '../components/community/CommunityFeedCard';
import { PublicTripDetailModal } from '../components/community/PublicTripDetailModal';
import { PublishTripModal } from '../components/community/PublishTripModal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { apiRequest } from '../utils/apiClient';
import { Search, MapPin, Sparkles, Plus, ArrowUpDown, CheckCircle, AlertCircle } from 'lucide-react';

export const Community: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [cityQuery, setCityQuery] = useState<string>(searchParams.get('city') || '');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name'>('createdAt');

  const [posts, setPosts] = useState<CommunityPostFeedData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (cityQuery) params.append('city', cityQuery);
      if (sortBy) params.append('sortBy', sortBy);

      const qStr = params.toString();
      const endpoint = `/community/feed${qStr ? `?${qStr}` : ''}`;
      const res = await apiRequest<{ data: CommunityPostFeedData[] }>(endpoint);
      setPosts(res.data || []);
    } catch (err) {
      console.error('Failed to load community feed', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, cityQuery, sortBy]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleCopyTrip = async (tripId: string) => {
    setNotificationMsg(null);
    try {
      const res = await apiRequest<{ data: { id: string } }>(`/community/copy/${tripId}`, {
        method: 'POST',
      });
      setNotificationMsg({
        type: 'success',
        text: 'Trip adopted successfully! Redirecting to your new trip...',
      });
      setTimeout(() => {
        navigate(`/trips/${res.data.id}`);
      }, 1200);
    } catch (err: any) {
      setNotificationMsg({
        type: 'error',
        text: err.message || 'Please log in to copy community trips to your account.',
      });
    }
  };

  return (
    <>
      <div style={{ paddingBottom: '3rem' }}>
        {/* Top Hero Banner */}
        <section
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, var(--bg-canvas, #f9fafb) 100%)',
            borderBottom: '1px solid var(--border-subtle, #e5e7eb)',
            padding: '2.5rem 0 1.75rem 0',
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full, 9999px)',
                    background: '#eff6ff',
                    color: 'var(--brand-blue, #2563eb)',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                  }}
                >
                  <Sparkles size={14} color="var(--brand-accent, #e11d48)" /> Module 10 — Community Travel Feed
                </div>
                <h1
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'var(--fg-primary, #111827)',
                    letterSpacing: '-0.02em',
                    margin: '0 0 0.4rem 0',
                  }}
                >
                  Community Travel Stories & Itineraries
                </h1>
                <p style={{ color: 'var(--fg-secondary, #4b5563)', fontSize: '0.95rem', margin: 0 }}>
                  Discover hand-crafted trip itineraries published by travelers worldwide. Adopt and copy trips to your own plan in 1-click.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => setShowPublishModal(true)}
                style={{ gap: '0.4rem', fontWeight: 600 }}
              >
                <Plus size={16} /> Share My Trip
              </Button>
            </div>

            {/* Search & Filter Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                background: '#ffffff',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm, 6px)',
                border: '1px solid var(--border-subtle, #e5e7eb)',
                boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
                marginTop: '1.75rem',
              }}
            >
              {/* Keyword Input */}
              <div
                style={{
                  flex: '1 1 260px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-tertiary, #f3f4f6)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--border-subtle, #e5e7eb)',
                }}
              >
                <Search size={18} color="var(--fg-muted, #9ca3af)" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search community posts, stories, or keywords..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                />
              </div>

              {/* City Filter Input */}
              <div
                style={{
                  flex: '0 0 200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-tertiary, #f3f4f6)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--border-subtle, #e5e7eb)',
                }}
              >
                <MapPin size={18} color="var(--brand-accent, #e11d48)" />
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Filter by city..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                />
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                <ArrowUpDown size={15} color="var(--fg-muted, #9ca3af)" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                    background: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="createdAt">Latest Stories First</option>
                  <option value="name">Trip Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Global Notification Banner */}
        {notificationMsg && (
          <div className="container" style={{ marginTop: '1.25rem' }}>
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                background: notificationMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                border: notificationMsg.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                color: notificationMsg.type === 'success' ? '#065f46' : '#991b1b',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {notificationMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{notificationMsg.text}</span>
            </div>
          </div>
        )}

        {/* Main Feed Grid Area */}
        <div className="container" style={{ marginTop: '1.5rem' }}>
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                    overflow: 'hidden',
                    height: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Skeleton height="200px" borderRadius="0" />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    <Skeleton width="50%" height="16px" />
                    <Skeleton width="90%" height="22px" />
                    <Skeleton width="100%" height="32px" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              title="No Community Stories Found"
              description="No public itineraries matched your search parameters. Be the first globetrotter to publish a trip!"
              actionText="Publish My Trip"
              onAction={() => setShowPublishModal(true)}
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {posts.map((post) => (
                <CommunityFeedCard
                  key={post.id}
                  post={post}
                  onViewItinerary={(p) => {
                    setActiveTripId(p.id);
                    setShowDetailModal(true);
                  }}
                  onCopyTrip={(p) => handleCopyTrip(p.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Public Trip Detail Modal */}
        <PublicTripDetailModal
          tripId={activeTripId}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setActiveTripId(null);
          }}
          onCopyTrip={(id) => handleCopyTrip(id)}
        />

        {/* Publish Trip Modal */}
        <PublishTripModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          onSuccess={() => fetchFeed()}
        />
      </div>
    </>
  );
};
