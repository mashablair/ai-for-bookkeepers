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
  NEXT_PUBLIC_SUPABASE_URL: (v) => {
    try {
      return new URL(v).protocol === "https:";
    } catch {
      return false;
    }
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: (v) => !!v,
  SUPABASE_SERVICE_ROLE_KEY: (v) => !!v,
  SESSION_SECRET: (v) => v?.length >= 32,
  OPENAI_API_KEY: (v) => !!v,
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
