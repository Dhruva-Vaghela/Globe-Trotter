import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { apiRequest } from '../../utils/apiClient';
import { Share2, Copy, Check, Lock, Globe } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  isPublic?: boolean;
  onPublicStatusChange?: (isPublic: boolean) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  tripId,
  isPublic = false,
  onPublicStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && tripId) {
      setError('');
      setCopied(false);
      if (isPublic) {
        handleGenerateShareLink();
      } else {
        setShareUrl('');
      }
    }
  }, [isOpen, tripId, isPublic]);

  const handleGenerateShareLink = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiRequest(`/trips/${tripId}/share`, {
        method: 'POST',
      });
      if (res.success && res.data?.shareToken) {
        const fullUrl = `${window.location.origin}/share/${res.data.shareToken}`;
        setShareUrl(fullUrl);
        if (onPublicStatusChange) onPublicStatusChange(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeShareLink = async () => {
    try {
      setLoading(true);
      setError('');
      await apiRequest(`/trips/${tripId}/share`, {
        method: 'DELETE',
      });
      setShareUrl('');
      if (onPublicStatusChange) onPublicStatusChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to revoke share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Share Itinerary"
      description="Publish a read-only public share link to share your trip with friends or the community."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && (
          <div
            style={{
              padding: '0.65rem 0.9rem',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: 'var(--radius-sm)',
              color: '#dc2626',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {shareUrl ? (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                color: '#059669',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              <Globe size={16} /> Public Sharing Active
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  background: '#f8fafc',
                }}
              />
              <button
                onClick={handleCopy}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={handleRevokeShareLink}
                disabled={loading}
                style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Lock size={14} /> Make Private / Revoke Link
              </button>

              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <Share2 size={42} color="var(--primary-color)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, color: '#0f172a' }}>
              This trip is currently private
            </h3>
            <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 1.5rem auto' }}>
              Generating a public link will allow anyone with the link to view your trip in read-only mode and copy it to their account.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.6rem 1.1rem',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Keep Private
              </button>
              <button
                onClick={handleGenerateShareLink}
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '0.6rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Globe size={16} /> Generate Share Link
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
