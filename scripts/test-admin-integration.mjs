import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { generateKeyPair, exportJWK, SignJWT } from "jose";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const { privateKey, publicKey } = await generateKeyPair("RS256");
const jwk = await exportJWK(publicKey);
const keyServer = createServer((req, res) => {
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ keys: [jwk] }));
});
await new Promise((r) => keyServer.listen(3018, "127.0.0.1", r));
const base = "http://127.0.0.1:3017",
  issuer = "http://127.0.0.1:3018",
  email = "local-admin@example.invalid",
  aud = "local-integration";
const token = await new SignJWT({ email })
  .setProtectedHeader({ alg: "RS256" })
  .setSubject("test-admin")
  .setIssuer(issuer)
  .setAudience(aud)
  .setExpirationTime("5m")
  .sign(privateKey);
let logs = "";
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--webpack",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3017",
  ],
  {
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: base,
      SESSION_SECRET: crypto.randomUUID() + crypto.randomUUID(),
      ACCESS_ISSUER: issuer,
      ACCESS_AUD: aud,
      ADMIN_EMAIL: email,
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
child.stdout.on("data", (d) => (logs += d));
child.stderr.on("data", (d) => (logs += d));
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  assert(ready, "Next server ready");
  const payload = {
    name: "Admin Integration Fixture",
    email: "fixture@example.invalid",
    practice: "Independent bookkeeper",
    format: "Team workshop",
    priorities: "Testing local admin persistence",
    consent: true,
    website: "",
    started: Date.now() - 5000,
    requestId: crypto.randomUUID(),
    referral: "admin-test",
  };
  const post = (path, data, auth = false) =>
    fetch(base + path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: base,
        ...(auth ? { "cf-access-jwt-assertion": token } : {}),
      },
      body: JSON.stringify(data),
      redirect: "manual",
    });
  const saved = await post("/api/leads", payload);
  assert.equal(saved.status, 200, await saved.text());
  let html = await (
    await fetch(base + "/admin?ref=admin-test", {
      headers: { "cf-access-jwt-assertion": token },
    })
  ).text();
  assert(
    html.includes("Admin Integration Fixture"),
    "authenticated admin renders saved request",
  );
  const matches = [...html.matchAll(/"id":"([0-9a-f-]{36})"/g)];
  // Read the serialized client component prop, which may be escaped by the RSC stream.
  const id =
    html.match(/\\"id\\":\\"([0-9a-f-]{36})\\"/)?.[1] || matches[0]?.[1];
  assert(id, "lead ID in rendered editor");
  assert.equal(
    (await post("/api/admin/lead", { id, status: "Contacted" }, true)).status,
    200,
  );
  assert.equal(
    (
      await post(
        "/api/admin/agenda",
        { id, content: "Verified local note persistence", reviewed: true },
        true,
      )
    ).status,
    200,
  );
  html = await (
    await fetch(base + "/admin?ref=admin-test", {
      headers: { "cf-access-jwt-assertion": token },
    })
  ).text();
  assert(html.includes("Contacted"));
  assert(html.includes("Verified local note persistence"));
  assert.equal(
    (await post("/api/admin/lead", { id, status: "Closed" })).status,
    401,
  );
  assert.equal(
    (await fetch(base + "/admin", { redirect: "manual" })).status,
    307,
  );
  const bad = await fetch(base + "/api/admin/lead", {
    method: "POST",
    headers: {
      origin: base,
      "content-type": "application/json",
      "cf-access-jwt-assertion": "forged",
    },
    body: JSON.stringify({ id, status: "Closed" }),
  });
  assert.equal(bad.status, 401);
  console.log(
    "PASS: local signed Access identity, admin render, status update, notes save/reload, anonymous and forged-token rejection. No production auth bypass.",
  );
} finally {
  child.kill("SIGTERM");
  keyServer.close();
  writeFileSync("../bookkeepers-admin-integration.log", logs);
}
