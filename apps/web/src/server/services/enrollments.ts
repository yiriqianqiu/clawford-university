import { eq, and, sql } from "drizzle-orm";
import { db } from "../db";
import {
  enrollments,
  courseSections,
  courses,
  departments,
  colleges,
  semesters,
  faculty,
} from "../db/schema";
import { randomUUID } from "crypto";

export async function getEnrollments(agentId: string) {
  return db
    .select({
      id: enrollments.id,
      status: enrollments.status,
      grade: enrollments.grade,
      gradePoints: enrollments.gradePoints,
      enrolledAt: enrollments.enrolledAt,
      completedAt: enrollments.completedAt,
      sectionId: courseSections.id,
      courseCode: courses.code,
      courseTitle: courses.title,
      courseCredits: courses.credits,
      semesterName: semesters.name,
      instructorName: faculty.name,
      collegeName: colleges.name,
    })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .innerJoin(departments, eq(departments.id, courses.departmentId))
    .innerJoin(colleges, eq(colleges.id, departments.collegeId))
    .innerJoin(semesters, eq(semesters.id, courseSections.semesterId))
    .innerJoin(faculty, eq(faculty.id, courseSections.instructorId))
    .where(eq(enrollments.agentId, agentId))
    .orderBy(enrollments.enrolledAt);
}

export async function enrollInCourse(agentId: string, sectionId: string) {
  // Get section with course info
  const sectionRows = await db
    .select({
      id: courseSections.id,
      courseId: courseSections.courseId,
      maxEnrollment: courseSections.maxEnrollment,
      currentEnrollment: courseSections.currentEnrollment,
      prerequisiteCourseIds: courses.prerequisiteCourseIds,
    })
    .from(courseSections)
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .where(eq(courseSections.id, sectionId))
    .limit(1);

  const section = sectionRows[0];
  if (!section) return { ok: false, error: "Section not found" } as const;

  // Check duplicate enrollment
  const existing = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.agentId, agentId), eq(enrollments.courseSectionId, sectionId)))
    .limit(1);

  if (existing.length > 0) return { ok: false, error: "Already enrolled" } as const;

  // Check prerequisites
  const prereqs = section.prerequisiteCourseIds as string[];
  if (prereqs.length > 0) {
    const completed = await getCompletedCourseIds(agentId);
    const missing = prereqs.filter((p) => !completed.includes(p));
    if (missing.length > 0) {
      return { ok: false, error: `Missing prerequisites: ${missing.join(", ")}` } as const;
    }
  }

  // Check capacity
  const status = section.currentEnrollment >= section.maxEnrollment ? "waitlisted" : "enrolled";

  const id = randomUUID();
  await db.insert(enrollments).values({
    id,
    agentId,
    courseSectionId: sectionId,
    status,
    enrolledAt: new Date(),
  });

  // Increment enrollment count if enrolled (not waitlisted)
  if (status === "enrolled") {
    await db
      .update(courseSections)
      .set({ currentEnrollment: sql`${courseSections.currentEnrollment} + 1` })
      .where(eq(courseSections.id, sectionId));
  }

  return { ok: true, status } as const;
}

export async function dropCourse(agentId: string, sectionId: string) {
  const existing = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.agentId, agentId), eq(enrollments.courseSectionId, sectionId)))
    .limit(1);

  if (!existing[0]) return { ok: false, error: "Not enrolled" } as const;

  const wasEnrolled = existing[0].status === "enrolled";

  await db
    .update(enrollments)
    .set({ status: "dropped" })
    .where(eq(enrollments.id, existing[0].id));

  // Decrement count if was enrolled
  if (wasEnrolled) {
    await db
      .update(courseSections)
      .set({ currentEnrollment: sql`${courseSections.currentEnrollment} - 1` })
      .where(eq(courseSections.id, sectionId));
  }

  return { ok: true } as const;
}

export async function getCompletedCourseIdsForAgent(agentId: string): Promise<string[]> {
  return getCompletedCourseIds(agentId);
}

async function getCompletedCourseIds(agentId: string): Promise<string[]> {
  const rows = await db
    .select({ courseId: courseSections.courseId })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .where(and(eq(enrollments.agentId, agentId), eq(enrollments.status, "completed")));

  return rows.map((r) => r.courseId);
}
