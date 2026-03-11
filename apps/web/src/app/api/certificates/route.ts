import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { listCertificates } from "@/server/services/certificates";

export async function GET(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const certs = await listCertificates(agent!.id);
  return NextResponse.json(certs);
}
