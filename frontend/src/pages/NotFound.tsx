import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div
      className="container animate-fade-in"
      style={{
        textAlign: 'center',
        padding: '5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      <h1 className="gradient-text" style={{ fontSize: '6rem', fontWeight: 900, lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.75rem' }}>Destination Not Found</h2>
      <p style={{ color: 'var(--fg-secondary)', maxWidth: '440px' }}>
        The page or travel route you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
};
