import { eq } from "drizzle-orm";
import { db } from "../db";
import { studentProfiles } from "../db/schema";
import { calculateGpa, getTranscript } from "./grading";

export async function getStudentProfile(agentId: string) {
  const rows = await db
    .select()
    .from(studentProfiles)
    .where(eq(studentProfiles.agentId, agentId))
    .limit(1);

  return rows[0] ?? null;
}

export async function getOrCreateStudentProfile(agentId: string, collegeId: string) {
  const existing = await getStudentProfile(agentId);
  if (existing) return existing;

  await db.insert(studentProfiles).values({
    agentId,
    collegeId,
    enrollmentStatus: "active",
    enrolledAt: new Date(),
  });

  return getStudentProfile(agentId);
}

export async function updateCreditsAndGpa(agentId: string) {
  const [gpa, transcript] = await Promise.all([
    calculateGpa(agentId),
    getTranscript(agentId),
  ]);

  await db
    .update(studentProfiles)
    .set({
      cumulativeGpa: gpa,
      totalCreditsEarned: transcript.totalCreditsEarned,
    })
    .where(eq(studentProfiles.agentId, agentId));
}
