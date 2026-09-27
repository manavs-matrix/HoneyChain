import React from 'react';
import { CheckCircle2, Clock, MapPin, Award, Package, Truck, UserCheck } from 'lucide-react';

export default function CustodyTimeline({ passport }) {
  if (!passport) return null;

  const hasQuality = Boolean(passport.qualityTest);
  const hasPackaging = Boolean(passport.packaging);
  const hasCustody = Boolean(passport.custodyJourney && passport.custodyJourney.length > 0);

  const stages = [
    {
      id: 'harvest',
      title: 'Apiary Origin & Harvest',
      subtitle: `${passport.origin.apiary} (${passport.origin.location})`,
      detail: `Harvested ${passport.harvest.yieldKg} kg of ${passport.harvest.floralSource}`,
      date: passport.harvest.date,
      completed: true,
      icon: MapPin
    },
    {
      id: 'quality',
      title: 'Lab Quality Testing',
      subtitle: hasQuality ? 'FSSAI Standards Verified' : 'Laboratory Testing Pending',
      detail: hasQuality
        ? `Moisture: ${passport.qualityTest.moisture_pct}%, Sucrose: ${passport.qualityTest.sucrose_pct}%, HMF: ${passport.qualityTest.hmf_mg_kg} mg/kg`
        : 'Awaiting laboratory batch analysis upload',
      date: hasQuality ? (passport.qualityTest.tested_at ? new Date(passport.qualityTest.tested_at).toLocaleDateString() : 'Verified') : 'Pending',
      completed: hasQuality,
      icon: Award
    },
    {
      id: 'packaging',
      title: 'Processing & Lot Packaging',
      subtitle: hasPackaging ? `Lot #${passport.packaging.lot_number}` : 'Packaging Facility Pending',
      detail: hasPackaging
        ? `Packaged ${passport.packaging.jar_count} x ${passport.packaging.jar_size_g}g glass jars`
        : 'Awaiting packaging & on-chain anchoring',
      date: hasPackaging ? (passport.packaging.packaged_at ? new Date(passport.packaging.packaged_at).toLocaleDateString() : 'Completed') : 'Pending',
      completed: hasPackaging,
      icon: Package
    },
    {
      id: 'distribution',
      title: 'Custody Transfer & Distribution',
      subtitle: hasCustody ? 'Transfer Recorded' : 'Verified Supply Chain Transit',
      detail: hasCustody
        ? `Transferred from ${passport.custodyJourney[0].from_actor} to ${passport.custodyJourney[0].to_actor}`
        : 'Batch verified for distributor transport',
      date: hasCustody ? passport.custodyJourney[0].transferred_at : (hasPackaging ? 'In Transit' : 'Pending'),
      completed: hasPackaging,
      icon: Truck
    },
    {
      id: 'consumer',
      title: 'Consumer Verification',
      subtitle: 'Scanned & Verified via QR Code',
      detail: 'Complete hash-chain integrity verified on screen',
      date: 'Live Now',
      completed: true,
      icon: UserCheck
    }
  ];

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.25rem' }}>🗺️ Supply-Chain Custody Journey</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {stages.map((st, index) => {
          const IconComp = st.icon;
          const isDone = st.completed;

          return (
            <div key={st.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              {/* Icon / Marker Column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isDone ? 'rgba(47, 158, 68, 0.12)' : 'rgba(232, 163, 61, 0.15)',
                    border: `2px solid ${isDone ? 'var(--verified)' : 'var(--pending)'}`,
                    color: isDone ? 'var(--verified)' : 'var(--primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}
                >
                  <IconComp size={18} />
                </div>
                {index < stages.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      height: '36px',
                      background: isDone ? 'var(--verified)' : 'var(--border)',
                      marginTop: '0.25rem'
                    }}
                  />
                )}
              </div>

              {/* Content Column */}
              <div style={{ flex: 1, background: 'var(--bg)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{st.title}</strong>
                  <span className={`status-badge ${isDone ? 'verified' : 'pending'}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                    {isDone ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginTop: '0.2rem' }}>
                  {st.subtitle}
                </p>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {st.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
