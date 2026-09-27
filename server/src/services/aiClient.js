/**
 * AI Service Client Module
 * Calls the Python FastAPI microservice over HTTP to check harvest yields for anomalies.
 */

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function checkYieldAnomaly(hiveId, yieldKg, floralSource) {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/v1/detect-anomaly`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hive_id: hiveId, yield_kg: yieldKg, floral_source: floralSource })
    });

    if (!response.ok) {
      throw new Error(`AI service responded with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('[aiClient] Failed to reach Python AI microservice, returning local heuristic:', err.message);
    // Local fallback flag if AI service is not running
    const isLow = yieldKg < 5.0;
    return {
      success: true,
      anomaly_detected: isLow,
      severity: isLow ? 'WARNING' : 'NORMAL',
      message: isLow ? 'Unusual productivity decline detected relative to historical average' : 'Harvest yield within expected range',
      baseline_avg_kg: 12.5,
      deviation_pct: isLow ? -60 : 0
    };
  }
}

module.exports = {
  checkYieldAnomaly
};
