import { NextRequest, NextResponse } from "next/server";
import { listFaculty, getFaculty } from "@/server/services/faculty";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    try {
      const member = await getFaculty(id);
      if (!member) return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
      return NextResponse.json(member);
    } catch {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }
  }

  const departmentId = request.nextUrl.searchParams.get("department") ?? undefined;

  try {
    const result = await listFaculty(departmentId);
    return NextResponse.json({ faculty: result });
  } catch {
    return NextResponse.json({ faculty: [] });
  }
}
