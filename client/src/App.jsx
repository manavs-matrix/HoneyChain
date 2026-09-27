import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import BeekeeperDashboard from './pages/BeekeeperDashboard';
import ConsumerScan from './pages/ConsumerScan';
import HoneyPassport from './pages/HoneyPassport';
import { Award, QrCode, LayoutDashboard } from 'lucide-react';

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash === 'scan') {
    return { tab: 'scan', batchId: null };
  }
  if (hash.startsWith('passport/')) {
    const parts = hash.split('/');
    return { tab: 'passport', batchId: parts[1] || 'HC-GJ-2026-000184' };
  }
  return { tab: 'dashboard', batchId: null };
}

function AppContent() {
  const [activeTab, setActiveTab] = useState(() => getRouteFromHash().tab);
  const [passportBatchId, setPassportBatchId] = useState(() => getRouteFromHash().batchId);
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash();
      setActiveTab(route.tab);
      setPassportBatchId(route.batchId);
    };

    if (!window.location.hash) {
      window.history.replaceState(null, '', '#dashboard');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path) => {
    window.location.hash = `#${path}`;
  };

  return (
    <div className="app-container">
      <header className="nav-bar">
        <a
          href="#dashboard"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('dashboard');
          }}
        >
          <span>🍯 HoneyChain</span>
          <span className="brand-badge">SIH26021</span>
        </a>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
          >
            <LayoutDashboard size={18} />
            Beekeeper Hub
          </button>
          <button
            className={`nav-btn ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => handleNavigate('scan')}
          >
            <QrCode size={18} />
            Verify Passport
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && <BeekeeperDashboard onNavigate={handleNavigate} />}
        {activeTab === 'scan' && <ConsumerScan onNavigate={handleNavigate} />}
        {activeTab === 'passport' && <HoneyPassport batchId={passportBatchId || 'HC-GJ-2026-000184'} />}
      </main>

      <footer className="footer">
        <p>HoneyChain — Digital Trust Infrastructure for Honey Supply-Chain Traceability</p>
        <p style={{ marginTop: '0.25rem', opacity: 0.8 }}>Team TechSentinels (Team ID 402) — Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

