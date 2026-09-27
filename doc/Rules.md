# Rules.md — HoneyChain

## 1. What to Use

- Standard, well-documented libraries only — favor stability over novelty given the timeline
- React Context/hooks for frontend state — no Redux or other state library unless a genuine need appears
- Environment variables (`.env`, never committed) for all secrets, API keys, and the testnet wallet key
- A single consistent API response shape across all Express routes: `{ success, data, error }`

## 2. What to Avoid

- Do not introduce a second frontend framework, a second database, or a second blockchain approach mid-build
- Do not attempt live IPFS integration unless the core flow is fully working with time to spare
- Do not make the live demo path depend on a public testnet call succeeding in real time — the hash-chain must verify fully offline/locally; the Polygon Amoy transaction is a supporting proof shown separately, not a dependency of the passport view
- Do not add features not listed in PRD.md's MVP scope without updating PRD.md first — scope creep is the primary risk to this build

## 3. Error Handling

- Every API route must catch and handle errors — never let the server crash on bad input
- Validation errors return `400` with a clear message; auth errors `401/403`; not found `404`
- A hash-chain verification failure is not an error to suppress — it is a first-class UI state (`INTEGRITY_FAILED`) and must be handled explicitly, since it is the tamper-demo's payoff

## 4. Boundaries for AI

**For the coding agent building this project:**
- Do not invent business logic (quality thresholds, pricing, certification criteria) — flag it as an open question rather than guessing silently
- Do not skip or simplify the hash-chain/tamper-demo path to save time — it is the highest-priority feature in this build, not optional polish
- If a requested change conflicts with PRD.md or this file, say so before implementing it

**For the in-app anomaly detection feature:**
- Read-only and flag-only — it must never modify a record
- Output is phrased as a flag or estimate ("Unusual productivity decline detected"), never as a certified verdict
- It operates only on data already in the application — it must not invent agricultural facts

## 5. Immutability Rule

Once a lifecycle event (harvest, quality test, packaging, custody transfer) is committed and hash-chained, no API route may allow a direct edit or overwrite of that event's stored data. A correction must be implemented as a new, separately hash-chained event linked to the original — never as a mutation of history. This rule is what the tamper-demo is built to prove.
