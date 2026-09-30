# Design QA — Universe Store Gyn

## Evidence

- Source of truth: `C:/Users/Eduardo/AppData/Local/Temp/codex-clipboard-56c27221-0c05-4156-919c-a76e15224c94.png`
- Motion reference: `C:/Users/Eduardo/Downloads/WhatsApp Video 2026-09-29 at 15.57.54.mp4`
- Implementation: `http://127.0.0.1:5173/`
- Browser evidence: Codex in-app browser, Chromium surface, DPR 1.
- Full-view checks: 1280 × 720 and 1024 × 832 CSS pixels.
- Focused responsive check: 390 × 844 CSS pixels.
- Comparison evidence: side-by-side 1024 × 832 capture created during QA from the supplied reference and the live implementation. The temporary comparison route and copied reference asset were removed after verification.

## Scope verified

- Product-free, centered hero and centered intro.
- Minimal black-hole treatment in the intro.
- Dark modular product cards using the project's own supplied assets.
- Shared outlined CTA and plus-control language with restrained fade reveals.
- Interactive iPhone 18 Pro color orbit with stable device geometry, manual selection, automatic in-view progression, contextual CTA and WhatsApp message.
- Responsive stacking, mobile navigation, no horizontal overflow, and reduced-motion code paths.

## Comparison history

1. P2 — The reference-style feature card stacked too early at 1024 px. Fixed by moving the single-column breakpoint to 700 px.
2. P2 — Variant renders showed a black rectangular image plane. Fixed with controlled screen blending on the device layers.
3. P2 — Feature-card scale and media crop differed from the reference. Refined the grid width, title scale, card proportions, media height, and responsive typography.
4. Rechecked the corrected desktop composition and mobile layout. No P0, P1, or P2 discrepancies remained.

## Interaction and technical checks

- Color selector: selecting **Cereja** set `aria-pressed="true"`, updated the label and changed the CTA to “Quero conhecer em Cereja”.
- Automatic progression: verified after a clean reload; motion pauses outside the viewport and complex cycling is disabled for reduced motion.
- Browser console: no errors during desktop and mobile checks.
- Mobile overflow: `clientWidth` matched `scrollWidth`.
- Intentional differences: project-provided product/editorial photography replaces the reference imagery; the sticky site header remains part of the real page composition.

## Final result

passed
