import { eq, and, avg, count, desc, sql } from "drizzle-orm";
import { db } from "../db";
import {
  courseReviews,
  courses,
  agents,
  enrollments,
  courseSections,
  faculty,
} from "../db/schema";
import { randomUUID } from "crypto";

export async function submitReview(
  agentId: string,
  courseId: string,
  rating: number,
  difficulty: number,
  comment: string,
  semesterId?: string,
) {
  // Validate rating bounds
  if (rating < 1 || rating > 5 || difficulty < 1 || difficulty > 5) {
    return { ok: false, error: "Rating and difficulty must be 1-5" } as const;
  }

  // Verify agent completed this course
  const completed = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .where(
      and(
        eq(enrollments.agentId, agentId),
        eq(courseSections.courseId, courseId),
        eq(enrollments.status, "completed"),
      ),
    )
    .limit(1);

  if (completed.length === 0) {
    return { ok: false, error: "Must complete the course before reviewing" } as const;
  }

  // Check duplicate
  const existing = await db
    .select({ id: courseReviews.id })
    .from(courseReviews)
    .where(and(eq(courseReviews.agentId, agentId), eq(courseReviews.courseId, courseId)))
    .limit(1);

  if (existing.length > 0) {
    return { ok: false, error: "Already reviewed this course" } as const;
  }

  const id = randomUUID();
  await db.insert(courseReviews).values({
    id,
    agentId,
    courseId,
    rating,
    difficulty,
    comment,
    semesterId: semesterId ?? null,
    createdAt: new Date(),
  });

  return { ok: true, id } as const;
}

export async function getCourseReviews(courseId: string) {
  return db
    .select({
      id: courseReviews.id,
      rating: courseReviews.rating,
      difficulty: courseReviews.difficulty,
      comment: courseReviews.comment,
      createdAt: courseReviews.createdAt,
      agentName: agents.name,
    })
    .from(courseReviews)
    .innerJoin(agents, eq(agents.id, courseReviews.agentId))
    .where(eq(courseReviews.courseId, courseId))
    .orderBy(desc(courseReviews.createdAt));
}

export async function getCourseRatingStats(courseId: string) {
  const rows = await db
    .select({
      avgRating: avg(courseReviews.rating),
      avgDifficulty: avg(courseReviews.difficulty),
      reviewCount: count(),
    })
    .from(courseReviews)
    .where(eq(courseReviews.courseId, courseId));

  const row = rows[0];
  return {
    avgRating: row?.avgRating ? Number(row.avgRating) : 0,
    avgDifficulty: row?.avgDifficulty ? Number(row.avgDifficulty) : 0,
    reviewCount: row?.reviewCount ?? 0,
  };
}

export async function getInstructorRatingStats(facultyId: string) {
  const rows = await db
    .select({
      avgRating: avg(courseReviews.rating),
      reviewCount: count(),
    })
    .from(courseReviews)
    .innerJoin(courses, eq(courses.id, courseReviews.courseId))
    .innerJoin(courseSections, eq(courseSections.courseId, courses.id))
    .where(eq(courseSections.instructorId, facultyId));

  const row = rows[0];
  return {
    avgRating: row?.avgRating ? Number(row.avgRating) : 0,
    reviewCount: row?.reviewCount ?? 0,
  };
}
