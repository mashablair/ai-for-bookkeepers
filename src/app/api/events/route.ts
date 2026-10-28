import { configured, database } from "@/lib/supabase";
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
    const { error } = await database()
      .from("events")
      .upsert(
        {
          id: input.id,
          event: input.event,
          referral: referral(input.referral),
        },
        { onConflict: "id", ignoreDuplicates: true },
      );
    if (error) throw error;
    return new Response(null, { status: 204 });
  } catch (e) {
    return failure(e);
  }
}
