import { createHmac, timingSafeEqual } from "node:crypto";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function signAssessment(id: string, secret: string, now = Date.now()) {
  if (secret.length < 32 || !uuid.test(id))
    throw new Error("Invalid session configuration");
  const value = `${id}.${now + 86400000}`;
  return `${value}.${createHmac("sha256", secret).update(value).digest("hex")}`;
}
export function verifyAssessment(
  token: string | undefined,
  secret: string | undefined,
  now = Date.now(),
) {
  if (!token || !secret || secret.length < 32) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, expiry, mac] = parts;
  if (
    !uuid.test(id) ||
    !/^\d+$/.test(expiry) ||
    !Number.isSafeInteger(Number(expiry)) ||
    Number(expiry) <= now ||
    !/^[a-f0-9]{64}$/.test(mac)
  )
    return null;
  const expected = createHmac("sha256", secret)
    .update(`${id}.${expiry}`)
    .digest("hex");
  return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(expected, "hex"))
    ? id
    : null;
}
export async function readJson(request: Request, limit = 20000) {
  if (Number(request.headers.get("content-length") || 0) > limit)
    throw new Error("BODY");
  if (!request.body) throw new Error("BODY");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new Error("BODY");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
