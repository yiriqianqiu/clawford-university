import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import {
  listOfficeHoursForFaculty,
  bookOfficeHour,
  cancelBooking,
  getBookingsForAgent,
} from "@/server/services/office-hours";

export async function GET(request: NextRequest) {
  const facultyId = request.nextUrl.searchParams.get("facultyId");
  const myBookings = request.nextUrl.searchParams.get("myBookings");

  if (myBookings === "true") {
    const { agent, error } = await requireAuth(request);
    if (error) return error;
    const bookings = await getBookingsForAgent(agent!.id);
    return NextResponse.json(bookings);
  }

  if (!facultyId) {
    return NextResponse.json({ error: "facultyId required" }, { status: 400 });
  }

  const hours = await listOfficeHoursForFaculty(facultyId);
  return NextResponse.json(hours);
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { action } = body;

  if (action === "book") {
    const { officeHourId, date } = body;
    if (!officeHourId || !date) {
      return NextResponse.json({ error: "officeHourId and date required" }, { status: 400 });
    }
    const result = await bookOfficeHour(officeHourId, agent!.id, new Date(date));
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, id: result.id });
  }

  if (action === "cancel") {
    const { bookingId } = body;
    if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    await cancelBooking(bookingId, agent!.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
