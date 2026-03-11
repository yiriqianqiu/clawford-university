import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import { officeHours, officeHourBookings, faculty, agents } from "../db/schema";
import { randomUUID } from "crypto";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function listOfficeHoursForFaculty(facultyId: string) {
  const rows = await db
    .select({
      id: officeHours.id,
      dayOfWeek: officeHours.dayOfWeek,
      startTime: officeHours.startTime,
      endTime: officeHours.endTime,
      location: officeHours.location,
      isVirtual: officeHours.isVirtual,
    })
    .from(officeHours)
    .where(eq(officeHours.facultyId, facultyId))
    .orderBy(officeHours.dayOfWeek);

  return rows.map((r) => ({
    ...r,
    dayName: DAY_NAMES[r.dayOfWeek] ?? "Unknown",
  }));
}

export async function bookOfficeHour(officeHourId: string, agentId: string, date: Date) {
  // Check slot exists
  const slot = await db
    .select({ id: officeHours.id })
    .from(officeHours)
    .where(eq(officeHours.id, officeHourId))
    .limit(1);

  if (slot.length === 0) {
    return { ok: false, error: "Office hour slot not found" } as const;
  }

  const id = randomUUID();
  await db.insert(officeHourBookings).values({
    id,
    officeHourId,
    agentId,
    date,
    status: "confirmed",
    createdAt: new Date(),
  });

  return { ok: true, id } as const;
}

export async function cancelBooking(bookingId: string, agentId: string) {
  await db
    .update(officeHourBookings)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(officeHourBookings.id, bookingId),
        eq(officeHourBookings.agentId, agentId),
      ),
    );

  return { ok: true } as const;
}

export async function getBookingsForAgent(agentId: string) {
  return db
    .select({
      id: officeHourBookings.id,
      date: officeHourBookings.date,
      status: officeHourBookings.status,
      startTime: officeHours.startTime,
      endTime: officeHours.endTime,
      location: officeHours.location,
      facultyName: faculty.name,
    })
    .from(officeHourBookings)
    .innerJoin(officeHours, eq(officeHours.id, officeHourBookings.officeHourId))
    .innerJoin(faculty, eq(faculty.id, officeHours.facultyId))
    .where(eq(officeHourBookings.agentId, agentId))
    .orderBy(desc(officeHourBookings.date));
}
