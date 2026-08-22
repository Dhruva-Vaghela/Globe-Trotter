import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiClient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loader } from '../components/common/Loader';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Mail, Shield, Calendar, Edit3, Sparkles } from 'lucide-react';

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await apiRequest('/users/profile');
      setProfile(res.data);
      setName(res.data.name || '');
      setBio(res.data.bio || '');
      setAvatarUrl(res.data.avatarUrl || '');
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, bio, avatarUrl }),
      });
      setProfile(res.data);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading profile..." />;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', padding: '2rem 1.5rem' }}>
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Avatar src={profile?.avatarUrl} name={profile?.name} size="lg" status="online" />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{profile?.name}</h1>
                  <Badge variant="brand">{profile?.role}</Badge>
                </div>
                <p style={{ color: 'var(--fg-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <Mail size={16} /> {profile?.email}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} /> Edit Profile
              </Button>
            </div>

            <p style={{ marginTop: '1rem', color: 'var(--fg-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {profile?.bio || 'No bio provided yet. Click Edit Profile to add your travel bio.'}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
                <Shield size={16} color="var(--brand-blue)" /> Status: <strong style={{ color: 'var(--fg-primary)' }}>Verified Account</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
                <Calendar size={16} color="#10b981" /> Member Since: <strong style={{ color: 'var(--fg-primary)' }}>{new Date(profile?.createdAt).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: message.startsWith('Error') ? '#fef2f2' : '#ecfdf5',
              color: message.startsWith('Error') ? '#ef4444' : '#10b981',
              fontSize: '0.9rem',
            }}
          >
            {message}
          </div>
        )}
      </Card>

      {/* Edit Profile Shadcn Style Dialog Modal */}
      <Dialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Personal Profile"
        description="Update your display name, bio, and avatar image URL."
      >
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Avatar Image URL (Optional)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg-secondary)' }}>
              Bio & Travel Interests
            </label>
            <textarea
              className="glass-input"
              rows={3}
              style={{ padding: '0.75rem', width: '100%', fontFamily: 'inherit', borderColor: '#cbd5e1' }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your favorite travel destinations or travel style..."
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" isLoading={saving}>
              Save Profile
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Travel Preferences Card */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles color="var(--brand-coral)" size={20} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Travel Preferences</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', fontWeight: 600 }}>Default Currency</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>{profile?.preference?.defaultCurrency || 'USD'}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', fontWeight: 600 }}>Preferred Language</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>{profile?.preference?.preferredLanguage?.toUpperCase() || 'EN'}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', fontWeight: 600 }}>Travel Style</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>{profile?.preference?.travelStyle || 'General Exploring'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
