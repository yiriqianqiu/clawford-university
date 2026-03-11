import { eq, and, notInArray } from "drizzle-orm";
import { db } from "../db";
import {
  courses,
  departments,
  colleges,
  enrollments,
  courseSections,
  degreePrograms,
  degreeRequirements,
  studentProfiles,
} from "../db/schema";
import { calculateGpa } from "./grading";

interface CourseRecommendation {
  courseId: string;
  code: string;
  title: string;
  credits: number;
  collegeName: string;
  reason: string;
}

interface DegreeProgress {
  programId: string;
  programName: string;
  collegeName: string;
  requiredCredits: number;
  earnedCredits: number;
  completedRequirements: number;
  totalRequirements: number;
  percentComplete: number;
}

export async function getRecommendations(agentId: string) {
  // Get completed course IDs
  const completedRows = await db
    .select({ courseId: courseSections.courseId })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .where(and(eq(enrollments.agentId, agentId), eq(enrollments.status, "completed")));

  const completedIds = completedRows.map((r) => r.courseId);

  // Get enrolled course IDs (to avoid recommending current courses)
  const enrolledRows = await db
    .select({ courseId: courseSections.courseId })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .where(and(eq(enrollments.agentId, agentId), eq(enrollments.status, "enrolled")));

  const enrolledIds = enrolledRows.map((r) => r.courseId);
  const takenIds = [...completedIds, ...enrolledIds];

  // Get all courses with their prereqs
  const allCourses = await db
    .select({
      id: courses.id,
      code: courses.code,
      title: courses.title,
      credits: courses.credits,
      prerequisiteCourseIds: courses.prerequisiteCourseIds,
      departmentId: courses.departmentId,
      collegeName: colleges.name,
    })
    .from(courses)
    .innerJoin(departments, eq(departments.id, courses.departmentId))
    .innerJoin(colleges, eq(colleges.id, departments.collegeId));

  // Find eligible courses (prereqs met, not taken)
  const recommendations: CourseRecommendation[] = [];

  for (const course of allCourses) {
    if (takenIds.includes(course.id)) continue;

    const prereqs = course.prerequisiteCourseIds as string[];
    const prereqsMet = prereqs.every((p) => completedIds.includes(p));
    if (!prereqsMet) continue;

    let reason = "Prerequisites met";
    if (prereqs.length === 0) {
      reason = "No prerequisites — great starting point";
    } else {
      reason = `Unlocked by completing ${prereqs.length} prerequisite(s)`;
    }

    recommendations.push({
      courseId: course.id,
      code: course.code,
      title: course.title,
      credits: course.credits,
      collegeName: course.collegeName,
      reason,
    });
  }

  // Get degree progress
  const programs = await db
    .select({
      id: degreePrograms.id,
      name: degreePrograms.name,
      requiredCredits: degreePrograms.requiredCredits,
      collegeName: colleges.name,
    })
    .from(degreePrograms)
    .innerJoin(colleges, eq(colleges.id, degreePrograms.collegeId));

  const degreeProgress: DegreeProgress[] = [];
  const profile = await db
    .select()
    .from(studentProfiles)
    .where(eq(studentProfiles.agentId, agentId))
    .limit(1);

  const earnedCredits = profile[0]?.totalCreditsEarned ?? 0;

  for (const program of programs) {
    const reqs = await db
      .select({ courseId: degreeRequirements.courseId })
      .from(degreeRequirements)
      .where(eq(degreeRequirements.degreeProgramId, program.id));

    const totalReqs = reqs.length;
    const completedReqs = reqs.filter(
      (r) => r.courseId && completedIds.includes(r.courseId),
    ).length;

    const percentComplete = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

    degreeProgress.push({
      programId: program.id,
      programName: program.name,
      collegeName: program.collegeName,
      requiredCredits: program.requiredCredits,
      earnedCredits,
      completedRequirements: completedReqs,
      totalRequirements: totalReqs,
      percentComplete,
    });
  }

  // Sort: highest progress first
  degreeProgress.sort((a, b) => b.percentComplete - a.percentComplete);

  const gpa = await calculateGpa(agentId);

  return {
    recommendations: recommendations.slice(0, 10),
    degreeProgress,
    completedCount: completedIds.length,
    enrolledCount: enrolledIds.length,
    totalCredits: earnedCredits,
    gpa,
  };
}
