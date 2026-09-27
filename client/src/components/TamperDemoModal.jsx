import React, { useState } from 'react';
import { batchApi } from '../api/apiClient';
import { AlertTriangle, Zap, RotateCcw } from 'lucide-react';

export default function TamperDemoModal({ isOpen, batchId, onClose, onSuccess }) {
  const [eventTypeToMutate, setEventTypeToMutate] = useState('HARVEST_CREATED');
  const [forgedYield, setForgedYield] = useState('999.0');
  const [forgedSource, setForgedSource] = useState('FORGED_PLASTIC_SYRUP');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !batchId) return null;

  const handleTamper = async (presetPayload = null, customEventType = null) => {
    setLoading(true);
    setError(null);

    const evtType = customEventType || eventTypeToMutate;
    const payload = presetPayload || {
      yieldKg: parseFloat(forgedYield) || 999.0,
      floralSource: forgedSource,
      tamperedBy: 'Unauthorised Database Modification'
    };

    const res = await batchApi.tamperDemo(batchId, evtType, payload);
    setLoading(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } else {
      setError(res.error || 'Tamper simulation failed');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '520px', background: '#FFF', padding: '2rem', borderTop: '6px solid var(--failed)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--failed)' }}>
              <AlertTriangle size={22} /> Live Database Tamper Simulation
            </h3>
            <p style={{ fontSize: '0.8rem', fontStyle: 'monospace', color: 'var(--text-secondary)' }}>Target Batch #{batchId}</p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Bypass database access controls to corrupt a committed event's SHA-256 payload hash. Demonstrates live visual detection of cryptographic chain breaking on the Honey Passport.
        </p>

        {/* Quick Demo Presets */}
        <div style={{ background: 'rgba(217, 67, 46, 0.05)', border: '1px dashed var(--failed)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--failed)', marginBottom: '0.65rem' }}>
            ⚡ 1-CLICK DEMO TAMPER PRESETS:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className="btn-danger"
              style={{ fontSize: '0.82rem', padding: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              onClick={() => handleTamper({ yieldKg: 999.0, floralSource: 'FORGED_PLASTIC_SYRUP' }, 'HARVEST_CREATED')}
              disabled={loading}
            >
              <Zap size={14} /> Forge Event #1 (HARVEST_CREATED yield to 999kg)
            </button>

            <button
              className="btn-danger"
              style={{ fontSize: '0.82rem', padding: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#B8321F' }}
              onClick={() => handleTamper({ moisturePct: 45.0, status: 'FAKE_APPROVAL' }, 'QUALITY_VERIFIED')}
              disabled={loading}
            >
              <Zap size={14} /> Forge Event #2 (QUALITY_VERIFIED moisture to 45%)
            </button>
          </div>
        </div>


        {/* Custom Target Selection Form */}
        <div className="form-group">
          <label className="form-label">Target Lifecycle Event Block</label>
          <select
            className="input-field"
            value={eventTypeToMutate}
            onChange={(e) => setEventTypeToMutate(e.target.value)}
          >
            <option value="HARVEST_CREATED">Event #1: HARVEST_CREATED (Harvest Data)</option>
            <option value="QUALITY_VERIFIED">Event #2: QUALITY_VERIFIED (Lab Test Data)</option>
            <option value="PACKAGED">Event #3: PACKAGED (Lot Packaging Data)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="nav-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-danger" onClick={() => handleTamper()} disabled={loading}>
            {loading ? 'Corrupting Hash...' : 'Commit Tamper Attempt'}
          </button>
        </div>
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
