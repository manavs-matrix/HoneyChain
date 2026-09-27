-- HoneyChain Schema Definition (PostgreSQL / SQLite compatible DDL)

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'beekeeper',
  org_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apiaries (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  total_hives INTEGER DEFAULT 0,
  beekeeper_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (beekeeper_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS hives (
  id VARCHAR(64) PRIMARY KEY,
  apiary_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  hive_type VARCHAR(100) DEFAULT 'Langstroth',
  status VARCHAR(50) DEFAULT 'Active',
  installed_date VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (apiary_id) REFERENCES apiaries(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inspections (
  id VARCHAR(64) PRIMARY KEY,
  hive_id VARCHAR(64) NOT NULL,
  inspection_date VARCHAR(50) NOT NULL,
  health_status VARCHAR(50) NOT NULL DEFAULT 'Healthy',
  queen_present INTEGER DEFAULT 1,
  honey_stores VARCHAR(50) DEFAULT 'Medium',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hive_id) REFERENCES hives(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS harvests (
  id VARCHAR(64) PRIMARY KEY,
  hive_id VARCHAR(64) NOT NULL,
  harvest_date VARCHAR(50) NOT NULL,
  yield_kg REAL NOT NULL,
  floral_source VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hive_id) REFERENCES hives(id)
);

CREATE TABLE IF NOT EXISTS batches (
  id VARCHAR(64) PRIMARY KEY, -- Unique string like HC-GJ-2026-000184
  harvest_id VARCHAR(64) NOT NULL,
  beekeeper_id VARCHAR(64) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'HARVESTED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (harvest_id) REFERENCES harvests(id)
);

CREATE TABLE IF NOT EXISTS quality_tests (
  id VARCHAR(64) PRIMARY KEY,
  batch_id VARCHAR(64) NOT NULL,
  moisture_pct REAL NOT NULL,
  sucrose_pct REAL NOT NULL,
  hmf_mg_kg REAL NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PASSED',
  tested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES batches(id)
);

CREATE TABLE IF NOT EXISTS packagings (
  id VARCHAR(64) PRIMARY KEY,
  batch_id VARCHAR(64) NOT NULL,
  lot_number VARCHAR(100) NOT NULL,
  jar_size_g INTEGER NOT NULL,
  jar_count INTEGER NOT NULL,
  packaged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES batches(id)
);

CREATE TABLE IF NOT EXISTS product_lots (
  id VARCHAR(64) PRIMARY KEY,
  batch_id VARCHAR(64) NOT NULL,
  lot_number VARCHAR(100) NOT NULL,
  qr_code_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES batches(id)
);

CREATE TABLE IF NOT EXISTS custody_transfers (
  id VARCHAR(64) PRIMARY KEY,
  batch_id VARCHAR(64) NOT NULL,
  from_actor VARCHAR(100) NOT NULL,
  to_actor VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  transferred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES batches(id)
);

CREATE TABLE IF NOT EXISTS hash_chain_events (
  event_id VARCHAR(64) PRIMARY KEY,
  batch_id VARCHAR(64) NOT NULL,
  actor VARCHAR(100) NOT NULL,
  timestamp VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  data_hash VARCHAR(64) NOT NULL,
  previous_event_hash VARCHAR(64) NOT NULL,
  tx_hash VARCHAR(100), -- Polygon Amoy transaction hash if anchored
  FOREIGN KEY (batch_id) REFERENCES batches(id)
);
