import React, { useState } from 'react';
import { harvestApi } from '../api/apiClient';
import AnomalyAlert from './AnomalyAlert';
import { Sparkles } from 'lucide-react';

export default function HarvestModal({ isOpen, hiveId, hiveName, onClose, onSuccess }) {
  const [yieldKg, setYieldKg] = useState('');
  const [floralSource, setFloralSource] = useState('Gir Wildflower & Mustard');
  const [notes, setNotes] = useState('');
  const [previewAnalysis, setPreviewAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePreviewAI = async () => {
    const parsedYield = parseFloat(yieldKg);
    if (isNaN(parsedYield) || parsedYield <= 0) {
      setError('Enter a valid yield (kg) to preview AI analysis');
      return;
    }

    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/detect-anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hive_id: hiveId || 'preview-hive',
          yield_kg: parsedYield,
          floral_source: floralSource,
          hive_type: 'Langstroth'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPreviewAnalysis(data);
      }
    } catch {
      setError('Could not reach AI microservice for live preview');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedYield = parseFloat(yieldKg);
    if (isNaN(parsedYield) || parsedYield <= 0) {
      setError('Please enter a valid harvest yield in kg');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await harvestApi.create(hiveId, parsedYield, floralSource, notes);
    setLoading(false);

    if (res.success) {
      setYieldKg('');
      setNotes('');
      setPreviewAnalysis(null);
      onSuccess(res.data);
      onClose();
    } else {
      setError(res.error || 'Failed to record harvest');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '540px', background: '#FFF', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3>Record Honey Harvest</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Hive: {hiveName}</p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Harvest Yield (kg)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                step="0.1"
                className="input-field"
                placeholder="e.g. 18.5"
                value={yieldKg}
                onChange={(e) => setYieldKg(e.target.value)}
                required
                style={{ marginTop: 0 }}
              />
              <button
                type="button"
                className="nav-btn"
                onClick={handlePreviewAI}
                style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', borderColor: 'var(--primary-dark)', color: 'var(--primary-dark)' }}
              >
                <Sparkles size={14} /> Preview AI Flag
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Floral Source</label>
            <select
              className="input-field"
              value={floralSource}
              onChange={(e) => setFloralSource(e.target.value)}
            >
              <option value="Gir Wildflower & Mustard">Gir Wildflower & Mustard</option>
              <option value="Acacia Monofloral">Acacia Monofloral</option>
              <option value="Eucalyptus Flora">Eucalyptus Flora</option>
              <option value="Siddhpur Neem Blossom">Siddhpur Neem Blossom</option>
              <option value="Multifloral Organic">Multifloral Organic</option>
            </select>
          </div>

          {/* AI Preview Alert if triggered */}
          {previewAnalysis && (
            <AnomalyAlert analysis={previewAnalysis} onClose={() => setPreviewAnalysis(null)} />
          )}

          <div className="form-group">
            <label className="form-label">Extraction / Batch Notes</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="e.g. Frame capping 90% complete, cold centrifugal extraction..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ background: 'var(--bg)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            ⚡ <strong>Automated Actions:</strong> Saving this harvest generates a unique Batch ID, appends the initial <code>HARVEST_CREATED</code> Hash-Chain event, and triggers AI yield anomaly verification.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="nav-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Batch...' : 'Record & Create Batch'}
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
