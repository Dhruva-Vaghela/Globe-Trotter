import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/apiClient';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Globe, Camera, Upload } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, profileImage }),
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '460px', padding: '3.5rem 1rem' }}>
      <Card style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--brand-red)', color: '#ffffff' }}>
            <Globe size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
            Join GlobeTrotter to plan and book trip experiences
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
          {/* Profile Photo Upload Field */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-secondary)', marginBottom: '0.5rem' }}>
              Profile Photo (Stored on Cloudinary) *
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#f3f4f6',
                  border: '2px dashed #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Camera size={32} color="#94a3b8" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: 'var(--primary-color)',
                  color: '#ffffff',
                  padding: '0.4rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Upload Profile Picture"
              >
                <Upload size={14} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            {profileImage && (
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '0.4rem' }}>
                ✓ Profile image attached (Will upload to Cloudinary)
              </span>
            )}
          </div>

          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <Button type="submit" variant="brand" isLoading={loading} style={{ width: '100%' }}>
            Get Started Free
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
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand-blue)', fontWeight: 700 }}>
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};
