import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { KeyRound, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage('Password reset token generated successfully.');
      setResetToken(res.data.token);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '460px', padding: '3rem 1rem' }}>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <KeyRound size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Forgot Password</h2>
          <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
            Enter your account email to receive a password reset token.
          </p>
        </div>

        {message && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: message.startsWith('Error') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: message.startsWith('Error') ? '#ef4444' : '#10b981',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Account Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" isLoading={loading} style={{ width: '100%' }}>
            Request Reset Token
          </Button>
        </form>

        {resetToken && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(31, 41, 55, 0.8)', border: '1px solid var(--border-glow)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', display: 'block' }}>Demo Reset Link / Token:</span>
            <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`} style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', wordBreak: 'break-all' }}>
              Click here to Reset Password
            </Link>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--fg-secondary)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
