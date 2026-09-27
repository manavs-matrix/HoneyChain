import React, { useEffect, useState } from 'react';
import { consumerApi, batchApi } from '../api/apiClient';
import HashChainView from '../components/HashChainView';
import CustodyTimeline from '../components/CustodyTimeline';
import QRDisplayModal from '../components/QRDisplayModal';
import TamperDemoModal from '../components/TamperDemoModal';
import { Award, Box, QrCode, Zap, RotateCcw, AlertTriangle } from 'lucide-react';

export default function HoneyPassport({ batchId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTamperModal, setShowTamperModal] = useState(false);
  const [restoring, setRestoring] = useState(false);

  async function fetchPassport() {
    setLoading(true);
    setError(null);
    const res = await consumerApi.getPassport(batchId);
    if (res.success && res.data) {
      setData(res.data);
    } else {
      setError(res.error || 'Failed to retrieve Honey Passport');
    }
    setLoading(false);
  }

  useEffect(() => {
    if (batchId) {
      fetchPassport();
    }
  }, [batchId]);

  const handleRestoreTamper = async () => {
    setRestoring(true);
    await batchApi.restoreTamper(batchId);
    await fetchPassport();
    setRestoring(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '2.5rem' }}>⏳</div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Verifying Honey Passport cryptographic chain integrity...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', borderColor: 'var(--failed)' }}>
        <div className="status-badge failed" style={{ marginBottom: '1rem' }}>
          Batch Not Found
        </div>
        <h3>No Passport Record</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{error}</p>
      </div>
    );
  }

  const { passport, integrityVerification } = data;
  const isVerified = integrityVerification.isVerified;

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto' }}>
      {/* Top Banner Status Badge per Design.md */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '2.5rem 2rem 1.75rem 2rem',
          marginBottom: '1.5rem',
          borderTop: `6px solid ${isVerified ? 'var(--verified)' : 'var(--failed)'}`,
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            className="nav-btn"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode size={14} /> QR
          </button>

          {!isVerified ? (
            <button
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              onClick={handleRestoreTamper}
              disabled={restoring}
            >
              <RotateCcw size={14} /> Restore Integrity
            </button>
          ) : (
            <button
              className="btn-danger"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              onClick={() => setShowTamperModal(true)}
            >
              <Zap size={14} /> Simulate Tamper
            </button>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <span className={`status-badge ${isVerified ? 'verified' : 'failed'}`} style={{ fontSize: '1rem', padding: '0.5rem 1.25rem' }}>
            {isVerified ? '✓ VERIFIED HONEY PASSPORT' : '⚠️ INTEGRITY VERIFICATION FAILED'}
          </span>
        </div>

        <h1 style={{ fontSize: '2rem' }}>Honey Passport</h1>
        <p style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: 'var(--primary-dark)', fontWeight: 700, marginTop: '0.2rem' }}>
          Batch #{passport.batchId}
        </p>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.75rem', maxWidth: '600px', margin: '0.75rem auto 0 auto' }}>
          {integrityVerification.reason}
        </p>
      </div>

      {/* Red Alert Callout if Tampered */}
      {!isVerified && (
        <div
          style={{
            background: 'rgba(217, 67, 46, 0.08)',
            border: '2px solid var(--failed)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <AlertTriangle size={28} color="var(--failed)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <h4 style={{ color: 'var(--failed)', fontSize: '1.1rem' }}>Cryptographic Tamper Alert Detected</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              One or more committed historical records for this honey batch have been altered outside the supply-chain protocol. The SHA-256 hash mismatch invalidates the chain.
            </p>
            <button
              className="btn-primary"
              style={{ marginTop: '0.85rem', fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
              onClick={handleRestoreTamper}
              disabled={restoring}
            >
              <RotateCcw size={14} /> Restore Original Chain Data
            </button>
          </div>
        </div>
      )}

      {/* Grid: Origin, Harvest, Quality, Packaging */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Origin & Beekeeper */}
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📍 Origin & Beekeeper
          </h3>
          <p><strong>Beekeeper:</strong> {passport.origin.beekeeper}</p>
          <p style={{ marginTop: '0.4rem' }}><strong>Apiary:</strong> {passport.origin.apiary}</p>
          <p style={{ marginTop: '0.4rem' }}><strong>Hive:</strong> {passport.origin.hive}</p>
          <p style={{ marginTop: '0.4rem' }}><strong>Location:</strong> {passport.origin.location}</p>
        </div>

        {/* Harvest Details */}
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🌸 Harvest Extraction
          </h3>
          <p><strong>Harvest Date:</strong> {passport.harvest.date}</p>
          <p style={{ marginTop: '0.4rem' }}><strong>Yield:</strong> {passport.harvest.yieldKg} kg</p>
          <p style={{ marginTop: '0.4rem' }}><strong>Floral Source:</strong> {passport.harvest.floralSource}</p>
          {passport.harvest.notes && (
            <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Notes:</strong> {passport.harvest.notes}
            </p>
          )}
        </div>

        {/* Quality Lab Results */}
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--primary-dark)" /> Laboratory Quality Test
          </h3>
          {passport.qualityTest ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span><strong>Status:</strong></span>
                <span className="status-badge verified" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                  {passport.qualityTest.status || 'PASSED'}
                </span>
              </div>
              <p style={{ marginTop: '0.4rem' }}><strong>Moisture:</strong> {passport.qualityTest.moisture_pct}% (Std &lt; 20%)</p>
              <p style={{ marginTop: '0.4rem' }}><strong>Sucrose:</strong> {passport.qualityTest.sucrose_pct}% (Std &lt; 5%)</p>
              <p style={{ marginTop: '0.4rem' }}><strong>HMF Level:</strong> {passport.qualityTest.hmf_mg_kg} mg/kg</p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Quality test pending lab upload.
            </p>
          )}
        </div>

        {/* Packaging Details */}
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box size={18} color="var(--primary-dark)" /> Packaging & Product Lot
          </h3>
          {passport.packaging ? (
            <div>
              <p><strong>Product Lot Number:</strong> <code style={{ color: 'var(--primary-dark)' }}>{passport.packaging.lot_number}</code></p>
              <p style={{ marginTop: '0.4rem' }}><strong>Jar Net Weight:</strong> {passport.packaging.jar_size_g}g</p>
              <p style={{ marginTop: '0.4rem' }}><strong>Lot Jar Quantity:</strong> {passport.packaging.jar_count} Jars</p>
              <p style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Packaged on: {new Date(passport.packaging.packaged_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Batch packaging pending processing facility.
            </p>
          )}
        </div>
      </div>

      {/* Custody Timeline Visualization */}
      <CustodyTimeline passport={passport} />

      {/* Visual Hash-Chain Ledger View */}
      <HashChainView
        events={integrityVerification.events}
        isVerified={integrityVerification.isVerified}
        reason={integrityVerification.reason}
        failedAtEventId={integrityVerification.failedAtEventId}
      />

      {/* Modals */}
      <QRDisplayModal
        isOpen={showQrModal}
        batchId={passport.batchId}
        lotNumber={passport.packaging?.lot_number}
        onClose={() => setShowQrModal(false)}
      />

      <TamperDemoModal
        isOpen={showTamperModal}
        batchId={passport.batchId}
        onClose={() => setShowTamperModal(false)}
        onSuccess={fetchPassport}
      />
    </div>
  );
}
