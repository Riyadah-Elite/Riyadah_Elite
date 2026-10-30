# Riyadah Elite — Design System & Visual Tokens

## 1. Visual Identity & Design Pillars

The design language of **Riyadah Elite** ("Obsidian Kinetic") blends esports championship arena aesthetics with high-precision QA telemetry diagnostics. The visual system adheres directly to:
1. **Google Stitch designs** (`projects/11407087133952409690` - *Riyadah Elite Gaming Hub* and *Nexus Competitive Gaming Platform*).
2. **Approved Wireframes** (Platform, Sidebar & Footer, Game Details & Bug Reporting).
3. **365Games Dark Esports Theme** (Deep dark obsidian canvases, vibrant core royal violet, luminous electric lime accents, sharp cyber metrics, clean dark borders).

---

## 2. Color Palette & Semantic Tokens

### Canvas & Surfaces
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `colors.background.primary` | `#09090D` | Obsidian root canvas, zero-elevation surfaces |
| `colors.background.secondary` | `#111119` | Topbars, sidebar rail, bottom navigation bar |
| `colors.background.surface` | `#181824` | Primary cards, input fields, interactive chips |
| `colors.background.elevated` | `#20202F` | Elevated modals, banners, hero cards, dropdowns |

### Brand Accents
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `colors.brand.primary` | `#7029F5` | Royal violet primary brand hue, active states, CTA borders |
| `colors.brand.secondary` | `#8B5CF6` | Luminous purple highlights, hover glows, icons |
| `colors.brand.accent` | `#39E600` | Electric neon lime / green, QA bounties, live telemetry, verified ticks |

### Status & Feedback
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `colors.status.success` | `#39E600` | Completed matches, verified defect resolutions |
| `colors.status.warning` | `#F59E0B` | Upcoming matches, registration closing soon |
| `colors.status.error` | `#EF4444` | Critical defect reports, disqualified matches, errors |
| `colors.status.info` | `#3B82F6` | General announcements, system telemetry info |

### Typography & Neutrals
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `colors.text.primary` | `#FFFFFF` | High-emphasis headings, titles, active labels |
| `colors.text.secondary` | `#A1A1AA` | Body copy, descriptions, secondary stats |
| `colors.text.muted` | `#71717A` | Metadata, timestamps, placeholders |
| `colors.border.subtle` | `rgba(255, 255, 255, 0.08)` | Standard hairline borders on dark cards |
| `colors.border.medium` | `rgba(255, 255, 255, 0.16)` | Hovered and focused card borders |

---

## 3. Typography Hierarchy

- **Heading Font**: `Geist`, `Inter`, `System` (`fontWeight: '800' | '700'`)
- **Body Font**: `Inter`, `System` (`fontWeight: '400' | '500' | '600'`)
- **Telemetry / Monospace Font**: `GeistMono`, `JetBrains Mono`, `monospace` (`fontWeight: '700'`)

### Scale
- `display`: 36px (Hero headlines, major tournament banners)
- `3xl`: 28px (Page titles, section headers)
- `2xl`: 22px (Modal titles, card headers)
- `xl`: 18px (Component titles, telemetry values)
- `lg`: 16px (Navigation labels, primary buttons)
- `base`: 14px (Standard interface body text)
- `sm`: 13px (Secondary body, input values)
- `xs`: 11px (Badges, tags, telemetry chips)

---

## 4. Spacing, Radii & Grid System

- **Layout Radii**:
  - `sm`: 6px (Pills, badges, code tags)
  - `md`: 10px (Inputs, buttons, small cards)
  - `lg`: 16px (Main cards, hero banners, modals)
  - `full`: 9999px (Circular avatars, rounded pills)

- **Layout Breakpoints**:
  - `Desktop`: Width $\ge$ 1024px
  - `Mobile / Tablet`: Width < 1024px

- **Responsive Shell Dimensions**:
  - Desktop Expanded Sidebar: 240px
  - Desktop Collapsed Sidebar Rail: 72px
  - Desktop Header Height: 68px
  - Mobile Top Header Height: 58px
  - Mobile Bottom Navigation Bar: 64px

