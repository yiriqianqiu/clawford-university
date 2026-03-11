import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { semesters } from "../db/schema";

export async function listSemesters() {
  return db.select().from(semesters).orderBy(desc(semesters.startDate));
}

export async function getActiveSemester() {
  const rows = await db
    .select()
    .from(semesters)
    .where(eq(semesters.isActive, true))
    .limit(1);
  return rows[0] ?? null;
}

export async function getSemester(id: string) {
  const rows = await db
    .select()
    .from(semesters)
    .where(eq(semesters.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export function isEnrollmentOpen(semester: { enrollmentOpenDate: Date; enrollmentCloseDate: Date }) {
  const now = new Date();
  return now >= semester.enrollmentOpenDate && now <= semester.enrollmentCloseDate;
}
