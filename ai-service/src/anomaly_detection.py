import math
from src.seed_data import HISTORICAL_YIELD_BASELINES, FLORAL_SOURCE_MULTIPLIERS

def analyze_harvest_yield(hive_id: str, yield_kg: float, floral_source: str = "Multifloral Organic", hive_type: str = "Langstroth"):
    """
    Analyzes a harvest yield against historical baselines using Z-score statistical evaluation.
    Outputs advisory flags (never certified verdicts) per Rules.md.
    """
    baseline = HISTORICAL_YIELD_BASELINES.get(hive_type, HISTORICAL_YIELD_BASELINES["default"])
    multiplier = FLORAL_SOURCE_MULTIPLIERS.get(floral_source, 1.0)

    adjusted_avg = round(baseline["avg_yield_kg"] * multiplier, 1)
    std_dev = baseline["std_dev_kg"]

    # Calculate Z-score and percentage deviation
    z_score = (yield_kg - adjusted_avg) / std_dev
    deviation_pct = ((yield_kg - adjusted_avg) / adjusted_avg) * 100.0

    if z_score < -1.8 or yield_kg < baseline["expected_min_kg"]:
        anomaly_detected = True
        severity = "WARNING"
        message = f"Unusual productivity decline detected: harvest of {yield_kg} kg is {abs(deviation_pct):.1f}% below historical average ({adjusted_avg} kg)."
        recommendations = [
            "Inspect colony for queen absence or failed egg-laying pattern",
            "Check brood frames for varroa mite infestation or signs of disease",
            "Verify local floral availability and check for recent pesticide exposure"
        ]
    elif z_score > 2.2 or yield_kg > baseline["expected_max_kg"]:
        anomaly_detected = True
        severity = "NOTICE"
        message = f"Exceptional harvest yield detected: {yield_kg} kg is {deviation_pct:.1f}% above historical baseline."
        recommendations = [
            "Verify comb weight measurement accuracy before batch logging",
            "Inspect super frames to ensure honey moisture is fully cured (< 20%)"
        ]
    else:
        anomaly_detected = False
        severity = "NORMAL"
        message = f"Harvest yield ({yield_kg} kg) is within normal expected historical baseline."
        recommendations = [
            "Maintain standard inspection schedule",
            "Proceed with laboratory quality sampling"
        ]

    return {
        "hive_id": hive_id,
        "hive_type": hive_type,
        "yield_kg": yield_kg,
        "floral_source": floral_source,
        "anomaly_detected": anomaly_detected,
        "severity": severity,
        "message": message,
        "baseline_avg_kg": adjusted_avg,
        "z_score": round(z_score, 2),
        "deviation_pct": round(deviation_pct, 1),
        "recommendations": recommendations
    }
