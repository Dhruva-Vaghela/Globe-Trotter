import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass, Sparkles, Luggage, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open trigger handled outside
        }
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'Explore Destinations', icon: <Compass size={16} color="var(--brand-blue)" />, path: '/discover' },
    { label: 'Popular Activities & Tours', icon: <Sparkles size={16} color="var(--brand-coral)" />, path: '/discover?category=activities' },
    { label: 'My Travel Trips', icon: <Luggage size={16} color="#10b981" />, path: '/dashboard' },
    { label: 'Community Itineraries', icon: <MapPin size={16} color="var(--brand-red)" />, path: '/community' },
  ];

  const filteredLinks = query
    ? quickLinks.filter((l) => l.label.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          zIndex: 2001,
          animation: 'paletteSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <Search size={18} color="var(--fg-muted)" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search destination..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#0f172a',
              background: 'transparent',
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Links Results */}
        <div style={{ padding: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted)', padding: '0.5rem 0.75rem', textTransform: 'uppercase' }}>
            Quick Navigation
          </div>
          {filteredLinks.length > 0 ? (
            filteredLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--fg-muted)', fontSize: '0.875rem' }}>
              No matching destinations or commands found.
            </div>
          )}
        </div>

        <div style={{ padding: '0.5rem 1rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: 'var(--fg-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Press <strong>ESC</strong> to exit</span>
          <span>GlobeTrotter Command Search</span>
        </div>
      </div>

      <style>{`
        @keyframes paletteSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
