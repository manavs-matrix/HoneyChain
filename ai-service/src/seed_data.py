"""
Synthetic historical yield baseline data for HoneyChain demo hives.
Organized by hive type and floral source distributions.
"""

HISTORICAL_YIELD_BASELINES = {
    "default": {
        "avg_yield_kg": 14.5,
        "std_dev_kg": 2.2,
        "expected_min_kg": 8.0,
        "expected_max_kg": 22.0
    },
    "Langstroth": {
        "avg_yield_kg": 16.5,
        "std_dev_kg": 2.5,
        "expected_min_kg": 9.5,
        "expected_max_kg": 24.5
    },
    "Top-Bar": {
        "avg_yield_kg": 11.0,
        "std_dev_kg": 1.8,
        "expected_min_kg": 6.0,
        "expected_max_kg": 16.0
    },
    "Warré": {
        "avg_yield_kg": 12.5,
        "std_dev_kg": 2.0,
        "expected_min_kg": 7.0,
        "expected_max_kg": 18.0
    }
}

FLORAL_SOURCE_MULTIPLIERS = {
    "Gir Wildflower & Mustard": 1.15,
    "Acacia Monofloral": 1.0,
    "Eucalyptus Flora": 1.10,
    "Siddhpur Neem Blossom": 0.90,
    "Multifloral Organic": 1.0
}
