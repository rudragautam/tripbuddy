import { jwtVerify, SignJWT } from "jose";

/** Edge/Node-safe session token helpers (used by proxy.ts and server code). */

export const SESSION_COOKIE = "tb_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionClaims = { uid: number; ver: number; role: "admin" | "editor" };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be set to at least 32 characters in production.");
    }
    return new TextEncoder().encode("dev-only-insecure-secret-change-me-0123456789");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(claims: SessionClaims) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (typeof payload.uid !== "number" || typeof payload.ver !== "number") return null;
    if (payload.role !== "admin" && payload.role !== "editor") return null;
    return { uid: payload.uid, ver: payload.ver, role: payload.role };
  } catch {
    return null;
  }
}
