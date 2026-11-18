import { verifyAdminToken } from "./access-token";
import "server-only";
import { headers } from "next/headers";
import { createRemoteJWKSet } from "jose";
export async function requireAdmin() {
  const issuer = process.env.ACCESS_ISSUER;
  const audience = process.env.ACCESS_AUD;
  const email = process.env.ADMIN_EMAIL;
  if (!issuer || !audience || !email) throw new Error("UNCONFIGURED");
  const token = (await headers()).get("cf-access-jwt-assertion");
  if (!token) throw new Error("UNAUTHORIZED");
  try {
    const keys = createRemoteJWKSet(new URL("/cdn-cgi/access/certs", issuer));
    return await verifyAdminToken(token, keys, issuer, audience, email);
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
