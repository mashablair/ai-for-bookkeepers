import { jwtVerify, type JWTVerifyGetKey } from "jose";
export async function verifyAdminToken(
  token: string,
  keys: JWTVerifyGetKey,
  issuer: string,
  audience: string,
  email: string,
) {
  const { payload } = await jwtVerify(token, keys, {
    issuer,
    audience,
    algorithms: ["RS256"],
    requiredClaims: ["exp", "sub", "email"],
  });
  if (
    typeof payload.email !== "string" ||
    payload.email.toLowerCase() !== email.toLowerCase() ||
    !payload.sub
  )
    throw new Error("UNAUTHORIZED");
  return { email: payload.email };
}
