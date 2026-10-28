import { configured, database } from "@/lib/supabase";
import { body, checkOrigin, setAssessmentCookie } from "@/lib/security";
import { assessmentSchema } from "@/lib/validation";
import {
  cleanAnswers,
  validAnswers,
  results,
  referral,
} from "@/lib/assessment";
import { rateLimit, failure } from "@/lib/api";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = assessmentSchema.parse(await body(request));
    if (!validAnswers(input.answers))
      return Response.json(
        { error: "Please answer all relevant questions." },
        { status: 400 },
      );
    const answers = cleanAnswers(input.answers);
    if (!configured())
      return Response.json({ saved: false, results: results(answers) });
    await rateLimit(request, "assessment", 20);
    const db = database();
    const { data, error } = await db
      .from("assessments")
      .insert({
        answers,
        summary: results(answers),
        referral: referral(input.referral),
        request_id: input.requestId,
      })
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505")
        return Response.json({ saved: false, results: results(answers) });
      throw error;
    }
    await setAssessmentCookie(data.id);
    return Response.json({ saved: true, results: results(answers) });
  } catch (e) {
    return failure(e);
  }
}
