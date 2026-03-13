import { NextResponse } from "next/server";

// better-auth handler removed — auth now uses @reown/appkit.
// See /api/auth/connect and /api/auth/disconnect instead.
export function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function POST() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
