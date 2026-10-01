# RIYADAH ELITE (رياضة إليت)
## Product Requirements Document (PRD) & Platform Brief
**Version:** 1.0.0 (Production Blueprint)  
**Date:** March 2025  
**Jurisdiction:** Kingdom of Saudi Arabia (KSA) & GCC  
**Status:** Comprehensive Platform Architecture & Implementation Brief  

---

### Executive Summary

**Riyadah Elite** is a premier, enterprise-grade esports competition and game playtesting platform engineered specifically for the Kingdom of Saudi Arabia and the broader MENA/GCC ecosystem. Built in strict alignment with Saudi Vision 2030 gaming and esports mandates, the National Gaming and Esports Strategy (NGES), and regulatory guidelines set forth by the Saudi Esports Federation (SEF), SAMA, and the Ministry of Commerce.

The platform resolves three critical industry challenges:
1. **For Game Studios & Developers:** Access to vetted, regionally located game testers, structured bug reporting, automated crash-dump triage, and secure NDA/build distribution under verified IP protection.
2. **For Gamers & Esports Competitors:** Safe, zero-wagering, sanctioned competitive brackets, community events, verified team rosters, and transparent milestone reward payouts.
3. **For Ecosystem Operators & Hosts:** Turnkey tournament bracket orchestration, dispute mediation, arbiter governance, and corporate/sponsor-backed prize pool escrow without predatory gambling or wagering mechanisms.

---

### Core Mission & Guiding Principles

1. **Strict Zero-Gambling / Anti-Wagering Platform Policy:**
   - Absolute prohibition of real-money player wagering, pay-to-enter winner-take-all pots, lootboxes, or peer-to-peer betting.
   - All prize purses are strictly **Host-Funded**, **Sponsor-Funded**, **Platform-Sanctioned Official Event Prizes**, or **Non-Cash Merchandise/Hardware**.
2. **Sovereign Regulatory & Identity Compliance:**
   - Integration with KSA national verification standards (Absher / Nafath biometrics for individual competitors).
   - Commercial Registration (CR) verification with the Ministry of Commerce for studios, esports clubs, and corporate hosts.
   - ZATCA electronic invoicing compliance (15% VAT on platform B2B service fees).
3. **Privacy-Preserving & Enclave Security:**
   - Role-Based Access Control (RBAC) across distinct operational enclaves. Sensitive PII (National IDs, IBANs) is cryptographically redacted for frontline operational staff.
   - Immutable audit logs (SHA-256 sealed) for all financial disbursements, arbiter rulings, and administrative actions.

---

### Brand & Visual Identity System

- **Brand Token Name:** `Riyadah Elite`
- **Typography:** `Space Grotesk` (Technical, athletic, legible across Arabic & English).
- **Core Color Palette:**
  - **Surface Container Lowest:** `#050A30` (Deep Midnight Enclave Navy)
  - **Surface Container Low:** `#0A0F35` / `#13183D` (Subdued Panel Backgrounds)
  - **Surface Container High:** `#1D234D` / `#31365D` (Interactive Card Surfaces)
  - **Primary Action Accent:** `#233DFF` (Electric Royal Blue)
  - **Secondary Brand Accent:** `#5CB6F9` (Cyan / High-Tech Telemetry Glow)
  - **Text & High Contrast:** `#CAE8FF` (High-Legibility Soft Ice Blue) & `#FFFFFF`
  - **Border & Glassmorphism:** `rgba(92, 182, 249, 0.15)` to `rgba(255, 255, 255, 0.08)` with 1px border precision.

---

### User Roles & Persona Ecosystem

