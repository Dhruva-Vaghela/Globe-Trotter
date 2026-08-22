import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Luggage, ArrowLeft } from 'lucide-react';

export const CreateTrip: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('India');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/trips', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          startDate,
          endDate,
          destinationCity,
          destinationCountry,
          totalBudget: totalBudget ? parseFloat(totalBudget) : undefined,
          coverImageUrl,
          isPublic,
        }),
      });

      navigate(`/trips/${res.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '640px', padding: '2.5rem 1.25rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/trips" style={{ color: '#4b5563', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to My Trips
        </Link>
      </div>

      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '6px', background: '#2563eb', color: '#ffffff' }}>
            <Luggage size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Plan New Trip</h1>
            <p style={{ color: '#4b5563', fontSize: '0.85rem' }}>
              Create a custom multi-day itinerary with budget tracking and destination stops.
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#e11d48',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Trip Name"
            placeholder="e.g. Goa Beach Break 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Destination City"
              placeholder="e.g. Goa / Paris / Kyoto"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              required
            />
            <Input
              label="Country"
              placeholder="e.g. India / France / Japan"
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <Input
            label="Total Estimated Budget (₹ / $)"
            type="number"
            placeholder="e.g. 25000"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
          />

          <Input
            label="Cover Image URL (Optional)"
            placeholder="https://images.unsplash.com/photo-..."
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg-secondary)' }}>
              Trip Notes / Description
            </label>
            <textarea
              className="glass-input"
              rows={3}
              style={{ padding: '0.75rem', width: '100%', fontFamily: 'inherit', borderColor: '#cbd5e1' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key highlights or travel notes..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
            />
            <label htmlFor="isPublic" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              Publish itinerary to GlobeTrotter Community Hub
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => navigate('/trips')}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" isLoading={loading}>
              Create Trip Itinerary
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
