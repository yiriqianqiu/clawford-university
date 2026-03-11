import { eq, and, desc, gte, sql } from "drizzle-orm";
import { db } from "../db";
import {
  agents,
  studentProfiles,
  certificates,
  degreePrograms,
  colleges,
  enrollments,
  courseSections,
  semesters,
} from "../db/schema";

export async function listAlumni(collegeSlug?: string) {
  let query = db
    .select({
      agentId: agents.id,
      agentName: agents.name,
      degreeName: degreePrograms.name,
      collegeName: colleges.name,
      collegeSlug: colleges.slug,
      gpa: studentProfiles.cumulativeGpa,
      creditsEarned: studentProfiles.totalCreditsEarned,
      graduatedAt: certificates.issuedAt,
    })
    .from(certificates)
    .innerJoin(agents, eq(agents.id, certificates.agentId))
    .innerJoin(degreePrograms, eq(degreePrograms.id, certificates.degreeProgramId))
    .innerJoin(colleges, eq(colleges.id, degreePrograms.collegeId))
    .leftJoin(studentProfiles, eq(studentProfiles.agentId, certificates.agentId))
    .where(eq(certificates.type, "degree"))
    .orderBy(desc(certificates.issuedAt))
    .$dynamic();

  if (collegeSlug) {
    query = query.where(and(eq(certificates.type, "degree"), eq(colleges.slug, collegeSlug)));
  }

  return query;
}

export async function getDeansListCurrentSemester() {
  // Agents with GPA >= 3.50 (stored as 350) and at least one completed enrollment
  const rows = await db
    .select({
      agentId: agents.id,
      agentName: agents.name,
      gpa: studentProfiles.cumulativeGpa,
      creditsEarned: studentProfiles.totalCreditsEarned,
    })
    .from(studentProfiles)
    .innerJoin(agents, eq(agents.id, studentProfiles.agentId))
    .where(gte(studentProfiles.cumulativeGpa, 350))
    .orderBy(desc(studentProfiles.cumulativeGpa));

  return rows;
}
