import { database } from "@/lib/database";
import { requireAdmin } from "@/lib/access";
import { body, checkOrigin } from "@/lib/security";
import { failure } from "@/lib/api";
import { z } from "zod";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await requireAdmin();
    const input = z
      .object({
        id: z.uuid(),
        status: z.enum([
          "New",
          "Contacted",
          "Scheduled",
          "Completed",
          "Closed",
        ]),
      })
      .parse(await body(request));
    const saved = await database()
      .prepare("UPDATE leads SET status=? WHERE id=? RETURNING id")
      .bind(input.status, input.id)
      .first();
    if (!saved) throw new Error("SAVE");
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
