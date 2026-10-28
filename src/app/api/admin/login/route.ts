import { authClient, configured, requireAdmin } from "@/lib/supabase";
import { body, checkOrigin } from "@/lib/security";
import { rateLimit, failure } from "@/lib/api";
import { z } from "zod";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    if (!configured()) throw new Error("UNCONFIGURED");
    await rateLimit(request, "login", 10);
    const input = z
      .object({ email: z.email(), password: z.string().min(1).max(200) })
      .parse(await body(request));
    const client = await authClient();
    const { error } = await client.auth.signInWithPassword(input);
    if (error) throw new Error("UNAUTHORIZED");
    try {
      await requireAdmin();
    } catch {
      await client.auth.signOut();
      throw new Error("UNAUTHORIZED");
    }
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
