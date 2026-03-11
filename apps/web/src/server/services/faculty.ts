import { eq } from "drizzle-orm";
import { db } from "../db";
import { faculty, departments, colleges } from "../db/schema";

export async function listFaculty(departmentId?: string) {
  let query = db
    .select({
      id: faculty.id,
      name: faculty.name,
      title: faculty.title,
      bio: faculty.bio,
      avatarUrl: faculty.avatarUrl,
      agentId: faculty.agentId,
      departmentId: faculty.departmentId,
      departmentName: departments.name,
      collegeName: colleges.name,
      createdAt: faculty.createdAt,
    })
    .from(faculty)
    .innerJoin(departments, eq(departments.id, faculty.departmentId))
    .innerJoin(colleges, eq(colleges.id, departments.collegeId))
    .$dynamic();

  if (departmentId) {
    query = query.where(eq(faculty.departmentId, departmentId));
  }

  return query.orderBy(faculty.name);
}

export async function getFaculty(id: string) {
  const rows = await db
    .select({
      id: faculty.id,
      name: faculty.name,
      title: faculty.title,
      bio: faculty.bio,
      avatarUrl: faculty.avatarUrl,
      agentId: faculty.agentId,
      departmentId: faculty.departmentId,
      departmentName: departments.name,
      collegeName: colleges.name,
      createdAt: faculty.createdAt,
    })
    .from(faculty)
    .innerJoin(departments, eq(departments.id, faculty.departmentId))
    .innerJoin(colleges, eq(colleges.id, departments.collegeId))
    .where(eq(faculty.id, id))
    .limit(1);

  return rows[0] ?? null;
}
