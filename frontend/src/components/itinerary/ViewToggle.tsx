import React from 'react';
import { Layers, GitCommit } from 'lucide-react';

interface ViewToggleProps {
  activeView: 'daywise' | 'timeline';
  onToggle: (view: 'daywise' | 'timeline') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onToggle }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: '#f1f5f9',
        padding: '0.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #e2e8f0',
      }}
    >
      <button
        onClick={() => onToggle('daywise')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          background: activeView === 'daywise' ? '#ffffff' : 'transparent',
          color: activeView === 'daywise' ? 'var(--primary-color)' : 'var(--fg-secondary)',
          fontWeight: activeView === 'daywise' ? 700 : 500,
          boxShadow: activeView === 'daywise' ? 'var(--shadow-sm)' : 'none',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <Layers size={16} /> Day-Wise Accordion
      </button>

      <button
        onClick={() => onToggle('timeline')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          background: activeView === 'timeline' ? '#ffffff' : 'transparent',
          color: activeView === 'timeline' ? 'var(--primary-color)' : 'var(--fg-secondary)',
          fontWeight: activeView === 'timeline' ? 700 : 500,
          boxShadow: activeView === 'timeline' ? 'var(--shadow-sm)' : 'none',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <GitCommit size={16} /> Vertical Timeline
      </button>
    </div>
  );
};
