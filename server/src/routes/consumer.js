const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyBatchChain } = require('../services/hashChain');

// GET /api/consumer/passport/:batchId
// Unauthenticated public route per PRD & Rules
router.get('/passport/:batchId', async (req, res, next) => {
  try {
    const { batchId } = req.params;

    const batchRes = await db.query(
      `SELECT b.id as batch_id, b.status as batch_status, b.created_at as batch_created_at,
              har.harvest_date, har.yield_kg, har.floral_source, har.notes as harvest_notes,
              h.name as hive_name, a.name as apiary_name, a.location as apiary_location,
              u.name as beekeeper_name
       FROM batches b
       JOIN harvests har ON b.harvest_id = har.id
       JOIN hives h ON har.hive_id = h.id
       JOIN apiaries a ON h.apiary_id = a.id
       JOIN users u ON a.beekeeper_id = u.id
       WHERE b.id = $1`,
      [batchId]
    );

    if (batchRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        error: `Honey Batch '${batchId}' not found`
      });
    }

    const batchInfo = batchRes.rows[0];

    const qualityRes = await db.query('SELECT * FROM quality_tests WHERE batch_id = $1', [batchId]);
    const packagingRes = await db.query('SELECT * FROM packagings WHERE batch_id = $1', [batchId]);
    const custodyRes = await db.query('SELECT * FROM custody_transfers WHERE batch_id = $1 ORDER BY transferred_at ASC', [batchId]);

    // Perform cryptographic chain verification
    const verification = await verifyBatchChain(batchId);

    return res.json({
      success: true,
      data: {
        passport: {
          batchId: batchInfo.batch_id,
          status: batchInfo.batch_status,
          createdAt: batchInfo.batch_created_at,
          origin: {
            beekeeper: batchInfo.beekeeper_name,
            apiary: batchInfo.apiary_name,
            hive: batchInfo.hive_name,
            location: batchInfo.apiary_location
          },
          harvest: {
            date: batchInfo.harvest_date,
            yieldKg: batchInfo.yield_kg,
            floralSource: batchInfo.floral_source,
            notes: batchInfo.harvest_notes
          },
          qualityTest: qualityRes.rows[0] || null,
          packaging: packagingRes.rows[0] || null,
          custodyJourney: custodyRes.rows
        },
        integrityVerification: {
          status: verification.verified ? 'VERIFIED' : 'INTEGRITY_FAILED',
          isVerified: verification.verified,
          reason: verification.reason || 'All hash links successfully validated across lifecycle events.',
          totalEvents: verification.totalEvents || 0,
          events: verification.events || []
        }
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
