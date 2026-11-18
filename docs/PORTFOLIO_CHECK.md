# Portfolio verification — November 18, 2026

- Unit/database tests: 16 passed.
- TypeScript check and Next.js production build: passed.
- Playwright: all 10 desktop/mobile tests passed, including assessment paths, accessible layouts, theme persistence, unconfigured submission failures, and protected routes.
- OpenNext Cloudflare bundle: built successfully; no deployment performed as part of these local checks.
- Updated Next.js to 16.4.5. A follow-up npm audit no longer reports the Next.js cache-disclosure advisories; five moderate dependency advisories remain elsewhere in the dependency tree.
- Screenshot: local assessment without backend credentials or submitted personal information.
- Live Supabase persistence, administrator sign-in, and follow-up delivery were not exercised. The README describes the implemented manual-review workflow, not automatic LLM reports.

These results describe the checked revision and environment, not a guarantee about future deployments.

## Live deployment verification

Deployed November 18, 2026 to https://ai-for-bookkeepers.mashablair.workers.dev from application revision `34822c1`. Cloudflare version `60c5b53f-91cd-4788-9ee0-cd5ca03d896f` serves 100% of traffic.

Supabase is intentionally disconnected. The release was built with empty public Supabase URL/key settings; no database was created or reconnected.

- Eight public pages loaded successfully at desktop (1440 px) and mobile (390 px) widths without horizontal overflow.
- Both beginner and experienced assessment paths completed on both viewport sizes.
- Requests using fictional test inputs returned HTTP 503 and a clear “has not been sent” message, as expected without storage.
- `/admin` redirected to `/admin/login`; cross-origin writes returned HTTP 403.
- No browser exceptions or requests to Supabase were observed.
- Request persistence, administrator sign-in, and follow-up delivery remain unavailable while the database is disconnected.
