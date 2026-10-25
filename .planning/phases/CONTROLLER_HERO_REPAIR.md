# Phase Plan: Controller Hero Repair & Responsive Polish

## Objective
Repair the oversized PlayStation-style controller GLB in the Riyadah Elite landing page hero, ensuring it occupies 35–45% of the desktop hero width, is positioned in the center-right, never overlaps text, and maintains smooth pointer/scroll interactions.

## Baseline & Root Cause Diagnosis
1. **Model Dimensions**:
   - Controller bounds: `min: [-1.0, -0.65, -0.41]`, `max: [1.0, 0.65, 0.41]`.
   - Native width: `2.0m`, height: `1.30m`, depth: `0.82m`, centered at `[0, 0, 0]`.
2. **Oversized Root Cause**:
   - `HeroScene3D.web.tsx` previously had `mainScale = 1.48`, resulting in width `2.96m` and height `1.92m`.
   - In a camera frustum with `fov: 45` at distance `3.8m` (frustum height `3.15m`, width `~5.59m`), a model width of `2.96m` occupied over 53% of the entire viewport and was positioned at `groupX = 0.62`.
   - With `groupX = 0.62` and half-width `1.48`, the left edge reached `-0.86`, directly invading and covering the headline, description, CTAs, and statistics on the left side of the screen.
   - It also caused severe vertical cropping across the top triggers and bottom grips.

## Implemented Tasks
- [x] Task 1: Normalize controller scale to `0.54` on desktop and reposition staging group to `groupX = 1.35`, `groupY = 0.0` in `HeroScene3D.web.tsx`.
- [x] Task 2: Retune camera default pose (`[0, 0.04, 3.8]`) and 4-stage scroll trajectory so the controller remains consistently framed across all stages without zooming in or cropping. Fixed first-frame camera initialization to prevent `(0, 0, 0)` NaN matrix.
- [x] Task 3: Adjust `ContactShadows` and lighting in `HeroSection.web.tsx` to align with the normalized controller coordinates (`controllerX = isMobile ? 0 : 1.35`) and scale.
- [x] Task 4: Tune responsive layout for wide desktop, laptop, tablet, and mobile portrait viewports with a dedicated mobile spacer (`block lg:hidden h-72 w-full my-4 pointer-events-none`) preventing text/CTA collision.
- [x] Task 5: Run TypeScript (`npx tsc --noEmit`), linter (`npx expo lint`), and production web export (`npx expo export --platform web`).
- [x] Task 6: Execute Ralph Loop acceptance-driven iteration against visual criteria.
- [x] Task 7: Execute CodeRabbit / Code Review audit and repair actionable findings.
- [x] Task 8: Verify in real browser using `browser_subagent` and capture before/after screenshots.

## Acceptance Criteria
- [x] Controller is between 35% and 45% of the desktop hero width (~38% at scale 0.54, width 1.08m).
- [x] Left text column (headline, description, CTAs, stats) is 100% unobstructed (>280px horizontal clearance on desktop).
- [x] Controller is not cropped at top, bottom, or sides.
- [x] Both analog sticks, face buttons, D-pad, touchpad, and grips are clearly visible in a 3/4 view.
- [x] Pointer interaction remains smooth, bounded, and glides back to resting pose.
- [x] Scroll animation does not cause unexpected enlargement or cropping.
- [x] Mobile and tablet layouts stack cleanly without horizontal overflow.
- [x] TypeScript, lint, and web export pass with 0 errors.
