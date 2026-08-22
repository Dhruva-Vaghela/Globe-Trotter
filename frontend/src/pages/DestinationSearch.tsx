import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { SearchBar } from '../components/destination/SearchBar';
import { DestinationFilterBar } from '../components/destination/DestinationFilterBar';
import { DestinationCard, type DestinationItem } from '../components/destination/DestinationCard';
import { AddToTripModal } from '../components/destination/AddToTripModal';
import { Skeleton } from '../components/ui/Skeleton';
import { Dialog } from '../components/ui/Dialog';
import { Button } from '../components/common/Button';
import { apiRequest } from '../utils/apiClient';
import { Compass, Sparkles, RefreshCw, Info } from 'lucide-react';

export const DestinationSearch: React.FC = () => {
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [maxCost, setMaxCost] = useState<number>(300);
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Modal overlays
  const [targetDestination, setTargetDestination] = useState<DestinationItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [detailsDestination, setDetailsDestination] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchDestinations();
  }, [searchQuery, selectedCountry, selectedRegion, maxCost, sortBy]);

  const fetchDestinations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCountry !== 'All') params.append('country', selectedCountry);
      if (selectedRegion !== 'All') params.append('region', selectedRegion);
      if (maxCost < 300) params.append('maxCost', maxCost.toString());
      if (sortBy) params.append('sortBy', sortBy);

      const res = await apiRequest<{ data: DestinationItem[] }>(`/destinations?${params.toString()}`);
      if (res && res.data) {
        setDestinations(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch destinations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = (dest: DestinationItem) => {
    setTargetDestination(dest);
    setIsAddModalOpen(true);
  };

  const handleOpenDetails = async (dest: DestinationItem) => {
    try {
      const res = await apiRequest<{ data: any }>(`/destinations/${dest.id}`);
      if (res && res.data) {
        setDetailsDestination(res.data);
        setIsDetailsModalOpen(true);
      }
    } catch (err) {
      setDetailsDestination(dest);
      setIsDetailsModalOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('All');
    setSelectedRegion('All');
    setMaxCost(300);
    setSortBy('popularity');
  };

  return (
    <Layout>
      <div style={{ background: 'var(--bg-canvas)', minHeight: 'calc(100vh - 120px)', padding: '2rem 0 4rem' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 2rem',
              color: '#ffffff',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(4px)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <Sparkles size={14} color="#fde047" /> Destination & City Search Hub
              </div>
              <h1
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  marginBottom: '0.5rem',
                  lineHeight: 1.2,
                }}
              >
                Explore Destinations & Plan Your Next Escape
              </h1>
              <p style={{ fontSize: '1rem', color: '#bfdbfe', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Discover handpicked global capitals, tropical beaches, and mountain retreats. Filter by cost, region, and rating to attach cities straight to your trip itinerary.
              </p>

              {/* Search Bar Embedded in Banner */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
            </div>
          </div>

          {/* Filter Bar */}
          <DestinationFilterBar
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            maxCost={maxCost}
            onChangeMaxCost={setMaxCost}
            sortBy={sortBy}
            onChangeSortBy={setSortBy}
          />

          {/* Results Summary Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
              {!isLoading && (
                <span>
                  Showing <span style={{ color: '#2563eb' }}>{destinations.length}</span> destinations
                </span>
              )}
            </div>

            {(searchQuery || selectedCountry !== 'All' || selectedRegion !== 'All' || maxCost < 300) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RefreshCw size={14} /> Reset All Filters
              </Button>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Grid View: Skeletons vs Cards vs EmptyState */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #e5e7eb',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <Skeleton height="180px" borderRadius="var(--radius-sm)" />
                  <Skeleton height="24px" width="60%" />
                  <Skeleton height="16px" width="90%" />
                  <Skeleton height="16px" width="75%" />
                  <Skeleton height="36px" width="100%" borderRadius="var(--radius-sm)" />
                </div>
              ))}
            </div>
          ) : destinations.length === 0 ? (
            /* Empty State */
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed #d1d5db',
                padding: '4rem 2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                }}
              >
                <Compass size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                No matching destinations found
              </h3>
              <p style={{ color: '#6b7280', maxWidth: '420px', fontSize: '0.9rem' }}>
                We couldn't find any destination matching your search criteria. Try adjusting your cost slider or clearing filters.
              </p>
              <Button variant="primary" size="md" onClick={handleResetFilters}>
                Reset Search Filters
              </Button>
            </div>
          ) : (
            /* Destination Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {destinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  onAddToTrip={handleOpenAddModal}
                  onViewDetails={handleOpenDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add To Trip Modal Overlay */}
      <AddToTripModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        destination={targetDestination}
      />

      {/* Destination Details Modal */}
      {detailsDestination && (
        <Dialog
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`${detailsDestination.name}, ${detailsDestination.country}`}
          description={`Region: ${detailsDestination.region} • Rating: ⭐ ${detailsDestination.rating}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <img
              src={detailsDestination.imageUrl}
              alt={detailsDestination.name}
              style={{
                width: '100%',
                height: '240px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
              }}
            />

            <p style={{ color: '#374151', lineHeight: 1.5, fontSize: '0.95rem' }}>
              {detailsDestination.description}
            </p>

            {/* Daily Cost & Tags */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem',
                background: '#f9fafb',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                  ESTIMATED DAILY COST
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb' }}>
                  ${detailsDestination.estimatedDailyCost} USD / day
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleOpenAddModal(detailsDestination);
                }}
              >
                + Add to Itinerary
              </Button>
            </div>

            {/* Travel Tips */}
            {detailsDestination.travelTips && (
              <div>
                <h4
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#111827',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Info size={16} color="#2563eb" /> Explorer Travel Tips
                </h4>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {detailsDestination.travelTips.map((tip: string, idx: number) => (
                    <li key={idx} style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </Layout>
  );
};
