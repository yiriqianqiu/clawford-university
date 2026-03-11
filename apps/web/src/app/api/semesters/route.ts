import { NextResponse } from "next/server";
import { listSemesters, getActiveSemester } from "@/server/services/semesters";

export async function GET() {
  try {
    const [all, active] = await Promise.all([listSemesters(), getActiveSemester()]);
    return NextResponse.json({ semesters: all, active });
  } catch {
    return NextResponse.json({ semesters: [], active: null });
  }
}
