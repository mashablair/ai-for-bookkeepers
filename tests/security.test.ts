import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from "jose";
import { verifyAdminToken } from "../src/lib/access-token";
test("Access validates signature, expiration, issuer, audience, and explicit administrator email", async () => {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const keys = createLocalJWKSet({ keys: [await exportJWK(publicKey)] });
  const issuer = "https://test.cloudflareaccess.com",
    aud = "test-app",
    email = "owner@example.invalid";
  async function token(overrides: Record<string, unknown> = {}) {
    return new SignJWT({
      email,
      sub: "user",
      iss: issuer,
      aud,
      exp: Math.floor(Date.now() / 1000) + 60,
      ...overrides,
    })
      .setProtectedHeader({ alg: "RS256" })
      .sign(privateKey);
  }
  assert.deepEqual(
    await verifyAdminToken(await token(), keys, issuer, aud, email),
    { email },
  );
  for (const override of [
    { email: "stranger@example.invalid" },
    { iss: "https://other.example" },
    { aud: "other-app" },
    { exp: 1 },
    { sub: "" },
  ])
    await assert.rejects(
      verifyAdminToken(await token(override), keys, issuer, aud, email),
    );
  await assert.rejects(verifyAdminToken("forged", keys, issuer, aud, email));
  const other = await generateKeyPair("RS256");
  const forged = await new SignJWT({
    email,
    sub: "user",
    iss: issuer,
    aud,
    exp: Math.floor(Date.now() / 1000) + 60,
  })
    .setProtectedHeader({ alg: "RS256" })
    .sign(other.privateKey);
  await assert.rejects(verifyAdminToken(forged, keys, issuer, aud, email));
});
