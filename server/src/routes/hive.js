const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/hive?apiaryId=xyz
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { apiaryId } = req.query;
    let sql = 'SELECT h.*, a.name as apiary_name FROM hives h JOIN apiaries a ON h.apiary_id = a.id';
    const params = [];

    if (apiaryId) {
      sql += ' WHERE h.apiary_id = $1';
      params.push(apiaryId);
    }

    sql += ' ORDER BY h.created_at DESC';
    let result = await db.query(sql, params);
    return res.json({ success: true, data: result.rows, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/hive
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { apiaryId, name, hiveType = 'Langstroth', installedDate } = req.body;
    if (!apiaryId || !name) {
      return res.status(400).json({ success: false, data: null, error: 'Apiary ID and Hive Name are required' });
    }

    const id = uuidv4();
    const instDate = installedDate || new Date().toISOString().split('T')[0];

    await db.query(
      'INSERT INTO hives (id, apiary_id, name, hive_type, status, installed_date) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, apiaryId, name, hiveType, 'Active', instDate]
    );

    // Increment hive count on apiary
    await db.query('UPDATE apiaries SET total_hives = total_hives + 1 WHERE id = $1', [apiaryId]);

    const created = await db.query('SELECT * FROM hives WHERE id = $1', [id]);
    return res.status(201).json({ success: true, data: created.rows[0], error: null });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
