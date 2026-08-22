import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/apiClient';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Globe } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const loggedUser = res.data.user;
      login(res.data.token, loggedUser);
      if (loggedUser?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '440px', padding: '3.5rem 1rem' }}>
      <Card style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--brand-blue)', color: '#ffffff' }}>
            <Globe size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
            Sign in to manage your GlobeTrotter trips
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
            <Link to="/forgot-password" style={{ color: 'var(--brand-blue)', fontSize: '0.85rem', fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" isLoading={loading} style={{ width: '100%' }}>
            Sign In
          </Button>
        </form>

        <p
          style={{
            color: 'var(--fg-muted)',
            fontSize: '0.875rem',
            marginTop: '1.5rem',
            textAlign: 'center',
          }}
        >
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--brand-red)', fontWeight: 700 }}>
            Create Account
          </Link>
        </p>
      </Card>
    </div>
  );
};
