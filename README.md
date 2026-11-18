# AI for Bookkeepers

**An adaptive skills assessment and consultant workspace for practical AI training.**

Next.js · React · TypeScript · Supabase · Cloudflare Workers

This application turns a broad question, “How could AI help my bookkeeping practice?”, into a structured training conversation. Visitors follow an assessment tailored to their experience, request a personally reviewed assessment or training session, and the consultant reviews the answers and prepares workshop notes in a protected workspace.

The project focuses on product-oriented front-end engineering: conditional form flows, clear feedback, accessible controls, server-side validation, and the connection between a public customer journey and an administrator’s workflow.

## Explore the product

| Area | What it does |
| --- | --- |
| Marketing pages | Introduces private training and team workshops with a responsive editorial layout and persistent light/dark themes. |
| Adaptive assessment | Adjusts questions to a visitor’s tools and experience, removes answers that no longer apply, and retains an in-progress draft in the current tab. |
| Assessment request | Collects consent and contact details after the questionnaire for personal review and follow-up. |
| Consultant workspace | Lists requests and assessments, filters by referral source, updates lead status, and saves manually written, reviewed workshop notes. |
| Measurement | Associates assessments with later requests and records conversion events after successful database inserts. |

**Current workflow:** assessment summaries are deterministic, not AI-generated. The visitor-facing results page requests personal review; it does not display an automatically generated report. Workshop notes are written and saved by the consultant. The current application does not generate agendas with an LLM or automatically email assessment reports. The presence of an OpenAI package in the dependency list is not an implemented AI integration.

There is no online payment or calendar-booking flow. A form submission requests follow-up; it does not book or charge for training.

## Engineering highlights

- **One conditional question model:** the UI and server use shared assessment rules, including removal of stale answers when the visitor changes their path.
- **Accessible interaction design:** semantic fieldsets and controls, focus movement between questions, visible errors and progress, responsive layouts, and browser tests with axe checks.
- **Explicit failure states:** without backend configuration, a visitor can explore the assessment, but contact submissions report that they were not sent rather than displaying a false success.
- **Layered authorization:** Supabase Auth plus an administrator allowlist; private pages and API handlers authorize independently of session-refresh middleware.
- **Protected request handling:** schema validation, origin checks, bounded request bodies, honeypot/timing checks, and rate limits. Anonymous clients have no direct application-table grants.
- **Retry-aware measurement:** unique request IDs and database-triggered conversion events avoid counting form clicks or repeated submissions as new conversions.

These are implementation features, not a claim of a completed independent security audit or accessibility certification.

## Run locally

Requires **Node.js 22+** and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open **http://127.0.0.1:3000** and set `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000` in `.env.local`. The configured origin must match the address used in the browser.

### Try it without credentials

Start at `/assessment`. Choose either a beginner or experienced path, go back and change an answer, and complete the questions. The assessment state is retained in the current browser tab. Persistence is unavailable without Supabase, and the email-request form returns an explicit not-sent message. `/admin` redirects to login; there is no demo authentication bypass.

Use fictional examples only. Do not enter client financial records, identifying client details, or account credentials.

### Enable persistence and the consultant workspace

1. Create a Supabase project and apply [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql).
2. Configure the variables below in an ignored local environment file or your deployment secret manager.
3. Disable public sign-ups in Supabase Auth. Create an administrator account and add its Auth UUID to `public.administrators`.
4. Configure authentication URLs for the intended environment and visit `/admin/login`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for request validation and site URLs. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase client key, subject to database permissions. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** database credential. Never expose it in browser code. |
| `SESSION_SECRET` | **Server-only**, at least 32 random characters, for signed assessment cookies. |
| `PUBLIC_INDEXING` | Search-indexing opt-in; defaults off. This is not access control. |

Generate a signing secret with `openssl rand -hex 32`. Never commit `.env.local`, secrets, or production data. Run `npm run check:config` to check required setting presence without printing values; this does not verify external account access.

A signed HttpOnly cookie connects an assessment to a later request for 24 hours. No public record-lookup endpoint is provided.

## Code map

```text
src/app/                 Pages and server API routes
src/components/          Site shell, assessment, request forms, admin controls
src/lib/                 Assessment rules, validation, authorization, request safety
src/proxy.ts             Administrator session refresh
supabase/migrations/     Schema, RLS, allowlist, rate limits, conversion events
tests/                   Assessment, database, request and security tests
tests/e2e/               Desktop/mobile journeys and axe accessibility checks
docs/                    Product context, deployment and earlier validation notes
```

Useful entry points: [question model](src/lib/assessment.ts), [assessment UI](src/components/assessment.tsx), [results/request UI](src/components/results.tsx), [administrator agenda handler](src/app/api/admin/agenda/route.ts), and [authorization](src/lib/supabase.ts).

## Validation

```sh
npm test
npm run typecheck
npm run build
# With the local app running at http://127.0.0.1:3000:
npm run test:e2e
# Build the Cloudflare-compatible Worker bundle; does not deploy:
npm run build:cloudflare
```

Unit and database tests use PGlite in memory, applying the migration with test-only Supabase role/auth stubs. They do not access a production project. Playwright expects installed Google Chrome and exercises desktop/mobile layouts, theme persistence, both assessment paths, unconfigured submissions and protected routes.

## Deployment and boundaries

Cloudflare packaging uses OpenNext. The checked-in `wrangler.jsonc` currently enables `workers_dev` and disables preview URLs; **do not assume it provides a private or Access-protected preview**. Confirm hosting, authentication, data handling and owner approval before any deployment. Local setup instructions above do not require a deployment.

Some historical notes in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) and earlier planning documents describe an AI agenda-generation design and a private-only Worker configuration that no longer match the current code. Treat those parts as historical, not current configuration instructions. The current `.env.example`, route implementations and `wrangler.jsonc` are the implementation reference.

Before production use, verify database migration and allowlist setup, session/cookie behavior on the actual host, request persistence and deduplication, administrator access boundaries, privacy/retention policy, and the manual follow-up process. This README does not certify live hosting or connected-service acceptance tests.
