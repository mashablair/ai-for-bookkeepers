import test from "node:test";
import assert from "node:assert/strict";
import {
  signAssessment,
  verifyAssessment,
  readJson,
} from "../src/lib/request-safety";
const secret = "test-only-secret-".repeat(4),
  id = "11111111-1111-4111-8111-111111111111";
test("signed assessment ownership expires and cannot be altered", () => {
  const t = signAssessment(id, secret, 1000);
  assert.equal(verifyAssessment(t, secret, 1001), id);
  assert.equal(verifyAssessment(t, secret, 86401000), null);
  assert.equal(
    verifyAssessment(
      t.replace(id, "22222222-2222-4222-8222-222222222222"),
      secret,
      1001,
    ),
    null,
  );
  assert.equal(verifyAssessment(t, secret + "x", 1001), null);
});
test("malformed cookies never throw or authorize", () => {
  for (const token of [
    "",
    "x.NaN.y",
    `${id}.Infinity.${"é".repeat(64)}`,
    signAssessment(id, secret) + ".extra",
  ])
    assert.equal(verifyAssessment(token, secret), null);
  assert.throws(() => signAssessment(id, "short"));
});
test("JSON reader bounds real bytes even without content length", async () => {
  assert.deepEqual(
    await readJson(
      new Request("http://localhost", { method: "POST", body: '{"ok":true}' }),
    ),
    { ok: true },
  );
  await assert.rejects(
    () =>
      readJson(
        new Request("http://localhost", {
          method: "POST",
          body: '"' + "é".repeat(20) + '"',
        }),
        30,
      ),
    /BODY/,
  );
  await assert.rejects(() =>
    readJson(
      new Request("http://localhost", { method: "POST", body: "not json" }),
    ),
  );
});
