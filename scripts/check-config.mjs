import { existsSync, readFileSync } from "node:fs";
// Only presence/validity is printed. Values and secrets are never logged.
const env = { ...process.env };
if (existsSync(".env.local"))
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) env[match[1]] ??= match[2].trim().replace(/^['"]|['"]$/g, "");
  }
const checks = {
  NEXT_PUBLIC_SITE_URL: (v) => {
    try {
      return ["http:", "https:"].includes(new URL(v).protocol);
    } catch {
      return false;
    }
  },
  ACCESS_ISSUER: (v) => {try {return /^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(v);} catch {return false;}},
  ACCESS_AUD: (v) => !!v,
  ADMIN_EMAIL: (v) => typeof v === 'string' && v.includes('@'),
  SESSION_SECRET: (v) => v?.length >= 32,
};
let missing = 0;
for (const [key, validate] of Object.entries(checks)) {
  const ok = validate(env[key]);
  console.log(`${key}: ${ok ? "configured" : "missing or invalid"}`);
  if (!ok) missing++;
}
console.log(
  "No credentials displayed. This does not verify external account access.",
);
process.exitCode = missing ? 1 : 0;
