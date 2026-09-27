import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Lightbulb } from 'lucide-react';

export default function AnomalyAlert({ analysis, onClose }) {
  if (!analysis) return null;

  const isAnomaly = analysis.anomaly_detected;
  const isWarning = analysis.severity === 'WARNING';

  return (
    <div
      style={{
        background: isWarning ? 'rgba(217, 67, 46, 0.08)' : (isAnomaly ? 'rgba(232, 163, 61, 0.12)' : 'rgba(47, 158, 68, 0.08)'),
        border: `1.5px solid ${isWarning ? 'var(--failed)' : (isAnomaly ? 'var(--primary)' : 'var(--verified)')}`,
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <div style={{ color: isWarning ? 'var(--failed)' : (isAnomaly ? 'var(--primary-dark)' : 'var(--verified)'), marginTop: '0.15rem' }}>
          {isWarning ? <AlertTriangle size={28} /> : (isAnomaly ? <Info size={28} /> : <CheckCircle2 size={28} />)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '1.1rem', color: isWarning ? 'var(--failed)' : 'var(--text-primary)' }}>
              {isWarning ? 'AI Yield Anomaly Warning' : (isAnomaly ? 'AI Yield Notice' : 'AI Harvest Baseline Analysis')}
            </strong>
            <span
              className={`status-badge ${isWarning ? 'failed' : (isAnomaly ? 'pending' : 'verified')}`}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}
            >
              {analysis.severity || 'NORMAL'}
            </span>
          </div>

          <p style={{ marginTop: '0.4rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {analysis.message}
          </p>

          {/* Statistical Breakdown Bar */}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', background: '#FFFFFF', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
            <span><strong>Harvest Yield:</strong> {analysis.yield_kg} kg</span>
            <span><strong>Historical Baseline Avg:</strong> {analysis.baseline_avg_kg} kg</span>
            {analysis.deviation_pct !== undefined && (
              <span><strong>Deviation:</strong> <span style={{ color: analysis.deviation_pct < 0 ? 'var(--failed)' : 'var(--verified)', fontWeight: 600 }}>{analysis.deviation_pct}%</span></span>
            )}
            {analysis.z_score !== undefined && (
              <span><strong>Z-Score:</strong> {analysis.z_score}</span>
            )}
          </div>

          {/* Advisory Recommendations List */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div style={{ marginTop: '0.85rem', fontSize: '0.85rem' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                <Lightbulb size={16} color="var(--primary-dark)" /> Recommended Beekeeper Actions:
              </strong>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ marginTop: '0.2rem' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
