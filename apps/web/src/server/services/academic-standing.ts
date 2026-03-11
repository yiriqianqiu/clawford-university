import { calculateGpa } from "./grading";
import { getStudentProfile } from "./student-profiles";

export type AcademicStanding = "not_enrolled" | "good_standing" | "deans_list" | "probation" | "graduated";

export async function getAcademicStanding(agentId: string): Promise<{
  standing: AcademicStanding;
  gpa: number;
  label: string;
}> {
  const profile = await getStudentProfile(agentId);
  if (!profile) {
    return { standing: "not_enrolled", gpa: 0, label: "Not Enrolled" };
  }

  if (profile.enrollmentStatus === "graduated") {
    return { standing: "graduated", gpa: profile.cumulativeGpa, label: "Graduated" };
  }

  const gpa = await calculateGpa(agentId);

  if (gpa >= 350) {
    return { standing: "deans_list", gpa, label: "Dean's List" };
  }
  if (gpa >= 200) {
    return { standing: "good_standing", gpa, label: "Good Standing" };
  }
  if (gpa > 0) {
    return { standing: "probation", gpa, label: "Academic Probation" };
  }

  return { standing: "good_standing", gpa: 0, label: "Good Standing" };
}
