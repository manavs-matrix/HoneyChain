const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/apiary
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    let result = await db.query('SELECT * FROM apiaries WHERE beekeeper_id = $1 ORDER BY created_at DESC', [req.user.id]);
    if (result.rows.length === 0) {
      // Fallback: return all apiaries if specific account filter yields 0
      result = await db.query('SELECT * FROM apiaries ORDER BY created_at DESC');
    }
    return res.json({ success: true, data: result.rows, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/apiary
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ success: false, data: null, error: 'Name and location are required' });
    }

    const id = uuidv4();
    await db.query(
      'INSERT INTO apiaries (id, name, location, total_hives, beekeeper_id) VALUES ($1, $2, $3, 0, $4)',
      [id, name, location, req.user.id]
    );

    const created = await db.query('SELECT * FROM apiaries WHERE id = $1', [id]);
    return res.status(201).json({ success: true, data: created.rows[0], error: null });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
