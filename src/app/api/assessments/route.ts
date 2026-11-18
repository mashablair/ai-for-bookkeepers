import { configured, database } from "@/lib/database";
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
    const id = crypto.randomUUID();
    const inserted = await db
      .prepare(
        "INSERT INTO assessments(id,request_id,answers,summary,referral) VALUES(?,?,?,?,?) ON CONFLICT(request_id) DO NOTHING RETURNING id",
      )
      .bind(
        id,
        input.requestId,
        JSON.stringify(answers),
        JSON.stringify(results(answers)),
        referral(input.referral),
      )
      .first<{ id: string }>();
    // A replay must never grant ownership of another visitor's assessment.
    if (!inserted)
      return Response.json({ saved: false, results: results(answers) });
    await setAssessmentCookie(inserted.id);
    return Response.json({ saved: true, results: results(answers) });
  } catch (e) {
    return failure(e);
  }
}
