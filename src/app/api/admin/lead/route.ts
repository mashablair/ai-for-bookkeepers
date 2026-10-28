import { requireAdmin } from "@/lib/supabase";
import { body, checkOrigin } from "@/lib/security";
import { failure } from "@/lib/api";
import { z } from "zod";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const { client } = await requireAdmin();
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
    const { data, error } = await client
      .from("leads")
      .update({ status: input.status })
      .eq("id", input.id)
      .select("id")
      .single();
    if (error || !data) throw new Error("SAVE");
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
