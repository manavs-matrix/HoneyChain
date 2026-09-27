import React, { useState } from 'react';
import { batchApi } from '../api/apiClient';

export default function QualityTestModal({ isOpen, batchId, onClose, onSuccess }) {
  const [moisturePct, setMoisturePct] = useState('17.5');
  const [sucrosePct, setSucrosePct] = useState('3.2');
  const [hmfMgKg, setHmfMgKg] = useState('12.4');
  const [status, setStatus] = useState('PASSED');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const testData = {
      moisturePct: parseFloat(moisturePct),
      sucrosePct: parseFloat(sucrosePct),
      hmfMgKg: parseFloat(hmfMgKg),
      status
    };

    const res = await batchApi.recordQualityTest(batchId, testData);
    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to record quality test');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', background: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3>Record Quality Test</h3>
            <p style={{ fontSize: '0.8rem', fontStyle: 'monospace', color: 'var(--text-secondary)' }}>Batch #{batchId}</p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Moisture Content (%) — Standard &lt; 20%</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              value={moisturePct}
              onChange={(e) => setMoisturePct(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sucrose Content (%) — Standard &lt; 5%</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              value={sucrosePct}
              onChange={(e) => setSucrosePct(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">HMF Content (mg/kg) — Standard &lt; 40 mg/kg</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              value={hmfMgKg}
              onChange={(e) => setHmfMgKg(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quality Verification Status</label>
            <select
              className="input-field"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PASSED">PASSED (FSSAI Verified)</option>
              <option value="REJECTED">REJECTED (Adulteration / High Moisture)</option>
            </select>
          </div>

          <div style={{ background: 'var(--bg)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            🔗 <strong>Hash-Chain Action:</strong> Recording quality results appends the <code>QUALITY_VERIFIED</code> cryptographic event block to batch #{batchId}.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="nav-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Record Test & Hash Event'}
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
