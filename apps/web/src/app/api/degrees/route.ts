import { NextRequest, NextResponse } from "next/server";
import { listDegreePrograms, getDegreeProgram, getDegreeRequirements } from "@/server/services/degrees";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    const program = await getDegreeProgram(slug);
    if (!program) {
      return NextResponse.json({ error: "Degree program not found" }, { status: 404 });
    }
    const requirements = await getDegreeRequirements(program.id);
    return NextResponse.json({ ...program, requirements });
  }

  const programs = await listDegreePrograms();
  return NextResponse.json(programs);
}
