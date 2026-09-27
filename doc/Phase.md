# Phase.md — HoneyChain Build Phases

Treat this as a 36-hour hackathon build. Adjust hour ranges to your actual window, but keep the order and priority — Phase 2 (hash-chain) and Phase 5 (tamper demo) are the highest-priority phases in the whole build.

## Phase 0 — Setup (hour 0–2)
**Goal:** working skeleton, everyone can run the project locally.
- Repo scaffolding per Architecture.md's folder structure
- Postgres schema for the domain model
- Environment config (`.env.example`), base Express server, base React app
- **Needs:** 1 backend, 1 frontend

## Phase 1 — Beekeeper core flow (hour 2–10)
**Goal:** a beekeeper can create the full chain of data up to a harvest.
- Apiary CRUD, Hive CRUD, Inspection logging
- Harvest creation → generates a Batch with a unique ID
- Basic beekeeper dashboard UI
- **Needs:** 2 backend/frontend

## Phase 2 — Batch lifecycle + hash-chain (hour 10–18)
**Goal:** the traceability core — this is the most important phase in the build.
- Quality test entry, packaging, product lot creation
- Hash-chain event writing on every transition
- Chain verification logic (walk events, confirm hash links)
- One Polygon Amoy testnet transaction wired up and demonstrable
- **Needs:** 1–2 backend, 1 blockchain-focused member

## Phase 3 — Consumer + QR (hour 18–24)
**Goal:** the full consumer-facing payoff.
- QR generation per Product Lot
- Scan/lookup flow → Honey Passport page
- Passport renders origin, quality, journey timeline, and verification status
- **Needs:** 1–2 frontend

## Phase 4 — AI anomaly detection (hour 24–28)
**Goal:** one working, honest AI feature.
- FastAPI service with seeded/synthetic historical yield data
- Anomaly flag surfaced on the beekeeper dashboard
- **Needs:** 1 AI/ML-focused member

## Phase 5 — Tamper demo + polish (hour 28–33)
**Goal:** the demo's centerpiece is bulletproof.
- Build and rehearse the tamper-detection scene until it fails and recovers predictably every time
- Seed realistic-looking demo data (apiaries, hives, a full batch already at "Distributed" status)
- UI polish pass on Passport and dashboard views
- **Needs:** whole team

## Phase 6 — Rehearsal & buffer (hour 33–36)
**Goal:** a demo the team can run without thinking.
- Full run-throughs of the 5–7 minute demo script
- Fix only what breaks — no new features
- Confirm answers ready for likely judge questions (data authenticity, blockchain necessity)
- **Needs:** whole team
