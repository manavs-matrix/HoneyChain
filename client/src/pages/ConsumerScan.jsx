import React, { useState } from 'react';
import { QrCode, Search, Sparkles, Camera } from 'lucide-react';

export default function ConsumerScan({ onNavigate }) {
  const [batchIdInput, setBatchIdInput] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (batchIdInput.trim()) {
      onNavigate(`passport/${batchIdInput.trim()}`);
    }
  };

  const handleSimulateCameraScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onNavigate('passport/HC-GJ-2026-000184');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '650px', margin: '2.5rem auto' }}>
      <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            background: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <QrCode size={32} />
        </div>

        <h2 style={{ fontSize: '1.75rem' }}>Honey Passport Verification</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.75rem 0', fontSize: '0.95rem' }}>
          Verify raw honey origin, laboratory test results, and cryptographic hash-chain integrity.
        </p>

        {/* Camera Simulator Box */}
        <div
          style={{
            background: 'var(--bg)',
            border: '2px dashed var(--primary)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem 1.5rem',
            marginBottom: '1.75rem',
            position: 'relative'
          }}
        >
          {scanning ? (
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem' }} className="spin">⚡</div>
              <p style={{ marginTop: '0.75rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                Scanning QR Code... Reading Batch Cryptographic Record
              </p>
            </div>
          ) : (
            <div>
              <Camera size={36} color="var(--primary-dark)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Point Camera at Honey Container QR Code
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: '0.85rem', fontSize: '0.88rem' }}
                onClick={handleSimulateCameraScan}
              >
                <Sparkles size={16} /> Instant Demo QR Scan
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ padding: '0 0.75rem' }}>OR ENTER BATCH ID MANUALLY</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Manual Lookup Form */}
        <form onSubmit={handleSearch}>
          <div className="form-group" style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. HC-GJ-2026-000184"
              value={batchIdInput}
              onChange={(e) => setBatchIdInput(e.target.value)}
              style={{ textAlign: 'center', fontSize: '1.05rem', letterSpacing: '0.05em', marginTop: 0 }}
            />
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
              <Search size={16} /> Verify
            </button>
          </div>
        </form>

        {/* Quick Demo Batch Shortcuts */}
        <div style={{ marginTop: '1.75rem', textAlign: 'left', background: 'var(--bg)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            💡 QUICK DEMO SHORTCUTS (CLICK TO VERIFY):
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className="nav-btn"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
              onClick={() => onNavigate('passport/HC-GJ-2026-000184')}
            >
              Batch #HC-GJ-2026-000184 (Gir Organic)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
