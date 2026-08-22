import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Loader } from '../components/common/Loader';
import { PublicItineraryCard } from '../components/itinerary/PublicItineraryCard';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Compass } from 'lucide-react';

export const PublicItinerary: React.FC = () => {
  const { token, id: tripId } = useParams<{ token?: string; id?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publicData, setPublicData] = useState<any>(null);
  const [isCopying, setIsCopying] = useState(false);

  const identifier = token || tripId;

  useEffect(() => {
    if (identifier) {
      loadPublicItinerary();
    }
  }, [identifier]);

  const loadPublicItinerary = async () => {
    try {
      setLoading(true);
      setError('');

      const endpoint = token
        ? `/public/trips/share/${token}`
        : `/public/trips/${tripId}`;

      const res = await apiRequest(endpoint);
      if (res.success) {
        setPublicData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Public itinerary not found or access revoked');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    if (!isAuthenticated) {
      alert('Please log in or register to copy this trip to your workspace!');
      navigate('/login');
      return;
    }

    try {
      setIsCopying(true);
      const res = await apiRequest(`/public/trips/${identifier}/copy`, {
        method: 'POST',
      });
      if (res.success && res.data?.clonedTripId) {
        alert('Trip copied successfully to your workspace!');
        navigate(`/trips/${res.data.clonedTripId}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to copy trip');
    } finally {
      setIsCopying(false);
    }
  };

  if (loading) {
    return <Loader message="Loading Public Itinerary..." />;
  }

  if (error || !publicData) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '1.5rem', textAlign: 'center' }}>
        <Compass size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#0f172a', fontWeight: 800 }}>Public Itinerary Unavailable</h2>
        <p style={{ color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>
          {error || 'This itinerary is private or the share link has been revoked by the owner.'}
        </p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '1.5rem' }}>
      <button
        onClick={() => navigate('/discover')}
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
        <ArrowLeft size={16} /> Discover More Trips
      </button>

      <PublicItineraryCard
        owner={publicData.owner}
        trip={publicData.trip}
        sections={publicData.sections}
        onCopyTrip={handleCopyTrip}
        isCopying={isCopying}
      />
    </div>
  );
};
