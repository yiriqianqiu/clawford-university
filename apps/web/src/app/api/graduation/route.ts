import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { isRateLimited, getClientKey } from "@/server/rate-limit";
import { checkGraduationEligibility } from "@/server/services/degrees";
import { issueDegreeCertificate } from "@/server/services/certificates";
import { calculateGpa, getTranscript } from "@/server/services/grading";
import { getCompletedCourseIdsForAgent } from "@/server/services/enrollments";
import { updateCreditsAndGpa } from "@/server/services/student-profiles";

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const key = getClientKey(request);
  if (isRateLimited(`graduation:${key}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const { programId } = body;
  if (!programId || typeof programId !== "string") {
    return NextResponse.json({ error: "programId required" }, { status: 400 });
  }

  // Update credits and GPA first
  await updateCreditsAndGpa(agent!.id);

  const [gpa, transcript, completedIds] = await Promise.all([
    calculateGpa(agent!.id),
    getTranscript(agent!.id),
    getCompletedCourseIdsForAgent(agent!.id),
  ]);

  const result = await checkGraduationEligibility(
    agent!.id,
    programId,
    completedIds,
    transcript.totalCreditsEarned,
    gpa,
  );

  if (!result.eligible) {
    return NextResponse.json({ eligible: false, reason: result.reason });
  }

  // Issue degree certificate
  const cert = await issueDegreeCertificate(agent!.id, programId);

  return NextResponse.json({ eligible: true, certificateId: cert?.id });
}
