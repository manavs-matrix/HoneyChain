import React, { useState } from 'react';
import { batchApi } from '../api/apiClient';

export default function PackagingModal({ isOpen, batchId, onClose, onSuccess }) {
  const [lotNumber, setLotNumber] = useState(`LOT-GJ2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [jarSizeG, setJarSizeG] = useState('500');
  const [jarCount, setJarCount] = useState('250');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const packageData = {
      lotNumber,
      jarSizeG: parseInt(jarSizeG, 10),
      jarCount: parseInt(jarCount, 10)
    };

    const res = await batchApi.packageBatch(batchId, packageData);
    setLoading(false);

    if (res.success) {
      onSuccess(res.data);
      onClose();
    } else {
      setError(res.error || 'Failed to record packaging');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', background: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3>Package & Generate Product Lot</h3>
            <p style={{ fontSize: '0.8rem', fontStyle: 'monospace', color: 'var(--text-secondary)' }}>Batch #{batchId}</p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Lot Number</label>
            <input
              type="text"
              className="input-field"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jar Net Weight (Grams)</label>
            <select
              className="input-field"
              value={jarSizeG}
              onChange={(e) => setJarSizeG(e.target.value)}
            >
              <option value="250">250g Jar</option>
              <option value="500">500g Glass Jar (Standard)</option>
              <option value="1000">1000g (1 kg) Bulk Container</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Total Jars Packaged in Lot</label>
            <input
              type="number"
              className="input-field"
              value={jarCount}
              onChange={(e) => setJarCount(e.target.value)}
              required
            />
          </div>

          <div style={{ background: 'var(--bg)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            🔮 <strong>Dual Proof Action:</strong> Appends <code>PACKAGED</code> hash-chain block and anchors batch hash on <strong>Polygon Amoy Testnet</strong>.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="nav-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Packaging & Anchoring...' : 'Package & Anchor On-Chain'}
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
