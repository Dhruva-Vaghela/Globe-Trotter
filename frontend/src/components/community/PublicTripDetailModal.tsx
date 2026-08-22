import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../common/Button';
import { Avatar } from '../ui/Avatar';
import { Copy } from 'lucide-react';
import { apiRequest } from '../../utils/apiClient';
import { Loader } from '../common/Loader';

interface PublicTrip {
  id: string;
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  startDate: string;
  endDate: string;
  user: {
    name: string;
    avatarUrl?: string | null;
    bio?: string | null;
  };
  stops?: { city: string; country: string }[];
  sections?: {
    id: string;
    title: string;
    items: {
      id: string;
      title: string;
      notes?: string | null;
      startTime?: string | null;
      cost: number;
    }[];
  }[];
  communityPost?: {
    title: string;
    content?: string | null;
  } | null;
}

interface PublicTripDetailModalProps {
  tripId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyTrip: (tripId: string) => void;
}

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';

export const PublicTripDetailModal: React.FC<PublicTripDetailModalProps> = ({
  tripId,
  isOpen,
  onClose,
  onCopyTrip,
}) => {
  const [trip, setTrip] = useState<PublicTrip | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_COVER);

  useEffect(() => {
    if (isOpen && tripId) {
      setLoading(true);
      apiRequest<{ data: PublicTrip }>(`/community/trips/${tripId}`)
        .then((res) => {
          setTrip(res.data);
          setImgSrc(res.data.coverImageUrl || FALLBACK_COVER);
        })
        .catch((err) => {
          console.error('Failed to load public trip details', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, tripId]);

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="640px">
      {loading ? (
        <Loader message="Loading public itinerary..." />
      ) : trip ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Cover Image Header */}
          <div
            style={{
              position: 'relative',
              height: '220px',
              borderRadius: 'var(--radius-sm, 6px)',
              overflow: 'hidden',
              marginTop: '-0.5rem',
            }}
          >
            <img
              src={imgSrc}
              alt={trip.name}
              onError={() => setImgSrc(FALLBACK_COVER)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Author & Title Row */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Avatar name={trip.user.name} size="sm" />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg-primary, #111827)', display: 'block' }}>
                  {trip.user.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--fg-secondary, #4b5563)' }}>
                  Published Community Explorer
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--fg-primary, #111827)', margin: '0 0 0.35rem 0' }}>
              {trip.communityPost?.title || trip.name}
            </h2>

            {trip.communityPost?.content && (
              <p style={{ color: 'var(--fg-secondary, #4b5563)', fontSize: '0.9rem', lineHeight: 1.4, margin: '0 0 0.75rem 0' }}>
                {trip.communityPost.content}
              </p>
            )}
          </div>

          {/* Day-by-Day Itinerary Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '300px', overflowY: 'auto' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--fg-primary, #111827)' }}>
              Itinerary Breakdown
            </h4>

            {trip.sections?.map((sec, idx) => (
              <div
                key={sec.id}
                style={{
                  background: 'var(--bg-tertiary, #f3f4f6)',
                  borderRadius: 'var(--radius-sm, 6px)',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--border-subtle, #e5e7eb)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--fg-primary, #111827)', marginBottom: '0.4rem' }}>
                  Day {idx + 1}: {sec.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {sec.items.length === 0 ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted, #9ca3af)', fontStyle: 'italic' }}>
                      No items
                    </span>
                  ) : (
                    sec.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          background: '#ffffff',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '4px',
                          fontSize: '0.825rem',
                          border: '1px solid var(--border-subtle, #e5e7eb)',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--fg-primary, #111827)' }}>📌 {item.title}</span>
                        <span style={{ fontWeight: 700, color: 'var(--fg-secondary, #4b5563)' }}>
                          ₹{item.cost.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onCopyTrip(trip.id);
              }}
            >
              <Copy size={15} /> Adopt & Copy Trip to My Account
            </Button>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
};
