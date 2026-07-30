# Open Dealer MCMDS landing page — design QA

## Latest MCMDS refresh

- Updated against MCMDS commit `7afec8c` (`Merge remote skill updates`).
- Added the reusable `assets/mcmds.css` foundation and bundled Departure Mono font.
- Replaced the earlier warm-neutral page palette with the canonical cool-neutral light and dark roles.
- Applied role-based typography: Indivisible for display and editorial leads, Inter for interface and reading copy, and Departure Mono for step identifiers and technical readouts.
- Reduced repeated section scale, decorative rules, and default dividers.
- Rebuilt the process and integration groups around subtle adjacent surfaces and compact gutters.
- Preserved the existing Open Dealer content, responsive structure, navigation, theme control, and conversion links.

## Comparison target

- Source visual truth:
  - `/Users/bmcmillin/Documents/Codex/2026-07-24/genr/work/opendealer-source/source-desktop-00.png`
  - `/Users/bmcmillin/Documents/Codex/2026-07-24/genr/work/opendealer-source/source-mobile-00.png`
  - `/Users/bmcmillin/Documents/Codex/2026-07-24/genr/work/opendealer-source/source-mobile-faq-open.png`
- Implementation:
  - `http://127.0.0.1:4173/`
  - `/Users/bmcmillin/Documents/Codex/2026-07-24/genr/work/opendealer-qa/implementation-desktop-final.png`
  - `/Users/bmcmillin/Documents/Codex/2026-07-24/genr/work/opendealer-qa/implementation-mobile-final.png`
  - `/Users/bmcmillin/Documents/Codex/2026-07-24/genr/work/opendealer-qa/implementation-mobile-menu-open-v1.png`
  - `/Users/bmcmillin/Documents/Codex/2026-07-24/genr/work/opendealer-qa/implementation-mobile-09-v1.png`
- Combined comparison evidence:
  - `/Users/bmcmillin/Documents/Codex/2026-07-24/genr/work/opendealer-qa/combined-comparison-v2.png`

## Viewports and normalization

- Desktop CSS viewport: `1440 × 900`, `deviceScaleFactor: 1`.
  - Source capture pixels: `1432 × 895`.
  - Implementation capture pixels: `1440 × 900`.
- Mobile CSS viewport: `390 × 844`, `deviceScaleFactor: 1`.
  - Source capture pixels: `382 × 827`.
  - Implementation capture pixels: `390 × 844`.
- The in-app browser trimmed a few edge pixels from the source captures. The combined comparison scales each source and implementation pair to the same display width; no density conversion was otherwise required.
- State: dark/system appearance, menu closed for opening comparisons, first FAQ open for the focused interaction comparison.

## Full-view comparison

The implementation preserves the source page's core information architecture and conversion path: brand/navigation, inventory-and-AI promise, direct-VDP message, three dealership benefits, four-step distribution pipeline, partner integrations, marketplace comparison, FAQs, and pricing CTA.

The visual differences are intentional and required by the MCMDS brief: the source's centered pink SaaS hero becomes an editorial left-aligned composition with warm-orange signal color, thin rules, quieter metadata, and a structured distribution artifact. The implementation improves the source's mobile opening, where the original hero content begins below an almost-empty first viewport.

## Focused region comparison

The mobile FAQ open state was compared in the combined evidence. Both versions preserve the same question, answer, open/closed affordance, and stacked reading order. The implementation uses native `details`/`summary`, sentence-case state labels, and MCMDS spacing while retaining the source content.

Additional focused evidence:

- Mobile comparison table: `implementation-mobile-08-v1.png`.
- Partner integrations: `implementation-desktop-04-v1.png` and `implementation-mobile-06-v1.png`.
- Mobile menu open state: `implementation-mobile-menu-open-v1.png`.

## Required fidelity surfaces

### Fonts and typography

- Indivisible, Inter, and Departure Mono loaded successfully (`document.fonts.check(...) === true`).
- Display headings and editorial leads use Indivisible; interface and reading copy use Inter; genuine technical metadata uses Departure Mono.
- Display headings use medium weight, tight tracking, and sentence case.
- Body, navigation, ordinary metadata, buttons, table content, and captions use normal tracking.
- Desktop and mobile wrapping is intentional and free of overlap or truncation.

### Spacing and layout rhythm

- Shared gutters are `48px` desktop and `20px` mobile.
- Major sections use the MCMDS `72px`/`112px`/`144px` rhythm.
- Process and integration objects use the updated surface-first hierarchy with `4px` gutters instead of persistent divider architecture.
- Desktop and mobile document widths match their viewports; horizontal overflow is `0`.
- The comparison table becomes stacked mobile rows rather than horizontally scrolling.
- Containment is limited to the operational inventory artifact and repeated integration cells.

### Colors and visual tokens

- Both MCMDS light and dark palettes were rendered and checked.
- Light roles use `#ffffff`, `#f7f8fa`, `#f2f4f7`, and `#30343b`; dark roles use `#000000`, `#050607`, `#0b0d10`, and `#d1d5db`.
- Theme control successfully cycled system → light → dark → system.
- Warm orange is limited to CTAs, emphasis, rules, and limited-state signals.
- Acid lime is used only for the distribution-ready status.
- Header/footer retain a dark field so the official light wordmark remains unmodified and legible.

### Image quality and asset fidelity

- The official Open Dealer wordmark and favicon are embedded from the source SVG assets.
- ChatGPT, MCP, Google, JSON-LD, and Schema.org marks are embedded from the source SVG assets.
- All images loaded with non-zero natural dimensions.
- No source logo, partner mark, or icon was replaced with a handmade drawing, placeholder, or hotlink.

### Copy and content

- The source's main promise, benefits, process, comparison claims, five FAQ answers, and closing CTA are preserved.
- Copy was condensed only where needed for the user's requested simple single-page version.
- External pricing and contact links resolve to the source site and open in a new tab.

## Interaction and browser checks

- Desktop theme control: passed.
- Mobile menu open/close and `aria-expanded`: passed.
- FAQ open/close and answer visibility: passed.
- Internal section anchors: every target exists.
- External CTA `href`, `target`, and `rel`: verified.
- Console warnings/errors: none.
- Embedded image loading: passed.
- Indivisible font loading: passed.

## Comparison history

### Pass 1

- [P2] The desktop header CTA inherited muted navigation text color.
  - Fix: raised selector specificity for the header CTA and verified warm-white text on the orange background.
- [P2] At a `1280 × 720` browser window, the opening composition extended beyond the first viewport and partially hid the CTA/evidence footer.
  - Fix: added a desktop short-viewport layout using reduced hero spacing and compact evidence rows.

### Pass 2

- Post-fix evidence: `implementation-desktop-top-v3.png`.
- CTA and evidence panel fit fully within the `1280 × 720` opening.
- Desktop `1440 × 900` and mobile `390 × 844` captures have no actionable P0/P1/P2 findings.

## Findings

No actionable P0, P1, or P2 findings remain.

## Open questions

None.

## Implementation checklist

- [x] Preserve the Open Dealer content model and core conversion path.
- [x] Apply MCMDS typography, color, spacing, radius, containment, and sentence case.
- [x] Embed real source brand and partner assets.
- [x] Support responsive desktop/mobile layouts without horizontal overflow.
- [x] Support light and dark appearances.
- [x] Test navigation, theme, FAQ, CTA attributes, fonts, assets, and console output.

## Follow-up polish

- [P3] If this becomes more than a proof of concept, replace the external pricing CTA with the intended production conversion flow.

final result: passed
