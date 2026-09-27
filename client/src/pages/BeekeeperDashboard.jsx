import React, { useState, useEffect } from 'react';
import { apiaryApi, hiveApi, harvestApi, batchApi, apiFetch } from '../api/apiClient';
import ApiaryModal from '../components/ApiaryModal';
import HiveModal from '../components/HiveModal';
import InspectionModal from '../components/InspectionModal';
import HarvestModal from '../components/HarvestModal';
import QualityTestModal from '../components/QualityTestModal';
import PackagingModal from '../components/PackagingModal';
import QRDisplayModal from '../components/QRDisplayModal';
import TamperDemoModal from '../components/TamperDemoModal';
import HiveCard from '../components/HiveCard';
import AnomalyAlert from '../components/AnomalyAlert';
import { Plus, RefreshCw, ArrowRight, Award, Box, ShieldCheck, QrCode, Zap, RotateCcw } from 'lucide-react';

export default function BeekeeperDashboard({ onNavigate }) {
  const [apiaries, setApiaries] = useState([]);
  const [hives, setHives] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showApiaryModal, setShowApiaryModal] = useState(false);
  const [showHiveModal, setShowHiveModal] = useState(false);
  const [selectedApiary, setSelectedApiary] = useState(null);

  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [selectedHive, setSelectedHive] = useState(null);

  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showPackagingModal, setShowPackagingModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTamperModal, setShowTamperModal] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  // AI Anomaly analysis callout state
  const [aiAnalysis, setAiAnalysis] = useState(null);

  async function loadData() {
    setLoading(true);
    // Seed initial data if empty
    await apiFetch('/seed', { method: 'POST' });

    const [apRes, hvRes, btRes] = await Promise.all([
      apiaryApi.list(),
      hiveApi.list(),
      batchApi.list()
    ]);

    if (apRes.success && apRes.data) setApiaries(apRes.data);
    if (hvRes.success && hvRes.data) setHives(hvRes.data);
    if (btRes.success && btRes.data) setBatches(btRes.data);

    setLoading(false);
  }

  async function handleResetDemo() {
    setLoading(true);
    await apiFetch('/seed?reset=true', { method: 'POST' });
    const [apRes, hvRes, btRes] = await Promise.all([
      apiaryApi.list(),
      hiveApi.list(),
      batchApi.list()
    ]);

    if (apRes.success && apRes.data) setApiaries(apRes.data);
    if (hvRes.success && hvRes.data) setHives(hvRes.data);
    if (btRes.success && btRes.data) setBatches(btRes.data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleHarvestCreated = (harvestResult) => {
    if (harvestResult?.anomalyAnalysis) {
      setAiAnalysis(harvestResult.anomalyAnalysis);
    }
    loadData();
  };

  const totalYieldKg = batches.reduce((acc, b) => acc + (parseFloat(b.yield_kg) || 0), 0);

  return (
    <div className="dashboard-page">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Beekeeper Management Hub</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your apiaries, hives, inspections, and batch hash-chains</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="nav-btn" onClick={handleResetDemo} disabled={loading} title="Reset all data back to original fresh demo state">
            <RotateCcw size={16} /> Reset Demo State
          </button>
          <button className="nav-btn" onClick={loadData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="btn-primary" onClick={() => setShowApiaryModal(true)}>
            <Plus size={16} /> New Apiary
          </button>
        </div>
      </div>


      {/* AI Anomaly Callout Banner if present */}
      {aiAnalysis && (
        <AnomalyAlert analysis={aiAnalysis} onClose={() => setAiAnalysis(null)} />
      )}

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Active Apiaries</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '0.2rem' }}>
            {apiaries.length}
          </p>
        </div>
        <div className="card">
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Monitored Hives</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '0.2rem' }}>
            {hives.length}
          </p>
        </div>
        <div className="card">
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Honey Batches</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '0.2rem' }}>
            {batches.length}
          </p>
        </div>
        <div className="card">
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Total Harvested</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--verified)', marginTop: '0.2rem' }}>
            {totalYieldKg.toFixed(1)} <span style={{ fontSize: '1rem' }}>kg</span>
          </p>
        </div>
      </div>

      {/* Main Apiaries & Hives List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        {apiaries.map(apiary => {
          const apiaryHives = hives.filter(h => h.apiary_id === apiary.id);
          return (
            <div key={apiary.id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>🏡 {apiary.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.15rem' }}>
                    📍 {apiary.location} • {apiaryHives.length} Hives Active
                  </p>
                </div>

                <button
                  className="nav-btn"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => {
                    setSelectedApiary(apiary);
                    setShowHiveModal(true);
                  }}
                >
                  <Plus size={15} /> Add Hive
                </button>
              </div>

              {/* Hives Grid */}
              {apiaryHives.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  No hives added to this apiary yet. Click "Add Hive" to create one.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {apiaryHives.map(hive => (
                    <HiveCard
                      key={hive.id}
                      hive={hive}
                      onLogInspection={(h) => {
                        setSelectedHive(h);
                        setShowInspectionModal(true);
                      }}
                      onCreateHarvest={(h) => {
                        setSelectedHive(h);
                        setShowHarvestModal(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Batches & Hash-Chain Advancement Controls */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>📦 Traceable Honey Batches & Lifecycle Advancement</h3>
        {batches.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No harvest batches recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {batches.map(b => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <strong style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>#{b.id}</strong>
                    <span className={`status-badge ${b.status === 'PACKAGED' ? 'verified' : 'pending'}`}>
                      {b.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    🌸 {b.floral_source || 'Wildflower'} • ⚖️ {b.yield_kg || 0} kg • 📅 {b.harvest_date || 'Recent'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {b.status === 'HARVESTED' && (
                    <button
                      className="nav-btn"
                      style={{ fontSize: '0.82rem', borderColor: 'var(--primary-dark)', color: 'var(--primary-dark)' }}
                      onClick={() => {
                        setSelectedBatchId(b.id);
                        setShowQualityModal(true);
                      }}
                    >
                      <Award size={14} /> Record Quality Test
                    </button>
                  )}

                  {b.status === 'QUALITY_VERIFIED' && (
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
                      onClick={() => {
                        setSelectedBatchId(b.id);
                        setShowPackagingModal(true);
                      }}
                    >
                      <Box size={14} /> Package & Anchor On-Chain
                    </button>
                  )}

                  {b.status === 'PACKAGED' && (
                    <>
                      <button
                        className="nav-btn"
                        style={{ fontSize: '0.82rem', borderColor: 'var(--primary-dark)', color: 'var(--primary-dark)' }}
                        onClick={() => {
                          setSelectedBatchId(b.id);
                          setShowQrModal(true);
                        }}
                      >
                        <QrCode size={14} /> View QR
                      </button>
                      <button
                        className="btn-danger"
                        style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
                        onClick={() => {
                          setSelectedBatchId(b.id);
                          setShowTamperModal(true);
                        }}
                      >
                        <Zap size={14} /> Tamper Demo
                      </button>
                    </>
                  )}

                  {onNavigate && (
                    <button
                      className="nav-btn"
                      style={{ fontSize: '0.82rem' }}
                      onClick={() => onNavigate(`passport/${b.id}`)}
                    >
                      View Passport <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ApiaryModal
        isOpen={showApiaryModal}
        onClose={() => setShowApiaryModal(false)}
        onSuccess={loadData}
      />

      <HiveModal
        isOpen={showHiveModal}
        apiaryId={selectedApiary?.id}
        apiaryName={selectedApiary?.name}
        onClose={() => setShowHiveModal(false)}
        onSuccess={loadData}
      />

      <InspectionModal
        isOpen={showInspectionModal}
        hiveId={selectedHive?.id}
        hiveName={selectedHive?.name}
        onClose={() => setShowInspectionModal(false)}
        onSuccess={loadData}
      />

      <HarvestModal
        isOpen={showHarvestModal}
        hiveId={selectedHive?.id}
        hiveName={selectedHive?.name}
        onClose={() => setShowHarvestModal(false)}
        onSuccess={handleHarvestCreated}
      />

      <QualityTestModal
        isOpen={showQualityModal}
        batchId={selectedBatchId}
        onClose={() => setShowQualityModal(false)}
        onSuccess={loadData}
      />

      <PackagingModal
        isOpen={showPackagingModal}
        batchId={selectedBatchId}
        onClose={() => setShowPackagingModal(false)}
        onSuccess={loadData}
      />

      <QRDisplayModal
        isOpen={showQrModal}
        batchId={selectedBatchId}
        onClose={() => setShowQrModal(false)}
        onSimulateScan={(bId) => {
          if (onNavigate) onNavigate(`passport/${bId}`);
        }}
      />

      <TamperDemoModal
        isOpen={showTamperModal}
        batchId={selectedBatchId}
        onClose={() => setShowTamperModal(false)}
        onSuccess={() => {
          loadData();
          if (onNavigate && selectedBatchId) {
            onNavigate(`passport/${selectedBatchId}`);
          }
        }}
      />

    </div>
  );
}
