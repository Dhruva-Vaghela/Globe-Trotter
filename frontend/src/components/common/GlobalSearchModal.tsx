import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils/apiClient';
import { Search, MapPin, Compass, Map, MessageSquare, X } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({ trips: [], destinations: [], activities: [], posts: [] });

  useEffect(() => {
    if (query.trim().length >= 2) {
      const timer = setTimeout(() => {
        performSearch(query);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults({ trips: [], destinations: [], activities: [], posts: [] });
    }
  }, [query]);

  const performSearch = async (q: string) => {
    try {
      setLoading(true);
      const res = await apiRequest(`/search?q=${encodeURIComponent(q)}`);
      if (res.success) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Global search error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '620px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <Search size={20} color="var(--primary-color)" style={{ marginRight: '0.75rem' }} />
          <input
            type="text"
            autoFocus
            placeholder="Search trips, destinations, activities, community..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#0f172a',
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1rem' }}>
          {loading && <p style={{ textAlign: 'center', color: 'var(--fg-muted)', margin: '1.5rem 0' }}>Searching...</p>}

          {!loading && query.trim().length < 2 && (
            <p style={{ textAlign: 'center', color: 'var(--fg-muted)', fontSize: '0.9rem', margin: '1.5rem 0' }}>
              Type at least 2 characters to search across Globe-Trotter...
            </p>
          )}

          {!loading && query.trim().length >= 2 && (
            <div>
              {/* Trips */}
              {results.trips.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Trips
                  </div>
                  {results.trips.map((t: any) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        navigate(`/trips/${t.id}`);
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <Map size={16} color="#0284c7" />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--fg-muted)' }}>{t.description || 'Saved trip plan'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Destinations */}
              {results.destinations.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Destinations
                  </div>
                  {results.destinations.map((d: any) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        navigate('/discover');
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <MapPin size={16} color="#d97706" />
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                        {d.name}, {d.country}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Activities */}
              {results.activities.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Activities & Experiences
                  </div>
                  {results.activities.map((a: any) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        navigate('/activities');
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <Compass size={16} color="#4f46e5" />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{a.name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--fg-muted)' }}>{a.locationName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts */}
              {results.posts.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Community Posts
                  </div>
                  {results.posts.map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        navigate('/community');
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <MessageSquare size={16} color="#059669" />
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
