import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../common/Button';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { apiRequest } from '../../utils/apiClient';
import { Loader } from '../common/Loader';

interface TripSection {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface UserTrip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  stops?: { city: string }[];
  sections?: TripSection[];
}

interface AddActivityToDayModalProps {
  activity: {
    id: string;
    name: string;
    estimatedCost: number;
    locationName: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddActivityToDayModal: React.FC<AddActivityToDayModalProps> = ({
  activity,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [trips, setTrips] = useState<UserTrip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [sections, setSections] = useState<TripSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [notes, setNotes] = useState<string>('');

  const [loadingTrips, setLoadingTrips] = useState<boolean>(false);
  const [loadingTripDetails, setLoadingTripDetails] = useState<boolean>(false);
  const [creatingSection, setCreatingSection] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Fetch User Trips when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setLoadingTrips(true);
      apiRequest<{ data: UserTrip[] }>('/trips')
        .then((res) => {
          const userTrips = res.data || [];
          setTrips(userTrips);
          if (userTrips.length > 0) {
            setSelectedTripId(userTrips[0].id);
          }
        })
        .catch((err) => {
          setErrorMsg(err.message || 'Please log in to add activities to your trip.');
        })
        .finally(() => {
          setLoadingTrips(false);
        });
    }
  }, [isOpen]);

  // 2. Fetch full details (sections) for selected trip
  const fetchTripSections = async (tripId: string) => {
    setLoadingTripDetails(true);
    try {
      const res = await apiRequest<{ data: UserTrip }>(`/trips/${tripId}`);
      const fetchedTrip = res.data;
      const secList = fetchedTrip?.sections || [];
      setSections(secList);
      if (secList.length > 0) {
        setSelectedSectionId(secList[0].id);
      } else {
        setSelectedSectionId('');
      }
    } catch (err) {
      console.error('Failed to fetch trip sections', err);
    } finally {
      setLoadingTripDetails(false);
    }
  };

  useEffect(() => {
    if (selectedTripId) {
      fetchTripSections(selectedTripId);
    } else {
      setSections([]);
      setSelectedSectionId('');
    }
  }, [selectedTripId]);

  // Auto-create Day 1 Section if trip has no sections yet
  const handleAutoCreateSection = async () => {
    const selectedTrip = trips.find((t) => t.id === selectedTripId);
    if (!selectedTrip) return;

    setCreatingSection(true);
    setErrorMsg(null);
    try {
      const res = await apiRequest(`/trips/${selectedTrip.id}/sections`, {
        method: 'POST',
        body: JSON.stringify({
          title: `Day 1: ${activity?.name || 'Excursion & Activities'}`,
          startDate: selectedTrip.startDate,
          endDate: selectedTrip.startDate,
          sectionBudget: 5000,
        }),
      });

      await fetchTripSections(selectedTrip.id);
      if (res.data?.id) {
        setSelectedSectionId(res.data.id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to auto-create day section for trip');
    } finally {
      setCreatingSection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity || !selectedTripId || !selectedSectionId) {
      setErrorMsg('Please select a valid trip and day section.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await apiRequest(
        `/trips/${selectedTripId}/sections/${selectedSectionId}/items`,
        {
          method: 'POST',
          body: JSON.stringify({
            activityId: activity.id,
            title: activity.name,
            cost: activity.estimatedCost,
            notes: notes || undefined,
            startTime: startTime || undefined,
          }),
        }
      );

      setSuccessMsg(`Successfully attached "${activity.name}" to your trip itinerary!`);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to attach activity to trip section');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Activity to Itinerary" maxWidth="520px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Selected Activity Preview Header */}
        <div
          style={{
            background: 'var(--bg-tertiary, #f3f4f6)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm, 6px)',
            border: '1px solid var(--border-subtle, #e5e7eb)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted, #9ca3af)', textTransform: 'uppercase' }}>
            Selected Experience
          </span>
          <h4 style={{ margin: '0.2rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--fg-primary, #111827)' }}>
            {activity.name}
          </h4>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.825rem', color: 'var(--fg-secondary, #4b5563)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={13} color="var(--brand-accent, #e11d48)" /> {activity.locationName}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--fg-primary, #111827)' }}>
              ₹{activity.estimatedCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {loadingTrips ? (
          <Loader message="Fetching your trips..." />
        ) : (
          <>
            {/* Trip Selector Dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-primary, #111827)' }}>
                Select Trip
              </label>
              {trips.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted, #9ca3af)', margin: 0 }}>
                  No active trips found. Please create a trip first in "My Trips".
                </p>
              ) : (
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                    background: '#ffffff',
                    fontSize: '0.9rem',
                    color: 'var(--fg-primary, #111827)',
                    fontWeight: 500,
                  }}
                >
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Day Section Selector Dropdown */}
            {selectedTripId && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-primary, #111827)' }}>
                  Select Day Section
                </label>
                {loadingTripDetails ? (
                  <span style={{ fontSize: '0.825rem', color: 'var(--fg-muted, #9ca3af)' }}>
                    Loading days...
                  </span>
                ) : sections.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fffbebfb', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                    <span style={{ fontSize: '0.825rem', color: '#92400e', fontWeight: 600 }}>
                      No day section found for this trip.
                    </span>
                    <Button
                      type="button"
                      variant="brand"
                      size="sm"
                      isLoading={creatingSection}
                      onClick={handleAutoCreateSection}
                    >
                      <Plus size={14} /> Auto-Create Day 1
                    </Button>
                  </div>
                ) : (
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm, 6px)',
                      border: '1px solid var(--border-subtle, #e5e7eb)',
                      background: '#ffffff',
                      fontSize: '0.9rem',
                      color: 'var(--fg-primary, #111827)',
                      fontWeight: 500,
                    }}
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Start Time & Custom Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-primary, #111827)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} /> Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-primary, #111827)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Book morning slot"
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Modal Submit / Cancel Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || trips.length === 0 || !selectedSectionId}
          >
            {submitting ? 'Attaching...' : 'Confirm & Add to Day'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
