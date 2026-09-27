import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink, Copy, Check } from 'lucide-react';

export default function QRDisplayModal({ isOpen, batchId, lotNumber, onClose, onSimulateScan }) {
  const [copied, setCopied] = React.useState(false);
  if (!isOpen || !batchId) return null;

  const passportUrl = `${window.location.origin}/passport/${batchId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', background: '#FFF', textAlign: 'center', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>🍯 Product Lot QR Code</h3>
            {lotNumber && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lot: {lotNumber}</p>}
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {/* QR Code Container */}
        <div
          style={{
            background: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--primary-light)',
            display: 'inline-block',
            margin: '1rem 0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <QRCodeSVG
            value={passportUrl}
            size={200}
            bgColor={"#FFFFFF"}
            fgColor={"#2B2118"}
            level={"H"}
            includeMargin={true}
          />
          <p style={{ marginTop: '0.75rem', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
            #{batchId}
          </p>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Scan with a smartphone camera or use the instant button below for demo verification.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={() => {
              onClose();
              if (onSimulateScan) onSimulateScan(batchId);
            }}
          >
            <ExternalLink size={16} /> Simulate Scan → Open Honey Passport
          </button>

          <button
            className="nav-btn"
            style={{ width: '100%', padding: '0.6rem', justifyContent: 'center' }}
            onClick={handleCopy}
          >
            {copied ? <Check size={16} color="var(--verified)" /> : <Copy size={16} />}
            {copied ? 'Link Copied!' : 'Copy Passport URL'}
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
