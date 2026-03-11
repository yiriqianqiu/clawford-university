import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  degreePrograms,
  degreeRequirements,
  colleges,
  courses,
  departments,
} from "../db/schema";

export async function listDegreePrograms() {
  return db
    .select({
      id: degreePrograms.id,
      name: degreePrograms.name,
      slug: degreePrograms.slug,
      type: degreePrograms.type,
      description: degreePrograms.description,
      requiredCredits: degreePrograms.requiredCredits,
      minGpa: degreePrograms.minGpa,
      collegeName: colleges.name,
      collegeSlug: colleges.slug,
      collegeEmoji: colleges.iconEmoji,
    })
    .from(degreePrograms)
    .innerJoin(colleges, eq(colleges.id, degreePrograms.collegeId))
    .orderBy(colleges.name, degreePrograms.name);
}

export async function getDegreeProgram(slug: string) {
  const rows = await db
    .select({
      id: degreePrograms.id,
      name: degreePrograms.name,
      slug: degreePrograms.slug,
      type: degreePrograms.type,
      description: degreePrograms.description,
      requiredCredits: degreePrograms.requiredCredits,
      minGpa: degreePrograms.minGpa,
      collegeId: degreePrograms.collegeId,
      collegeName: colleges.name,
      collegeSlug: colleges.slug,
    })
    .from(degreePrograms)
    .innerJoin(colleges, eq(colleges.id, degreePrograms.collegeId))
    .where(eq(degreePrograms.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}

export async function getDegreeRequirements(programId: string) {
  return db
    .select({
      id: degreeRequirements.id,
      courseId: degreeRequirements.courseId,
      courseCode: courses.code,
      courseTitle: courses.title,
      courseCredits: courses.credits,
      departmentId: degreeRequirements.departmentId,
      departmentName: departments.name,
      minCredits: degreeRequirements.minCredits,
      isElective: degreeRequirements.isElective,
      sortOrder: degreeRequirements.sortOrder,
    })
    .from(degreeRequirements)
    .leftJoin(courses, eq(courses.id, degreeRequirements.courseId))
    .leftJoin(departments, eq(departments.id, degreeRequirements.departmentId))
    .where(eq(degreeRequirements.degreeProgramId, programId))
    .orderBy(degreeRequirements.sortOrder);
}

export async function checkGraduationEligibility(
  agentId: string,
  programId: string,
  completedCourseIds: string[],
  totalCredits: number,
  gpa: number,
) {
  const program = await db
    .select()
    .from(degreePrograms)
    .where(eq(degreePrograms.id, programId))
    .limit(1);

  if (!program[0]) return { eligible: false, reason: "Degree program not found" } as const;

  const { requiredCredits, minGpa } = program[0];

  if (totalCredits < requiredCredits) {
    return {
      eligible: false,
      reason: `Need ${requiredCredits} credits, have ${totalCredits}`,
    } as const;
  }

  if (gpa < minGpa) {
    return {
      eligible: false,
      reason: `Need GPA ${(minGpa / 100).toFixed(2)}, have ${(gpa / 100).toFixed(2)}`,
    } as const;
  }

  // Check required courses
  const requirements = await getDegreeRequirements(programId);
  const requiredCourses = requirements.filter((r) => r.courseId && !r.isElective);
  const missingCourses = requiredCourses.filter(
    (r) => r.courseId && !completedCourseIds.includes(r.courseId),
  );

  if (missingCourses.length > 0) {
    const missing = missingCourses.map((c) => c.courseCode ?? c.courseId).join(", ");
    return { eligible: false, reason: `Missing required courses: ${missing}` } as const;
  }

  return { eligible: true, reason: null } as const;
}
