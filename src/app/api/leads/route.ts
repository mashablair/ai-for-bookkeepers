import { configured, database } from "@/lib/database";
import { body, checkOrigin, assessmentOwner } from "@/lib/security";
import { deliverySchema, leadSchema } from "@/lib/validation";
import { z } from "zod";
import { referral } from "@/lib/assessment";
import { rateLimit, failure } from "@/lib/api";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = z
      .union([deliverySchema, leadSchema])
      .parse(await body(request));
    const delivery = "intent" in input;
    if (
      Date.now() - input.started < 2500 ||
      Date.now() - input.started > 86400000
    )
      return Response.json(
        { error: "Please take a moment to review your details and try again." },
        { status: 400 },
      );
    if (!configured())
      return Response.json(
        {
          error: delivery
            ? "Assessment requests are not connected yet. Your request has not been sent. Please try again once the service is available."
            : "Consultation requests are not connected yet. Your request has not been sent. Please try again once the service is available.",
        },
        { status: 503 },
      );
    await rateLimit(request, "lead", 6);
    const db = database();
    let assessmentId = await assessmentOwner();
    let source = referral(input.referral);
    if (assessmentId) {
      const data = await db
        .prepare("SELECT referral FROM assessments WHERE id=?")
        .bind(assessmentId)
        .first<{ referral: string }>();
      if (data) source = data.referral;
      else assessmentId = null;
    }
    await db
      .prepare(
        "INSERT INTO leads(id,request_id,name,email,practice,format,priorities,consent_at,referral,assessment_id) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_id) DO NOTHING",
      )
      .bind(
        crypto.randomUUID(),
        input.requestId,
        input.name,
        input.email,
        delivery ? "Not provided" : input.practice,
        delivery ? "Free assessment" : input.format,
        delivery ? "Please send the free assessment." : input.priorities,
        new Date().toISOString(),
        source,
        assessmentId,
      )
      .run();
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
