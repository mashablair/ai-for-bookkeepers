import { configured, database } from "@/lib/database";
import { body, checkOrigin } from "@/lib/security";
import { referral } from "@/lib/assessment";
import { rateLimit, failure } from "@/lib/api";
import { z } from "zod";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = z
      .object({
        id: z.uuid(),
        referral: z.string().max(40),
        event: z.literal("assessment_start"),
      })
      .parse(await body(request));
    if (!configured()) return new Response(null, { status: 204 });
    await rateLimit(request, "event", 30);
    await database()
      .prepare(
        "INSERT INTO events(id,event,referral) VALUES(?,?,?) ON CONFLICT(id) DO NOTHING",
      )
      .bind(input.id, input.event, referral(input.referral))
      .run();
    return new Response(null, { status: 204 });
  } catch (e) {
    return failure(e);
  }
}
