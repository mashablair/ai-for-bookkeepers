# Deployment preparation and launch gates

## Local private review

Run `npm run dev` and open http://127.0.0.1:3000. This binds only to the local computer. Local review requires no Cloudflare credentials and does not publish anything.

## Cloudflare-compatible build

`npm run build:cloudflare` runs the Next.js production build and packages the app with OpenNext. It does not upload or deploy. Use the checked-in package lock to reproduce versions. The webpack compiler is selected because Turbopack could not open its required subprocess port in the development environment.

For an externally accessible private review, configure Cloudflare Access on a dedicated hostname first, restricted to Maria’s identity. Confirm Access protects the full site (including static assets and APIs) before routing traffic. Keep default workers.dev and preview URLs disabled so they cannot bypass Access. No hostname/account was supplied, so this remote preview has not been provisioned.

Configure the public Supabase URL/anon key and the canonical site URL at build time. Configure service-role key, SESSION_SECRET and OPENAI_API_KEY as server-side secrets through the deployment environment. Never put those secrets in `NEXT_PUBLIC_` variables, source control or client code. Use HTTPS. A secret of at least 32 random characters is required.

The supplied no-route Worker configuration is a preparation artifact, not a claim that Access has been enabled. A robots noindex directive is not access control. Public indexing defaults off for every page. Once public launch is approved, confirm final domain, set PUBLIC_INDEXING=true at build time, and rebuild. Admin/results remain noindex independently.

## Required connected acceptance tests

1. Run the migration in a non-production Supabase project. Create Maria's Auth user and allowlist row. Disable sign-ups.
2. Complete beginner and advanced assessments through the browser. Verify one database row and one completion event per request. Confirm results do not need contact details.
3. Enter via `?ref=anna`, submit a consultation and a separate workshop request with clearly fictional test details. Verify linkage, referral source and exactly one appropriate event per successful insertion. Retry a request ID and verify deduplication.
4. As anon and as a non-admin authenticated user, confirm assessment/lead records cannot be fetched. The same queries should work for Maria. Test expired sessions and sign-out.
5. Change lead status. Generate, edit, save, reload, regenerate and mark an agenda reviewed. Confirm regeneration resets review status. Confirm no contact details appear in the OpenAI request.
6. Test the protected preview without an Access session and through any potential alternate hostnames. They must not disclose the application.
7. Confirm privacy contact, storage regions, retention/deletion handling and processor terms. Replace draft privacy language with owner-approved wording.
8. Measure production performance on the actual host and mobile network; local timings do not establish field Core Web Vitals.

Only after those checks and Maria’s explicit approval should the site receive a public route.

## Adapter compatibility note

The final OpenNext build succeeds with Next.js 16.4.3 and @opennextjs/cloudflare 1.20.14. OpenNext emits a warning that Next.js Node.js proxy/middleware support is experimental on Cloudflare. `src/proxy.ts` refreshes administrator sessions; page and API authorization do not rely on it. Verify refresh and cookie handling on the Access-protected Worker before public launch. If the adapter has not stabilized this path, use a supported session-refresh deployment pattern or a fully supported Next.js host; do not treat the bundle build as live runtime verification.
