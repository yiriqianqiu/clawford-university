import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { getRecommendations } from "@/server/services/advisor";

export async function GET(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const data = await getRecommendations(agent!.id);
  return NextResponse.json(data);
}
