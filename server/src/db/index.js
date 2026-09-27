const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const crypto = require('crypto');

let pool = null;
let useJsonStore = true;
const storeFilePath = path.join(__dirname, '../../honeychain_store.json');


// In-memory table store fallback if PostgreSQL is not active
let memoryTables = {
  users: [],
  apiaries: [],
  hives: [],
  inspections: [],
  harvests: [],
  batches: [],
  quality_tests: [],
  packagings: [],
  product_lots: [],
  custody_transfers: [],
  hash_chain_events: []
};

function loadJsonStore() {
  if (fs.existsSync(storeFilePath)) {
    try {
      const content = fs.readFileSync(storeFilePath, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        memoryTables = { ...memoryTables, ...parsed };
      }
    } catch (e) {
      console.warn('Could not parse local json store, initializing fresh:', e.message);
    }
  }
}

function saveJsonStore() {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(memoryTables, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save local json store:', e.message);
  }
}

function seedDefaultData(forceReset = false) {
  if (!forceReset && memoryTables.apiaries && memoryTables.apiaries.length > 0) {
    return; // Already populated
  }

  memoryTables = {
    users: [],
    apiaries: [],
    hives: [],
    inspections: [],
    harvests: [],
    batches: [],
    quality_tests: [],
    packagings: [],
    product_lots: [],
    custody_transfers: [],
    hash_chain_events: []
  };

  const userId = 'demo-beekeeper-id';

  const apiary1Id = 'apiary-gir-4';
  const apiary2Id = 'apiary-sasan-1';
  const hive1Id = 'hive-alpha-1';
  const hive2Id = 'hive-alpha-2';
  const hive3Id = 'hive-sasan-a';
  
  const harvest1Id = 'harvest-gir-1';
  const harvest2Id = 'harvest-gir-2';
  const harvest3Id = 'harvest-sasan-1';

  const batch1Id = 'HC-GJ-2026-000184'; // PACKAGED
  const batch2Id = 'HC-GJ-2026-000185'; // HARVESTED (Ready for Quality Test)
  const batch3Id = 'HC-GJ-2026-000186'; // QUALITY_VERIFIED (Ready for Packaging & Polygon Anchor)

  memoryTables.users = [{
    id: userId,
    email: 'beekeeper@honeychain.io',
    password_hash: 'hashed',
    name: 'Ramesh Patel (Master Beekeeper)',
    role: 'beekeeper',
    created_at: new Date().toISOString()
  }];

  memoryTables.apiaries = [
    {
      id: apiary1Id,
      name: 'Gir Forest Organic Apiary #4',
      location: 'Junagadh, Gujarat',
      total_hives: 2,
      beekeeper_id: userId,
      created_at: new Date().toISOString()
    },
    {
      id: apiary2Id,
      name: 'Sasan Foothills Wildflower Apiary',
      location: 'Sasan Gir, Gujarat',
      total_hives: 1,
      beekeeper_id: userId,
      created_at: new Date().toISOString()
    }
  ];

  memoryTables.hives = [
    {
      id: hive1Id,
      apiary_id: apiary1Id,
      name: 'Hive Alpha-1',
      hive_type: 'Langstroth',
      status: 'Active',
      installed_date: '2025-02-10',
      created_at: new Date().toISOString()
    },
    {
      id: hive2Id,
      apiary_id: apiary1Id,
      name: 'Hive Alpha-2 (Acacia)',
      hive_type: 'Langstroth',
      status: 'Active',
      installed_date: '2025-03-15',
      created_at: new Date().toISOString()
    },
    {
      id: hive3Id,
      apiary_id: apiary2Id,
      name: 'Hive Sasan-A',
      hive_type: 'Top-Bar',
      status: 'Active',
      installed_date: '2025-04-01',
      created_at: new Date().toISOString()
    }
  ];

  memoryTables.inspections = [
    {
      id: 'insp-1',
      hive_id: hive1Id,
      inspection_date: '2026-09-10',
      health_status: 'Healthy',
      queen_present: 1,
      honey_stores: 'High',
      notes: 'Strong brood pattern, excellent nectar flow from wild mustard',
      created_at: new Date().toISOString()
    },
    {
      id: 'insp-2',
      hive_id: hive2Id,
      inspection_date: '2026-09-12',
      health_status: 'Healthy',
      queen_present: 1,
      honey_stores: 'Medium',
      notes: 'Queen active, comb expansion progressing well',
      created_at: new Date().toISOString()
    }
  ];

  memoryTables.harvests = [
    {
      id: harvest1Id,
      hive_id: hive1Id,
      harvest_date: '2026-09-15',
      yield_kg: 18.5,
      floral_source: 'Gir Wildflower & Mustard',
      notes: 'Organic extraction, cold strained',
      created_at: new Date().toISOString()
    },
    {
      id: harvest2Id,
      hive_id: hive2Id,
      harvest_date: '2026-09-18',
      yield_kg: 14.2,
      floral_source: 'Acacia & Wild Mustard',
      notes: 'Raw extracted frames',
      created_at: new Date().toISOString()
    },
    {
      id: harvest3Id,
      hive_id: hive3Id,
      harvest_date: '2026-09-20',
      yield_kg: 22.0,
      floral_source: 'Sasan Wild Blossom',
      notes: 'Pure wildflower comb',
      created_at: new Date().toISOString()
    }
  ];

  memoryTables.batches = [
    {
      id: batch1Id,
      harvest_id: harvest1Id,
      beekeeper_id: userId,
      status: 'PACKAGED',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: batch2Id,
      harvest_id: harvest2Id,
      beekeeper_id: userId,
      status: 'HARVESTED',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: batch3Id,
      harvest_id: harvest3Id,
      beekeeper_id: userId,
      status: 'QUALITY_VERIFIED',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ];

  memoryTables.quality_tests = [
    {
      id: 'qt-1',
      batch_id: batch1Id,
      moisture_pct: 17.5,
      sucrose_pct: 3.2,
      hmf_mg_kg: 12.4,
      status: 'PASSED',
      tested_at: new Date().toISOString()
    },
    {
      id: 'qt-3',
      batch_id: batch3Id,
      moisture_pct: 16.8,
      sucrose_pct: 2.9,
      hmf_mg_kg: 10.1,
      status: 'PASSED',
      tested_at: new Date().toISOString()
    }
  ];

  memoryTables.packagings = [
    {
      id: 'pkg-1',
      batch_id: batch1Id,
      lot_number: 'LOT-GJ2026-9042',
      jar_size_g: 500,
      jar_count: 250,
      packaged_at: new Date().toISOString()
    }
  ];

  memoryTables.product_lots = [
    {
      id: 'lot-1',
      batch_id: batch1Id,
      lot_number: 'LOT-GJ2026-9042',
      qr_code_url: `/passport/${batch1Id}`,
      created_at: new Date().toISOString()
    }
  ];

  // Hash events for batch1Id
  const h1Payload = { harvestId: harvest1Id, batchId: batch1Id, hiveId: hive1Id, yieldKg: 18.5, floralSource: 'Gir Wildflower & Mustard', harvestDate: '2026-09-15' };
  const h1Hash = crypto.createHash('sha256').update(JSON.stringify(h1Payload)).digest('hex');

  const q1Payload = { batchId: batch1Id, moisturePct: 17.5, sucrosePct: 3.2, hmfMgKg: 12.4, status: 'PASSED' };
  const q1Hash = crypto.createHash('sha256').update(JSON.stringify(q1Payload)).digest('hex');

  const p1Payload = { batchId: batch1Id, lotNumber: 'LOT-GJ2026-9042', jarSizeG: 500, jarCount: 250 };
  const p1Hash = crypto.createHash('sha256').update(JSON.stringify(p1Payload)).digest('hex');

  // Hash events for batch2Id (HARVESTED)
  const h2Payload = { harvestId: harvest2Id, batchId: batch2Id, hiveId: hive2Id, yieldKg: 14.2, floralSource: 'Acacia & Wild Mustard', harvestDate: '2026-09-18' };
  const h2Hash = crypto.createHash('sha256').update(JSON.stringify(h2Payload)).digest('hex');

  // Hash events for batch3Id (QUALITY_VERIFIED)
  const h3Payload = { harvestId: harvest3Id, batchId: batch3Id, hiveId: hive3Id, yieldKg: 22.0, floralSource: 'Sasan Wild Blossom', harvestDate: '2026-09-20' };
  const h3Hash = crypto.createHash('sha256').update(JSON.stringify(h3Payload)).digest('hex');

  const q3Payload = { batchId: batch3Id, moisturePct: 16.8, sucrosePct: 2.9, hmfMgKg: 10.1, status: 'PASSED' };
  const q3Hash = crypto.createHash('sha256').update(JSON.stringify(q3Payload)).digest('hex');

  memoryTables.hash_chain_events = [
    {
      event_id: 'ev-1',
      batch_id: batch1Id,
      actor: 'Beekeeper (Ramesh Patel)',
      timestamp: '2026-09-15T10:00:00.000Z',
      event_type: 'HARVEST_CREATED',
      data_hash: h1Hash,
      previous_event_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      tx_hash: null
    },
    {
      event_id: 'ev-2',
      batch_id: batch1Id,
      actor: 'Quality Control Lab (FSSAI Certified)',
      timestamp: '2026-09-16T14:30:00.000Z',
      event_type: 'QUALITY_VERIFIED',
      data_hash: q1Hash,
      previous_event_hash: h1Hash,
      tx_hash: null
    },
    {
      event_id: 'ev-3',
      batch_id: batch1Id,
      actor: 'Processing Facility (Gir Organic Co-Op)',
      timestamp: '2026-09-17T09:15:00.000Z',
      event_type: 'PACKAGED',
      data_hash: p1Hash,
      previous_event_hash: q1Hash,
      tx_hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f80002'
    },
    {
      event_id: 'ev-4',
      batch_id: batch2Id,
      actor: 'Beekeeper (Ramesh Patel)',
      timestamp: '2026-09-18T11:00:00.000Z',
      event_type: 'HARVEST_CREATED',
      data_hash: h2Hash,
      previous_event_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      tx_hash: null
    },
    {
      event_id: 'ev-5',
      batch_id: batch3Id,
      actor: 'Beekeeper (Ramesh Patel)',
      timestamp: '2026-09-20T08:00:00.000Z',
      event_type: 'HARVEST_CREATED',
      data_hash: h3Hash,
      previous_event_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      tx_hash: null
    },
    {
      event_id: 'ev-6',
      batch_id: batch3Id,
      actor: 'Quality Control Lab (FSSAI Certified)',
      timestamp: '2026-09-20T14:00:00.000Z',
      event_type: 'QUALITY_VERIFIED',
      data_hash: q3Hash,
      previous_event_hash: h3Hash,
      tx_hash: null
    }
  ];

  saveJsonStore();
}

async function query(sql, params = []) {
  if (pool && !useJsonStore) {
    try {
      const res = await pool.query(sql, params);
      return res;
    } catch (err) {
      console.error('PostgreSQL query error:', err.message);
      throw err;
    }
  }

  const cleanSql = sql.trim().replace(/\s+/g, ' ');
  const uppercaseSql = cleanSql.toUpperCase();

  if (uppercaseSql.startsWith('SELECT 1')) {
    return { rows: [{ '?column?': 1 }], rowCount: 1 };
  }

  if (uppercaseSql.startsWith('SELECT')) {
    // Check for JOIN queries first
    if (uppercaseSql.includes('JOIN')) {
      return handleJoinedSelect(cleanSql, params);
    }

    let tableName = null;
    const fromMatch = cleanSql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (fromMatch) tableName = fromMatch[1].toLowerCase();

    if (!tableName || !memoryTables[tableName]) {
      return { rows: [], rowCount: 0 };
    }

    let rows = [...memoryTables[tableName]];

    // Filtering by parameter e.g. WHERE beekeeper_id = $1 or WHERE id = $1
    const whereMatch = cleanSql.match(/WHERE\s+([a-zA-Z0-9_]+)\s*=\s*\$1/i);
    if (whereMatch && params.length > 0) {
      const col = whereMatch[1].toLowerCase();
      rows = rows.filter(r => r[col] == params[0]);
    }

    // ORDER BY timestamp / created_at / harvest_date
    if (uppercaseSql.includes('ORDER BY')) {
      if (uppercaseSql.includes('DESC')) {
        rows.sort((a, b) => new Date(b.created_at || b.timestamp || b.harvest_date || 0) - new Date(a.created_at || a.timestamp || a.harvest_date || 0));
      } else {
        rows.sort((a, b) => new Date(a.created_at || a.timestamp || a.harvest_date || 0) - new Date(b.created_at || b.timestamp || b.harvest_date || 0));
      }
    }

    // LIMIT
    const limitMatch = cleanSql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      rows = rows.slice(0, limit);
    }

    return { rows, rowCount: rows.length };
  }

  if (uppercaseSql.startsWith('INSERT INTO')) {
    const tableMatch = cleanSql.match(/INSERT INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (tableMatch) {
      const tableName = tableMatch[1].toLowerCase();
      const cols = tableMatch[2].split(',').map(c => c.trim().toLowerCase());

      if (!memoryTables[tableName]) memoryTables[tableName] = [];

      const newRow = {};
      cols.forEach((col, idx) => {
        newRow[col] = params[idx] !== undefined ? params[idx] : null;
      });

      if (!newRow.created_at) newRow.created_at = new Date().toISOString();
      memoryTables[tableName].push(newRow);
      saveJsonStore();
      return { rows: [newRow], rowCount: 1 };
    }
  }

  if (uppercaseSql.startsWith('UPDATE')) {
    const updateMatch = cleanSql.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.*?)(?:\s+WHERE\s+(.+))?$/i);
    if (updateMatch) {
      const tableName = updateMatch[1].toLowerCase();
      const setClause = updateMatch[2].trim();
      const whereClause = (updateMatch[3] || '').trim();
      const rows = memoryTables[tableName] || [];

      let updatedCount = 0;
      rows.forEach(r => {
        if (cleanSql.includes('WHERE batch_id = $2 AND event_type = $3')) {
          const targetBatchId = params[1];
          const targetEventType = params[2];
          if (r.batch_id === targetBatchId && r.event_type === targetEventType) {
            if (setClause.includes('data_hash = $1')) {
              r.data_hash = params[0];
            }
            updatedCount++;
          }
        } else if (cleanSql.includes('WHERE event_id = $') || cleanSql.includes('WHERE batch_id = $2 AND event_id = $3')) {
          const targetEventId = params[params.length - 1];
          if (r.event_id === targetEventId || r.id === targetEventId) {
            if (setClause.includes('previous_event_hash = $1')) {
              r.previous_event_hash = params[0];
            } else if (setClause.includes('data_hash = $1')) {
              r.data_hash = params[0];
            }
            updatedCount++;
          }
        } else if (cleanSql.includes('WHERE id = $') || cleanSql.includes('WHERE batch_id = $')) {
          const targetId = params[params.length - 1];
          if (r.id === targetId || r.batch_id === targetId || r.event_id === targetId) {
            if (setClause.includes("status = '")) {
              r.status = setClause.split("'")[1];
            } else if (setClause.includes('status = $1')) {
              r.status = params[0];
            } else if (setClause.includes('data_hash = $1')) {
              r.data_hash = params[0];
            } else if (setClause.includes('previous_event_hash = $1')) {
              r.previous_event_hash = params[0];
            } else if (setClause.includes('total_hives = total_hives + 1')) {
              r.total_hives = (r.total_hives || 0) + 1;
            }
            updatedCount++;
          }
        }
      });
      saveJsonStore();
      return { rows: [], rowCount: updatedCount };
    }
  }



  return { rows: [], rowCount: 0 };
}

