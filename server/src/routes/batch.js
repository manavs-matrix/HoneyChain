const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { appendEvent, verifyBatchChain, computeDataHash } = require('../services/hashChain');
const { anchorEventOnChain } = require('../services/blockchainAnchor');

// GET /api/batch — List batches
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT b.*, har.yield_kg, har.floral_source, har.harvest_date
       FROM batches b
       JOIN harvests har ON b.harvest_id = har.id
       ORDER BY b.created_at DESC`
    );
    return res.json({ success: true, data: result.rows, error: null });
  } catch (err) {
    next(err);
  }
});

// GET /api/batch/:batchId — Get specific batch with full hash-chain & verification
router.get('/:batchId', async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const batchRes = await db.query(
      `SELECT b.*, har.yield_kg, har.floral_source, har.harvest_date, h.name as hive_name, a.name as apiary_name, a.location
       FROM batches b
       JOIN harvests har ON b.harvest_id = har.id
       JOIN hives h ON har.hive_id = h.id
       JOIN apiaries a ON h.apiary_id = a.id
       WHERE b.id = $1`,
      [batchId]
    );

    if (batchRes.rows.length === 0) {
      return res.status(404).json({ success: false, data: null, error: 'Batch not found' });
    }

    const batch = batchRes.rows[0];
    const qualityRes = await db.query('SELECT * FROM quality_tests WHERE batch_id = $1', [batchId]);
    const packagingRes = await db.query('SELECT * FROM packagings WHERE batch_id = $1', [batchId]);
    const custodyRes = await db.query('SELECT * FROM custody_transfers WHERE batch_id = $1 ORDER BY transferred_at ASC', [batchId]);

    const chainVerification = await verifyBatchChain(batchId);

    return res.json({
      success: true,
      data: {
        batch,
        qualityTest: qualityRes.rows[0] || null,
        packaging: packagingRes.rows[0] || null,
        custodyTransfers: custodyRes.rows,
        chainVerification
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/batch/:batchId/quality-test — Record quality test result
router.post('/:batchId/quality-test', async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { moisturePct = 17.5, sucrosePct = 3.2, hmfMgKg = 12.4, status = 'PASSED' } = req.body;

    const id = uuidv4();
    await db.query(
      `INSERT INTO quality_tests (id, batch_id, moisture_pct, sucrose_pct, hmf_mg_kg, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, batchId, moisturePct, sucrosePct, hmfMgKg, status]
    );

    await db.query(`UPDATE batches SET status = 'QUALITY_VERIFIED' WHERE id = $1`, [batchId]);

    const testPayload = { batchId, moisturePct, sucrosePct, hmfMgKg, status };
    const chainEvent = await appendEvent({
      batchId,
      actor: `Quality Control Lab`,
      eventType: 'QUALITY_VERIFIED',
      dataPayload: testPayload
    });

    return res.json({ success: true, data: { qualityTestId: id, chainEvent }, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/batch/:batchId/package — Record packaging & generate product lot / QR
router.post('/:batchId/package', async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { lotNumber = `LOT-${Date.now()}`, jarSizeG = 500, jarCount = 200 } = req.body;

    const packId = uuidv4();
    await db.query(
      `INSERT INTO packagings (id, batch_id, lot_number, jar_size_g, jar_count)
       VALUES ($1, $2, $3, $4, $5)`,
      [packId, batchId, lotNumber, jarSizeG, jarCount]
    );

    const lotId = uuidv4();
    const qrCodeUrl = `/passport/${batchId}`;
    await db.query(
      `INSERT INTO product_lots (id, batch_id, lot_number, qr_code_url)
       VALUES ($1, $2, $3, $4)`,
      [lotId, batchId, lotNumber, qrCodeUrl]
    );

    await db.query(`UPDATE batches SET status = 'PACKAGED' WHERE id = $1`, [batchId]);

    const packPayload = { batchId, lotNumber, jarSizeG, jarCount, qrCodeUrl };

    // Also anchor on Polygon Amoy testnet
    const anchorResult = await anchorEventOnChain(batchId, 'PACKAGED', packPayload.lotNumber);

    const chainEvent = await appendEvent({
      batchId,
      actor: `Processing Facility`,
      eventType: 'PACKAGED',
      dataPayload: packPayload,
      txHash: anchorResult.txHash
    });

    return res.json({
      success: true,
      data: { packId, lotId, qrCodeUrl, anchorResult, chainEvent },
      error: null
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/batch/:batchId/tamper-demo — Simulates data tampering for Phase 5 demo
router.post('/:batchId/tamper-demo', async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { eventTypeToMutate = 'HARVEST_CREATED', forgedPayload = { yieldKg: 999.0, floralSource: 'FORGED_PLASTIC_HONEY' } } = req.body;

    const forgedHash = crypto.createHash('sha256').update(JSON.stringify(forgedPayload)).digest('hex');

    await db.query(
      `UPDATE hash_chain_events SET data_hash = $1 WHERE batch_id = $2 AND event_type = $3`,
      [forgedHash, batchId, eventTypeToMutate]
    );

    return res.json({
      success: true,
      data: {
        tamperedBatchId: batchId,
        forgedHash,
        message: `Simulated tamper committed: event '${eventTypeToMutate}' hash was corrupted. Verification will now fail.`
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/batch/:batchId/restore-tamper — Restores original valid hash chain
router.post('/:batchId/restore-tamper', async (req, res, next) => {
  try {
    const { batchId } = req.params;
    
    // 1. Restore HARVEST_CREATED
    const harRes = await db.query('SELECT * FROM harvests WHERE id IN (SELECT harvest_id FROM batches WHERE id = $1)', [batchId]);
    if (harRes.rows.length > 0) {
      const har = harRes.rows[0];
      const validPayload = {
        harvestId: har.id,
        batchId,
        hiveId: har.hive_id,
        yieldKg: har.yield_kg,
        floralSource: har.floral_source,
        harvestDate: har.harvest_date
      };
      const validHash = computeDataHash(validPayload);
      await db.query(
        `UPDATE hash_chain_events SET data_hash = $1 WHERE batch_id = $2 AND event_type = 'HARVEST_CREATED'`,
        [validHash, batchId]
      );
    }

    // 2. Restore QUALITY_VERIFIED if exists
    const qtRes = await db.query('SELECT * FROM quality_tests WHERE batch_id = $1', [batchId]);
    if (qtRes.rows.length > 0) {
      const qt = qtRes.rows[0];
      const validPayload = {
        batchId,
        moisturePct: qt.moisture_pct,
        sucrosePct: qt.sucrose_pct,
        hmfMgKg: qt.hmf_mg_kg,
        status: qt.status
      };
      const validHash = computeDataHash(validPayload);
      await db.query(
        `UPDATE hash_chain_events SET data_hash = $1 WHERE batch_id = $2 AND event_type = 'QUALITY_VERIFIED'`,
        [validHash, batchId]
      );
    }

    // 3. Restore PACKAGED if exists
    const pkgRes = await db.query('SELECT * FROM packagings WHERE batch_id = $1', [batchId]);
    if (pkgRes.rows.length > 0) {
      const pkg = pkgRes.rows[0];
      const validPayload = {
        batchId,
        lotNumber: pkg.lot_number,
        jarSizeG: pkg.jar_size_g,
        jarCount: pkg.jar_count
      };
      const validHash = computeDataHash(validPayload);
      await db.query(
        `UPDATE hash_chain_events SET data_hash = $1 WHERE batch_id = $2 AND event_type = 'PACKAGED'`,
        [validHash, batchId]
      );
    }

    // 4. Re-link previous_event_hash chain sequence for complete integrity restoration
    const eventsRes = await db.query('SELECT * FROM hash_chain_events WHERE batch_id = $1 ORDER BY timestamp ASC', [batchId]);
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    for (const ev of eventsRes.rows) {
      await db.query('UPDATE hash_chain_events SET previous_event_hash = $1 WHERE event_id = $2', [prevHash, ev.event_id]);
      prevHash = ev.data_hash;
    }

    return res.json({
      success: true,
      data: {
        batchId,
        message: 'Cryptographic hash-chain integrity restored.'
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
});



module.exports = router;
