# PRD.md — HoneyChain Product Requirements Document

## 1. Problem Statement

**SIH26021** calls for a solution to honey supply-chain traceability. Honey adulteration and lack of provenance verification undermine consumer trust and beekeeper livelihoods. There is no accessible, verifiable way for a consumer to know where their honey actually came from, how it was processed, or whether records have been tampered with.

## 2. Vision

**"Every drop of honey should have a verifiable story."**

HoneyChain is not a website that stores honey records on a blockchain — it is a digital trust infrastructure for the honey supply chain, built around a single flagship concept: the **Honey Passport**, a complete, verifiable identity for every batch of honey, from hive to consumer.

## 3. Target Users

### Built for the MVP demo:
- **Beekeeper** — manages apiaries and hives, logs inspections, creates harvests and honey batches
- **Consumer** — scans a QR code on a honey product and sees the full, verifiable Honey Passport

### Represented in the architecture, simplified in the build:
- **Processor** — receives a batch, records a quality test and processing step, creates a packaging lot. Implemented as a simplified "advance batch status" action rather than a full portal.
- **Distributor** — records custody transfer of a packaged lot. Same simplified treatment.
- **Admin / Government verifier** — audits records, sees traceability coverage across the ecosystem. Documented in the architecture and pitch as the natural next phase; not required to function in the live build.

## 4. MVP Feature Scope (build these)

- Beekeeper creates an apiary → creates a hive → logs an inspection → creates a harvest
- A harvest generates a **Honey Batch** with a unique ID (e.g. `HC-GJ-2026-000184`)
- Batch lifecycle: **Harvest → Quality Test (manual entry) → Packaging → Product Lot → QR generation**
- Every lifecycle transition writes a **hash-chain event**: `{eventId, batchId, actor, timestamp, eventType, dataHash, previousEventHash}`
- One lifecycle event per demo batch is also anchored as a **real transaction on the Polygon Amoy testnet**, used specifically to prove the concept is not simulated theater
- Consumer scans/enters a QR code and sees the **Honey Passport**: origin, floral source, harvest date, quality result, custody journey, and live blockchain verification status
- **Tamper demonstration**: attempting to alter a previously committed record must visibly fail integrity verification in the UI — this is the centerpiece of the demo and must be 100% reliable
- **AI anomaly detection**: flags unusual drops in a hive's harvest yield compared to its own history — the only AI feature in the MVP build

## 5. Explicitly Out of Scope for the Build

(Present these in the pitch deck as roadmap — do not attempt to build them live)

- Full Processor, Distributor, and Admin dashboards
- Live IPFS document storage
- Harvest yield prediction, hive risk scoring, conversational AI assistant
- Multi-language / vernacular UI
- Real integration with government or cooperative data sources

## 6. Success Criteria

- A judge can watch a 5–7 minute demo: beekeeper creates a harvest → batch advances through the chain → consumer scans QR and sees a verified passport → a tamper attempt is caught live, on screen, every time
- The team has a confident, rehearsed answer to *"how do you verify a beekeeper or batch is real?"* — answer: an in-app admin-approval step for beekeeper onboarding today, with cooperative/FPO partnership as the phase-2 answer to scale verification
- Nothing in the live demo depends on public network latency (testnet call is a supporting proof point, not a dependency of the core flow)

## 7. Non-Functional Requirements

- Demo must run reliably offline/on a local network if needed
- All UI states (verified / pending / failed) must be visually unambiguous from across a room
- No feature may claim a certification or scientific guarantee the team hasn't earned — AI output is framed as a flag/estimate, not a verdict
