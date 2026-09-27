# 🍯 HoneyChain — Hackathon Demo & Feature Explanation Guide

> **Smart India Hackathon 2026 (SIH26021)**  
> **Team**: TechSentinels (Team ID: 402)

---

## 📌 PART 1: Feature Explanation ("Which Feature Does What?")

Below is the complete reference explaining what each feature in **HoneyChain** does, why it exists, and how it works under the hood.

---

### 1. 🏡 Beekeeper Management Hub (`#dashboard`)
* **What it does**: 
  - Allows beekeepers to create and manage **Apiaries** (geographic locations e.g. *Gir Forest Organic Apiary #4*, *Sasan Foothills*) and **Hives** (individual bee boxes e.g. *Hive Alpha-1*, *Hive Sasan-A*).
  - Enables logging of **Hive Inspections** (queen health, brood pattern, honey store levels).
  - Enables logging of **Harvest Records** (harvest date, floral source like *Gir Wildflower & Mustard*, yield in kg).
* **Why it exists**: Captures raw provenance data right at the source (the apiary) before any processing or packaging occurs.

---

### 2. 📦 Pre-Seeded Demo Batches Across All Lifecycle Stages
To make live judging 100% seamless, 3 pre-seeded batches are provided out of the box in all 3 supply-chain stages:

| Batch ID | Stage Status | Available Action Button | Demo Purpose |
|---|---|---|---|
| **`#HC-GJ-2026-000185`** | `HARVESTED` | **`Award` Record Quality Test** | Use to demonstrate entering FSSAI lab parameters (moisture, sucrose, HMF). |
| **`#HC-GJ-2026-000186`** | `QUALITY_VERIFIED` | **`Box` Package & Anchor On-Chain** | Use to demonstrate packaging, lot generation, & Polygon Amoy testnet anchoring. |
| **`#HC-GJ-2026-000184`** | `PACKAGED` | **`QrCode` View QR**, **`Zap` Tamper Demo** | Use to demonstrate consumer QR passport lookup & live tamper proofing. |

---

### 3. 🔗 Cryptographic SHA-256 Hash-Chain Engine
* **What it does**:
  - Automatically records every lifecycle event (`HARVEST_CREATED` ➔ `QUALITY_VERIFIED` ➔ `PACKAGED` ➔ `TRANSFERRED`).
  - Each event block computes a cryptographic SHA-256 hash containing its own data payload AND the previous block's hash (`previousEventHash`).
* **Why it exists**: 
  - Guarantees data immutability. If any past record is modified (e.g., someone changes a harvest yield from 18.5 kg to 999 kg), the hashes no longer match, breaking the chain.
  - Operates 100% offline without relying on external servers or network RPC calls.

---

### 4. 🌐 Polygon Amoy Testnet Blockchain Anchoring
* **What it does**:
  - When a batch reaches the `PACKAGED` stage, its final hash is published to the **Polygon Amoy Testnet**.
  - Generates a real transaction hash (e.g., `0x7f83b165...`) that judges can inspect.
* **Why it exists**: 
  - Provides public, decentralized proof that data wasn't just stored locally.
  - Built asynchronously so network latency never slows down the live user interface.

---

### 5. 📜 Public Consumer Honey Passport & QR Scanner (`#scan` & `#passport/<batchId>`)
* **What it does**:
  - Consumers scan a QR code on a honey jar or enter a Batch ID (e.g. `HC-GJ-2026-000184`).
  - Displays the complete digital passport for that specific honey batch:
    - **Apiary & Hive Location** (Junagadh, Gujarat)
    - **Floral Source** (Gir Wildflower & Mustard)
    - **Lab Purity Results** (Moisture 17.5%, Sucrose 3.2%, HMF 12.4 mg/kg)
    - **Custody Journey & Polygon Anchor Link**
    - **Live Cryptographic Status** (🟢 `VERIFIED` vs 🔴 `FAILED`)
* **Why it exists**: Gives consumers 100% verifiable proof of authenticity, replacing unverified paper labels with digital trust.

---

### 6. ⚡ 1-Click Interactive Tamper Demonstration (`Tamper Demo` Modal)
* **What it does**:
  - A special demo tool that allows you to intentionally forge/alter an old record (e.g., changing harvest yield or altering quality test results).
  - Offers 1-click preset buttons:
    - **Forge Event #1 (HARVEST_CREATED yield to 999kg)**
    - **Forge Event #2 (QUALITY_VERIFIED moisture to 45%)**
  - When you view the Honey Passport after tampering, the cryptographic engine detects the mismatch and instantly turns the passport status to 🔴 **"Integrity Verification Failed"**.
  - Includes a **"Restore Integrity"** button to instantly revert the deliberate forgery.
* **Why it exists**: **This is the centerpiece of your hackathon pitch.** It visually proves to judges that data tampering is mathematically impossible to hide.

---

### 7. 🤖 AI Yield Anomaly Detection Microservice (Python FastAPI)
* **What it does**:
  - Runs a Python FastAPI service on port 8000 that evaluates newly logged harvests against historical hive averages using Z-score statistics.
  - If a harvest yield is abnormally high (e.g. +250% higher than historical yield), it flags an **Anomaly Warning** (alerting potential sugar syrup dilution).
* **Why it exists**: Prevents fraudulent yield inflation before honey is submitted for processing.

---

### 8. 🔄 1-Click Demo Reset & Zero-Dependency Database Engine
* **What it does**:
  - Connects to PostgreSQL if available, but automatically falls back to an in-memory JSON file store (`honeychain_store.json`) with pre-seeded demo data if PostgreSQL is offline.
  - On every server launch, or whenever you click the **"⚡ Reset Demo State"** button in the dashboard header, all data instantly resets to pristine original state.
* **Why it exists**: Ensures 100% uptime and allows instant zero-delay data cleanup between judge evaluation rounds.

---

## 🎬 PART 2: Hackathon Demo Guide (Step-by-Step Pitch Script)

Use this **5 to 7 minute pitch script** when presenting to judges.

---

### ⏱️ Minute 0:00 - 1:00 | The Hook & Problem Statement
* **What to say**:
  > *"Respected Judges, over 70% of honey sold in markets today is adulterated with sugar syrup, and consumers have no way to verify if the honey on store shelves is genuine. Existing solutions rely on paper certificates that are easily forged.*  
  >  
  > *We built **HoneyChain** — a digital trust infrastructure for honey supply-chain traceability. Our core innovation is the **Honey Passport**, a complete digital identity for every batch of honey from hive to consumer."*

---

### ⏱️ Minute 1:00 - 2:30 | Beekeeper Flow & AI Anomaly Detection
* **What to do on screen**:
  1. Open `http://localhost:3000/#dashboard`.
  2. Show **Gir Forest Organic Apiary #4** and **Hive Alpha-1**.
  3. Click **Add Harvest** on `Hive Alpha-1`.
  4. Enter:
     - Yield: `18.5 kg`
     - Floral Source: `Gir Wildflower & Mustard`
  5. Click **Save Harvest**.
* **What to say**:
  > *"Here on the Beekeeper Hub, Master Beekeeper Ramesh Patel logs a harvest from Hive Alpha-1. The system automatically creates a new batch and appends the first immutable event: `HARVEST_CREATED`.*  
  >  
  > *Notice that our Python AI microservice immediately analyzes this yield against historical hive averages using Z-score math to flag any suspicious volume spikes that might indicate sugar syrup feeding."*

---

### ⏱️ Minute 2:30 - 4:00 | Lifecycle Advancement & Polygon Anchoring
* **What to do on screen**:
  1. Find pre-seeded batch `#HC-GJ-2026-000185` (Status: `HARVESTED`).
  2. Click **Record Quality Test**:
     - Moisture: `17.5%`, Sucrose: `3.2%`, HMF: `12.4 mg/kg`. Click **Submit**.
     - Notice the batch status advances to **QUALITY_VERIFIED** and the button changes to **Package & Anchor On-Chain**.
  3. Find batch `#HC-GJ-2026-000186` (Status: `QUALITY_VERIFIED`) and click **Package & Anchor On-Chain**:
     - Lot Number: `LOT-GJ2026-9042`, Jar Size: `500g`, Jar Count: `250`. Click **Package**.
  4. Point out the **Polygon Amoy Testnet Transaction Hash** (`0x7f83b165...`).
* **What to say**:
  > *"As the batch moves through the supply chain, lab test results (FSSAI compliance for moisture and HMF) are recorded. When packaged, HoneyChain computes the batch hash and asynchronously anchors it to the Polygon Amoy Testnet for public decentralized proof."*

---

### ⏱️ Minute 4:00 - 5:00 | Consumer Honey Passport Verification
* **What to do on screen**:
  1. Click **Verify Passport** in top navigation (`http://localhost:3000/#scan`).
  2. Click **Instant Demo QR Scan**.
  3. Scroll through the rendered **Honey Passport**:
     - Origin & Apiary Location
     - FSSAI Certified Lab Parameters
     - Full Custody Timeline
     - 🟢 **"Cryptographic Hash-Chain Verified"** badge.
* **What to say**:
  > *"When a consumer scans the QR code on a honey jar, they don't just see marketing claims — they see the verifiable **Honey Passport**. It shows exact hive coordinates, lab test results, and green cryptographic confirmation that no records have been altered."*

---

### ⏱️ Minute 5:00 - 6:30 | The Climax: Live 1-Click Tamper Demo ⚡ & Demo Reset
* **What to do on screen**:
  1. Go to the Honey Passport (or return to `#dashboard`).
  2. Click **Simulate Tamper** / **Tamper Demo** on batch `#HC-GJ-2026-000184`.
  3. Click **Forge Event #1 (HARVEST_CREATED yield to 999kg)** or **Forge Event #2 (QUALITY_VERIFIED moisture to 45%)**.
  4. Observe that the passport badge instantly turns 🔴 **INTEGRITY VERIFICATION FAILED** with red hash mismatch callouts!
  5. Click **Restore Original Chain Data** / **Restore Integrity** to reset the cryptographic proof back to 🟢 **VERIFIED**.
  6. *(Cleanup for next judge round)*: Click **Reset Demo State** in the Beekeeper Hub header anytime to restore all database tables back to original pristine state!
* **What to say**:
  > *"Now for the ultimate test of digital trust. What if a bad actor attempts to alter the database to cover up adulterated honey?*  
  >  
  > *(Inject Forgery)*  
  >  
  > *Notice what happens instantly when we view the passport: The cryptographic hash chain breaks! The passport immediately flags **Integrity Verification Failed** in bold red. Mathematical proof makes secret tampering 100% impossible."*

---

## 🎯 PART 3: Judge Q&A Cheat Sheet (Top Questions & Winning Answers)

| Judge Question | Winning Answer |
|---|---|
| **Q1: "Why do you use an off-chain hash chain AND Polygon?"** | *"Public blockchains are great for public proof, but they can be slow and require gas fees. Our SHA-256 hash-chain provides zero-cost, instant offline verification, while Polygon testnet anchoring periodically commits checkpoints for public immutability."* |
| **Q2: "How do you verify the beekeeper isn't lying at the start?"** | *"We use a two-step defense: First, our AI microservice flags statistical yield anomalies (unusual volume spikes). Second, mandatory FSSAI certified lab quality testing (checking sucrose % and HMF mg/kg) is required before any batch can be packaged."* |
| **Q3: "What if there is no internet at the apiary in rural India?"** | *"HoneyChain is built offline-first! The cryptographic hash chain and DB run locally on the beekeeper's device without internet. When connectivity becomes available, data syncs asynchronously to the server and Polygon testnet."* |
| **Q4: "How does this scale across India?"** | *"We integrate with Honey FPOs (Farmer Producer Organizations) and National Beekeeping & Honey Mission (NBHM) infrastructure, allowing co-operatives to onboard thousands of local beekeepers seamlessly."* |
| **Q5: "How do you reset data between judge rounds?"** | *"We built a 1-click 'Reset Demo State' button into the dashboard header. Every time the server launches or the reset button is clicked, all database records return to original pristine demo state instantly."* |

---

*Good luck with your Smart India Hackathon presentation! Team TechSentinels (Team ID: 402) 🚀*
