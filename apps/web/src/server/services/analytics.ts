import { sql, count, desc } from "drizzle-orm";
import { db } from "../db";
import {
  agents,
  courses,
  colleges,
  enrollments,
  courseSections,
  certificates,
  studentProfiles,
  courseReviews,
} from "../db/schema";

export async function getUniversityStats() {
  const [agentCount] = await db.select({ count: count() }).from(agents);
  const [courseCount] = await db.select({ count: count() }).from(courses);
  const [enrollmentCount] = await db.select({ count: count() }).from(enrollments);
  const [certCount] = await db.select({ count: count() }).from(certificates);
  const [reviewCount] = await db.select({ count: count() }).from(courseReviews);

  const graduateRows = await db
    .select({ count: count() })
    .from(certificates)
    .where(sql`${certificates.type} = 'degree'`);

  return {
    totalAgents: agentCount.count,
    totalCourses: courseCount.count,
    totalEnrollments: enrollmentCount.count,
    totalCertificates: certCount.count,
    totalGraduates: graduateRows[0]?.count ?? 0,
    totalReviews: reviewCount.count,
  };
}

export async function getPopularCourses(limit = 10) {
  return db
    .select({
      courseCode: courses.code,
      courseTitle: courses.title,
      enrollmentCount: count(enrollments.id),
    })
    .from(enrollments)
    .innerJoin(courseSections, sql`${courseSections.id} = ${enrollments.courseSectionId}`)
    .innerJoin(courses, sql`${courses.id} = ${courseSections.courseId}`)
    .groupBy(courses.id)
    .orderBy(desc(count(enrollments.id)))
    .limit(limit);
}

export async function getCollegeEnrollmentBreakdown() {
  return db
    .select({
      collegeName: colleges.name,
      studentCount: count(studentProfiles.agentId),
    })
    .from(studentProfiles)
    .innerJoin(colleges, sql`${colleges.id} = ${studentProfiles.collegeId}`)
    .groupBy(colleges.id)
    .orderBy(desc(count(studentProfiles.agentId)));
}

export async function getGpaDistribution() {
  // Group GPA into buckets: 0-1, 1-2, 2-3, 3-4
  const rows = await db
    .select({
      gpa: studentProfiles.cumulativeGpa,
    })
    .from(studentProfiles)
    .where(sql`${studentProfiles.cumulativeGpa} > 0`);

  const buckets = [
    { range: "0.00-1.00", min: 0, max: 100, count: 0 },
    { range: "1.00-2.00", min: 100, max: 200, count: 0 },
    { range: "2.00-3.00", min: 200, max: 300, count: 0 },
    { range: "3.00-3.50", min: 300, max: 350, count: 0 },
    { range: "3.50-4.00", min: 350, max: 401, count: 0 },
  ];

  for (const row of rows) {
    const bucket = buckets.find((b) => row.gpa >= b.min && row.gpa < b.max);
    if (bucket) bucket.count++;
  }

  return buckets.map((b) => ({ range: b.range, count: b.count }));
}
