# Architecture.md — HoneyChain

## 1. App Flow

```
Beekeeper
  → creates Apiary
  → creates Hive
  → logs Inspection
  → creates Harvest
      → system creates Batch (unique ID, e.g. HC-GJ-2026-000184)
      → hash-chain event: HARVEST_CREATED

Batch status advances (simplified Processor/Distributor actions)
  → Quality Test recorded         → hash-chain event: QUALITY_VERIFIED
  → Packaging recorded            → hash-chain event: PACKAGED
  → Product Lot + QR generated
  → Custody transfer recorded     → hash-chain event: TRANSFERRED / DISTRIBUTED

One event per demo batch is also mirrored as a real transaction on the
Polygon Amoy testnet, used to prove the chain is not purely cosmetic.

Consumer
  → scans QR code
  → system looks up Batch + full hash-chain
  → verifies each event's hash against the previous event's hash
  → renders Honey Passport with a VERIFIED / FAILED status

Tamper demo
  → an admin/demo action attempts to alter a committed historical record
  → backend rejects direct mutation of committed events (see Rules.md)
  → if bypassed at the data layer for demo purposes, hash verification
    on that event fails and the passport shows "Integrity Verification Failed"
```

## 2. Domain Model

```
User
 └── Organization
       ├── Apiary
       │     └── Hive
       │           ├── Inspection
       │           └── Harvest
       │                 └── Batch
       │                       ├── QualityTest
       │                       ├── Packaging
       │                       │     └── ProductLot → QR
       │                       └── CustodyTransfer
       └── HashChainEvent (one per lifecycle transition, linked to Batch)
```

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React (SPA) | No Next.js — keep build simple given the timeline |
| Backend | Node.js + Express | REST API |
| Database | PostgreSQL | Batches, users, hives, events |
| Blockchain | App-level hash-chain (primary) + Polygon Amoy testnet (one anchored tx) | Hash-chain must work fully offline; testnet is a supporting proof, never a dependency of the core demo path |
| AI microservice | Python + FastAPI | Anomaly detection only, called over HTTP from Express |
| QR | Generated server-side per Product Lot | Rendered client-side |
| File storage | Local/object storage for MVP | IPFS documented as future work, not wired up live unless time remains |

## 4. Folder & File Structure

```
/client                     React frontend
  /src
    /pages                  BeekeeperDashboard, ConsumerScan, HoneyPassport
    /components             HiveCard, HarvestForm, HashChainView, QRDisplay,
                             PassportCard, StatusBadge (Verified/Pending/Failed)
    /api                    apiClient.js (fetch wrappers per resource)
    /context                AuthContext
/server                      Node/Express backend
  /src
    /routes                 apiary.js, hive.js, inspection.js, harvest.js,
                             batch.js, consumer.js, auth.js
    /models                 Postgres schema/models per domain entity
    /services               hashChain.js, blockchainAnchor.js (Polygon Amoy),
                             aiClient.js (calls AI microservice)
    /middleware              auth.js, roleGuard.js, errorHandler.js
    server.js
/ai-service                  Python FastAPI
  /src
    main.py
    anomaly_detection.py
    seed_data.py             synthetic historical yield data for the demo
/docs                        PRD.md, Architecture.md, Rules.md, Phase.md,
                              Design.md, Memory.md
```

## 5. Role-Based Access (MVP)

- **Beekeeper**: create/read own apiaries, hives, inspections, harvests; read own batches
- **Consumer**: read-only access to a batch's public passport data via QR/batch ID lookup, no auth required
- **Demo/admin action** (stands in for Processor/Distributor in the build): advance a batch's status, record quality test results, trigger packaging + QR generation

## 6. Hash-Chain Design

Each lifecycle transition creates an event record:

```json
{
  "eventId": "uuid",
  "batchId": "HC-GJ-2026-000184",
  "actor": "beekeeper|system|demo-admin",
  "timestamp": "ISO8601",
  "eventType": "HARVEST_CREATED",
  "dataHash": "sha256 of the event payload",
  "previousEventHash": "sha256 of the prior event in this batch's chain"
}
```

Verification walks the chain for a batch and confirms each `previousEventHash` matches the prior event's `dataHash`. Any historical edit breaks this chain and is what the tamper-demo makes visible.
