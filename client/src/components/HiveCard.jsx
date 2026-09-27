import React from 'react';
import { Activity, Droplet } from 'lucide-react';

export default function HiveCard({ hive, onLogInspection, onCreateHarvest }) {
  return (
    <div
      className="card"
      style={{
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '1.1rem' }}>{hive.name}</h4>
          <span className="status-badge verified" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
            {hive.status || 'Active'}
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <p><strong>Type:</strong> {hive.hive_type || 'Langstroth'}</p>
          <p style={{ marginTop: '0.2rem' }}><strong>Installed:</strong> {hive.installed_date || 'N/A'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          className="nav-btn"
          onClick={() => onLogInspection(hive)}
          style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', justifyContent: 'center' }}
        >
          <Activity size={14} /> Inspection
        </button>
        <button
          className="btn-primary"
          onClick={() => onCreateHarvest(hive)}
          style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', justifyContent: 'center' }}
        >
          <Droplet size={14} /> Harvest
        </button>
      </div>
    </div>
  );
}
