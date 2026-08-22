import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/apiClient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loader } from '../components/common/Loader';
import { Settings as SettingsIcon, Trash2, AlertTriangle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [travelStyle, setTravelStyle] = useState('');

  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await apiRequest('/users/profile');
        if (res.data.preference) {
          setCurrency(res.data.preference.defaultCurrency || 'USD');
          setLanguage(res.data.preference.preferredLanguage || 'en');
          setTravelStyle(res.data.preference.travelStyle || '');
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await apiRequest('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          defaultCurrency: currency,
          preferredLanguage: language,
          travelStyle,
        }),
      });
      setMessage('Preferences saved successfully!');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiRequest('/users/account', { method: 'DELETE' });
      logout();
      navigate('/');
    } catch (err: any) {
      alert(`Account deletion failed: ${err.message}`);
    }
  };

  if (loading) return <Loader message="Loading settings..." />;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem' }}>
        <SettingsIcon size={28} color="#818cf8" />
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Account & System Settings</h1>
      </div>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Regional & Travel Preferences</h2>
        
        {message && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: message.startsWith('Error') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: message.startsWith('Error') ? '#ef4444' : '#10b981',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--fg-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Default Currency
            </label>
            <select
              className="glass-input"
              style={{ width: '100%', padding: '0.65rem 0.85rem' }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD" style={{ background: '#1f2937' }}>USD ($) - US Dollar</option>
              <option value="EUR" style={{ background: '#1f2937' }}>EUR (€) - Euro</option>
              <option value="GBP" style={{ background: '#1f2937' }}>GBP (£) - British Pound</option>
              <option value="INR" style={{ background: '#1f2937' }}>INR (₹) - Indian Rupee</option>
              <option value="JPY" style={{ background: '#1f2937' }}>JPY (¥) - Japanese Yen</option>
              <option value="AUD" style={{ background: '#1f2937' }}>AUD (A$) - Australian Dollar</option>
              <option value="CAD" style={{ background: '#1f2937' }}>CAD (C$) - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--fg-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Preferred Language
            </label>
            <select
              className="glass-input"
              style={{ width: '100%', padding: '0.65rem 0.85rem' }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en" style={{ background: '#1f2937' }}>English</option>
              <option value="es" style={{ background: '#1f2937' }}>Spanish</option>
              <option value="fr" style={{ background: '#1f2937' }}>French</option>
              <option value="de" style={{ background: '#1f2937' }}>German</option>
              <option value="hi" style={{ background: '#1f2937' }}>Hindi</option>
            </select>
          </div>

          <Input
            label="Default Travel Style / Theme"
            placeholder="e.g. Backpacker, Luxury, Solo Adventure, Family"
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" isLoading={saving}>
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} /> Danger Zone
        </h2>
        <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Permanently delete your GlobeTrotter account and all associated trip itineraries, budget logs, and preferences.
        </p>

        {!showDeleteConfirm ? (
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={16} /> Delete Account
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 600 }}>Are you sure? This cannot be undone.</span>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
              Confirm Delete
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
