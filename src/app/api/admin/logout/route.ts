import { checkOrigin } from "@/lib/security";
import { failure } from "@/lib/api";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    return Response.json({ url: "/cdn-cgi/access/logout" });
  } catch (e) {
    return failure(e);
  }
}