function handleJoinedSelect(cleanSql, params) {
  const uppercaseSql = cleanSql.toUpperCase();

  if (uppercaseSql.includes('FROM BATCHES B')) {
    const batches = memoryTables.batches || [];
    const harvests = memoryTables.harvests || [];
    const hives = memoryTables.hives || [];
    const apiaries = memoryTables.apiaries || [];
    const users = memoryTables.users || [];

    let result = batches.map(b => {
      const har = harvests.find(h => h.id === b.harvest_id) || {};
      const hiv = hives.find(h => h.id === har.hive_id) || {};
      const api = apiaries.find(a => a.id === hiv.apiary_id) || {};
      const usr = users.find(u => u.id === api.beekeeper_id) || {};

      return {
        ...b,
        batch_id: b.id,
        batch_status: b.status,
        batch_created_at: b.created_at,
        yield_kg: har.yield_kg || 0,
        floral_source: har.floral_source || 'Multifloral',
        harvest_date: har.harvest_date || b.created_at,
        harvest_notes: har.notes || '',
        hive_name: hiv.name || 'Hive #1',
        apiary_name: api.name || 'Apiary #1',
        apiary_location: api.location || 'Gujarat, India',
        beekeeper_name: usr.name || 'Master Beekeeper'
      };
    });

    if (cleanSql.includes('WHERE b.id = $1') && params.length > 0) {
      result = result.filter(r => r.id === params[0]);
    }

    return { rows: result, rowCount: result.length };
  }

  if (uppercaseSql.includes('FROM HARVESTS HAR')) {
    const harvests = memoryTables.harvests || [];
    const hives = memoryTables.hives || [];
    const batches = memoryTables.batches || [];

    let result = harvests.map(har => {
      const hiv = hives.find(h => h.id === har.hive_id) || {};
      const b = batches.find(b => b.harvest_id === har.id) || {};
      return {
        ...har,
        hive_name: hiv.name || 'Hive',
        batch_id: b.id || null,
        batch_status: b.status || null
      };
    });

    return { rows: result, rowCount: result.length };
  }

  if (uppercaseSql.includes('FROM HIVES H JOIN APIARIES A')) {
    const hives = memoryTables.hives || [];
    const apiaries = memoryTables.apiaries || [];

    let result = hives.map(h => {
      const api = apiaries.find(a => a.id === h.apiary_id) || {};
      return {
        ...h,
        apiary_name: api.name || 'Apiary'
      };
    });

    if (cleanSql.includes('AND h.apiary_id = $2') || cleanSql.includes('WHERE h.apiary_id = $1')) {
      const targetApiaryId = params[params.length - 1];
      result = result.filter(r => r.apiary_id === targetApiaryId);
    }

    return { rows: result, rowCount: result.length };
  }

  return { rows: [], rowCount: 0 };
}

async function initDb() {
  loadJsonStore();

  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres://')) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 2000,
      });

      await pool.query('SELECT 1');
      console.log('✅ Connected to PostgreSQL database');
      const schemaPath = path.join(__dirname, '../models/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✅ PostgreSQL schema verified');
      return;
    } catch (err) {
      console.warn('⚠️ PostgreSQL unavailable:', err.message);
      console.log('🔄 Switched to zero-dependency JSON Store for resilient hackathon execution.');
      if (pool) {
        await pool.end().catch(() => {});
        pool = null;
      }
    }
  }

  useJsonStore = true;
  seedDefaultData(true);
  console.log('✅ Initialized resilient zero-dependency DB store (fresh demo state restored).');
}

module.exports = {
  query,
  initDb,
  get isSqlite() { return useJsonStore; },
  forceSeed: (force = true) => seedDefaultData(force)
};

