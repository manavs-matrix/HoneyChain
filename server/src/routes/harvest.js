const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { appendEvent } = require('../services/hashChain');
const { checkYieldAnomaly } = require('../services/aiClient');

// Helper to generate unique batch ID e.g. HC-GJ-2026-000184
function generateBatchId() {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const year = new Date().getFullYear();
  return `HC-GJ-${year}-${randNum}`;
}

// GET /api/harvest
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT har.*, h.name as hive_name, b.id as batch_id, b.status as batch_status
       FROM harvests har
       JOIN hives h ON har.hive_id = h.id
       JOIN apiaries a ON h.apiary_id = a.id
       LEFT JOIN batches b ON b.harvest_id = har.id
       ORDER BY har.created_at DESC`
    );
    return res.json({ success: true, data: result.rows, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/harvest
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { hiveId, harvestDate, yieldKg, floralSource, notes } = req.body;
    if (!hiveId || !yieldKg || !floralSource) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'hiveId, yieldKg, and floralSource are required'
      });
    }

    const harvestId = uuidv4();
    const hDate = harvestDate || new Date().toISOString().split('T')[0];

    // 1. Save harvest
    await db.query(
      `INSERT INTO harvests (id, hive_id, harvest_date, yield_kg, floral_source, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [harvestId, hiveId, hDate, parseFloat(yieldKg), floralSource, notes || '']
    );

    // 2. Generate unique batch ID
    const batchId = generateBatchId();
    await db.query(
      `INSERT INTO batches (id, harvest_id, beekeeper_id, status)
       VALUES ($1, $2, $3, 'HARVESTED')`,
      [batchId, harvestId, req.user?.id || 'demo-beekeeper-id']
    );

    // 3. Write initial Hash-Chain event HARVEST_CREATED
    const eventPayload = {
      harvestId,
      batchId,
      hiveId,
      yieldKg: parseFloat(yieldKg),
      floralSource,
      harvestDate: hDate,
      beekeeperId: req.user?.id || 'demo-beekeeper-id'
    };

    const chainEvent = await appendEvent({
      batchId,
      actor: `Beekeeper (${req.user?.name || 'Ramesh Patel'})`,
      eventType: 'HARVEST_CREATED',
      dataPayload: eventPayload
    });

    // 4. Run AI Anomaly Detection call
    const anomalyResult = await checkYieldAnomaly(hiveId, parseFloat(yieldKg), floralSource);

    return res.status(201).json({
      success: true,
      data: {
        harvestId,
        batchId,
        chainEvent,
        anomalyAnalysis: anomalyResult
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
