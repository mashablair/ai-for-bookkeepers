import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
export function database() {
  const { env } = getCloudflareContext();
  if (!env.DB) throw new Error("UNCONFIGURED");
  return env.DB;
}
export function configured() {
  try {
    return Boolean(
      database() && (process.env.SESSION_SECRET?.length ?? 0) >= 32,
    );
  } catch {
    return false;
  }
}
