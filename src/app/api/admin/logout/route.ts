import { authClient } from "@/lib/supabase";
import { checkOrigin } from "@/lib/security";
import { failure } from "@/lib/api";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await (await authClient()).auth.signOut();
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
