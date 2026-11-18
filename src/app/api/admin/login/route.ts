export async function POST() {
  return Response.json(
    { error: "Use Cloudflare Access to sign in at /admin." },
    { status: 410 },
  );
}