| Role Persona | Target Audience | Primary Access & Responsibilities |
| :--- | :--- | :--- |
| **Gamer / Tester / Player** | Esports athletes, casual gamers, QA testers | Browse tournaments, participate in closed playtests, submit bug reports, claim verified reward bounties. |
| **Game Studio / Developer** | Indie studios, regional publishers, AAA teams | Submit game builds, configure testing campaigns, manage tester quotas, review bug dossiers, release bounty escrows. |
| **Tournament Host / Arbiter** | Community organizers, collegiate leagues, clubs | Create sanctioned tournaments, seed brackets, manage check-ins, record match scores, resolve disputes. |
| **Internal Operational Staff** | Riyadah Elite employees (L1–L3 Authority) | Verification, Trust & Safety, Arbiter desk, Finance settlement, Discovery CMS, Platform Operations. |
| **Executive Leadership** | Founders, Co-Founders, Board | Holistic platform KPIs, immutable audit logs, kill-switch controls, statutory compliance oversight. |

---

### Platform Architecture & Module Breakdown

#### 1. Public Discovery & Marketing Portal (Web Standard: Top Bar + Footer)
- **Landing Page (Desktop & Mobile):** Hero showcase, playtest bounties spotlight, upcoming sanctioned cups, trust markers (SAMA/SEF alignment).
- **How It Works:** Interactive multi-step guide explaining the player lifecycle, developer QA loop, and tournament structure.
- **For Developers (B2B):** Dedicated developer portal outlining automated crash reporting, regional low-latency playtesting, and studio onboarding.
- **Game Testing Discovery:** Public directory of active playtest waves with filtering by genre, platform (PC, Console, Mobile), and bounty reward.
- **Tournament Discovery:** Live directory of sanctioned tournaments with bracket types, rulesets, and host verification status.
- **Auth Flow & States:** Login, Sign Up, Email Verification, Forgot Password, Reset Password, and Password Changed confirmation flows.

#### 2. User & Player Dashboard (Left Nav + Top HUD)
- **Dashboard Overview:** Personal telemetry, active tournament matches, joined testing campaigns, wallet bounty earnings ledger.
- **Game Testing Workspace:** Active builds, signed NDA status, feedback tasks, bug report submission drawer, bounty claim status.
- **Tournaments Workspace:** My active registrations, upcoming match schedule, bracket visualizer, match conflict dispute reporting.
- **Profile & Player Card:** Verified gamer tag, Nafath KYC badge, hardware specs (GPU/CPU/RAM for testing eligibility), trophy case.
- **Account Settings:** Security preferences, 2FA, linked gaming accounts (Steam, Riot ID, Epic), payout IBAN details.

#### 3. Developer / Studio Dashboard (Left Nav + Top HUD)
- **Developer Overview:** Live games roster, testing velocity, tester cohort distribution, crash frequency index.
- **My Games & Add Game Wizard:** Multi-step submission pipeline (Metadata → Binary Upload → Engine Specs → Rights Declaration).
- **Testing Campaigns:** Campaign builder with wave scheduling, tester quota filters (hardware, age, rank), and bounty allocations.
- **Testers Cohort Management:** Active tester list, device telemetry diagnostics, activity logs, and tester scoring.
- **Feedback & Results:** Interactive triage board for bug tickets, UX sentiment ratings, telemetry heatmaps, and hotfix tracking.
- **Payments & Escrow:** SAMA-reconciled escrow deposits, milestone disbursements to testers, platform service fee records.
- **Game Rights & Verification:** Legal declarations, engine licenses (UE5, Unity), git tree hashes, studio commercial register validation.

#### 4. Tournament Host Dashboard (Left Nav + Top HUD)
- **Host Overview:** Active tournaments, registration numbers, check-in statuses, dispute queues.
- **Tournament Management Console:** Bracket generation (Single/Double Elimination, Swiss, Round Robin), rule enforcement, broadcast delay settings.
- **Results & Participants:** Match verification, VOD link submissions, score confirmations, automatic progression triggers.
- **Host Profile & Settings:** Organization accreditation, sponsor wire verification, community rating, risk tier score.

