# AI for Bookkeepers

A Next.js App Router application for Maria Blair’s assessment-informed AI training service. Built locally; **not publicly deployed**.

## Run locally

Requires Node.js 22+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://127.0.0.1:3000. Set `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000` when using that address. Origin validation intentionally requires the configured origin to match the browser URL.

Without credentials, marketing content and the full assessment/results journey work. Results are retained in the current browser tab. Assessment persistence is explicitly marked unavailable; consultation requests report that they were **not sent**. The admin login explains missing configuration. There is no mock production success and no authentication bypass.

## Structure

- `src/app/`: marketing pages, assessment, results, admin and server API routes
- `src/components/`: editorial site shell, assessment wizard, results, forms and dashboard controls
- `src/lib/`: adaptive question model, deterministic results, validation, authorization and request protection
- `src/proxy.ts`: administrator session refresh; all private handlers also authorize independently
- `supabase/migrations/001_initial.sql`: schema, RLS, allowlist, rate limits and transactional conversion events
- `tests/`: branching, validation and real embedded PostgreSQL tests
- `tests/e2e/`: desktop/mobile browser journeys and axe accessibility checks
- `public/images/`: photographs reused from the supplied Maria Blair reference site
- `docs/`: authoritative source documents, setup and validation notes

## Connect Supabase

1. Create a project and run `supabase/migrations/001_initial.sql` in its SQL editor.
2. Populate `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY`.
3. Generate `SESSION_SECRET` with `openssl rand -hex 32` and place it in `.env.local`. Never commit it.
4. Disable public sign-ups in Supabase Auth. Create Maria’s user in Supabase and set a strong password using the account recovery/admin flow.
5. Add that user's UUID with `insert into public.administrators(user_id) values ('YOUR_AUTH_USER_UUID');` in the SQL editor. Knowing a password or creating an ordinary authenticated user does not grant dashboard access.
6. Configure site/auth URLs and email delivery as appropriate. Visit `/admin/login`.

The browser never receives the service-role key. Anonymous clients have no read/write grants on application tables. Public submissions go through validated server routes. The signed HttpOnly cookie connects an assessment to a later consultation for 24 hours; there is no public record lookup API.

## OpenAI agenda generation

Set server-only `OPENAI_API_KEY` and, if desired, `OPENAI_MODEL` (default `gpt-4.1-mini`). Generation uses the Responses API with `store:false` and a bounded output. Only validated fixed-choice assessment data is sent. Name, email and the free-text consultation inquiry are excluded. A request without a linked assessment can receive a manually written agenda. Generated drafts remain unreviewed until Maria edits/reviews and saves them.

## Measurement and referrals

`/assessment?ref=anna` uses the same assessment. First valid referral in a browser tab wins for that session; absent referral is `organic`. Source labels are restricted to 40 alphanumeric/underscore/hyphen characters. A linked assessment's stored source takes precedence over the lead form's value.

`assessment_start` is recorded once per assessment request ID. `assessment_complete`, `consultation_request`, and `workshop_request` are database-triggered **after successful inserts**. Unique request IDs prevent duplicate lead conversions on retry. There are no ad pixels or contact details in the event table. Rate limits store short-lived HMAC hashes rather than raw IPs. On Cloudflare, only its trusted connecting-IP header is used; deployments behind other proxies need a trusted client-IP adaptation.

## Checks

```sh
npm test
npm run typecheck
npm run build
# Start local app in another terminal, then:
npx playwright test --workers=2
npm run build:cloudflare
```

Browser tests use installed Google Chrome. The PostgreSQL tests use PGlite in memory and create test-only Supabase role/auth stubs before applying the actual migration. They do not touch a real Supabase project.

## Private deployment preparation

OpenNext builds `.open-next/worker.js` and static assets. `wrangler.jsonc` has `workers_dev:false`, `preview_urls:false` and **no public routes**. No deploy script is provided. See [deployment setup](docs/DEPLOYMENT.md) before uploading or assigning any route. The owner has explicitly withheld approval for public publication.

## Remaining production setup

Supabase project/keys and administrator account; OpenAI key; Cloudflare account and an Access-protected preview hostname; final domain; privacy contact and retention policy. Live Supabase login, network persistence and real OpenAI generation remain unverified until credentials are configured. No GitHub repository was created.

No online payments, calendar booking, outbound lead emails, fabricated testimonials, certification claims or promised savings are included. Lead notifications, retention automation and additional customer research are sensible follow-ups after the core connected journey is verified.

## Configuration readiness

The chosen backend remains **Supabase**, with Cloudflare hosting. No D1 migration is planned and no access to `dating-goddess-db` is needed.

Run `npm run check:config` to check required setting presence without printing credentials. A local ignored `.env.local` can hold these settings; never share or commit it. The existing local setup includes a generated session signing secret. Supply the Supabase project URL, anon key and service-role key, then OpenAI API key, using your local environment file or a secret manager. The migration and allowlist still need to be applied in that project's dashboard.
