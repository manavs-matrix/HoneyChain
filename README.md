# 🍯 HoneyChain — Digital Trust Infrastructure for Honey Supply-Chain Traceability

> **Smart India Hackathon 2026 (SIH26021)**  
> **Team**: TechSentinels (Team ID: 123564)  
> *"Every drop of honey should have a verifiable story."*  

---

## 📌 Executive Summary

**HoneyChain** is a digital trust infrastructure designed to solve honey adulteration and lack of provenance verification in India's honey supply chain. 

Built around the concept of the **Honey Passport**, HoneyChain provides an end-to-end immutable audit trail for every batch of raw honey—from the specific hive and apiary location to laboratory quality testing, processing, packaging, and final retail QR verification.

```
Beekeeper (Harvest) ➔ Quality Test ➔ Processing & Packaging ➔ Polygon Anchor ➔ Consumer QR Scan
```

---

## ✨ Key Features & Capabilities

### 1. 🏡 Beekeeper Management Hub
* **Apiary & Hive Hierarchy**: Log and track multiple apiaries (e.g., *Gir Forest Organic Apiary #4*, *Sasan Foothills*) and individual hives (e.g., *Hive Alpha-1*, *Hive Sasan-A*).
* **Hive Inspection Logs**: Record queen health, brood activity, and honey store levels.
* **Harvest Data Entry**: Log harvest dates, floral origin (e.g., *Gir Wildflower & Mustard*), and raw yield in kilograms.

### 2. 🔗 Cryptographic Hash-Chain Engine
* **App-Level SHA-256 Chain**: Every lifecycle event creates an immutable record linked to the prior event's hash (`dataHash` & `previousEventHash`).
* **Offline-Resilient Trust**: Functions 100% offline or on local networks without requiring external blockchain RPC connectivity for basic verification.
* **Event Sequence**:
  1. `HARVEST_CREATED` — Generated upon hive harvest log.
  2. `QUALITY_VERIFIED` — Records FSSAI certified lab parameters (Moisture %, Sucrose %, HMF mg/kg).
  3. `PACKAGED` — Final jar packaging, lot generation, and QR code assignment.
  4. `TRANSFERRED` — Custody transfer logs across supply chain participants.

### 3. 🌐 Polygon Amoy Testnet Anchoring
* **On-Chain Proof**: Anchors final packaged lot hashes directly to the **Polygon Amoy Testnet** (e.g., Transaction Hash `0x7f83b...`).
* **Non-Blocking Architecture**: Testnet anchoring is asynchronous; zero latency delay during live judge demonstrations.

### 4. 📜 Public Consumer Honey Passport & QR Scanner
* **Instant QR Verification**: Consumers scan a product QR code or enter a Batch ID (e.g., `HC-GJ-2026-000184`) to view its digital passport.
* **Complete Transparency**: Displays origin map, floral source, harvest date, laboratory test results, custody timeline, and live cryptographic verification status (`VERIFIED` vs `FAILED`).

### 5. ⚡ 1-Click Interactive Tamper Demo
* **Judge Verification Tool**: Integrated 1-click tamper simulation tool allowing judges to forge historical records (e.g., changing harvest yield or lab test results).
* **Real-Time Cryptographic Breaking**: Visually demonstrates hash mismatch instantly—the Honey Passport immediately flags `"Integrity Verification Failed"`. Includes a 1-click restore action to reset the chain.

### 6. 🤖 AI Yield Anomaly Detection Microservice
* **FastAPI Python Service**: Microservice analyzing harvest yield logs against historical hive baselines using Z-score statistics.
* **Strict Guardrails**: Read-only anomaly detection that flags suspicious harvest volume spikes (potential sugar syrup dilution) without altering blockchain state.

### 7. 🛡️ Resilient Zero-Dependency Database Engine
* **PostgreSQL + JSON Fallback Engine**: Primary PostgreSQL backend with automatic fallback to an in-memory JSON data store (`honeychain_store.json`) for zero-configuration, instant execution during live pitch presentations.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Frontend** | React 18 (Vite SPA) | Custom CSS Design System with warm honey palette (`#E8A33D`, `#FFFBF2`), Lucide Icons, responsive layouts |
| **Backend API** | Node.js + Express | RESTful API, SHA-256 cryptographic hash-chain engine, JWT authentication middleware |
| **Database** | PostgreSQL + JSON Store | PostgreSQL primary with resilient zero-dependency JSON Store fallback |
| **Blockchain** | SHA-256 Hash Chain + Polygon Amoy | Off-chain hash chain with Polygon Amoy testnet transaction anchoring |
| **AI Microservice** | Python 3 + FastAPI + Uvicorn | Z-score statistical yield anomaly detection microservice running on port 8000 |

---

## 🏗️ System Architecture

```
                                +-----------------------------------+
                                |     React SPA Client (Vite)       |
                                |     http://localhost:3000         |
                                +-----------------+-----------------+
                                                  |
                                                  | REST API Requests
                                                  v
                                +-----------------+-----------------+
                                |   Node.js / Express Backend API   |
                                |     http://localhost:5000         |
                                +--------+----------------+---------+
                                         |                |
                +------------------------+                +-------------------------+
                |                                                                   |
                v                                                                   v
+---------------+---------------+                                 +-----------------+-----------------+
|  Zero-Dep DB / PostgreSQL     |                                 |    Python FastAPI Microservice  |
|  (honeychain_store.json)      |                                 |     http://localhost:8000         |
+-------------------------------+                                 +-----------------------------------+
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or higher
- **Python**: `v3.9` or higher

---

### Step 1: Clone & Prepare Workspace

```bash
git clone https://github.com/TechSentinels/HoneyChain.git
cd HoneyChain
```

---

### Step 2: Start the Node.js Backend Server

```bash
cd server
npm install
npm start
```
*Server starts on `http://localhost:5000`. Local JSON fallback database is initialized automatically with pre-seeded demo data.*

---

### Step 3: Start the Python AI Microservice

In a new terminal window:

```bash
cd ai-service
# (Optional) Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt
python -m uvicorn src.main:app --port 8000 --reload
```
*AI service starts on `http://localhost:8000`.*

---

### Step 4: Start the React Frontend

In a new terminal window:

```bash
cd client
npm install
npm run dev
```
*Frontend opens at `http://localhost:3000`.*

---

## 🧪 End-to-End Demo Walkthrough

1. **Open the Beekeeper Management Hub**:
   - Navigate to `http://localhost:3000/#dashboard`.
   - Inspect active apiaries (*Gir Forest Organic Apiary #4*), hives, and recorded batches (`#HC-GJ-2026-000184`).

2. **Verify a Honey Passport**:
   - Click **Verify Passport** in the top navigation or go to `http://localhost:3000/#scan`.
   - Click **Instant Demo QR Scan** or search for batch `#HC-GJ-2026-000184`.
   - View origin details, lab parameters (Moisture: 17.5%, Sucrose: 3.2%), Polygon Amoy transaction link, and **"Cryptographic Hash-Chain Verified"** badge.

3. **Run the Live Tamper Demonstration**:
   - Return to the Beekeeper Hub (`#dashboard`).
   - Click **Tamper Demo** on batch `#HC-GJ-2026-000184`.
   - Select **Forge Harvest Yield** (e.g. change 18.5 kg to 999 kg) and submit.
   - Click **View Passport** — observe that the status immediately changes to 🔴 **"Integrity Verification Failed"** with red hash mismatch warnings.
   - Click **Restore Chain** in the Tamper Modal to restore cryptographic integrity.

---

## 📡 API Endpoint Reference

### Auth & Seed
- `POST /api/seed` — Seed fresh demo apiaries, hives, harvests, and batches.
- `POST /api/auth/register` — Register a new user account.
- `POST /api/auth/login` — Login and acquire JWT token.

### Beekeeper Management
- `GET /api/apiary` — List apiaries for current user.
- `POST /api/apiary` — Create a new apiary.
- `GET /api/hive?apiaryId=<id>` — List hives in an apiary.
- `POST /api/hive` — Create a new hive.
- `POST /api/inspection` — Log a hive inspection.
- `POST /api/harvest` — Record a honey harvest (triggers AI anomaly check).

### Batches & Hash-Chain
- `GET /api/batch` — List all honey batches.
- `GET /api/batch/:id` — Get single batch details and full event history.
- `POST /api/batch/:id/quality-test` — Record lab quality test parameters.
- `POST /api/batch/:id/package` — Package batch, generate QR, and anchor on Polygon Amoy.
- `POST /api/batch/:id/tamper-demo` — Inject deliberate record forgery (demo feature).
- `POST /api/batch/:id/restore-tamper` — Restore original un-tampered record.

### Consumer Verification
- `GET /api/consumer/passport/:batchId` — Public lookup endpoint returning batch data, hash-chain events, and verification status.

---

## 📁 Repository Structure

```
HoneyChain/
├── client/                      # React SPA Frontend (Vite)
│   ├── src/
│   │   ├── api/                 # API Client Fetch Wrappers
│   │   ├── components/          # HiveCards, Modals, HashChainView, AnomalyAlert
│   │   ├── context/             # AuthContext
│   │   ├── pages/               # BeekeeperDashboard, ConsumerScan, HoneyPassport
│   │   ├── App.jsx              # Main App Container & SPA Hash Routing
│   │   └── index.css            # Custom Warm Honey Styling & Design System
│   └── package.json
├── server/                      # Node.js Express REST Backend API
│   ├── src/
│   │   ├── db/                  # PostgreSQL Pool + Zero-Dep JSON Engine
│   │   ├── middleware/          # Auth JWT & Error Handler
│   │   ├── routes/              # Auth, Apiary, Hive, Harvest, Batch, Consumer, Seed
│   │   └── services/            # HashChain Engine, Polygon Anchor, AI Client
│   ├── honeychain_store.json    # Persistent JSON DB Store (Demo Mode)
│   ├── server.js                # Server Entry Point
│   └── package.json
├── ai-service/                  # Python FastAPI Anomaly Microservice
│   ├── src/
│   │   ├── anomaly_detection.py # Z-score yield analysis algorithm
│   │   ├── main.py              # FastAPI endpoints
│   │   └── seed_data.py         # Synthetic historical yield data
│   └── requirements.txt
├── doc/                         # Technical Documentation & PRD
│   ├── Architecture.md
│   ├── Design.md
│   ├── Memory.md
│   ├── Phase.md
│   ├── PRD.md
│   └── Rules.md
└── README.md                    # Project Master Documentation
```

---

## 🏆 Smart India Hackathon 2026 (SIH26021)

**Team**: TechSentinels (Team ID: 402)  
**Problem Statement**: SIH26021 — Honey Traceability and Quality Assurance System  

*Developed with ❤️ for Smart India Hackathon 2026.*