#### 5. Internal Administration & Operations Command Centers (Restricted RBAC Enclaves)
- **Platform Operations (Level 3):** Cross-department workflow router, live incident triage (DC-1 latency, netcode false positives), 9-department health matrix.
- **Verification Management (Level 2):** Identity (Absher/Nafath), Developer CR, Tiered Host Risk Clearance (Community, Club, Enterprise), Game Rights Git tree hash validation.
- **Finance & Settlement Command Center (Level 2):** Real-time gateway ledger, SAMA SARIE/Mada settlements, multi-sig dual authorizations, zero-wagering gateway filters.
- **Trust & Safety & Moderation (Level 2):** Behavioral moderation, anti-cheat telemetry hooks, toxicity flags, player sanction appeals.
- **Internal Tournament & Arbiter Desk (Level 2):** Competitive integrity oversight, arbiter override capabilities, match replay review desk.
- **Content Management & Discovery CMS (Level 2):** Homepage slot sequencer, tournament spotlights, game highlights, taxonomy tagging.
- **User & Developer Internal Management (Level 2):** User lifecycle, studio relationship tracking, hardware registry inspection.
- **HR & People Operations Portal (Level 2):** Internal staff provisioning, security enclave clearance tiers, department access logs.
- **Founder & Executive Admin (Level 4 / Alpha-0):** Unrestricted audit oversight, sovereign compliance reporting, emergency system suspension protocols.

---

### Technical & Non-Functional Specifications

1. **Frontend Architecture:**
   - Modern semantic HTML5 with Tailwind CSS utility architecture.
   - Responsive breakpoints: Mobile (`390px`–`430px`), Tablet (`768px`–`1024px`), Desktop/Ultrawide (`1280px`–`1920px`+).
   - Component isolation: Standardized Glassmorphic UI surfaces (`backdrop-blur-md`), micro-interactions, accessible keyboard navigation (`⌘K` command palettes).
2. **Security & Data Isolation:**
   - Subsystem isolation between public CMS and internal financial/PII vaults.
   - PII masking standards: National ID numbers and banking IBANs displayed as masked tokens (`[•••-••••-4921]`).
   - Immutable audit logs: Every financial release, role change, and sanction requires a mandatory justification committed to a cryptographic ledger.
3. **Integration Standards:**
   - Payment Rails: SAMA SARIE, Mada, SAMA-compliant gateway APIs (no proprietary wallet custody).
   - Identity: KSA National Single Sign-On (Nafath / Absher API).
   - Telemetry: Dedicated ME-East edge nodes (`RUH-DC1` Riyadh datacenter telemetry target: `<12ms`).

---

### Regulatory Compliance & Platform Guardrails

- **Article 4 - Zero-Wagering Guarantee:** Under no circumstances shall users be permitted to wager currency on match outcomes or enter prize pools using player-contributed entry fees.
- **Article 7 - Intellectual Property Protection:** Game studios retain 100% proprietary ownership of all uploaded builds, source assets, and telemetry. Testers execute cryptographically signed platform NDAs.
- **Article 12 - Tiered Host Framework:** Casual hosts organizing community events under 3,750 SAR ($1,000 USD) are exempt from commercial registration, ensuring low barrier-to-entry while enforcing strict platform zero-wagering policies. Enterprise events exceeding $5,000 USD require pre-funded escrow and official commercial credentials.

---

### Next Milestones & Roadmap

1. **Phase 1 (Complete):** Core UI/UX design system, full public discovery suite, player authenticated portals, developer studio management, host workspaces, and internal L2/L3 operations command centers.
2. **Phase 2 (Current Focus):** Backend API gateway specifications, REST/GraphQL endpoint definitions, and schema migrations.
3. **Phase 3:** Integration of KSA Nafath biometric mock sandbox and SAMA SARIE payment gateway test harness.
4. **Phase 4:** Closed alpha regional tournament pilot and indie game test wave in Riyadh.
