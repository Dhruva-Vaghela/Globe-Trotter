import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Globe,
  MapPin,
  Search,
  LogOut,
  Settings,
  ChevronDown,
  Compass,
  Sparkles,
  Luggage,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { CommandPalette } from '../ui/CommandPalette';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCity, setSelectedCity] = useState('Goa');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const popularCities = ['Goa', 'Mumbai', 'Delhi', 'Bengaluru', 'Paris', 'Tokyo', 'Bali', 'Rome'];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
      {/* Top Header Row */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo & Location Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                padding: '0.4rem',
                borderRadius: '6px',
                background: '#2563eb',
                color: '#ffffff',
                display: 'flex',
              }}
            >
              <Globe size={20} />
            </div>
            <span
              style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              Globe<span style={{ color: '#e11d48' }}>Trotter</span>
            </span>
          </Link>

          {/* Location Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                color: '#111827',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <MapPin size={15} color="#e11d48" />
              <span>{selectedCity}</span>
              <ChevronDown size={14} color="#6b7280" />
            </button>

            {showLocationModal && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  width: '220px',
                  background: '#ffffff',
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid #e5e7eb',
                  padding: '0.85rem',
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  Select City
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowLocationModal(false);
                      }}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: '4px',
                        background: selectedCity === city ? '#eff6ff' : 'transparent',
                        color: selectedCity === city ? '#2563eb' : '#111827',
                        fontWeight: selectedCity === city ? 700 : 500,
                        fontSize: '0.825rem',
                        textAlign: 'left',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Command Search Trigger */}
        <div style={{ flex: 1, maxWidth: '420px' }}>
          <button
            onClick={() => setIsCommandOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.85rem',
              borderRadius: '6px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={16} color="#9ca3af" />
              <span>Search destinations, experiences...</span>
            </div>
            <kbd
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.1rem 0.35rem',
                borderRadius: '4px',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#6b7280',
              }}
            >
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Command Palette Modal */}
        <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

        {/* Right Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Link
                to="/trips"
                style={{
                  color: isActive('/trips') ? '#2563eb' : '#111827',
                  fontWeight: isActive('/trips') ? 700 : 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Luggage size={16} color={isActive('/trips') ? '#2563eb' : '#4b5563'} /> My Trips
              </Link>

              <Link
                to="/calendar"
                style={{
                  color: isActive('/calendar') ? '#2563eb' : '#111827',
                  fontWeight: isActive('/calendar') ? 700 : 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Compass size={16} color={isActive('/calendar') ? '#2563eb' : '#059669'} /> Calendar
              </Link>

              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.2rem 0.6rem 0.2rem 0.25rem',
                  borderRadius: '6px',
                  background: isActive('/profile') ? '#eff6ff' : '#f3f4f6',
                  border: isActive('/profile') ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                  color: isActive('/profile') ? '#2563eb' : '#111827',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <Avatar src={user?.avatarUrl} name={user?.name} size="sm" />
                <span>{user?.name}</span>
              </Link>

              <Link to="/settings" style={{ color: isActive('/settings') ? '#2563eb' : '#4b5563' }} title="Settings">
                <Settings size={18} />
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogOut size={15} /> Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Product Sub-Header Rail */}
      <div
        style={{
          background: '#ffffff',
          borderTop: '1px solid #f3f4f6',
          padding: '0.4rem 0',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}
      >
        <div
          className="container no-scrollbar"
          style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', overflowX: 'auto' }}
        >
          <Link
            to="/discover"
            style={{
              color: isActive('/discover') ? '#2563eb' : '#4b5563',
              fontWeight: isActive('/discover') ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderBottom: isActive('/discover') ? '2px solid #2563eb' : '2px solid transparent',
              paddingBottom: '0.2rem',
            }}
          >
            <Compass size={15} color={isActive('/discover') ? '#2563eb' : '#6b7280'} /> Destinations
          </Link>

          <Link
            to="/activities"
            style={{
              color: isActive('/activities') ? '#2563eb' : '#4b5563',
              fontWeight: isActive('/activities') ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderBottom: isActive('/activities') ? '2px solid #2563eb' : '2px solid transparent',
              paddingBottom: '0.2rem',
            }}
          >
            <Sparkles size={15} color={isActive('/activities') ? '#2563eb' : '#e11d48'} /> Top Tours & Activities
          </Link>

          <Link
            to="/community"
            style={{
              color: isActive('/community') ? '#2563eb' : '#4b5563',
              fontWeight: isActive('/community') ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderBottom: isActive('/community') ? '2px solid #2563eb' : '2px solid transparent',
              paddingBottom: '0.2rem',
            }}
          >
            <MapPin size={15} color={isActive('/community') ? '#2563eb' : '#059669'} /> Community Itineraries
            <Badge variant="brand">Hot</Badge>
          </Link>
        </div>
      </div>
    </header>
  );
};
