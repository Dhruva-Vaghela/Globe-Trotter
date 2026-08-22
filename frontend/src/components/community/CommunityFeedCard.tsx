import React, { useState } from 'react';
import { MapPin, Copy, Info } from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../ui/Avatar';

export interface CommunityPostFeedData {
  id: string;
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  startDate: string;
  endDate: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    bio?: string | null;
  };
  stops: { city: string; country: string }[];
  communityPost?: {
    title: string;
    content?: string | null;
  } | null;
  totalSections: number;
  totalActivities: number;
  totalEstCost: number;
}

interface CommunityFeedCardProps {
  post: CommunityPostFeedData;
  onViewItinerary: (post: CommunityPostFeedData) => void;
  onCopyTrip: (post: CommunityPostFeedData) => void;
}

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80';

export const CommunityFeedCard: React.FC<CommunityFeedCardProps> = ({
  post,
  onViewItinerary,
  onCopyTrip,
}) => {
  const [imgSrc, setImgSrc] = useState(post.coverImageUrl || FALLBACK_COVER);

  const durationDays = Math.max(
    1,
    Math.ceil(
      (new Date(post.endDate).getTime() - new Date(post.startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

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
      className="community-card-hover"
    >
      {/* Cover Image Header */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-tertiary, #f3f4f6)',
        }}
      >
        <img
          src={imgSrc}
          alt={post.name}
          onError={() => setImgSrc(FALLBACK_COVER)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Duration Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(17, 24, 39, 0.85)',
            color: '#ffffff',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
          }}
        >
          {durationDays} Days • {post.totalActivities} Activities
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
          gap: '1rem',
        }}
      >
        <div>
          {/* Author Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Avatar name={post.user.name} size="sm" />
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg-primary, #111827)', display: 'block' }}>
                {post.user.name}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--fg-secondary, #4b5563)' }}>
                Shared Travel Story
              </span>
            </div>
          </div>

          {/* Post Title */}
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--fg-primary, #111827)',
              margin: '0 0 0.35rem 0',
              lineHeight: 1.3,
            }}
          >
            {post.communityPost?.title || post.name}
          </h3>

          {/* Story / Description Snippet */}
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--fg-secondary, #4b5563)',
              margin: '0 0 0.75rem 0',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.communityPost?.content || post.description || 'Custom curated trip itinerary shared with the community.'}
          </p>

          {/* City Stops Tags */}
          {post.stops && post.stops.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <MapPin size={13} color="var(--brand-accent, #e11d48)" />
              {post.stops.map((s, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'var(--bg-tertiary, #f3f4f6)',
                    color: 'var(--fg-primary, #111827)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                  }}
                >
                  {s.city}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Spend & CTA Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px dashed var(--border-subtle, #e5e7eb)',
            gap: '0.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted, #9ca3af)', display: 'block' }}>
              Est. Total Budget
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fg-primary, #111827)' }}>
              ₹{post.totalEstCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Button variant="secondary" size="sm" onClick={() => onViewItinerary(post)} style={{ gap: '0.25rem' }}>
              <Info size={14} /> View
            </Button>

            <Button variant="primary" size="sm" onClick={() => onCopyTrip(post)} style={{ gap: '0.25rem' }}>
              <Copy size={14} /> Adopt Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
