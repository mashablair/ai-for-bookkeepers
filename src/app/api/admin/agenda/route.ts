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
        content: z.string().max(15000),
        reviewed: z.boolean().optional(),
      })
      .parse(await body(request));
    if (!input.content.trim())
      return Response.json(
        { error: "Enter a note before saving." },
        { status: 400 },
      );
    await database()
      .prepare(
        "INSERT INTO agendas(lead_id,content,reviewed,updated_at) VALUES(?,?,?,?) ON CONFLICT(lead_id) DO UPDATE SET content=excluded.content,reviewed=excluded.reviewed,updated_at=excluded.updated_at",
      )
      .bind(
        input.id,
        input.content,
        input.reviewed === true ? 1 : 0,
        new Date().toISOString(),
      )
      .run();
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
