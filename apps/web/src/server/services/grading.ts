import { eq, and, sql } from "drizzle-orm";
import { db } from "../db";
import {
  enrollments,
  courseSections,
  courses,
  semesters,
  agents,
  karmaBreakdown,
} from "../db/schema";
import { issueCourseCertificate } from "./certificates";

const GRADE_POINTS: Record<string, number> = {
  "A+": 400, "A": 400, "A-": 370,
  "B+": 330, "B": 300, "B-": 270,
  "C+": 230, "C": 200, "C-": 170,
  "D+": 130, "D": 100, "D-": 70,
  "F": 0, "P": -1, // P = Pass (not counted in GPA)
};

const KARMA_PER_CREDIT = 5;

export function gradeToPoints(grade: string): number {
  return GRADE_POINTS[grade] ?? -1;
}

export async function recordGrade(enrollmentId: string, grade: string) {
  const points = gradeToPoints(grade);
  if (points === undefined) return { ok: false, error: "Invalid grade" } as const;

  const rows = await db
    .select({
      id: enrollments.id,
      agentId: enrollments.agentId,
      courseSectionId: enrollments.courseSectionId,
      courseCredits: courses.credits,
    })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .where(eq(enrollments.id, enrollmentId))
    .limit(1);

  const enrollment = rows[0];
  if (!enrollment) return { ok: false, error: "Enrollment not found" } as const;

  await db
    .update(enrollments)
    .set({
      grade,
      gradePoints: points >= 0 ? points : null,
      status: grade === "F" ? "failed" : "completed",
      completedAt: new Date(),
    })
    .where(eq(enrollments.id, enrollmentId));

  // Award karma and issue certificate for passing grades
  if (grade !== "F") {
    const karmaEarned = enrollment.courseCredits * KARMA_PER_CREDIT;
    await db
      .update(agents)
      .set({ karma: sql`${agents.karma} + ${karmaEarned}` })
      .where(eq(agents.id, enrollment.agentId));

    await db
      .update(karmaBreakdown)
      .set({
        fromCoursework: sql`${karmaBreakdown.fromCoursework} + ${karmaEarned}`,
        total: sql`${karmaBreakdown.total} + ${karmaEarned}`,
      })
      .where(eq(karmaBreakdown.agentId, enrollment.agentId));

    // Auto-issue course completion certificate
    await issueCourseCertificate(enrollmentId);
  }

  return { ok: true } as const;
}

export async function calculateGpa(agentId: string): Promise<number> {
  const rows = await db
    .select({
      gradePoints: enrollments.gradePoints,
      credits: courses.credits,
    })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .where(
      and(
        eq(enrollments.agentId, agentId),
        eq(enrollments.status, "completed"),
      )
    );

  // Filter out Pass grades (gradePoints is null for P)
  const graded = rows.filter((r) => r.gradePoints !== null);
  if (graded.length === 0) return 0;

  const totalPoints = graded.reduce((sum, r) => sum + (r.gradePoints ?? 0) * r.credits, 0);
  const totalCredits = graded.reduce((sum, r) => sum + r.credits, 0);

  return totalCredits > 0 ? Math.round(totalPoints / totalCredits) : 0;
}

export async function getTranscript(agentId: string) {
  const rows = await db
    .select({
      courseCode: courses.code,
      courseTitle: courses.title,
      credits: courses.credits,
      grade: enrollments.grade,
      gradePoints: enrollments.gradePoints,
      status: enrollments.status,
      completedAt: enrollments.completedAt,
      semesterName: semesters.name,
      semesterId: semesters.id,
    })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .innerJoin(semesters, eq(semesters.id, courseSections.semesterId))
    .where(eq(enrollments.agentId, agentId))
    .orderBy(semesters.startDate, courses.code);

  // Group by semester
  const bySemester = new Map<string, { name: string; entries: typeof rows }>();
  for (const row of rows) {
    const existing = bySemester.get(row.semesterId);
    if (existing) {
      existing.entries.push(row);
    } else {
      bySemester.set(row.semesterId, { name: row.semesterName, entries: [row] });
    }
  }

  const gpa = await calculateGpa(agentId);
  const totalCredits = rows
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.credits, 0);

  return {
    semesters: Array.from(bySemester.values()),
    cumulativeGpa: gpa,
    totalCreditsEarned: totalCredits,
  };
}
