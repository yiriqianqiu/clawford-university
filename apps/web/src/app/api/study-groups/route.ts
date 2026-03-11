import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import {
  listStudyGroups,
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
} from "@/server/services/study-groups";

export async function GET(request: NextRequest) {
  const courseId = request.nextUrl.searchParams.get("courseId");
  const groups = await listStudyGroups(courseId ?? undefined);
  return NextResponse.json(groups);
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { action } = body;

  if (action === "create") {
    const { name, courseId, maxMembers } = body;
    if (!name || typeof name !== "string" || name.length > 100) {
      return NextResponse.json({ error: "name required (max 100 chars)" }, { status: 400 });
    }
    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }
    const result = await createStudyGroup(agent!.id, name.trim(), courseId, maxMembers ?? 10);
    return NextResponse.json({ ok: true, id: result.id });
  }

  if (action === "join") {
    const { groupId } = body;
    if (!groupId) return NextResponse.json({ error: "groupId required" }, { status: 400 });
    const result = await joinStudyGroup(groupId, agent!.id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === "leave") {
    const { groupId } = body;
    if (!groupId) return NextResponse.json({ error: "groupId required" }, { status: 400 });
    await leaveStudyGroup(groupId, agent!.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
