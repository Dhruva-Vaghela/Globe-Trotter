import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../common/Button';
import { apiRequest } from '../../utils/apiClient';
import type { DestinationItem } from './DestinationCard';

interface TripItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  stops?: any[];
}

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: DestinationItem | null;
  onSuccess?: () => void;
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({
  isOpen,
  onClose,
  destination,
  onSuccess,
}) => {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserTrips();
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const fetchUserTrips = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<{ data: TripItem[] }>('/trips');
      if (res && res.data) {
        setTrips(res.data);
        if (res.data.length > 0) {
          setSelectedTripId(res.data[0].id);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load user trips. Please sign in first.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStop = async () => {
    if (!destination || !selectedTripId) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await apiRequest(`/trips/${selectedTripId}/stops`, {
        method: 'POST',
        body: JSON.stringify({
          destinationId: destination.id,
          city: destination.name,
          country: destination.country,
        }),
      });

      setSuccessMsg(`Added ${destination.name} to your trip itinerary!`);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add destination to trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!destination) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Add ${destination.name} to Trip`}
      description={`Select an itinerary to attach ${destination.name}, ${destination.country} as a destination stop.`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Destination Target Preview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.85rem',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <img
            src={destination.imageUrl}
            alt={destination.name}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-sm)',
              objectFit: 'cover',
            }}
          />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
              {destination.name}, {destination.country}
            </h4>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>
              Est. Daily Cost: ${destination.estimatedDailyCost} • Rating: ⭐ {destination.rating}
            </span>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
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
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
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

        {/* Trip Selection Radio List */}
        <div>
          <label
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#374151',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            Choose Active Itinerary:
          </label>

          {isLoading ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
              Loading your trips...
            </div>
          ) : trips.length === 0 ? (
            <div
              style={{
                padding: '1.25rem',
                textAlign: 'center',
                background: '#f9fafb',
                borderRadius: 'var(--radius-sm)',
                border: '1px border-dashed #d1d5db',
              }}
            >
              <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                You don't have any active trips yet!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = '/trips/new')}
              >
                + Create New Trip
              </Button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {trips.map((trip) => {
                const isSelected = selectedTripId === trip.id;
                return (
                  <div
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                        {trip.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.775rem',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginTop: '0.15rem',
                        }}
                      >
                        <Calendar size={12} />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString()} -{' '}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="tripSelection"
                      checked={isSelected}
                      onChange={() => setSelectedTripId(trip.id)}
                      style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid #f3f4f6',
          }}
        >
          <Button variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleAddStop}
            disabled={!selectedTripId || isSubmitting || trips.length === 0}
            style={{ minWidth: '130px' }}
          >
            {isSubmitting ? 'Adding...' : 'Confirm Stop'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
