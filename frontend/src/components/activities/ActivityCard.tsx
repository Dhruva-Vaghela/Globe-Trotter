import React, { useState } from 'react';
import { Star, MapPin, Clock, Plus, Info } from 'lucide-react';
import { Button } from '../common/Button';

export interface ActivityCardData {
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
    iconName?: string | null;
  } | null;
}

interface ActivityCardProps {
  activity: ActivityCardData;
  onViewDetails: (activity: ActivityCardData) => void;
  onAddToTrip: (activity: ActivityCardData) => void;
}

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onViewDetails,
  onAddToTrip,
}) => {
  const [imgSrc, setImgSrc] = useState(activity.imageUrl || FALLBACK_COVER);

  const formatDuration = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hrs > 0 && remainingMins > 0) return `${hrs}h ${remainingMins}m`;
    if (hrs > 0) return `${hrs} Hour${hrs > 1 ? 's' : ''}`;
    return `${remainingMins} Mins`;
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-sm, 6px)',
        border: '1px solid var(--border-subtle, #e5e7eb)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="activity-card-hover"
    >
      {/* Thumbnail Image Header */}
      <div
        style={{
          position: 'relative',
          height: '180px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-tertiary, #f3f4f6)',
        }}
      >
        <img
          src={imgSrc}
          alt={activity.name}
          onError={() => setImgSrc(FALLBACK_COVER)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />

        {/* Category Pill Tag Overlay */}
        {activity.category && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(17, 24, 39, 0.75)',
              color: '#ffffff',
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              fontSize: '0.725rem',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}
          >
            {activity.category.name}
          </div>
        )}

        {/* Rating Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: '#ffffff',
            color: 'var(--fg-primary, #111827)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.775rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Star size={13} color="#f59e0b" fill="#f59e0b" />
          <span>{activity.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div>
          {/* Location Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.775rem',
              fontWeight: 600,
              color: 'var(--brand-accent, #e11d48)',
              marginBottom: '0.35rem',
            }}
          >
            <MapPin size={13} />
            <span>{activity.locationName}</span>
          </div>

          {/* Activity Title */}
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--fg-primary, #111827)',
              lineHeight: 1.3,
              margin: '0 0 0.4rem 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {activity.name}
          </h3>

          {/* Short Description */}
          {activity.description && (
            <p
              style={{
                fontSize: '0.825rem',
                color: 'var(--fg-secondary, #4b5563)',
                margin: 0,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {activity.description}
            </p>
          )}
        </div>

        {/* Duration & Price Meta Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            borderTop: '1px dashed var(--border-subtle, #e5e7eb)',
          }}
        >
          {/* Duration Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--fg-secondary, #4b5563)',
            }}
          >
            <Clock size={14} color="var(--brand-blue, #2563eb)" />
            <span>{formatDuration(activity.durationMinutes)}</span>
          </div>

          {/* Price Tag */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted, #9ca3af)', display: 'block' }}>
              Est. Cost
            </span>
            <span
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--fg-primary, #111827)',
              }}
            >
              ₹{activity.estimatedCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* CTA Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(activity)}
            style={{ flex: '0 0 auto', padding: '0.4rem 0.6rem' }}
            title="View Details"
          >
            <Info size={15} />
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToTrip(activity)}
            style={{
              flex: 1,
              borderRadius: 'var(--radius-sm, 6px)',
              fontWeight: 600,
              fontSize: '0.825rem',
            }}
          >
            <Plus size={15} /> Add to Trip
          </Button>
        </div>
      </div>
    </div>
  );
};
