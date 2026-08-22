import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '2.5rem 0',
          textAlign: 'center',
          color: 'var(--fg-muted)',
          fontSize: '0.875rem',
          background: '#ffffff',
          marginTop: '4rem',
        }}
      >
        <div className="container">
          <p style={{ color: 'var(--fg-secondary)', fontWeight: 600 }}>
            GlobeTrotter — Consumer Travel Discovery & Itinerary Platform
          </p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            © {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
