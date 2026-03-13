import { cookies } from "next/headers";
import { db } from "./db";
import { sessions, users } from "./db/schema";
import { eq, and, gt } from "drizzle-orm";

const SESSION_COOKIE = "clawford.session";

/**
 * Get the current session from cookies (Server Components).
 * Returns user ID or null.
 */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const result = await db
    .select({ userId: sessions.userId })
    .from(sessions)
    .where(
      and(
        eq(sessions.id, sessionId),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return result[0]?.userId ?? null;
}

/**
 * Get session from a Request object (API routes).
 */
export function getSessionFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}

/**
 * Validate a session token from a Request.
 * Returns user ID or null.
 */
export async function validateSession(request: Request): Promise<string | null> {
  const sessionId = getSessionFromRequest(request);
  if (!sessionId) return null;

  const result = await db
    .select({ userId: sessions.userId })
    .from(sessions)
    .where(
      and(
        eq(sessions.id, sessionId),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return result[0]?.userId ?? null;
}

export { SESSION_COOKIE };
