# Next connection step

The backend remains Supabase. Do not migrate to D1 or connect this app to dating-goddess-db.

Completed without account credentials: application implementation, schema/migration and database isolation tests, request-security hardening, local session-secret setup, desktop/mobile journey checks and deployment packaging.

To connect real services, place the following in the ignored `.env.local` file using your editor, not a chat message:

- NEXT_PUBLIC_SUPABASE_URL: dedicated Supabase project's URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: project's public anon key
- SUPABASE_SERVICE_ROLE_KEY: project's server-only service-role key
- OPENAI_API_KEY: API key for agenda generation

The local site URL and SESSION_SECRET are already set. Then run `npm run check:config`; it never prints the values. Restart the development server after configuration changes.

In Supabase, apply `supabase/migrations/001_initial.sql`, disable public registration, create Maria's Auth account and add its UUID to the administrators table. Follow README.md for the exact setup and DEPLOYMENT.md for connected acceptance tests.

No cloud accounts, chargeable services or public deployment were created. A remote private preview additionally needs Cloudflare account access and an Access-protected hostname. Domain, privacy contact and retention decisions are launch prerequisites, not blockers for connecting and privately testing the app.
