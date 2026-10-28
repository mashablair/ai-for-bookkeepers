import "server-only";
import { signAssessment, verifyAssessment, readJson } from "./request-safety";
import { cookies } from "next/headers";
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url)
    .origin;
  const local =
    !process.env.NEXT_PUBLIC_SITE_URL &&
    origin &&
    ["http://127.0.0.1:3000", "http://localhost:3000"].includes(origin);
  if (!origin || (origin !== expected && !local)) throw new Error("ORIGIN");
}
export async function setAssessmentCookie(id: string) {
  const token = signAssessment(id, process.env.SESSION_SECRET!);
  (await cookies()).set("assessment", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https:"),
    maxAge: 86400,
    path: "/",
  });
}
export async function assessmentOwner() {
  return verifyAssessment(
    (await cookies()).get("assessment")?.value,
    process.env.SESSION_SECRET,
  );
}
export const body = readJson;
