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
        content: z.string().max(15000),
        reviewed: z.boolean().optional(),
      })
      .parse(await body(request));
    if (!input.content.trim())
      return Response.json(
        { error: "Enter a note before saving." },
        { status: 400 },
      );
    const { error } = await client.from("agendas").upsert(
      {
        lead_id: input.id,
        content: input.content,
        reviewed: input.reviewed === true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "lead_id" },
    );
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
