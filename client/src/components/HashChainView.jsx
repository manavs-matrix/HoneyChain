import React from 'react';
import { Link2, ShieldCheck, ShieldAlert, ExternalLink } from 'lucide-react';

export default function HashChainView({ events = [], isVerified = true, reason, failedAtEventId }) {
  return (
    <div className="card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3>🔗 Cryptographic Hash-Chain Ledger</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Linked SHA-256 event blocks verifying honey batch provenance immutability
          </p>
        </div>

        <span className={`status-badge ${isVerified ? 'verified' : 'failed'}`}>
          {isVerified ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
          {isVerified ? 'CHAIN INTEGRITY VERIFIED' : 'INTEGRITY FAILED'}
        </span>
      </div>

      {!isVerified && reason && (
        <div style={{ background: 'rgba(217, 67, 46, 0.1)', border: '1px solid var(--failed)', color: 'var(--failed)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          <strong>⚠️ Hash Mismatch Detected:</strong> {reason}
        </div>
      )}

      {events.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No hash-chain events recorded for this batch.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
          {events.map((ev, index) => {
            const isFailedBlock = !isVerified && ev.event_id === failedAtEventId;
            const hasTxHash = Boolean(ev.tx_hash);
            const explorerUrl = hasTxHash ? `https://amoy.polygonscan.com/tx/${ev.tx_hash}` : null;

            return (
              <div
                key={ev.event_id || index}
                style={{
                  background: isFailedBlock ? 'rgba(217, 67, 46, 0.05)' : 'var(--bg)',
                  border: `1.5px solid ${isFailedBlock ? 'var(--failed)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  position: 'relative'
                }}
              >
                {/* Event Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary-dark)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      #{index + 1}
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{ev.event_type}</strong>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </div>

                {/* Actor */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  👤 <strong>Actor:</strong> {ev.actor || 'System'}
                </p>

                {/* Hashes Block */}
                <div style={{ background: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', color: isFailedBlock ? 'var(--failed)' : 'var(--text-primary)' }}>
                    <strong style={{ minWidth: '130px', color: 'var(--text-secondary)' }}>Data Payload Hash:</strong>
                    <span style={{ wordBreak: 'break-all', fontWeight: 600 }}>{ev.data_hash}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ minWidth: '130px' }}>Previous Link Hash:</strong>
                    <span style={{ wordBreak: 'break-all' }}>{ev.previous_event_hash}</span>
                  </div>
                </div>

                {/* Polygon Amoy Anchoring Proof */}
                {hasTxHash && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--verified)' }}>
                    <span className="status-badge verified" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                      POLYGON AMOY ANCHORED
                    </span>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary-dark)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                    >
                      View Tx: {ev.tx_hash.substring(0, 16)}... <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
