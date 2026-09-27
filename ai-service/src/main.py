from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from src.anomaly_detection import analyze_harvest_yield
from src.seed_data import HISTORICAL_YIELD_BASELINES

app = FastAPI(title="HoneyChain AI Microservice", version="1.0.0")

class YieldCheckRequest(BaseModel):
    hive_id: str
    yield_kg: float
    floral_source: Optional[str] = "Multifloral Organic"
    hive_type: Optional[str] = "Langstroth"

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "success": True,
        "service": "HoneyChain AI Anomaly Detection",
        "status": "online"
    }

@app.get("/api/v1/hive-baselines")
def get_baselines():
    return {
        "success": True,
        "baselines": HISTORICAL_YIELD_BASELINES
    }

@app.post("/api/v1/detect-anomaly")
def detect_anomaly(req: YieldCheckRequest):
    result = analyze_harvest_yield(
        hive_id=req.hive_id,
        yield_kg=req.yield_kg,
        floral_source=req.floral_source,
        hive_type=req.hive_type
    )
    return {
        "success": True,
        **result
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
