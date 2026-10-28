import { configured, database } from "@/lib/supabase";
import { body, checkOrigin, assessmentOwner } from "@/lib/security";
import { leadSchema } from "@/lib/validation";
import { referral } from "@/lib/assessment";
import { rateLimit, failure } from "@/lib/api";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = leadSchema.parse(await body(request));
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
          error:
            "Consultation requests are not connected yet. Your request has not been sent. Please try again once the service is available.",
        },
        { status: 503 },
      );
    await rateLimit(request, "lead", 6);
    const db = database();
    let assessmentId = await assessmentOwner();
    let source = referral(input.referral);
    if (assessmentId) {
      const { data, error: lookupError } = await db
        .from("assessments")
        .select("referral")
        .eq("id", assessmentId)
        .single();
      if (lookupError && lookupError.code !== "PGRST116") throw lookupError;
      if (data) source = data.referral;
      else assessmentId = null;
    }
    const { error } = await db.from("leads").insert({
      name: input.name,
      email: input.email,
      practice: input.practice,
      format: input.format,
      priorities: input.priorities,
      consent_at: new Date().toISOString(),
      referral: source,
      assessment_id: assessmentId,
      request_id: input.requestId,
    });
    if (error && error.code !== "23505") throw error;
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
