---
name: Riyadah Elite
colors:
  surface: '#0a0f35'
  surface-dim: '#0a0f35'
  surface-bright: '#31365d'
  surface-container-lowest: '#050930'
  surface-container-low: '#13183d'
  surface-container: '#171c41'
  surface-container-high: '#21274c'
  surface-container-highest: '#2c3258'
  on-surface: '#dfe0ff'
  on-surface-variant: '#c5c5da'
  inverse-surface: '#dfe0ff'
  inverse-on-surface: '#282d53'
  outline: '#8f8fa3'
  outline-variant: '#444557'
  surface-tint: '#bcc2ff'
  primary: '#bcc2ff'
  on-primary: '#00169d'
  primary-container: '#233dff'
  on-primary-container: '#d0d3ff'
  inverse-primary: '#2640ff'
  secondary: '#92ccff'
  on-secondary: '#003351'
  secondary-container: '#3698d9'
  on-secondary-container: '#002c47'
  tertiary: '#adcae1'
  on-tertiary: '#153345'
  tertiary-container: '#446073'
  on-tertiary-container: '#bcdaf1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#bcc2ff'
  on-primary-fixed: '#000a64'
  on-primary-fixed-variant: '#0022da'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#92ccff'
  on-secondary-fixed: '#001e31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#c8e6fd'
  tertiary-fixed-dim: '#adcae1'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#2d4a5c'
  background: '#0a0f35'
  on-background: '#dfe0ff'
  surface-variant: '#2c3258'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  gutter: 1.5rem
  container-max: 1280px
---

## Brand & Style

This design system powers a high-performance, two-sided gaming SaaS ecosystem tailored exclusively for competitive tournament operations and rigorous game testing telemetry. It merges the electric adrenaline of esports with the clinical precision of enterprise developer tooling.

The aesthetic fuses **Modern Gaming SaaS** and **Frosted Glassmorphism**: deep oceanic night canvases, sharp electric luminescent boundaries, soft-edged controller silhouettes, and translucent telemetry surfaces. The visual tone commands professional credibility for game studios while exciting competitive players with energetic, glowing focal points.

## Colors

The palette directly honors the brand tokenology with an intense dark foundation and layered atmospheric blue lighting:

- **Neutral Dark Canvas (`#050A30`)**: Deep Navy forms the zero-layer background, rendering deep contrast for data panels, brackets, and telemetry streams.
- **Primary Accent (`#233DFF`)**: Electric Blue powers interactive primaries, glowing outlines, active tab indicators, and tournament bracket milestones.
- **Secondary Accent (`#5CB6F9`)**: Radiant Cyan/Primary Blue serves as an illuminating glow layer, state indicators, hover accents, and metrics callouts.
- **Tertiary Accent (`#CAE8FF`)**: Light Sky Blue provides soft ambient rim lighting, badge backgrounds, and secondary metadata highlights.
- **Surface Neutrals & Overlays**:
  - `surface-elevated`: `rgba(13, 22, 69, 0.7)` with `backdrop-filter: blur(16px)`.
  - `border-glow`: `rgba(35, 61, 255, 0.18)` on idle cards, stepping up to `rgba(92, 182, 249, 0.45)` on active focus.
  - `text-primary`: `#F7FBFF` (Soft White).
  - `text-secondary`: `rgba(202, 232, 255, 0.7)`.
  - `text-muted`: `rgba(202, 232, 255, 0.45)`.

## Typography

Typography establishes an intentional contrast between technological precision and readable clarity:

- **Headlines & Structural Labels (`Space Grotesk`)**: Provides mechanical rhythm, engineered angles, and a futuristic esports identity. Used for page heroes, section anchors, stats callouts, and tournament headers.
- **Body & Telemetry Copy (`Plus Jakarta Sans`)**: Delivers geometric balance and open letterforms, preventing eye fatigue during lengthy bug testing reports or rules documentation.
- **Casing Rules**: Use uppercase with extended tracking (`letter-spacing: 0.08em`) exclusively on `label-sm` badges (e.g., `LIVE`, `BRACKET CLOSING`, `QA COMPLETED`). Headlines retain title casing or sentence casing to preserve natural cadence.

