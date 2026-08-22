import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Loader } from '../components/common/Loader';
import { SectionCard } from '../components/itinerary/SectionCard';
import type { SectionData } from '../components/itinerary/SectionCard';
import { AddSectionModal } from '../components/itinerary/AddSectionModal';
import { ActivitySelectorModal } from '../components/itinerary/ActivitySelectorModal';
import { ItinerarySummaryCard } from '../components/itinerary/ItinerarySummaryCard';
import { Plus, ArrowLeft, Layers } from 'lucide-react';

export const ItineraryBuilder: React.FC = () => {
  const { id: tripId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tripData, setTripData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [sections, setSections] = useState<SectionData[]>([]);

  // Modals state
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (tripId) {
      loadItineraryData();
    }
  }, [tripId]);

  const loadItineraryData = async () => {
    try {
      setLoading(true);
      setError('');
      const [daywiseRes, summaryRes] = await Promise.all([
        apiRequest(`/trips/${tripId}/view/daywise`),
        apiRequest(`/trips/${tripId}/view/summary`),
      ]);

      if (daywiseRes.success) {
        setTripData(daywiseRes.data.trip);
        setSections(daywiseRes.data.sections);
      }
      if (summaryRes.success) {
        setSummaryData(summaryRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load itinerary details');
    } finally {
      setLoading(false);
    }
  };

  // Section CRUD Handlers
  const handleSaveSection = async (data: { title: string; startDate: string; endDate: string; sectionBudget: number }) => {
    if (!tripId) return;
    if (editingSection) {
      // Update section
      await apiRequest(`/trips/${tripId}/sections/${editingSection.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } else {
      // Create section
      await apiRequest(`/trips/${tripId}/sections`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    await loadItineraryData();
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!tripId) return;
    if (!window.confirm('Are you sure you want to delete this day section and all its contents?')) return;
    try {
      await apiRequest(`/trips/${tripId}/sections/${sectionId}`, {
        method: 'DELETE',
      });
      await loadItineraryData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete section');
    }
  };

  // Item Handlers
  const handleAddItemToSection = async (itemData: {
    activityId?: string;
    title: string;
    notes?: string;
    startTime?: string;
    cost: number;
  }) => {
    if (!tripId || !targetSectionId) return;
    await apiRequest(`/trips/${tripId}/sections/${targetSectionId}/items`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    await loadItineraryData();
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!tripId) return;
    try {
      await apiRequest(`/trips/${tripId}/items/${itemId}`, {
        method: 'DELETE',
      });
      await loadItineraryData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const handleReorderItems = async (sectionId: string, itemIds: string[]) => {
    if (!tripId) return;
    try {
      await apiRequest(`/trips/${tripId}/sections/${sectionId}/items/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ itemIds }),
      });
      await loadItineraryData();
    } catch (err: any) {
      console.error('Failed to reorder items:', err);
    }
  };

  if (loading) {
    return <Loader message="Loading Itinerary Builder..." />;
  }

  if (error || !tripData) {
    return (
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1.5rem' }}>
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          {error || 'Trip itinerary not found'}
        </div>
        <button onClick={() => navigate('/trips')} style={{ marginTop: '1rem' }} className="btn-secondary">
          Back to My Trips
        </button>
      </div>
    );
  }

  const targetSection = sections.find((s) => s.id === targetSectionId);

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

      {/* Header Summary */}
      <ItinerarySummaryCard
        tripId={tripData.id}
        tripName={tripData.name}
        totalDurationDays={summaryData?.totalDurationDays || 1}
        totalActivitiesCount={summaryData?.totalActivitiesCount || 0}
        totalBudget={summaryData?.totalBudget || 0}
        totalSpent={summaryData?.totalSpent || 0}
        destinationSequence={summaryData?.destinationSequence || []}
        isBuilderMode={true}
      />

      {/* Action Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Interactive Day Sections ({sections.length})
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: 'var(--fg-muted)' }}>
            Organize your trip day-by-day, assign budgets, and populate activity items.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSection(null);
            setIsAddSectionOpen(true);
          }}
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.7rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
          }}
        >
          <Plus size={18} /> Add Day Section
        </button>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed #cbd5e1',
          }}
        >
          <Layers size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, color: '#0f172a' }}>No Day Sections Created Yet</h3>
          <p style={{ color: 'var(--fg-muted)', maxWidth: '450px', margin: '0 auto 1.5rem auto', fontSize: '0.925rem' }}>
            Start composing your itinerary by adding your first day section (e.g. Day 1: Arrival & City Walking Tour).
          </p>
          <button
            onClick={() => {
              setEditingSection(null);
              setIsAddSectionOpen(true);
            }}
            className="btn-primary"
            style={{ padding: '0.7rem 1.4rem', fontWeight: 700 }}
          >
            + Create First Day Section
          </button>
        </div>
      ) : (
        sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onEditSection={(sec) => {
              setEditingSection(sec);
              setIsAddSectionOpen(true);
            }}
            onDeleteSection={handleDeleteSection}
            onAddItem={(secId) => {
              setTargetSectionId(secId);
              setIsAddItemOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
            onReorderItems={handleReorderItems}
          />
        ))
      )}

      {/* Modals */}
      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onSave={handleSaveSection}
        editingSection={editingSection}
        tripStartDate={tripData.startDate}
        tripEndDate={tripData.endDate}
      />

      <ActivitySelectorModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onSelectActivity={handleAddItemToSection}
        sectionTitle={targetSection?.title}
      />
    </div>
  );
};
