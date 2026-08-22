import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Loader } from '../components/common/Loader';
import { ItinerarySummaryCard } from '../components/itinerary/ItinerarySummaryCard';
import { ViewToggle } from '../components/itinerary/ViewToggle';
import { ItinerarySearchBar } from '../components/itinerary/ItinerarySearchBar';
import { DayWiseLayout } from '../components/itinerary/DayWiseLayout';
import { TimelineView } from '../components/itinerary/TimelineView';
import { ArrowLeft } from 'lucide-react';

export const ItineraryView: React.FC = () => {
  const { id: tripId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'daywise' | 'timeline'>('daywise');
  const [searchQuery, setSearchQuery] = useState('');

  const [tripData, setTripData] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);

  useEffect(() => {
    if (tripId) {
      loadViewData();
    }
  }, [tripId]);

  const loadViewData = async () => {
    try {
      setLoading(true);
      setError('');

      const [daywiseRes, timelineRes, summaryRes] = await Promise.all([
        apiRequest(`/trips/${tripId}/view/daywise`),
        apiRequest(`/trips/${tripId}/view/timeline`),
        apiRequest(`/trips/${tripId}/view/summary`),
      ]);

      if (daywiseRes.success) {
        setTripData(daywiseRes.data.trip);
        setSections(daywiseRes.data.sections);
      }
      if (timelineRes.success) {
        setTimelineEvents(timelineRes.data.events);
      }
      if (summaryRes.success) {
        setSummaryData(summaryRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load itinerary view data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading Itinerary Hub..." />;
  }

  if (error || !tripData) {
    return (
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1.5rem' }}>
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          {error || 'Itinerary view data unavailable'}
        </div>
        <button onClick={() => navigate('/trips')} style={{ marginTop: '1rem' }} className="btn-secondary">
          Back to My Trips
        </button>
      </div>
    );
  }

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

      {/* Summary Card */}
      <ItinerarySummaryCard
        tripId={tripData.id}
        tripName={tripData.name}
        totalDurationDays={summaryData?.totalDurationDays || 1}
        totalActivitiesCount={summaryData?.totalActivitiesCount || 0}
        totalBudget={summaryData?.totalBudget || 0}
        totalSpent={summaryData?.totalSpent || 0}
        destinationSequence={summaryData?.destinationSequence || []}
        isBuilderMode={false}
      />

      {/* View Switcher & Search Bar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <ViewToggle activeView={activeView} onToggle={(v) => setActiveView(v)} />
        <ItinerarySearchBar value={searchQuery} onChange={(val) => setSearchQuery(val)} />
      </div>

      {/* Content View */}
      {activeView === 'daywise' ? (
        <DayWiseLayout sections={sections} searchQuery={searchQuery} />
      ) : (
        <TimelineView events={timelineEvents} searchQuery={searchQuery} />
      )}
    </div>
  );
};
