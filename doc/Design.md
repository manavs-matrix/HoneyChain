# Design.md — HoneyChain

## 1. Color Palette

**Primary — honey/amber**
- Primary: `#E8A33D` (warm honey gold) — brand color, primary buttons, active states
- Primary-dark: `#C9822A` — hover states, headings on light background
- Primary-light: `#F7D9A0` — subtle backgrounds, highlight fills

**Neutrals**
- Background: `#FFFBF2` (warm cream, not stark white)
- Surface/card: `#FFFFFF`
- Text primary: `#2B2118` (warm charcoal, not pure black)
- Text secondary: `#6B5B4A`
- Border: `#E8DFCF`

**Semantic states** (carry a lot of the demo's storytelling — must be unmistakable at a glance)
- Verified / success: `#2F9E44` (green)
- Pending / in progress: `#E8A33D` (same as primary amber, reinforces brand)
- Failed / integrity alert: `#D9432E` (red)

## 2. Typography

- **UI/body text:** Inter — clean, highly readable under demo lighting or screen-share compression
- **Headings / Passport title treatment:** a slightly warmer serif or rounded display face (e.g. Fraunces or Poppins for headings) to give the Honey Passport a "certificate" feel without looking playful
- Base size 16px, headings scale 1.25–1.5x per level, generous line-height (1.5+) for readability at a distance

## 3. Tone

Calm, premium, trustworthy — closer to a certification/ID document than a typical dashboard. Avoid heavy gradients, drop shadows, or decorative flourishes that can look unfinished under time pressure; let the amber palette and clear status colors carry the visual identity.

## 4. Key Components

**Honey Passport card**
- Card-based layout, not a data table
- Clear checkmark row for each verification stage (Source, Harvest, Quality, Processing, Packaging)
- Large, unmissable status badge at the top: VERIFIED (green) or INTEGRITY FAILED (red)

**Custody/journey timeline**
- Vertical (mobile) or horizontal (desktop) timeline: Apiary → Harvest → Processing → Quality → Packaging → Distribution → Consumer
- Each stage marked complete/pending with the semantic colors above

**Dashboards**
- Data-dense but calm: stat cards (hives, apiaries, kg harvested) at the top, list/table views below
- Anomaly flags rendered as a distinct amber/red callout, not buried in a table row

**QR / Scan flow**
- Large, centered QR code on the product lot view
- Scan result transitions directly into the Passport card — no intermediate loading screens beyond a brief spinner
