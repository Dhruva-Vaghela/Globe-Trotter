import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ActivitySearchBar } from '../components/activities/ActivitySearchBar';
import { ActivityCategoryRail, type CategoryOption } from '../components/activities/ActivityCategoryRail';
import { ActivityCard, type ActivityCardData } from '../components/activities/ActivityCard';
import { ActivityDetailModal } from '../components/activities/ActivityDetailModal';
import { AddActivityToDayModal } from '../components/activities/AddActivityToDayModal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { apiRequest } from '../utils/apiClient';
import { SlidersHorizontal, ArrowUpDown, FilterX, Sparkles, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ActivitySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [locationQuery, setLocationQuery] = useState<string>(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [maxCost, setMaxCost] = useState<number>(20000);
  const [maxDuration, setMaxDuration] = useState<number>(600); // 600 mins = 10 hrs
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'cost_asc' | 'cost_desc' | 'duration'>('rating');

  // Data & Loading States
  const [activities, setActivities] = useState<ActivityCardData[]>([]);
  const [categories] = useState<CategoryOption[]>([
    { id: 'cat-1', name: 'Beaches & Islands' },
    { id: 'cat-2', name: 'Cultural & Heritage' },
    { id: 'cat-3', name: 'Hill Stations & Treks' },
    { id: 'cat-4', name: 'Food & Dining' },
    { id: 'cat-5', name: 'Adventures & Safaris' },
    { id: 'cat-6', name: 'Spiritual Trails' },
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal States
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const [activeAddActivity, setActiveAddActivity] = useState<ActivityCardData | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);

  // Fetch Activities from backend API
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (locationQuery) params.append('location', locationQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (maxCost < 20000) params.append('maxCost', maxCost.toString());
      if (maxDuration < 600) params.append('maxDuration', maxDuration.toString());
      if (minRating > 0) params.append('minRating', minRating.toString());
      if (sortBy) params.append('sortBy', sortBy);

      const queryString = params.toString();
      const endpoint = `/activities${queryString ? `?${queryString}` : ''}`;
      const res = await apiRequest<{ data: ActivityCardData[] }>(endpoint);
      setActivities(res.data || []);
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, locationQuery, selectedCategory, maxCost, maxDuration, minRating, sortBy]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCategory('');
    setMaxCost(20000);
    setMaxDuration(600);
    setMinRating(0);
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <>
      <div style={{ paddingBottom: '3rem' }}>
        {/* Top Hero / Header Section */}
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
                  <Sparkles size={14} color="var(--brand-accent, #e11d48)" /> Module 5 — Activity Search & Management
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
                  Explore & Book Day Experiences
                </h1>
                <p style={{ color: 'var(--fg-secondary, #4b5563)', fontSize: '0.95rem', margin: 0 }}>
                  Discover day tours, culinary walks, adventure sports, and cultural trails to attach to your trip itinerary.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: '#ffffff',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--border-subtle, #e5e7eb)',
                  boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
                }}
              >
                <MapPin size={16} color="var(--brand-accent, #e11d48)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg-primary, #111827)' }}>
                  {activities.length} Experiences Available
                </span>
              </div>
            </div>

            {/* Search Bar & Category Pill Rail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.75rem' }}>
              <ActivitySearchBar
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                locationFilter={locationQuery}
                onLocationChange={(val) => setLocationQuery(val)}
              />

              <ActivityCategoryRail
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(catId) => setSelectedCategory(catId)}
              />
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="container" style={{ marginTop: '1.5rem' }}>
          {/* Controls Bar: Filter Toggle & Sort Dropdown */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Button
                variant={showFiltersPanel ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                style={{ gap: '0.4rem', fontWeight: 600 }}
              >
                <SlidersHorizontal size={16} /> Filters
              </Button>

              {(searchQuery || locationQuery || selectedCategory || maxCost < 20000 || maxDuration < 600 || minRating > 0) && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--brand-accent, #e11d48)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <FilterX size={15} /> Reset Filters
                </button>
              )}
            </div>

            {/* Sort By Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={15} color="var(--fg-muted, #9ca3af)" />
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--fg-secondary, #4b5563)' }}>
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--border-subtle, #e5e7eb)',
                  background: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--fg-primary, #111827)',
                  cursor: 'pointer',
                }}
              >
                <option value="rating">Rating (Highest First)</option>
                <option value="cost_asc">Price (Low to High)</option>
                <option value="cost_desc">Price (High to Low)</option>
                <option value="duration">Duration (Shortest First)</option>
              </select>
            </div>
          </div>

          {/* Expandable Advanced Filters Panel */}
          {showFiltersPanel && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-sm, 6px)',
                border: '1px solid var(--border-subtle, #e5e7eb)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {/* Max Cost Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--fg-primary, #111827)' }}>Max Cost</span>
                  <span style={{ color: 'var(--brand-blue, #2563eb)' }}>₹{maxCost.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={maxCost}
                  onChange={(e) => setMaxCost(Number(e.target.value))}
                  style={{ accentColor: 'var(--brand-blue, #2563eb)' }}
                />
              </div>

              {/* Max Duration Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--fg-primary, #111827)' }}>Max Duration</span>
                  <span style={{ color: 'var(--brand-blue, #2563eb)' }}>
                    {Math.floor(maxDuration / 60)}h {maxDuration % 60 > 0 ? `${maxDuration % 60}m` : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="600"
                  step="30"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(Number(e.target.value))}
                  style={{ accentColor: 'var(--brand-blue, #2563eb)' }}
                />
              </div>

              {/* Minimum Rating Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-primary, #111827)' }}>
                  Minimum Rating
                </span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                    background: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <option value={0}>All Ratings</option>
                  <option value={4.0}>⭐ 4.0 & above</option>
                  <option value={4.5}>⭐ 4.5 & above</option>
                  <option value={4.8}>⭐ 4.8 & above (Top Rated)</option>
                </select>
              </div>
            </div>
          )}

          {/* Activity Cards Grid / Skeleton Loading / Empty State */}
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                    overflow: 'hidden',
                    height: '360px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                  }}
                >
                  <Skeleton height="180px" borderRadius="0" />
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    <Skeleton width="40%" height="16px" />
                    <Skeleton width="85%" height="22px" />
                    <Skeleton width="100%" height="32px" />
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                      <Skeleton width="30%" height="20px" />
                      <Skeleton width="30%" height="20px" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <EmptyState
              title="No Activities Found"
              description="No experiences matched your active search query or filter parameters. Try adjusting your cost slider or clearing filters."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {activities.map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  onViewDetails={(item) => {
                    setActiveDetailId(item.id);
                    setShowDetailModal(true);
                  }}
                  onAddToTrip={(item) => {
                    setActiveAddActivity(item);
                    setShowAddModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Activity Detail Modal */}
        <ActivityDetailModal
          activityId={activeDetailId}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setActiveDetailId(null);
          }}
          onAddToTrip={(act) => {
            setActiveAddActivity({
              id: act.id,
              name: act.name,
              estimatedCost: act.estimatedCost,
              locationName: act.locationName,
              durationMinutes: act.durationMinutes,
              rating: act.rating,
              imageUrl: act.imageUrl,
              category: act.category,
            });
            setShowAddModal(true);
          }}
        />

        {/* Add Activity to Trip Day Modal */}
        <AddActivityToDayModal
          activity={activeAddActivity}
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setActiveAddActivity(null);
          }}
        />
      </div>
    </>
  );
};
