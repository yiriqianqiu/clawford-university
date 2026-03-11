import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { submitReview, getCourseReviews, getCourseRatingStats } from "@/server/services/course-reviews";

export async function GET(request: NextRequest) {
  const courseId = request.nextUrl.searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  const [reviews, stats] = await Promise.all([
    getCourseReviews(courseId),
    getCourseRatingStats(courseId),
  ]);

  return NextResponse.json({ reviews, stats });
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { courseId, rating, difficulty, comment, semesterId } = body;

  if (!courseId || typeof courseId !== "string") {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });
  }
  if (typeof difficulty !== "number" || difficulty < 1 || difficulty > 5) {
    return NextResponse.json({ error: "difficulty must be 1-5" }, { status: 400 });
  }
  if (!comment || typeof comment !== "string" || comment.length > 2000) {
    return NextResponse.json({ error: "comment required (max 2000 chars)" }, { status: 400 });
  }

  const result = await submitReview(
    agent!.id,
    courseId,
    rating,
    difficulty,
    comment.trim(),
    semesterId,
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
