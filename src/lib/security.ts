import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url)
    .origin;
  const local =
    !process.env.NEXT_PUBLIC_SITE_URL &&
    origin &&
    ["http://127.0.0.1:3000", "http://localhost:3000"].includes(origin);
  if (!origin || (origin !== expected && !local)) throw new Error("ORIGIN");
}
function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET!)
    .update(value)
    .digest("hex");
}
export async function setAssessmentCookie(id: string) {
  const value = `${id}.${Date.now() + 86400000}`;
  (await cookies()).set("assessment", `${value}.${sign(value)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https:"),
    maxAge: 86400,
    path: "/",
  });
}
export async function assessmentOwner() {
  const token = (await cookies()).get("assessment")?.value;
  if (!token || !process.env.SESSION_SECRET) return null;
  const [id, expiry, mac] = token.split(".");
  if (!id || !expiry || !mac || Date.now() > Number(expiry)) return null;
  const expected = sign(`${id}.${expiry}`);
  if (
    mac.length !== expected.length ||
    !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))
  )
    return null;
  return id;
}
export async function body(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 20000)
    throw new Error("BODY");
  const raw = await request.text();
  if (raw.length > 20000) throw new Error("BODY");
  return JSON.parse(raw);
}
