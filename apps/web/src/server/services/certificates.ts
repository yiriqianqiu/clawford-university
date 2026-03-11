import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import {
  certificates,
  courses,
  degreePrograms,
  colleges,
  enrollments,
  courseSections,
} from "../db/schema";
import { randomUUID } from "crypto";

export async function listCertificates(agentId: string) {
  return db
    .select({
      id: certificates.id,
      type: certificates.type,
      title: certificates.title,
      description: certificates.description,
      grade: certificates.grade,
      issuedAt: certificates.issuedAt,
      txHash: certificates.txHash,
      tokenId: certificates.tokenId,
      courseCode: courses.code,
      courseTitle: courses.title,
      degreeName: degreePrograms.name,
    })
    .from(certificates)
    .leftJoin(courses, eq(courses.id, certificates.courseId))
    .leftJoin(degreePrograms, eq(degreePrograms.id, certificates.degreeProgramId))
    .where(eq(certificates.agentId, agentId))
    .orderBy(desc(certificates.issuedAt));
}

export async function getCertificate(id: string) {
  const rows = await db
    .select({
      id: certificates.id,
      agentId: certificates.agentId,
      type: certificates.type,
      title: certificates.title,
      description: certificates.description,
      grade: certificates.grade,
      issuedAt: certificates.issuedAt,
      txHash: certificates.txHash,
      tokenId: certificates.tokenId,
      courseId: certificates.courseId,
      courseCode: courses.code,
      courseTitle: courses.title,
      degreeProgramId: certificates.degreeProgramId,
      degreeName: degreePrograms.name,
      collegeName: colleges.name,
    })
    .from(certificates)
    .leftJoin(courses, eq(courses.id, certificates.courseId))
    .leftJoin(degreePrograms, eq(degreePrograms.id, certificates.degreeProgramId))
    .leftJoin(colleges, eq(colleges.id, degreePrograms.collegeId))
    .where(eq(certificates.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function issueCourseCertificate(enrollmentId: string) {
  // Get enrollment details
  const rows = await db
    .select({
      agentId: enrollments.agentId,
      grade: enrollments.grade,
      courseId: courseSections.courseId,
      courseCode: courses.code,
      courseTitle: courses.title,
    })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .where(eq(enrollments.id, enrollmentId))
    .limit(1);

  const enrollment = rows[0];
  if (!enrollment) return null;

  // Check if certificate already exists for this course
  const existing = await db
    .select({ id: certificates.id })
    .from(certificates)
    .where(
      and(
        eq(certificates.agentId, enrollment.agentId),
        eq(certificates.type, "course_completion"),
        eq(certificates.courseId, enrollment.courseId),
      ),
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  const id = randomUUID();
  await db.insert(certificates).values({
    id,
    agentId: enrollment.agentId,
    type: "course_completion",
    courseId: enrollment.courseId,
    title: `${enrollment.courseCode} — ${enrollment.courseTitle}`,
    description: `Completed ${enrollment.courseCode} ${enrollment.courseTitle} with grade ${enrollment.grade}.`,
    grade: enrollment.grade,
    issuedAt: new Date(),
  });

  return { id };
}

export async function issueDegreeCertificate(agentId: string, programId: string) {
  // Check duplicate
  const existing = await db
    .select({ id: certificates.id })
    .from(certificates)
    .where(
      and(
        eq(certificates.agentId, agentId),
        eq(certificates.type, "degree"),
        eq(certificates.degreeProgramId, programId),
      ),
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  // Get program details
  const programRows = await db
    .select({
      name: degreePrograms.name,
      type: degreePrograms.type,
      collegeName: colleges.name,
    })
    .from(degreePrograms)
    .innerJoin(colleges, eq(colleges.id, degreePrograms.collegeId))
    .where(eq(degreePrograms.id, programId))
    .limit(1);

  const program = programRows[0];
  if (!program) return null;

  const id = randomUUID();
  await db.insert(certificates).values({
    id,
    agentId,
    type: "degree",
    degreeProgramId: programId,
    title: program.name,
    description: `${program.type === "bachelor" ? "Bachelor's Degree" : "Certificate"} from ${program.collegeName}.`,
    issuedAt: new Date(),
  });

  return { id };
}

export async function issueHonorCertificate(agentId: string, title: string, description: string) {
  const id = randomUUID();
  await db.insert(certificates).values({
    id,
    agentId,
    type: "honor",
    title,
    description,
    issuedAt: new Date(),
  });
  return { id };
}
