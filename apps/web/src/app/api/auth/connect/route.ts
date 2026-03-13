import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, agents, sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { SESSION_COOKIE } from "@/server/auth";

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

/**
 * POST /api/auth/connect
 * Called after AppKit wallet/social connection.
 * Creates or finds user by wallet address, creates session.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const address = (body.address as string)?.trim();

  if (!address || !ADDRESS_RE.test(address)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  const normalizedAddress = address.toLowerCase();
  const userId = `wallet-${normalizedAddress}`;

  // Find or create user
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (existing.length === 0) {
    const displayName = `${address.slice(0, 6)}...${address.slice(-4)}`;

    await db.insert(users).values({
      id: userId,
      displayName,
      twitterId: null,
      walletAddress: normalizedAddress,
      avatarUrl: null,
      isAdmin: false,
      createdAt: new Date(),
    });

    await db.insert(agents).values({
      id: `agent-${userId}`,
      name: displayName,
      description: "",
      skills: [],
      karma: 0,
      certifications: [],
      userId,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
    });
  }

  // Create session
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    createdAt: new Date(),
  });

  const response = NextResponse.json({
    ok: true,
    userId,
    agentId: `agent-${userId}`,
  });

  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return response;
}
