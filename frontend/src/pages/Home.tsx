import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Clock, Compass, Sparkles, Calendar } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/ui/Badge';
import { Rating } from '../components/ui/Rating';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { CategoryCircle } from '../components/ui/CategoryCircle';
import { apiRequest } from '../utils/apiClient';
import {
  circularCategories,
  indianDestinations,
  globalDestinations,
  bookableActivities,
  trendingItineraries,
} from '../data/discoveryData';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dbActivities, setDbActivities] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDbContent() {
      try {
        const res = await apiRequest('/dashboard/destinations');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbActivities(res.data);
        }
      } catch (err) {
        // Fallback to discoveryData if offline
      }
    }
    fetchDbContent();
  }, []);

  const filterItem = (category: string) => {
    if (selectedCategory === 'all') return true;
    return category.toLowerCase() === selectedCategory.toLowerCase();
  };

  const filteredIndian = indianDestinations.filter((item) => filterItem(item.category));
  const filteredGlobal = globalDestinations.filter((item) => filterItem(item.category));

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* 1. Swiggy / Zomato Style Circular Categories Rail */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1.25rem 0' }}>
        <div className="container">
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.85rem',
            }}
          >
            What are you exploring today?
          </div>

          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '1.25rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
            }}
          >
            <CategoryCircle
              id="all"
              label="All Categories"
              imageUrl="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80"
              isActive={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            />
            {circularCategories.map((cat) => (
              <CategoryCircle
                key={cat.id}
                id={cat.id}
                label={cat.label}
                imageUrl={cat.imageUrl}
                isActive={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area: 100 Cards Across 4 Product Grids */}
      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Section 1: Popular Indian Destinations (25 Cards) */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#e11d48" /> Popular Indian Destinations ({filteredIndian.length})
              </h2>
              <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Top getaway cities, hill stations, and heritage trails across India</p>
            </div>
            <Badge variant="brand">{filteredIndian.length} Destinations</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {filteredIndian.map((dest) => (
              <AnimatedCard key={dest.id} style={{ padding: 0 }}>
                <div style={{ position: 'relative', height: '165px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_COVER;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem' }}>
                    <Badge variant={dest.badgeVariant || 'brand'}>{dest.tag}</Badge>
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>{dest.name}</h3>
                      <span style={{ fontSize: '0.775rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={12} color="#e11d48" /> {dest.country}
                      </span>
                    </div>
                    <Rating value={dest.rating} reviewsCount={dest.reviews} />
                  </div>

                  <p style={{ color: '#4b5563', fontSize: '0.825rem', lineHeight: 1.4, margin: '0.6rem 0 0.85rem', height: '34px', overflow: 'hidden' }}>
                    {dest.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.65rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>Est. Budget</span>
                      <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb' }}>{dest.estimatedPrice}</p>
                    </div>
                    <Button size="sm" variant="brand" onClick={() => navigate('/register')}>
                      <Plus size={14} /> Plan Trip
                    </Button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </section>

        {/* Section 2: Global Destinations & Hotspots (25 Cards) */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} color="#2563eb" /> International Hotspots ({filteredGlobal.length})
              </h2>
              <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Popular world capitals, islands, and alpine mountain retreats</p>
            </div>
            <Badge variant="default">{filteredGlobal.length} Countries</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {filteredGlobal.map((dest) => (
              <AnimatedCard key={dest.id} style={{ padding: 0 }}>
                <div style={{ position: 'relative', height: '165px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_COVER;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem' }}>
                    <Badge variant={dest.badgeVariant || 'default'}>{dest.tag}</Badge>
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>{dest.name}</h3>
                      <span style={{ fontSize: '0.775rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={12} color="#2563eb" /> {dest.country}
                      </span>
                    </div>
                    <Rating value={dest.rating} reviewsCount={dest.reviews} />
                  </div>

                  <p style={{ color: '#4b5563', fontSize: '0.825rem', lineHeight: 1.4, margin: '0.6rem 0 0.85rem', height: '34px', overflow: 'hidden' }}>
                    {dest.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.65rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>Est. Travel Cost</span>
                      <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb' }}>{dest.estimatedPrice}</p>
                    </div>
                    <Button size="sm" variant="primary" onClick={() => navigate('/register')}>
                      <Plus size={14} /> Plan Trip
                    </Button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </section>

        {/* Section 3: Top Bookable Activities & Tours (Live from DB + Discovery) */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#e11d48" /> Top Recommended Experiences & Activities
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Bookable day tours, scuba diving, food walks, and desert safaris from Neon DB</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.15rem' }}>
            {(dbActivities.length > 0 ? dbActivities : bookableActivities).map((act: any) => (
              <AnimatedCard key={act.id} style={{ display: 'flex', gap: '0.85rem', padding: '0.75rem' }}>
                <img
                  src={act.imageUrl || FALLBACK_COVER}
                  alt={act.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_COVER;
                  }}
                  style={{ width: '100px', height: '100px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <Badge variant="default">{act.locationName || act.city || 'Featured'}</Badge>
                      <Rating value={act.rating || 4.8} />
                    </div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>{act.name}</h3>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={11} /> {act.durationMinutes ? `${Math.round(act.durationMinutes / 60)} Hours` : act.duration || '2 Hours'}
                      </span>
                      <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>
                        {act.estimatedCost ? `₹${act.estimatedCost.toLocaleString()}` : act.price}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => navigate('/register')}>
                      + Add
                    </Button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </section>

        {/* Section 4: Trending Community Itineraries (25 Cards) */}
        <section>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="#059669" /> Trending Community Itineraries ({trendingItineraries.length})
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Tested multi-day trip plans created by seasoned travelers</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {trendingItineraries.map((itin) => (
              <AnimatedCard key={itin.id} style={{ padding: 0 }}>
                <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={itin.imageUrl}
                    alt={itin.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_COVER;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem' }}>
                    <Badge variant="success">{itin.days} Days Plan</Badge>
                  </div>
                </div>

                <div style={{ padding: '0.9rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: '0.4rem', height: '40px', overflow: 'hidden' }}>
                    {itin.title}
                  </h3>
                  <span style={{ fontSize: '0.775rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.65rem' }}>
                    <MapPin size={12} color="#059669" /> {itin.location}
                  </span>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.65rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>Total Est. Budget</span>
                      <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>{itin.budget}</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => navigate('/register')}>
                      View Guide
                    </Button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
