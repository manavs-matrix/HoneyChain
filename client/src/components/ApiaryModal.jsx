import React, { useState } from 'react';
import { apiaryApi } from '../api/apiClient';

export default function ApiaryModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      setError('Please provide both Apiary Name and Location');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await apiaryApi.create(name.trim(), location.trim());
    setLoading(false);

    if (res.success) {
      setName('');
      setLocation('');
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to create apiary');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', background: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Add New Apiary</h3>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Apiary Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Gir Forest Organic Apiary #4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location (District / State)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Junagadh, Gujarat"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="nav-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Apiary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '1rem'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.25rem',
  cursor: 'pointer',
  color: 'var(--text-secondary)'
};

const errorBannerStyle = {
  background: 'rgba(217, 67, 46, 0.1)',
  color: 'var(--failed)',
  padding: '0.65rem 1rem',
  borderRadius: 'var(--radius-sm)',
  marginBottom: '1rem',
  fontSize: '0.85rem'
};
