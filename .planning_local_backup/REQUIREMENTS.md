# Riyadah Elite — Product Requirements

**Last Updated:** 2026-10-03  
**Status:** Active  

## Milestone 1: Authentication & Identity Foundation (Current Milestone)

### Functional Requirements
- **AUTH-01 (Login)**:
  - Email and password input with strict format validation.
  - Accessible password visibility toggle.
  - Integration with backend `POST /api/v1/auth/login`.
  - Rate-limited and enumerated-timing safe authentication responses.
  - Honest error banner on failure; transition only upon verified backend success.
- **AUTH-02 (Registration / Signup)**:
  - Full Name, Username (`@handle`), Email, Password, and Password Confirmation fields.
  - Client and server validation for password strength (min 8 chars, uppercase, lowercase, number, special character).
  - Integration with backend `POST /api/v1/auth/signup`.
  - Duplicate email/username collision handling without crashing.
- **AUTH-03 (Account Created Success)**:
  - High-fidelity tactical confirmation screen following Stitch design reference.
  - Reflects actual registration state (e.g. pending email verification if configured, or immediate active profile).
- **AUTH-04 (Forgot Password)**:
  - Email input form with client-side format checks.
  - Integration with `POST /api/v1/auth/forgot-password`.
  - Anti-enumeration design: generic confirmation response regardless of whether the email exists.
- **AUTH-05 (Reset Password)**:
  - Secure token validation from query parameters (`?token=...`).
  - Inputs for New Password and Confirm New Password with live strength indicators.
  - Integration with `POST /api/v1/auth/reset-password`.
  - Single-use token invalidation and expiration check.
- **AUTH-06 (Password Changed Success)**:
  - Visual celebration screen with animated SVG checkmark and return-to-login CTA.
- **AUTH-07 (Session & Authorization)**:
  - `GET /api/v1/auth/me` to fetch active session details.
  - `POST /api/v1/auth/logout` to terminate session.
  - Protected API route middleware rejecting unauthorized access.

### Security Requirements
- **SEC-01**: Passwords hashed using `bcrypt` (work factor >= 10). Plaintext passwords never logged or persisted.
- **SEC-02**: Password reset tokens generated with `crypto.randomBytes(32)` and stored as SHA-256 hashes with short expiry (15-60 minutes).
- **SEC-03**: Form input payload validation using Zod schemas on both frontend and backend.
- **SEC-04**: CORS configured strictly for trusted client origins.

---

## Future Milestones (Roadmapped)
- **Milestone 2**: Database expansion & Playtesting Campaigns API (Real Game models, tester submission, telemetry logging).
- **Milestone 3**: Tournament Engine (Brackets, match coordination, check-ins, participant roster).
- **Milestone 4**: Developer Studio Workspace (B2B dashboard, campaign builder, tester feedback review).
- **Milestone 5**: Player Workspace & Profile (Reputation pass, match history, applied playtests).
- **Milestone 6**: Internal Admin & Arbitration Command Center.
