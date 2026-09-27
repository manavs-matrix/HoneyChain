import React, { useState } from 'react';
import { hiveApi } from '../api/apiClient';

export default function HiveModal({ isOpen, apiaryId, apiaryName, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [hiveType, setHiveType] = useState('Langstroth');
  const [installedDate, setInstalledDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Hive Name is required');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await hiveApi.create(apiaryId, name.trim(), hiveType, installedDate);
    setLoading(false);

    if (res.success) {
      setName('');
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to create hive');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', background: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3>Add New Hive</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Apiary: {apiaryName}</p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Hive Designation / Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Hive Alpha-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hive Type</label>
            <select
              className="input-field"
              value={hiveType}
              onChange={(e) => setHiveType(e.target.value)}
            >
              <option value="Langstroth">Langstroth (Standard)</option>
              <option value="Top-Bar">Top-Bar</option>
              <option value="Warre">Warré</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Installation Date</label>
            <input
              type="date"
              className="input-field"
              value={installedDate}
              onChange={(e) => setInstalledDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="nav-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Hive'}
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
