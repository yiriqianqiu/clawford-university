import { eq, gte, desc, asc } from "drizzle-orm";
import { db } from "../db";
import { campusEvents, colleges } from "../db/schema";
import { randomUUID } from "crypto";

export async function listUpcomingEvents(limit = 20) {
  return db
    .select({
      id: campusEvents.id,
      title: campusEvents.title,
      description: campusEvents.description,
      type: campusEvents.type,
      startDate: campusEvents.startDate,
      endDate: campusEvents.endDate,
      collegeName: colleges.name,
    })
    .from(campusEvents)
    .leftJoin(colleges, eq(colleges.id, campusEvents.collegeId))
    .where(gte(campusEvents.startDate, new Date()))
    .orderBy(asc(campusEvents.startDate))
    .limit(limit);
}

export async function listAllEvents(limit = 50) {
  return db
    .select({
      id: campusEvents.id,
      title: campusEvents.title,
      description: campusEvents.description,
      type: campusEvents.type,
      startDate: campusEvents.startDate,
      endDate: campusEvents.endDate,
      collegeName: colleges.name,
    })
    .from(campusEvents)
    .leftJoin(colleges, eq(colleges.id, campusEvents.collegeId))
    .orderBy(desc(campusEvents.startDate))
    .limit(limit);
}

export async function getEvent(id: string) {
  const rows = await db
    .select({
      id: campusEvents.id,
      title: campusEvents.title,
      description: campusEvents.description,
      type: campusEvents.type,
      startDate: campusEvents.startDate,
      endDate: campusEvents.endDate,
      collegeName: colleges.name,
      createdBy: campusEvents.createdBy,
    })
    .from(campusEvents)
    .leftJoin(colleges, eq(colleges.id, campusEvents.collegeId))
    .where(eq(campusEvents.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function createEvent(data: {
  title: string;
  description: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  collegeId?: string;
  createdBy?: string;
}) {
  const id = randomUUID();
  await db.insert(campusEvents).values({
    id,
    title: data.title,
    description: data.description,
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate ?? null,
    collegeId: data.collegeId ?? null,
    createdBy: data.createdBy ?? null,
    createdAt: new Date(),
  });
  return { id };
}
