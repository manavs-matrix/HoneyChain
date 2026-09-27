const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { appendEvent } = require('../services/hashChain');

// POST /api/seed — Populate initial demo data if database is fresh (or force reset)
router.post('/', async (req, res, next) => {
  try {
    const isReset = req.query.reset === 'true' || req.query.force === 'true' || req.body?.reset === true;
    if (isReset && db.forceSeed) {
      db.forceSeed(true);
      return res.json({
        success: true,
        data: { message: 'Demo data reset to fresh state successfully' },
        error: null
      });
    }

    if (db.forceSeed) {
      db.forceSeed(false);
    }

    return res.json({
      success: true,
      data: { message: 'Demo data seeded successfully' },
      error: null
    });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
