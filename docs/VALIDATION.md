# Validation record — October 28, 2026

## Passed

- Next.js 16.4.3 production webpack build: public pages prerendered; admin and API routes dynamic.
- OpenNext 1.20.14 Cloudflare bundle produced at `.open-next/worker.js`. No upload/deploy performed.
- TypeScript strict checks.
- 13 automated tests: beginner and advanced branching, stale-answer cleanup, four proficiency labels, privacy/verification prioritization, invalid input, referral normalization, lead schema, RLS coverage, event triggers, and actual SQL migration execution in embedded PostgreSQL.
- PostgreSQL integration test: record persistence, stored referral, workshop conversion, admin status/agenda updates, rate limit enforcement, anonymous denial and authenticated non-admin invisibility. Fixtures exist only inside the in-memory test database.
- 10 Playwright cases across desktop (1440×1000) and mobile (390×844): all public pages, no horizontal overflow, theme persistence, beginner/advanced completion without contact capture, referral continuation, missing-credentials submission error, admin access and cross-origin protection.
- Axe WCAG 2 A/AA and 2.1 A/AA scans: no violations in tested public pages and results; homepage also checked in dark mode. Automated scans do not prove complete accessibility conformance.
- Manual screenshot review of desktop light and mobile dark full-page layouts.
- Dependency audit after override of vulnerable transitive glob version: zero known vulnerabilities reported.

## Fixes found during verification

- Default Turbopack build failed under local subprocess restrictions; supported webpack build succeeds.
- Local 127.0.0.1 request origin differed from Next's internal localhost origin; fixed a narrowly scoped no-config local fallback. Explicit configured origins remain exact-match.
- Fixed browser test selector collision with Next's live route announcer.
- Treat beginners' lack of privacy-process experience as not learned, not not-applicable.
- Keep locally generated results available when database persistence fails.
- Added Supabase session refresh for private routes.

## Remaining external verification

No credentials were provided or discovered for a live Supabase project, OpenAI API or Cloudflare deployment. Real Auth delivery/login, live network persistence, OpenAI-generated agenda quality and a remote private preview are **not verified**. Follow DEPLOYMENT.md's connected acceptance checks.

OpenNext warns that Next.js Node proxy support is experimental on Cloudflare. Verify authenticated cookie refresh in the actual private Worker runtime; the successful build is not a runtime guarantee.

Local production performance measurements are recorded in `local-performance.json`. They use unthrottled local Chrome and do not establish field Core Web Vitals or real mobile-network performance. No INP claim is made.

The public privacy policy is explicitly a review draft. Confirm retention, privacy contact and processor arrangements before launch. No public publication has occurred.

## Follow-up hardening — Supabase retained

Owner confirmed that Supabase should remain the backend. No D1 code or database changes were made.

The suite now includes 16 tests, including signed assessment-cookie tampering/expiry, malformed Unicode signatures, and byte-bounded JSON requests without Content-Length. All pass. Consultation requests tolerate a deleted previously linked assessment without a foreign-key failure. Session configuration rejects signing secrets shorter than 32 characters.

Created ignored local configuration with a securely generated signing secret. `npm run check:config` reports names and readiness only; Supabase credentials and the OpenAI API key remain missing. The local preview is intentionally left running for owner review.
