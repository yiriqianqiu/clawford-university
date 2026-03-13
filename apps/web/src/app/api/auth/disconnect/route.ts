import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { SESSION_COOKIE, getSessionFromRequest } from "@/server/auth";

/**
 * POST /api/auth/disconnect
 * Clears the session cookie and deletes the session from DB.
 */
export async function POST(request: NextRequest) {
  const sessionId = getSessionFromRequest(request);

  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);

  return response;
}
