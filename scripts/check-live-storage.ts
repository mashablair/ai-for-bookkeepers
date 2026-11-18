import assert from "node:assert/strict";
import { questions, cleanAnswers, type Answers } from "../src/lib/assessment";
async function main() {
  const base =
    process.env.TEST_SITE_URL ||
    "https://ai-for-bookkeepers.mashablair.workers.dev";
  const answers: Answers = { tools: "Neither yet" };
  for (const q of questions)
    if (!q.when || q.when(answers)) answers[q.id] ??= q.options[0];
  const post = (path: string, data: unknown, cookie?: string) =>
    fetch(base + path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: base,
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(data),
      redirect: "manual",
    });
  const requestId = crypto.randomUUID();
  const assessment = await post("/api/assessments", {
    answers: cleanAnswers(answers),
    requestId,
    referral: "deployment-check",
  });
  assert.equal(assessment.status, 200);
  const saved = (await assessment.json()) as { saved: boolean };
  assert.equal(saved.saved, true);
  const cookie = assessment.headers.get("set-cookie")?.split(";")[0];
  assert(cookie);
  const lead = {
    intent: "assessment",
    name: "Deployment Test — Fictional",
    email: "deployment-test@example.invalid",
    consent: true,
    website: "",
    started: Date.now() - 5000,
    requestId: crypto.randomUUID(),
    referral: "organic",
  };
  for (let n = 0; n < 2; n++) {
    const response = await post("/api/leads", lead, cookie);
    assert.equal(response.status, 200);
    assert.equal(((await response.json()) as { ok: boolean }).ok, true);
  }
  const denied = await post("/api/admin/lead", {
    id: crypto.randomUUID(),
    status: "Contacted",
  });
  assert([401, 403, 503, 302].includes(denied.status));
  const cross = await fetch(base + "/api/leads", {
    method: "POST",
    headers: {
      origin: "https://example.invalid",
      "content-type": "application/json",
    },
    body: JSON.stringify(lead),
  });
  assert.equal(cross.status, 403);
  console.log(
    JSON.stringify({
      assessmentRequestId: requestId,
      leadRequestId: lead.requestId,
      assessmentSaved: true,
      leadSaved: true,
      retryAccepted: true,
      unauthenticatedAdminStatus: denied.status,
      crossOriginStatus: cross.status,
    }),
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
