const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/inspection?hiveId=xyz
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { hiveId } = req.query;
    if (!hiveId) {
      return res.status(400).json({ success: false, data: null, error: 'hiveId query parameter required' });
    }

    const result = await db.query(
      'SELECT * FROM inspections WHERE hive_id = $1 ORDER BY inspection_date DESC',
      [hiveId]
    );
    return res.json({ success: true, data: result.rows, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/inspection
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { hiveId, inspectionDate, healthStatus = 'Healthy', queenPresent = 1, honeyStores = 'Medium', notes } = req.body;
    if (!hiveId) {
      return res.status(400).json({ success: false, data: null, error: 'hiveId is required' });
    }

    const id = uuidv4();
    const dateStr = inspectionDate || new Date().toISOString().split('T')[0];

    await db.query(
      `INSERT INTO inspections (id, hive_id, inspection_date, health_status, queen_present, honey_stores, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, hiveId, dateStr, healthStatus, queenPresent ? 1 : 0, honeyStores, notes || '']
    );

    const created = await db.query('SELECT * FROM inspections WHERE id = $1', [id]);
    return res.status(201).json({ success: true, data: created.rows[0], error: null });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
