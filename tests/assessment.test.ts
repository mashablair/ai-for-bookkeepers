import test from "node:test";
import assert from "node:assert/strict";
import {
  questions,
  visibleQuestions,
  cleanAnswers,
  validAnswers,
  results,
  referral,
  Answers,
} from "../src/lib/assessment";
import { deliverySchema, leadSchema } from "../src/lib/validation";
function complete(tools: string, projects = "Yes, I use them regularly") {
  const a: Answers = { tools, projects };
  for (const q of questions) {
    if (!q.when || q.when(a)) a[q.id] ??= q.options[0];
  }
  return cleanAnswers(a);
}
test("beginner skips configuration while preserving essential safety questions", () => {
  const a = complete("Neither yet");
  assert(validAnswers(a));
  assert(!visibleQuestions(a).some((q) => q.id === "connectors"));
  assert(visibleQuestions(a).some((q) => q.id === "privacy"));
  assert.equal(
    results(a).skills.find((s) => s.id === "prompting")?.level,
    "Not learned",
  );
});
test("experienced project user gets deeper setup questions", () => {
  const a = complete("Both");
  assert(validAnswers(a));
  assert(visibleQuestions(a).some((q) => q.id === "projectInstructions"));
});
test("changing upstream answer removes stale advanced answers", () => {
  const a = complete("Both");
  a.tools = "Neither yet";
  const clean = cleanAnswers(a);
  assert(!clean.projectInstructions);
  assert(!clean.sources);
  assert(validAnswers(clean));
});
test("non-project user skips project instructions", () => {
  const a = complete("ChatGPT", "Not yet");
  assert(!visibleQuestions(a).some((q) => q.id === "projectInstructions"));
  assert.equal(
    results(a).skills.find((s) => s.id === "projectInstructions")?.level,
    "Not applicable",
  );
});
test("all four proficiency states are distinguished", () => {
  const a = complete("Claude");
  a.instructions = questions.find((q) => q.id === "instructions")!.options[1];
  a.sources = questions.find((q) => q.id === "sources")!.options[2];
  a.connectors = questions.find((q) => q.id === "connectors")!.options[3];
  const levels = new Set(results(a).skills.map((s) => s.level));
  assert.equal(levels.size, 4);
});
test("privacy and verification take priority over configuration gaps", () => {
  const a = complete("Both");
  a.privacy = questions.find((q) => q.id === "privacy")!.options[2];
  a.verification = questions.find((q) => q.id === "verification")!.options[2];
  a.instructions = questions.find((q) => q.id === "instructions")!.options[2];
  assert.deepEqual(
    results(a)
      .priorities.slice(0, 2)
      .map((s) => s.id),
    ["privacy", "verification"],
  );
});
test("missing and invented answers are rejected", () => {
  assert(!validAnswers({ tools: "Both" }));
  const a = complete("ChatGPT");
  a.privacy = "invented";
  assert(!validAnswers(a));
});
test("referral normalization rejects malformed attribution", () => {
  assert.equal(referral("Anna"), "anna");
  assert.equal(referral(null), "organic");
  assert.equal(referral("<script>"), "organic");
  assert.equal(referral("a".repeat(41)), "organic");
});
test("lead validation rejects spam, missing consent and invalid email", () => {
  const lead = {
    name: "Test Person",
    email: "test@example.com",
    practice: "Independent bookkeeper",
    format: "Private training",
    priorities: "Learn safe prompting",
    consent: true,
    website: "",
    started: Date.now(),
    requestId: crypto.randomUUID(),
    referral: "anna",
  };
  assert(leadSchema.safeParse(lead).success);
  for (const patch of [
    { email: "bad" },
    { consent: false },
    { website: "spam" },
    { priorities: "" },
  ])
    assert(!leadSchema.safeParse({ ...lead, ...patch }).success);
  assert(
    deliverySchema.safeParse({
      intent: "assessment",
      name: lead.name,
      email: lead.email,
      consent: true,
      website: "",
      started: lead.started,
      requestId: lead.requestId,
      referral: "anna",
    }).success,
  );
  assert(
    !deliverySchema.safeParse({
      intent: "assessment",
      name: "A",
      email: lead.email,
      consent: true,
      website: "",
      started: lead.started,
      requestId: lead.requestId,
      referral: "anna",
    }).success,
  );
});
