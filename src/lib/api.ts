import "server-only";
import { database } from "./database";
import { createHmac } from "node:crypto";
export async function rateLimit(request: Request, kind: string, limit = 10) {
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const key = createHmac("sha256", process.env.SESSION_SECRET!)
    .update(`${kind}:${ip}:${Math.floor(Date.now() / 3600000)}`)
    .digest("hex");
  const db = database();
  const entries = await db.batch<{ count: number }>([
    db
      .prepare(
        "INSERT INTO rate_limits(key,count,created_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
      )
      .bind(key, Date.now()),
    db
      .prepare("DELETE FROM rate_limits WHERE created_at < ?")
      .bind(Date.now() - 7200000),
  ]);
  if (Number(entries[0].results[0]?.count) > limit) throw new Error("RATE");
}
export function failure(error: unknown) {
  const msg = error instanceof Error ? error.message : "";
  const status =
    msg === "UNAUTHORIZED"
      ? 401
      : msg === "ORIGIN"
        ? 403
        : msg === "RATE"
          ? 429
          : msg === "UNCONFIGURED"
            ? 503
            : 400;
  return Response.json(
    {
      error:
        status === 401
          ? "Please sign in with an authorized administrator account."
          : status === 429
            ? "Too many attempts. Please try again later."
            : status === 503
              ? "This service is not configured yet."
              : "We could not complete this request. Please check your entries and try again.",
    },
    { status },
  );
}
