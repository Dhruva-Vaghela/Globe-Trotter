import React, { useState } from 'react';
import { MapPin, Star, Plus } from 'lucide-react';
import { AnimatedCard } from '../ui/AnimatedCard';
import { Button } from '../common/Button';
import { Badge } from '../ui/Badge';

export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  imageUrl: string;
  rating: number;
  estimatedDailyCost: number;
  tags: string[];
}

interface DestinationCardProps {
  destination: DestinationItem;
  onAddToTrip: (destination: DestinationItem) => void;
  onViewDetails?: (destination: DestinationItem) => void;
}

const DEFAULT_FALLBACK_COVER =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onAddToTrip,
  onViewDetails,
}) => {
  const [imgSrc, setImgSrc] = useState(destination.imageUrl || DEFAULT_FALLBACK_COVER);

  const handleImageError = () => {
    setImgSrc(DEFAULT_FALLBACK_COVER);
  };

  return (
    <AnimatedCard
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 'var(--radius-sm)',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* Cover Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '210px',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
        }}
      >
        <img
          src={imgSrc}
          alt={destination.name}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />

        {/* Region / Country Pill */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(17, 24, 39, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          <MapPin size={12} color="#e11d48" />
          <span>{destination.country}</span>
        </div>

        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: '#ffffff',
            color: '#111827',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.775rem',
            fontWeight: 700,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span>{destination.rating.toFixed(1)}</span>
        </div>

        {/* Daily Cost Overlay Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            background: '#2563eb',
            color: '#ffffff',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          ${destination.estimatedDailyCost}/day
        </div>
      </div>

      {/* Card Content Body */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Destination Title & Region */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '0.35rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.01em',
                lineHeight: 1.25,
              }}
            >
              {destination.name}
            </h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
              {destination.region}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '0.875rem',
              color: '#4b5563',
              lineHeight: 1.45,
              marginBottom: '0.85rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {destination.description}
          </p>

          {/* Tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              marginBottom: '1.15rem',
            }}
          >
            {destination.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid #f3f4f6',
          }}
        >
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToTrip(destination)}
            style={{
              flex: 1,
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              fontWeight: 700,
              background: '#2563eb',
            }}
          >
            <Plus size={16} /> Add to Trip
          </Button>

          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(destination)}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Details
            </Button>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
};
