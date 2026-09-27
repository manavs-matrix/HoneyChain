const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

/**
 * Calculates SHA-256 hash of event data payload
 */
function computeDataHash(payload) {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Calculates hash linking current payload with previous event hash
 */
function computeEventHash(dataHash, previousEventHash) {
  return crypto.createHash('sha256').update(`${dataHash}:${previousEventHash}`).digest('hex');
}

/**
 * Appends a new lifecycle event to a batch's hash chain
 * Per Rules.md immutability rule, event records are never edited; only new events appended.
 */
async function appendEvent({ batchId, actor, eventType, dataPayload, txHash = null }) {
  const dataHash = computeDataHash(dataPayload);
  const timestamp = new Date().toISOString();

  // Find the previous event in this batch's chain
  const prevResult = await db.query(
    'SELECT data_hash FROM hash_chain_events WHERE batch_id = $1 ORDER BY timestamp DESC LIMIT 1',
    [batchId]
  );

  const previousEventHash = prevResult.rows.length > 0
    ? prevResult.rows[0].data_hash
    : '0000000000000000000000000000000000000000000000000000000000000000'; // Genesis hash

  const eventId = uuidv4();

  await db.query(
    `INSERT INTO hash_chain_events (event_id, batch_id, actor, timestamp, event_type, data_hash, previous_event_hash, tx_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [eventId, batchId, actor, timestamp, eventType, dataHash, previousEventHash, txHash]
  );

  return {
    eventId,
    batchId,
    actor,
    timestamp,
    eventType,
    dataHash,
    previousEventHash,
    txHash
  };
}

/**
 * Verifies the complete hash chain for a batch
 */
async function verifyBatchChain(batchId) {
  const result = await db.query(
    'SELECT * FROM hash_chain_events WHERE batch_id = $1 ORDER BY timestamp ASC',
    [batchId]
  );

  const events = result.rows;
  if (events.length === 0) {
    return { verified: false, reason: 'No chain events found for this batch', events: [] };
  }

  let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    if (ev.previous_event_hash !== expectedPrevHash) {
      return {
        verified: false,
        failedAtEventId: ev.event_id,
        reason: `Hash mismatch at event #${i + 1} (${ev.event_type}). Expected previous hash ${expectedPrevHash}, got ${ev.previous_event_hash}`,
        events
      };
    }
    expectedPrevHash = ev.data_hash;
  }

  return {
    verified: true,
    totalEvents: events.length,
    events
  };
}

module.exports = {
  computeDataHash,
  computeEventHash,
  appendEvent,
  verifyBatchChain
};
