import "server-only";
import { database } from "./supabase";
import { createHmac } from "node:crypto";
export async function rateLimit(request: Request, kind: string, limit = 10) {
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const key = createHmac("sha256", process.env.SESSION_SECRET!)
    .update(`${kind}:${ip}:${Math.floor(Date.now() / 3600000)}`)
    .digest("hex");
  const { data, error } = await database().rpc("take_rate_limit", {
    p_key: key,
    p_limit: limit,
  });
  if (error) throw new Error("Storage unavailable");
  if (!data) throw new Error("RATE");
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
