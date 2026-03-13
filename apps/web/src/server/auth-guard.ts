import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSession } from "./auth";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { getAgentByUserId } from "./services/agents";

/**
 * Extract the authenticated agent from a request session.
 * Returns the agent or null if not authenticated.
 */
export async function getSessionAgent(request: NextRequest) {
  const userId = await validateSession(request);
  if (!userId) return null;

  const agent = await getAgentByUserId(userId);
  return agent;
}

/**
 * Validate that the request Origin matches the Host header (CSRF protection).
 * Returns a 403 response if the check fails, or null if valid.
 */
export function checkCsrf(request: NextRequest): NextResponse | null {
  if (request.method === "GET" || request.method === "HEAD") return null;

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return null; // Allow same-origin requests without Origin header

  const originHost = new URL(origin).host;
  if (originHost !== host) {
    return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
  }

  return null;
}

/**
 * Require authentication: returns the agent or a 401 response.
 */
export async function requireAuth(request: NextRequest) {
  const csrfError = checkCsrf(request);
  if (csrfError) return { agent: null, error: csrfError };

  const agent = await getSessionAgent(request);
  if (!agent) {
    return {
      agent: null,
      error: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }

  return { agent, error: null };
}

/**
 * Check if the current user (Server Component context) is an admin.
 * Returns true if admin, false otherwise.
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const userId = await getSession();
    if (!userId) return false;

    const row = await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return row[0]?.isAdmin === true;
  } catch {
    return false;
  }
}
