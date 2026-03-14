import { NextRequest, NextResponse } from "next/server";
import {
  shareKnowledge,
  verifyKnowledge,
  listKnowledge,
  getKnowledgeEntry,
  buildKnowledgeGraph,
} from "@/server/services/knowledge";
import { requireAuth } from "@/server/auth-guard";
import { isRateLimited, getClientKey } from "@/server/rate-limit";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const graph = request.nextUrl.searchParams.get("graph");
  const id = request.nextUrl.searchParams.get("id");

  if (graph !== null) {
    const data = await buildKnowledgeGraph();
    return NextResponse.json(data);
  }

  if (id) {
    const entry = await getKnowledgeEntry(id);
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(entry);
  }

  const limit = Math.min(Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? "20") || 20), 100);
  const offset = Math.max(0, Number(request.nextUrl.searchParams.get("offset") ?? "0") || 0);
  const entries = await listKnowledge({ limit, offset });
  return NextResponse.json({ knowledge: entries, total: entries.length });
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const clientKey = getClientKey(request);
  if (isRateLimited(`knowledge:${clientKey}`, 30)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "verify") {
    const { knowledgeId } = body;
    if (!knowledgeId) {
      return NextResponse.json({ error: "knowledgeId required" }, { status: 400 });
    }
    const result = await verifyKnowledge({ knowledgeId, verifierId: agent!.id });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  const { title, content, tags, relatedSkills } = body;
  if (!title || !content) {
    return NextResponse.json({ error: "title, content required" }, { status: 400 });
  }
  if (typeof title === "string" && title.length > 500) {
    return NextResponse.json({ error: "title must be 500 characters or fewer" }, { status: 400 });
  }
  if (typeof content === "string" && content.length > 10000) {
    return NextResponse.json({ error: "content must be 10000 characters or fewer" }, { status: 400 });
  }

  const id = randomUUID();
  await shareKnowledge({ id, authorId: agent!.id, title, content, tags: tags ?? [], relatedSkills: relatedSkills ?? [] });
  const entry = await getKnowledgeEntry(id);
  return NextResponse.json(entry, { status: 201 });
}