## Layout & Spacing

The layout is anchored around a 12-column responsive fluid grid on desktop and a single/double column structure on mobile:

- **Desktop (1024px+)**: Max content container capped at `1280px` with `24px` gutters and centered margins. Multi-column cards support side-by-side tournament schedules and testing feedback pipelines.
- **Tablet (768px – 1023px)**: 8-column configuration with `20px` margins. Dense statistics collapse into 2-column modules.
- **Mobile (320px – 767px)**: Fluid single-column stacking with `16px` outer gutters. Navigation switches to an elevated sticky bottom-rail or slim controller-style header bar with thumb-accessible trigger points.
- **Rhythm Principle**: Internal card padding scales between `space-lg` (desktop) and `space-md` (mobile). Section margins employ generous vertical breathing room (`space-3xl`) to let glowing backdrops diffuse naturally.

## Elevation & Depth

Visual depth is achieved through layered frosted glass and radial electric illuminations rather than heavy drop shadows:

- **Base Layer (Elevation 0)**: Background `#050A30` adorned with subtle atmospheric radial gradients (`radial-gradient(circle at 50% 0%, rgba(35,61,255,0.18) 0%, transparent 60%)`).
- **Surface Cards (Elevation 1)**: `background: rgba(8, 16, 54, 0.65)`, framed by `backdrop-filter: blur(18px)` and a hairline border of `1px solid rgba(35, 61, 255, 0.18)`.
- **Hover & Active Modals (Elevation 2)**: Glow amplification via `box-shadow: 0 0 28px -4px rgba(35, 61, 255, 0.35), inset 0 1px 0 rgba(202, 232, 255, 0.15)`.
- **Primary Interactive Glow**: CTA buttons emit a focused aura using `box-shadow: 0 4px 20px rgba(35, 61, 255, 0.5)`.

## Shapes

The design system employs **Rounded (Level 2)** geometry, inspired by the smooth ergonomic curvature of high-end gaming hardware:

- Standard cards, dashboard metrics panels, and preview modules feature a curvature of `16px` to `24px`.
- Interactive elements (buttons, badge tags, search fields) utilize softened radii between `10px` and full pill-capsules (`9999px`) for contextual chips.
- Micro-geometry: Cut-corner accents (45-degree chamfers) may be applied sparsely to decorative status pills or tournament bracket connector pins to reinforce the gamer aesthetic.

## Components

### Buttons
- **Primary Action**: Solid gradient fill (`linear-gradient(135deg, #233DFF 0%, #1525A8 100%)`), soft white text, subtle electric blue outer shadow. On hover, scales by `1.02` with an expanded `#5CB6F9` ambient glow.
- **Secondary / Glass Action**: Translucent surface (`rgba(202, 232, 255, 0.08)`), crisp border (`rgba(92, 182, 249, 0.3)`), light sky blue typography. Border illumination sharpens to `rgba(92, 182, 249, 0.8)` on hover.

### Cards & Modules
- **Game Testing & Tournament Panels**: Structured with `20px` border radius, `backdrop-filter: blur(14px)`, and dual-light treatment: top border receives `rgba(202, 232, 255, 0.2)` highlighting light falloff, while bottom borders stay darker `rgba(35, 61, 255, 0.12)`.
- **Tournament Bracket Nodes**: Segmented card units with high-contrast match scores, participant avatars, and live ping/latency indicators in `#5CB6F9`.

### Chips & Badges
- **Status Tags (e.g., Live, Testing Beta, Prize Pool)**: Pill-rounded (`9999px`), `rgba(35, 61, 255, 0.15)` fill with a 1px border. Equipped with a pulsing 6px radial dot for active tournament streams.

### Form Inputs & Telemetry Fields
- Dark translucent background (`rgba(5, 10, 48, 0.6)`), inset border `rgba(92, 182, 249, 0.2)`, `12px` radius.
- On focus: shifts border color to `#5CB6F9` accompanied by a `0 0 12px rgba(92, 182, 249, 0.35)` glow ring.

### Checkboxes & Toggle Switches
- Custom switches designed with smooth console-trigger ergonomics: neon pill track with sliding thumb emitting a soft light trail in the active state.