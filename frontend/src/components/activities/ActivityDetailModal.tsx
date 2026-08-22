import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Star, MapPin, Clock, Plus, Tag, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { apiRequest } from '../../utils/apiClient';
import { Loader } from '../common/Loader';

interface DetailedActivity {
  id: string;
  name: string;
  description?: string | null;
  locationName: string;
  estimatedCost: number;
  durationMinutes: number;
  rating: number;
  imageUrl?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  durationBreakdown?: {
    hours: number;
    minutes: number;
    formatted: string;
    suitableFor: string;
  };
  locationMap?: {
    formattedAddress: string;
    city: string;
    country: string;
  };
}

interface ActivityDetailModalProps {
  activityId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToTrip: (activity: DetailedActivity) => void;
}

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activityId,
  isOpen,
  onClose,
  onAddToTrip,
}) => {
  const [activity, setActivity] = useState<DetailedActivity | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_COVER);

  useEffect(() => {
    if (isOpen && activityId) {
      setLoading(true);
      apiRequest<{ data: DetailedActivity }>(`/activities/${activityId}`)
        .then((res) => {
          setActivity(res.data);
          setImgSrc(res.data.imageUrl || FALLBACK_COVER);
        })
        .catch((err) => {
          console.error('Failed to load activity details', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, activityId]);

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="640px">
      {loading ? (
        <Loader message="Loading activity details..." />
      ) : activity ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main Image Header */}
          <div
            style={{
              position: 'relative',
              height: '240px',
              borderRadius: 'var(--radius-sm, 6px)',
              overflow: 'hidden',
              marginTop: '-0.5rem',
            }}
          >
            <img
              src={imgSrc}
              alt={activity.name}
              onError={() => setImgSrc(FALLBACK_COVER)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {activity.category && (
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(17, 24, 39, 0.85)',
                  color: '#ffffff',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Tag size={13} /> {activity.category.name}
              </span>
            )}
          </div>

          {/* Title & Rating */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--fg-primary, #111827)',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                {activity.name}
              </h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                <Star size={15} fill="#d97706" color="#d97706" />
                <span>{activity.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {/* Location Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--brand-accent, #e11d48)',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginTop: '0.5rem',
              }}
            >
              <MapPin size={16} />
              <span>{activity.locationName}</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ color: 'var(--fg-secondary, #4b5563)', fontSize: '0.925rem', lineHeight: 1.5 }}>
            {activity.description || 'No detailed description available.'}
          </div>

          {/* Key Activity Info Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: 'var(--bg-tertiary, #f3f4f6)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm, 6px)',
              border: '1px solid var(--border-subtle, #e5e7eb)',
            }}
          >
            {/* Duration Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--fg-muted, #9ca3af)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Clock size={13} color="var(--brand-blue, #2563eb)" /> Duration Breakdown
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg-primary, #111827)' }}>
                {activity.durationBreakdown?.formatted || `${activity.durationMinutes} Minutes`}
              </span>
              <span style={{ fontSize: '0.775rem', color: 'var(--fg-secondary, #4b5563)' }}>
                {activity.durationBreakdown?.suitableFor || 'Standard Experience'}
              </span>
            </div>

            {/* Cost & Verification */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--fg-muted, #9ca3af)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <ShieldCheck size={13} color="var(--status-success, #059669)" /> Estimated Price
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fg-primary, #111827)' }}>
                ₹{activity.estimatedCost.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.775rem', color: 'var(--status-success, #059669)', fontWeight: 600 }}>
                Verified Bookable Tour
              </span>
            </div>
          </div>

          {/* Location Map info tag */}
          {activity.locationMap && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.825rem',
                color: 'var(--fg-secondary, #4b5563)',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
              }}
            >
              <CheckCircle2 size={16} color="var(--brand-blue, #2563eb)" />
              <span>
                Location maps to <strong>{activity.locationMap.city}</strong> ({activity.locationMap.country})
              </span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onAddToTrip(activity);
              }}
            >
              <Plus size={16} /> Add to Day Plan
            </Button>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
};
