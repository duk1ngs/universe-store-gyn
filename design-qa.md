# Design QA — Universe Store Gyn

## Current release review

- Source of truth: the existing project and its approved iPhone 18 Pro color-orbit interaction. The previously supplied visual reference was used for direction, not pixel matching.
- Local implementation: `http://127.0.0.1:5173/`.
- Browser review: Codex in-app Chromium at 1440 × 900 and 390 × 844 CSS pixels, plus a fresh-origin intro check.
- Product-first hero, monochrome intro, color transitions, section sequence, WhatsApp links, logo contrast, and footer reviewed visually.

## Findings and resolutions

1. The former white hero competed with the approved product experience. The interactive iPhone scene is now the first section after the intro.
2. White section surfaces broke the new direction. Product, reputation, store, map, and footer surfaces were recomposed on a black/graphite system with white typography and controlled separators.
3. The supplied iPhone renders contain a black rectangular image plane. A tight device silhouette crop removes that plane while preserving the approved assets; `screen` blend was removed because it prevented a silver-to-black material change.
4. The mobile color caption touched the device. The mobile stage was lengthened so the device and caption have distinct space.
5. Automatic color cycling waits for the intro to complete; the intro's black-hole moment remains separate from the interactive product scene.

## Verification

- Intro: black-hole field, monochrome lockup, name/skip controls, and soft exit into the hero.
- Hero: color orb, contact-timed single-image change, changing caption and contextual WhatsApp CTA. The ambient glow follows the selected color without replacing the black background.
- Scroll: product scale/lift/orbit response; the selected color influence fades as the hero exits. Existing intersection-based reveals continue through the later sections.
- Mobile: recomposed title/product/controls, no horizontal document overflow, legible service rail and remaining sections.
- Reduced motion: CSS disables transforms/reveals and the ambient canvas stops animating; color selection remains available through the component's reduced-motion path.
- Performance: ambient WebGL field uses low-power context, DPR cap and 20 FPS cap; the intro black-hole canvas is mounted only during intro, capped at DPR 1 and approximately 30 FPS; both canvases pause when the page is hidden.
- Browser console: no errors in the reviewed local session.
- TypeScript, ESLint, production build, and `git diff --check`: passed.

## Color and intro refinement — 2026-09-30

- Root cause: the earlier two-image material reveal mixed outgoing and incoming product states, especially on blue → black. A delayed second ambient layer could keep the previous hue visible after the selected-color orb had already passed.
- Resolution: pre-decode the destination, keep exactly one product image and one ambient layer, then update both at the orb's contact point. The last manual color request wins; automatic cycling does not overwrite manual input and pauses after it. The hero ambience stays isolated and fades with scroll.
- Desktop review: black, silver, cherry and blue states, intermediate reveal, color ambience, orbital depth and the exit into the next black section. No product geometry shift or black image rectangle observed.
- Mobile review at 390 × 844 CSS pixels: intro entry, hero and controls, rapid Prata → Cereja → Azul selection (final state Azul), contextual CTA, no horizontal overflow.
- Intro: the existing Black Hole shader now uses defined smoothstep edges, a restrained halo/disk, sparse stars and orbital linework; monochrome logo and controls remain legible. The orbit and hole recede during the existing opening transition into the hero.
- Reduced motion: reviewed CSS and component path; orbit/reveal animation is suppressed and color selection commits directly. A live OS/browser reduced-motion emulation was not available in this review.
- Scroll expansion: adapted only the useful depth principle through mild orbit expansion and existing product scale/lift. The registered external Scroll Expansion Hero has no executable source and its full interaction would compete with color controls and mobile length.
- Console errors: none in the reviewed local browser session. TypeScript, ESLint, production build and Design Intelligence library tests passed.

## Orb-first transition and shared fluid field — 2026-09-30

- The hero sequence preserves the original order: the selected-color orb travels first; at contact, the single product image and the single local atmosphere change together. No second product image, material mask or delayed ambient overlay remains.
- Orb fill, border, halo and orbit response derive from one exact variant color. The automatic demonstration waits seven seconds and yields to manual selection.
- The validated Be Store fluid-field component was adapted directly into `UniverseAmbient` as a monochrome global layer. Section surfaces remain translucent enough to reveal depth while the iPhone hero retains its isolated color ambience.
- The intro uses its own fluid-field instance beneath a transparent WebGL Black Hole, orbital dust and restrained status markers. Its background remains opaque until exit, so the hero cannot appear through it prematurely.
- Browser review for this correction: intro and hero at 1280 × 720 and 390 × 844; blue → black before contact, at contact and stable. At every sampled state the hero contained exactly one product image; orb fill, border and glow resolved to `#292a2c` for Preto, the device and ambience changed together at contact, mobile had no horizontal overflow, and the console had no errors.

## Fluid intro field, original hero reveal and luminous actions — 2026-10-01

- The topographic field was replaced by the actual monochrome simplex-noise field used in the Be Store intro. The same fluid shader now spans the full Universe site and remains independent from the hero's selected-product color.
- The hero returned to its first choreography: the exact selected-color sphere crosses the stage while a left-to-right mask reveals the next finish. Destination assets are still decoded before the sequence and queued manual input is preserved.
- `ShinyButton` is saved under `components/ui` and extends the existing Universe button primitive. Main CTA links, editorial pills, intro actions and the floating WhatsApp action share the same subtle conic edge and inner light pass, using graphite/white palette tokens instead of the supplied blue.
- Desktop inspection confirmed the intro, fluid atmosphere, four color controls, intermediate `crossing` state, CTA treatment and zero console errors. The measured intermediate device mask was active (`color-device-reveal`, non-final inset) while the sphere was still crossing.
- Mobile inspection at 390 × 844 confirmed the recomposed hero, fixed WhatsApp control, seven shiny actions, one global fluid canvas, no horizontal overflow (`scrollWidth === clientWidth`) and zero console errors.
- TypeScript, ESLint, production build and `git diff --check`: passed.

## Editorial safeguards

- Product availability is not asserted as fact; the copy asks visitors to confirm model, launch, and stock with the store.
- Reviews and local store details remain as supplied in the existing project.
- Product imagery remains the project's existing asset set; no synthetic replacement was introduced in this change.
