import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../common/Button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { apiRequest } from '../../utils/apiClient';
import { Loader } from '../common/Loader';

interface UserTrip {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
}

interface PublishTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PublishTripModal: React.FC<PublishTripModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [trips, setTrips] = useState<UserTrip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const [loadingTrips, setLoadingTrips] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setLoadingTrips(true);
      apiRequest<{ data: UserTrip[] }>('/trips')
        .then((res) => {
          const tripList = res.data || [];
          setTrips(tripList);
          if (tripList.length > 0) {
            setSelectedTripId(tripList[0].id);
            setTitle(tripList[0].name);
            setContent(tripList[0].description || '');
          }
        })
        .catch((err) => {
          setErrorMsg(err.message || 'Please log in to publish trips to the community.');
        })
        .finally(() => {
          setLoadingTrips(false);
        });
    }
  }, [isOpen]);

  const handleTripChange = (tripId: string) => {
    setSelectedTripId(tripId);
    const chosen = trips.find((t) => t.id === tripId);
    if (chosen) {
      setTitle(chosen.name);
      setContent(chosen.description || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) {
      setErrorMsg('Please select a trip to publish.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await apiRequest(`/community/publish/${selectedTripId}`, {
        method: 'POST',
        body: JSON.stringify({
          title: title || undefined,
          content: content || undefined,
        }),
      });

      setSuccessMsg('Your trip has been published to the community feed!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish trip');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Publish Trip to Community Feed" maxWidth="520px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-primary, #111827)' }}>
                Select Trip to Share
              </label>
              {trips.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted, #9ca3af)', margin: 0 }}>
                  No trips found. Create a trip first in "My Trips".
                </p>
              ) : (
                <select
                  value={selectedTripId}
                  onChange={(e) => handleTripChange(e.target.value)}
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
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-primary, #111827)' }}>
                Community Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 4-Day Ultimate Goa Beach Break"
                style={{
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--border-subtle, #e5e7eb)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-primary, #111827)' }}>
                Travel Story / Tips for Globetrotters
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Share your highlights, favorite food spots, or budget advice..."
                style={{
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--border-subtle, #e5e7eb)',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting || trips.length === 0}>
            {submitting ? 'Publishing...' : 'Publish to Community'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
