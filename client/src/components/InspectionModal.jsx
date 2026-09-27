import React, { useState } from 'react';
import { inspectionApi } from '../api/apiClient';

export default function InspectionModal({ isOpen, hiveId, hiveName, onClose, onSuccess }) {
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [queenPresent, setQueenPresent] = useState(true);
  const [honeyStores, setHoneyStores] = useState('High');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await inspectionApi.create(hiveId, healthStatus, queenPresent, honeyStores, notes);
    setLoading(false);

    if (res.success) {
      setNotes('');
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to log inspection');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', background: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3>Log Hive Inspection</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target: {hiveName}</p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Colony Health Status</label>
            <select
              className="input-field"
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}
            >
              <option value="Healthy">Healthy (Optimal)</option>
              <option value="Monitoring">Monitoring Needed</option>
              <option value="Weak">Weak / Low Population</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
            <input
              type="checkbox"
              id="queenCheck"
              checked={queenPresent}
              onChange={(e) => setQueenPresent(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="queenCheck" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              Queen Present & Egg Lying Confirmed
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Honey Stores Level</label>
            <select
              className="input-field"
              value={honeyStores}
              onChange={(e) => setHoneyStores(e.target.value)}
            >
              <option value="High">High (Full Frames)</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low (Requires Supplemental Feeding)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Field Inspection Notes</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="e.g. Strong brood pattern, nectar flow active, no varroa mite signs..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="nav-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging...' : 'Save Inspection'}
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
